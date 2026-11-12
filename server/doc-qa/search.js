import MiniSearch from "minisearch";
import { embed, embeddingId } from "./models.js";

const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });
const stopWords = new Set([
  "公司", "规范", "是否", "怎么", "如何", "请问", "可以", "应该", "符合",
  "什么", "这样", "需要", "一下", "是不是", "计算",
]);

function tokenize(value) {
  const latin = value.toLowerCase().match(/[a-z0-9_$]+(?:[.-][a-z0-9_$]+)*/g) ?? [];
  const chinese = [...segmenter.segment(value)]
    .filter(({ segment, isWordLike }) => isWordLike && segment.length > 1 && /\p{Script=Han}/u.test(segment))
    .map(({ segment }) => segment)
    .filter((word) => !stopWords.has(word));
  return [...latin.filter((word) => word.length > 1), ...chinese];
}

function unitVector(vector) {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return norm ? vector.map((value) => value / norm) : [];
}

export function createSearch(index, embedding) {
  const sections = index.sections;
  const search = new MiniSearch({
    fields: ["title", "heading", "text", "keywords"],
    tokenize,
    searchOptions: { boost: { heading: 3, keywords: 3, title: 1.4 } },
  });
  search.addAll(sections);

  const useEmbeddings = embedding && index.embedding === embeddingId(embedding);
  if (embedding && !useEmbeddings) {
    console.warn("向量配置与索引不一致。当前使用关键词检索，请重新构建站点以启用语义检索。");
  }
  const vectors = useEmbeddings
    ? sections.map(({ id, vector }) => ({ id, values: unitVector(vector) }))
    : [];

  return async function findSections(question, signal) {
    const includesDeclaration = /\b(?:var|let|const)\s+[$\p{ID_Start}][\p{ID_Continue}$]*\s*=/u.test(question);
    const query = includesDeclaration ? `${question} 变量声明 缩进与标点 分号` : question;
    const keywordResults = search.search(query).slice(0, 12);
    const ranked = new Map(keywordResults.map(({ id }, rank) => [id, 1 / (rank + 3)]));

    if (vectors.length) {
      try {
        const [vector] = await embed(embedding, [question], signal);
        const queryVector = unitVector(vector);
        if (queryVector.length !== vectors[0].values.length) {
          throw new Error("向量维度与索引不一致，请重新构建文档索引。");
        }
        const semanticResults = vectors.map(({ id, values }) => ({
          id,
          score: values.reduce((score, value, i) => score + value * queryVector[i], 0),
        })).filter(({ score }) => score >= 0.35)
          .sort((a, b) => b.score - a.score).slice(0, 12);
        semanticResults.forEach(({ id }, rank) => {
          ranked.set(id, (ranked.get(id) ?? 0) + 1 / (rank + 3));
        });
      } catch (error) {
        signal?.throwIfAborted();
        console.warn(`文档向量检索失败，已使用关键词检索。${error.message}`);
      }
    }

    const counts = new Map();
    const results = [];
    for (const [id] of [...ranked].sort((a, b) => b[1] - a[1])) {
      const section = sections[id];
      // 每个出处至多保留两段，给其他相关条款留出位置。
      const key = `${section.url}:${section.heading}`;
      const count = counts.get(key) ?? 0;
      if (count >= 2) continue;
      counts.set(key, count + 1);
      results.push(section);
      if (results.length === 6) break;
    }
    return results;
  };
}
