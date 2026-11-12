import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import { bugFlow } from "../docs/workflow/flows/bug.js";
import { optimizationFlow } from "../docs/workflow/flows/optimization.js";
import { requirementFlow } from "../docs/workflow/flows/requirement.js";
import { embed, embeddingConfig, embeddingId } from "../server/doc-qa/models.js";

const dist = fileURLToPath(new URL("../docs/.vitepress/dist/", import.meta.url));
const indexDir = new URL("../.doc-search/", import.meta.url);
const indexFile = new URL("index.json", indexDir);
const sections = [];
const maxSectionLength = 1800;

function addSection({ title, heading, url, blocks, keywords = "" }) {
  let text = "";
  for (const block of blocks.flatMap((value) => value.match(/[\s\S]{1,1800}/gu) ?? [])) {
    if (text && text.length + block.length + 2 > maxSectionLength) {
      sections.push({ id: sections.length, title, heading, url, text, keywords });
      text = "";
    }
    text = text ? `${text}\n\n${block}` : block;
  }
  if (text) sections.push({ id: sections.length, title, heading, url, text, keywords });
}

function tableRows($, table) {
  const rows = [];
  const headerCount = $(table).find("thead > tr").length;
  $(table).find("tr").each((rowIndex, row) => {
    rows[rowIndex] ??= [];
    let column = 0;
    $(row).children("th, td").each((_, cell) => {
      while (rows[rowIndex][column] !== undefined) column++;
      const text = $(cell).text().trim().replace(/\s+/g, " ");
      const rowspan = Number($(cell).attr("rowspan")) || 1;
      const colspan = Number($(cell).attr("colspan")) || 1;
      for (let r = rowIndex; r < rowIndex + rowspan; r++) {
        rows[r] ??= [];
        for (let c = column; c < column + colspan; c++) rows[r][c] = text;
      }
      column += colspan;
    });
  });
  const headers = rows.slice(0, headerCount);
  return rows.slice(headerCount).map((row) => row.flatMap((value, column) => {
    const label = [...new Set(headers.map((header) => header[column]).filter(Boolean))].join(" / ");
    return value ? [label ? `${label}：${value}` : value] : [];
  }).join(" | ")).filter(Boolean);
}

function indexPage(html, pageUrl) {
  const $ = load(html);
  const article = $(".vp-doc").first();
  if (!article.length) return;
  article.find("nav, button, .header-anchor, .line-numbers-wrapper, script, style").remove();
  article.find("br").replaceWith("\n");
  article.find(".VPBadge").each((_, badge) => $(badge).text(`【${$(badge).text()}】 `));
  article.find("li").append("\n");
  const title = article.find("h1").first().text().trim() || $("title").text().split(" | ")[0];
  let current = { title, heading: title, url: pageUrl, blocks: [] };
  const blockContainers = "ul, ol, pre, blockquote, table, dl";
  for (const element of article.find(`h1, h2, h3, h4, h5, h6, p, ${blockContainers}`).toArray()) {
    const block = $(element);
    if (block.parents(blockContainers).length) continue;
    if (/^h[1-6]$/.test(element.tagName)) {
      addSection(current);
      const heading = block.text().trim();
      const id = block.attr("id");
      const url = id ? `${pageUrl}#${encodeURIComponent(id)}` : pageUrl;
      const keywords = title === "JavaScript 开发标准" && heading.includes("变量声明") ? "var let const" : "";
      current = { title, heading, url, blocks: [], keywords };
    } else if (element.tagName === "table") {
      current.blocks.push(...tableRows($, element));
    } else {
      const text = block.text().trim();
      if (text) current.blocks.push(text);
    }
  }
  addSection(current);
}

function indexFlow(flow, title, url) {
  const labels = new Map(flow.nodes.map(({ id, data }) => [id, data.label.replace(/\s*\n\s*/g, " ")]));
  const stages = new Map(flow.stages?.map(({ id, data }) => [id, data.label]));
  const nodes = new Map(flow.nodes.map((node) => [node.id, node]));
  const groups = new Map();
  for (const edge of flow.edges) {
    const heading = stages.get(nodes.get(edge.source)?.data.stageId) ?? "流程图";
    const source = labels.get(edge.source);
    const target = labels.get(edge.target);
    if (!source || !target) continue;
    if (!groups.has(heading)) groups.set(heading, []);
    const branch = edge.label ? `（${edge.label}）` : "";
    groups.get(heading).push(`${source}${branch} → ${target}`);
  }
  for (const [heading, blocks] of groups) addSection({ title, heading, url, blocks });
}

const files = (await readdir(dist, { recursive: true })).sort();
for (const file of files) {
  const route = file.replaceAll(sep, "/");
  if (!route.endsWith(".html") || route.startsWith("test/") || ["404.html", "index.html"].includes(route)) continue;
  const url = `/${route.replace(/\/index\.html$/, "/")}`;
  indexPage(await readFile(join(dist, file), "utf8"), url);
}

indexFlow(requirementFlow, "需求流程", "/workflow/");
indexFlow(optimizationFlow, "优化流程", "/workflow/optimization.html");
indexFlow(bugFlow, "BUG 处理流程", "/workflow/bug.html");

const config = embeddingConfig();
const embedding = embeddingId(config);
if (config) {
  const previous = await readFile(indexFile, "utf8").then(JSON.parse).catch(() => null);
  const key = ({ title, heading, text }) => JSON.stringify([title, heading, text]);
  const cached = new Map(previous?.embedding === embedding
    ? previous.sections.map((section) => [key(section), section.vector]) : []);
  for (const section of sections) section.vector = cached.get(key(section));
  const missing = sections.filter((section) => !section.vector);
  for (let i = 0; i < missing.length; i += 8) {
    const batch = missing.slice(i, i + 8);
    const vectors = await embed(config, batch.map(({ title, heading, text }) => `${title}\n${heading}\n${text}`));
    batch.forEach((section, position) => { section.vector = vectors[position]; });
  }
  if (sections.some(({ vector }) => vector.length !== sections[0].vector.length)) {
    throw new Error("向量维度不一致，请检查向量模型配置。");
  }
}

await mkdir(indexDir, { recursive: true });
const temporary = new URL(`index-${randomUUID()}.tmp`, indexDir);
await writeFile(temporary, JSON.stringify({ embedding, sections }));
await rename(temporary, indexFile);
console.log(`已索引 ${sections.length} 个文档片段${embedding ? "（含向量）" : ""}。`);
