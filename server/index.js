import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import express from "express";
import { chatConfig, embeddingConfig, generateAnswer } from "./doc-qa/models.js";
import { createSearch } from "./doc-qa/search.js";

const indexFile = new URL("../.doc-search/index.json", import.meta.url);
const index = await readFile(indexFile, "utf8").then(JSON.parse).catch((error) => {
  if (error.code === "ENOENT") throw new Error("缺少文档索引，请先运行 pnpm docs:build。");
  throw error;
});
const chat = chatConfig();
const findSections = createSearch(index, embeddingConfig());
const dist = fileURLToPath(new URL("../docs/.vitepress/dist/", import.meta.url));
const noEvidence = { answer: "站内文档未找到足够的依据回答这个问题。", sources: [] };
const app = express();
app.disable("x-powered-by");

app.post("/api/ask", express.json({ limit: "16kb" }), async (req, res) => {
  res.set("Cache-Control", "no-store");
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  if (!question || question.length > 3000) {
    return res.status(400).json({ error: "请输入 1 至 3000 字的提问。" });
  }
  if (!chat) {
    return res.status(503).json({ error: "问答模型尚未配置，请联系站点管理员。" });
  }

  const controller = new AbortController();
  const cancel = () => controller.abort();
  res.once("close", cancel);
  try {
    const sections = await findSections(question, controller.signal);
    controller.signal.throwIfAborted();
    if (!sections.length) return res.json(noEvidence);

    const result = await generateAnswer(chat, question, sections, controller.signal);
    return res.json(result.sources.length ? result : noEvidence);
  } catch (error) {
    if (controller.signal.aborted) return;
    console.error(`文档问答失败：${error.message}`);
    const status = error.name === "TimeoutError" ? 504 : 502;
    return res.status(status).json({ error: "问答服务暂时无法生成回答，请稍后重试。" });
  } finally {
    res.off("close", cancel);
  }
});

app.use("/api/ask", (req, res) => res.status(405).set("Allow", "POST").json({ error: "请使用 POST 提问。" }));
app.use(express.static(dist, { extensions: ["html"] }));
app.use((req, res) => res.status(404).sendFile("404.html", { root: dist }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === "entity.parse.failed" || error.type === "entity.too.large") {
    return res.status(error.status).json({ error: "提问格式无效或内容过长。" });
  }
  console.error(`站点请求失败：${error.message}`);
  return res.status(500).json({ error: "站点暂时无法处理请求。" });
});

const host = process.env.DOCS_HOST || "127.0.0.1";
const port = Number(process.env.DOCS_PORT || 3001);
app.listen(port, host, () => {
  console.log(`研发规范站点和问答接口已启动（${host}:${port}）。`);
});
