# 项目协作指南

本项目使用 VitePress 默认主题，集中维护公司标准、版本更新和工作流程。本指南适用于整个项目。

## 目录与配置

- `docs/` 是站点源目录，技术文章以 Markdown 编写。
- `docs/frontend/` 存放前端标准，`docs/backend/` 存放后端标准，`docs/changelog/` 存放版本更新，`docs/workflow/` 存放工作流程。
- `docs/index.md` 是站点首页，通过 YAML frontmatter 配置首页内容。
- `docs/.vitepress/config.js` 集中管理站点设置、顶部导航（`themeConfig.nav`）和侧边栏（`themeConfig.sidebar`）。
- 使用 pnpm 管理依赖。修改依赖时同步更新 `package.json` 和 `pnpm-lock.yaml`。

## 文档维护

- 新增技术文档默认使用简体中文。API、命令、配置项和代码标识符保留原文。代码块标注语言，版本敏感的示例注明适用版本或运行环境。
- 技术标准先按前端或后端分类，再放入相应的技术主题目录。例如 CSS 放在 `docs/frontend/css/`，Vue 3 放在 `docs/frontend/vue3/`。其他主题同样优先使用所属分类下的已有目录。
- 页面文件名使用小写英文和连字符。沿用现有站内链接的写法，例如 `/frontend/css/`。
- 新增需要从侧边栏访问的文章时，在对应分组添加入口。移动或重命名页面时，同步检查侧边栏、顶部导航、首页入口和文档内链中受影响的引用。
- 优先使用 VitePress 默认主题的配置和 Markdown 能力。仅在任务需要时引入自定义组件、样式或额外依赖。
- `node_modules/`、`docs/.vitepress/cache/` 和 `docs/.vitepress/dist/` 由工具生成，避免手动编辑或提交。

## 本地验证

- 首次安装依赖时运行 `pnpm install --frozen-lockfile`。
- 使用 `pnpm docs:dev` 查看开发预览。
- 修改站点内容、导航或配置后，运行 `pnpm docs:build` 检查构建和站内链接。涉及页面布局或交互时，预览受影响页面。
- 构建后可用 `pnpm docs:preview` 查看生产构建结果。
- 当前 `pnpm test` 是占位脚本，站点变更使用 `pnpm docs:build` 验证。
