# 项目协作指南

本项目基于 VitePress 默认主题，使用 Vue 组件扩展页面，集中维护公司研发标准、版本号规范、工作流程和绩效考核。本指南适用于整个项目。

## 目录与配置

- `docs/` 是站点源目录，技术文章以 Markdown 编写；`docs/index.md` 是站点首页，通过 YAML frontmatter 配置首页内容。
- `docs/frontend/standards/` 和 `docs/backend/standards/` 分别存放前、后端开发标准；`docs/frontend/other/` 和 `docs/backend/other/` 分别存放前、后端专项标准。
- `docs/changelog/` 存放版本号规范；`docs/workflow/` 存放工作流程页面，`docs/workflow/flows/` 存放流程图定义。
- `docs/performance/frontend/` 和 `docs/performance/backend/` 分别存放前、后端绩效考核页面；`docs/performance/data/` 存放 Excel 源表和 `*.data.js` 数据加载入口。
- `docs/test/` 存放组件预览和验证页面；`docs/public/` 存放静态资源。
- `docs/.vitepress/config.js` 集中管理站点设置、顶部导航（`themeConfig.nav`）和侧边栏（`themeConfig.sidebar`）。
- `docs/.vitepress/components/` 存放站点使用的 Vue 组件；`docs/.vitepress/theme/` 存放主题入口和样式；`docs/.vitepress/loaders/` 存放共享数据加载逻辑。
- 使用 pnpm 管理依赖。修改依赖时同步更新 `package.json` 和 `pnpm-lock.yaml`。

## 文档维护

- 新增技术文档默认使用简体中文。API、命令、配置项和代码标识符保留原文。代码块标注语言，版本敏感的示例注明适用版本或运行环境。
- 新增标准时，先按前端或后端分类，再按内容放入 `standards/`（开发标准）或 `other/`（专项标准）。例如 CSS 和 Vue 3 开发标准分别位于 `docs/frontend/standards/css.md` 和 `docs/frontend/standards/vue3.md`。
- Markdown 页面文件名使用小写英文和连字符。沿用现有站内链接的写法，例如 `/frontend/standards/css`、`/backend/standards/`。
- 新增需要从侧边栏访问的文章时，在对应分组添加入口。移动或重命名页面时，同步检查侧边栏、顶部导航、首页入口和文档内链中受影响的引用。工作流程页面的页内导航由 `docs/.vitepress/components/WorkflowPage.vue` 维护。
- 优先使用 VitePress 默认主题的配置和 Markdown 能力。仅在任务需要时引入自定义组件、样式或额外依赖。
- `node_modules/`、`docs/.vitepress/cache/` 和 `docs/.vitepress/dist/` 由工具生成，避免手动编辑或提交。

## 组件与页面样式

- 自定义 Vue 组件和页面的 CSS 类名统一使用 BEM（Block、Element、Modifier）：`block`、`block__element`、`block--modifier` 或 `block__element--modifier`。各部分使用小写英文，多个单词用连字符连接。
- 以流程图为例，`workflow-diagram` 是块，`workflow-diagram__controls` 是元素，`workflow-diagram--fullscreen` 和 `workflow-diagram__controls--stages` 分别是块和元素的修饰类。修饰类与对应的基础类同时使用。引用 VitePress 或第三方库的类名时保留原名，例如 `vp-doc`。

## 本地验证

- 首次安装依赖时运行 `pnpm install --frozen-lockfile`。
- 使用 `pnpm docs:dev` 查看开发预览。
- 修改站点内容、导航或配置后，运行 `pnpm docs:build` 检查构建和站内链接。涉及页面布局或交互时，预览受影响页面。
- 构建后可用 `pnpm docs:preview` 查看生产构建结果。
- 当前 `pnpm test` 是占位脚本，站点变更使用 `pnpm docs:build` 验证。
