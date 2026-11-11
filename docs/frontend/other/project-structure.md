---
aside: false
---

<script setup>
import DirectoryTree from "../../.vitepress/components/DirectoryTree.vue";

const projectStructure = [
  {
    name: "public",
    description: "不打包静态资源",
    children: [{ name: "favicon.ico", description: "站点图标" }],
  },
  {
    name: "src",
    description: "项目核心源码",
    defaultOpen: false,
    children: [
      {
        name: "api",
        description: "按业务模块封装接口请求",
        children: [
          { name: "request.js", description: "请求实例和拦截器" },
          { name: "user.js", description: "用户模块接口" },
        ],
      },
      {
        name: "assets",
        description: "参与构建的图片、字体和全局样式",
        children: [
          { name: "images", description: "图片资源", children: [] },
          { name: "fonts", description: "字体文件", children: [] },
          { name: "styles", description: "全局样式", children: [] },
        ],
      },
      {
        name: "components",
        description: "跨页面复用的组件",
        children: [
          { name: "base", description: "基础组件", children: [] },
          { name: "business", description: "通用业务组件", children: [] },
          { name: "common", description: "全局组合组件", children: [] },
        ],
      },
      {
        name: "composables",
        description: "可复用的 Vue 3 组合式逻辑",
        children: [{ name: "useTable.js", description: "表格分页与查询" }],
      },
      {
        name: "directives",
        description: "全局自定义指令",
        children: [{ name: "permission.js", description: "按钮权限指令" }],
      },
      {
        name: "layouts",
        description: "全局页面布局外壳",
        children: [{ name: "MainLayout.vue", description: "后台主体布局" }],
      },
      {
        name: "plugins",
        description: "注册和初始化第三方依赖",
        children: [{ name: "index.js", description: "插件注册入口" }],
      },
      {
        name: "router",
        description: "路由配置和导航守卫",
        children: [{ name: "index.js", description: "路由入口" }],
      },
      {
        name: "stores",
        description: "Pinia 跨页面共享状态",
        children: [{ name: "user.js", description: "用户会话和权限状态" }],
      },
      {
        name: "utils",
        description: "通用工具函数",
        children: [{ name: "format.js", description: "日期和金额格式化" }],
      },
      {
        name: "views",
        description: "业务页面视图",
        children: [
          { name: "system", description: "系统管理模块", children: [] },
          { name: "goods", description: "商品模块", children: [] },
          { name: "order", description: "订单模块", children: [] },
        ],
      },
      { name: "App.vue", description: "应用根组件" },
      { name: "main.js", description: "项目入口文件" },
    ],
  },
  { name: ".env", description: "环境变量配置文件" },
  { name: ".gitignore", description: "Git 忽略规则" },
  { name: "index.html", description: "Vite 的 HTML 入口" },
  { name: "package.json", description: "依赖和项目脚本" },
  { name: "pnpm-lock.yaml", description: "锁定依赖版本" },
  { name: "vite.config.js", description: "开发服务器和构建配置" },
  { name: "README.md", description: "项目说明与本地开发步骤" },
];
</script>

# Vue 3 项目目录规范

以 Vue 3、Vite 和 JavaScript 的单应用项目为例。点击带有子项的目录行可展开或收起目录。

<DirectoryTree :nodes="projectStructure" />

## 各目录说明与使用规范

### `public/`（静态资源）

- **存放内容**：不经过 Vite 打包或压缩、直接复制到构建产物中的静态文件，例如 `favicon.ico`、`robots.txt`、静态 HTML 模板和大型离线资源。
- **使用规则**：部署在站点根路径时，可通过 `/favicon.ico` 这类根路径访问。业务图片和随业务代码更新的资源放在 `src/assets/`。

### `src/assets/`（构建资源）

存放需要由 Vite 在构建时处理的图片、字体和样式，例如需要生成带哈希的文件名或在构建时压缩的资源。可按业务模块拆分。

```text
assets/
├── images/          # 项目图片
│   ├── common/      # 全局通用图片
│   └── [模块名]/    # 模块专属图片
├── fonts/           # 自定义字体
└── styles/          # 全局样式
    ├── reset.scss   # 浏览器默认样式重置
    ├── var.scss     # 颜色、尺寸和主题变量
    └── global.scss  # 全局通用样式
```

### `src/api/`（接口层）

统一封装 Axios 实例、拦截器和错误处理，接口函数按业务模块拆分。页面只调用封装好的接口函数，禁止直接编写 Axios 请求。

```text
api/
├── request.js  # Axios 实例、拦截器和统一错误处理
├── login.js    # 登录、注册、退出接口
├── user.js     # 用户管理接口
├── goods.js    # 商品模块接口
└── order.js    # 订单模块接口
```

### `src/composables/`（组合式逻辑）

抽离可复用的 Vue 3 组合式逻辑，用于替代 `mixins`。这类逻辑不直接依赖 DOM，文件统一使用 `useXxx.js` 命名。

```text
composables/
├── useUser.js        # 用户信息、登录状态和权限逻辑
├── useTable.js       # 表格分页、查询和重置
├── useDialog.js      # 弹窗开关和表单重置
└── usePermission.js  # 页面和按钮的权限判断
```

### `src/directives/`（自定义指令）

存放可复用的 DOM 操作指令，例如按钮权限、图片懒加载、拖拽、防抖和复制。

### `src/layouts/`（全局布局）

存放页面共用的外层布局。通过路由配置引入布局，在布局内嵌套渲染业务页面。

```text
layouts/
├── MainLayout.vue   # 后台主体布局：侧边栏、头部和内容区
└── LoginLayout.vue  # 登录页独立布局
```

### `src/plugins/`（第三方插件）

集中注册和初始化第三方依赖，保持 `main.js` 简洁。例如 Element Plus、Vant、ECharts、SVG 图标和统计埋点。

### `src/router/`（路由管理）

集中管理路由实例、全局导航守卫和权限拦截。大型项目可按业务模块拆分路由配置。

```text
router/
├── index.js      # 路由实例、全局守卫和权限拦截
└── modules/      # 按业务模块拆分的路由配置
    ├── system.js
    ├── goods.js
    └── order.js
```

### `src/stores/`（Pinia 状态管理）

用 Pinia 管理跨页面共享的状态。按业务模块拆分，每个 Store 只承担一项职责。

```text
stores/
├── user.js   # 用户 token、信息和权限
├── app.js    # 侧边栏折叠、加载状态和主题
└── goods.js  # 商品模块共享缓存
```

### `src/utils/`（工具函数）

存放与具体业务解耦、无 Vue 依赖的通用 JavaScript 函数。

```text
utils/
├── format.js    # 日期、时间和金额格式化
├── validate.js  # 手机号、邮箱和密码校验
├── storage.js   # 本地存储封装
└── common.js    # 通用基础方法
```

### `src/views/`（业务页面）

存放可通过路由访问的完整业务页面，一个业务路由对应一个页面模块。仅当前页面使用的组件放在该页面的 `components/` 下，不全局注册。

```text
views/
├── system/                 # 系统管理模块
│   ├── user/
│   │   └── list/
│   │       ├── index.vue
│   │       └── components/ # 用户列表页私有组件
│   └── role/
├── goods/                  # 商品模块
└── order/                  # 订单模块
```

## `src/components/` 组件目录规范

### 存放规则

**允许存放**

- 基础组件，例如按钮、弹窗、表格和输入框。
- 多页面复用的业务组件，例如用户选择器、商品卡片和订单状态标签。
- 全局组合组件，例如页面头部、SVG 图标和空状态。

**禁止存放**

- 完整业务页面，放在 `src/views/`。
- 单个页面的私有组件，放在该页面的 `components/`。
- 纯逻辑、工具函数或接口请求，分别放在 `src/composables/`、`src/utils/` 或 `src/api/`。

### 分层结构

```text
components/
├── base/       # 与业务无关的基础 UI 组件
│   ├── BaseButton/
│   │   └── index.vue
│   ├── BaseDialog/
│   ├── BaseTable/
│   └── BaseSearch/
├── business/   # 多页面复用的业务组件
│   ├── UserSelect/
│   ├── GoodsCard/
│   └── OrderStatusTag/
└── common/     # 全局组合组件
    ├── PageHeader/
    └── SvgIcon/
```

### 命名与文件约定

- **组件目录命名**：统一使用大驼峰（PascalCase），禁止小驼峰、短横线和下划线命名。
- **入口文件**：固定为 `index.vue`，可选用 `index.js` 统一导出。
- **基础组件**：使用 `Base` 前缀，例如 `BaseDialog`、`BaseTable`。
- **业务组件**：使用体现业务含义的大驼峰名称，例如 `UserSelect`、`GoodsCard`。

## 小型项目目录示例

对于页面较少、没有复杂权限逻辑的小型项目、H5 页面或官网，可按需省略未使用的目录，保留以下结构：

```text
src/
├── api/
├── assets/
├── components/
├── composables/
├── router/
├── utils/
├── views/
├── App.vue
└── main.js
```

## 通用工程规范

1. **路径别名**：统一配置 `@` 指向 `src/`，减少多层相对路径。
2. **样式隔离**：组件局部样式使用 `<style scoped>`，全局样式统一放在 `src/assets/styles/`。
3. **代码分层**：页面负责渲染和组织交互，复杂的状态和交互逻辑抽离到 `composables/`。
4. **复用原则**：简单且仅当前页面使用的逻辑可留在页面内；跨页面复用的界面和逻辑分别抽离为组件和组合式函数。
