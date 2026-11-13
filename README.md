# 研发规范

## 文档问答

使用 Node.js 22.12 或以上版本。将 `.env.example` 复制为项目根目录的 `.env`，填写生成模型的 Base URL、模型 ID 和 API Key。生成模型需要支持 `POST /chat/completions` 和 `response_format: { "type": "json_object" }`。Base URL 填供应商指定的 API 前缀，包含供应商要求的版本路径。

如需语义检索，另外配置支持 `POST /embeddings` 的模型。构建和运行服务时使用相同的向量模型配置。向量配置留空时，问答接口使用关键词检索。

```bash
pnpm install --frozen-lockfile
pnpm docs:build
pnpm docs:ask
```

打开 `http://127.0.0.1:3001/`，点击导航里的「问研发规范」。编辑前端时，可在另一个终端运行 `pnpm docs:dev`。开发服务器会将问答请求转发到 `127.0.0.1:3001`。

浏览器的 Network 面板显示 `/api/ask`。模型接口的地址、HTTP 状态和耗时显示在运行 `pnpm docs:ask` 的终端。日志只记录请求的基本信息。

`pnpm docs:build` 会从站点构建产物和流程定义生成 `.doc-search/index.json`。更新文档后，重新构建并重启问答服务，让静态页面和索引一起生效。

上线时运行 `pnpm docs:ask`，该服务同时提供构建后的站点和 `/api/ask`。部署产物需要包含 `docs/.vitepress/dist/` 和 `.doc-search/index.json`。使用部署平台的服务端环境变量配置模型，也可以通过 `DOCS_HOST` 和 `DOCS_PORT` 设置监听地址和端口。
