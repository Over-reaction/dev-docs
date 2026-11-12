<script setup>
import DirectoryTree from "../../.vitepress/components/DirectoryTree.vue";

const projectStructure = [
  { name: "deploy", description: "部署脚本与配置模板", children: [] },
  { name: "docs", description: "项目说明与技术文档", children: [] },
  {
    name: "project-api",
    description: "跨服务接口聚合模块",
    children: [
      {
        name: "project-order-api",
        description: "订单服务对外接口",
        children: [
          {
            name: "src/main/java/com/yiqianhe/project/order/api",
            description: "对外接口根包",
            children: [
              { name: "dto", description: "数据传输对象", children: [{ name: "OrderDTO.java", description: "订单对外传输对象" }, { name: "OrderQueryDTO.java", description: "订单查询条件" }] },
              { name: "event", description: "对外事件消息结构，按需创建", children: [] },
              { name: "OrderRemoteApi.java", description: "对外服务接口定义，按所用协议创建" },
            ],
          },
          { name: "pom.xml", description: "Maven 依赖与普通 JAR 构建" },
        ],
      },
      { name: "project-user-api", description: "用户服务对外接口，结构与订单接口模块一致", children: [] },
      { name: "pom.xml", description: "聚合 POM：子模块管理" },
    ],
  },
  {
    name: "project-auth-service",
    description: "独立认证服务，仅在架构需要时创建",
    children: [
      { name: "src", description: "应用源码与测试", children: [] },
      { name: "pom.xml", description: "Maven 依赖、插件与构建配置" },
    ],
  },
  {
    name: "project-common",
    description: "公共技术能力聚合模块",
    children: [
      {
        name: "project-common-core",
        description: "无 Web、数据库依赖的基础库",
        children: [
          {
            name: "src/main/java/com/yiqianhe/project/common/core",
            description: "基础代码根包",
            children: [
              { name: "exception", description: "基础异常定义", children: [] },
              { name: "response", description: "统一响应与分页对象", children: [] },
              { name: "util", description: "通用工具类", children: [] },
            ],
          },
          { name: "pom.xml", description: "Maven 依赖与普通 JAR 构建" },
        ],
      },
      {
        name: "project-common-web",
        description: "Web 公共能力，按需引入",
        children: [
          { name: "src/main/java/com/yiqianhe/project/common/web", description: "异常处理、Web 拦截等技术代码", children: [] },
          { name: "pom.xml", description: "Maven 依赖与普通 JAR 构建" },
        ],
      },
      { name: "pom.xml", description: "聚合 POM：子模块管理" },
    ],
  },
  {
    name: "project-gateway",
    description: "统一路由与入口控制，按需创建",
    children: [
      { name: "src/main/java/com/yiqianhe/project/gateway", description: "网关启动类、配置与过滤器", children: [] },
      { name: "src/main/resources", description: "配置与只读资源", children: [{ name: "application.yml", description: "默认配置与外部配置引用" }] },
      { name: "pom.xml", description: "Maven 依赖、插件与构建配置" },
    ],
  },
  {
    name: "project-modules",
    description: "业务服务聚合模块，不包含业务代码",
    children: [
      {
        name: "project-order-service",
        description: "订单服务，独立构建与部署",
        children: [
          { name: "db", description: "数据库初始化与升级脚本", children: [] },
          {
            name: "src/main/java/com/yiqianhe/project/order",
            description: "应用代码根包",
            children: [
              { name: "config", description: "应用配置管理", children: [] },
              {
                name: "modules/order",
                description: "订单业务模块",
                children: [
                  { name: "client", description: "外部系统访问封装", children: [{ name: "UserClient.java", description: "用户服务调用适配" }] },
                  { name: "controller", description: "HTTP 接口入口", children: [] },
                  { name: "converter", description: "对象模型转换", children: [] },
                  { name: "dto", description: "数据传输对象", children: [] },
                  { name: "entity", description: "数据库持久化对象", children: [] },
                  { name: "enums", description: "业务枚举", children: [] },
                  { name: "job", description: "定时任务入口，按需创建", children: [] },
                  { name: "listener", description: "事件与消息处理入口，按需创建", children: [] },
                  { name: "manager", description: "组合查询、缓存与外部调用处理，按需创建", children: [] },
                  { name: "mapper", description: "数据库访问接口", children: [] },
                  { name: "service", description: "业务服务接口与实现", children: [{ name: "impl", description: "业务服务实现", children: [{ name: "OrderServiceImpl.java", description: "订单业务处理与事务编排" }] }, { name: "OrderService.java", description: "订单业务服务接口" }] },
                  { name: "vo", description: "接口展示对象", children: [] },
                ],
              },
              { name: "OrderApplication.java", description: "订单服务启动入口" },
            ],
          },
          {
            name: "src/main/resources",
            description: "配置与只读资源",
            children: [
              { name: "mapper/order", description: "MyBatis SQL 映射", children: [] },
              { name: "application.yml", description: "默认配置与外部配置引用" },
            ],
          },
          { name: "src/test", description: "测试代码与资源", children: [] },
          { name: "pom.xml", description: "Maven 依赖、插件与构建配置" },
        ],
      },
      { name: "project-user-service", description: "用户服务，目录规则与订单服务一致", children: [] },
      { name: "pom.xml", description: "聚合 POM：子模块管理" },
    ],
  },
  { name: ".gitignore", description: "Git 忽略规则" },
  { name: "pom.xml", description: "父 POM：版本、插件与模块聚合" },
  { name: "README.md", description: "项目说明与本地运行步骤" },
];
</script>

# Java 微服务项目结构标准

## 文档版本

| 版本号 | 修订时间   | 修订者 | 备注 |
| ------ | ---------- | ------ | ---- |
| V1.0.0 | 2026/11/12 | 宁海   | 初稿 |

## 文档说明

适用于使用 Maven 和 Spring Boot、按业务边界独立部署的 Java 服务。以下以同一仓库管理多个服务为例；多仓库项目必须保持相同的服务内部结构，公共库和接口模块通过制品仓库发布与引用。

本标准与[通用工程标准](/backend/other/project-structure)配套使用，命名、分层职责、配置、依赖、测试资源和交付要求统一在通用标准中维护。

`project` 与 `com.yiqianhe.project` 均为示例名称。网关、认证和公共技术模块按实际架构创建。点击带有子项的目录行可展开或收起目录。

<DirectoryTree :nodes="projectStructure" />

## 各目录说明与使用规范

### 根目录与父 `pom.xml`（聚合和版本管理）

根目录保留网关、认证服务、接口聚合模块和公共技术聚合模块，业务服务统一放在 `project-modules/` 下。根 POM 在 `modules` 中登记 `project-modules`，具体业务服务由其内部的 POM 聚合。

每个服务单独生成可部署产物，不得将整个聚合工程打包成一个应用。

### `project-common/`（公共技术能力）

公共技术能力按下表拆分。

| 模块 | 存放内容 | 使用边界 |
| --- | --- | --- |
| `project-common-core` | 统一响应、分页结构、基础异常、通用工具 | 不得依赖 Web、数据库或具体业务服务 |
| `project-common-web` | Web 异常处理、拦截器等 | 仅由使用匹配 Web 技术栈的应用显式引入 |
| 其他公共技术模块 | 缓存、消息、存储等复用封装 | 有实际复用需求后按能力拆分，不得形成全量依赖包 |

公共模块不得反向依赖服务实现和业务接口模块。网关与业务服务使用不同 Web 技术栈时，必须分别组织公共能力，不得无差别引入 Web 依赖。

### `project-api/`（跨服务接口）

每个服务维护自身对外提供的接口模块，例如 `project-order-api` 由订单服务负责。接口模块集中管理接口定义及配套的数据对象，允许包含：

- 跨服务接口定义，以及对应的请求、响应 DTO。
- 必须由双方共同理解的字段编码、错误码或事件数据结构。
- 与项目所用协议配套、且为定义接口所必需的最小依赖。

接口模块不得包含 Controller 实现、内部 Service、Mapper、持久化实体、数据库连接、应用启动类或环境配置。采用 HTTP 且通过接口描述生成客户端的项目，允许用版本化的接口描述及生成制品替代手写 Java 接口模块。

对外接口 DTO 放在对应 API 模块；数据库实体放在服务自身的 `entity/`，不得直接作为对外接口入参或响应。业务含义和字段结构一致时，允许服务内部复用接口 DTO；需要独立的业务模型时，放在本服务的 `dto/` 等目录，通过 `converter/` 转换，不得仅为分层重复定义同字段对象。

### `project-gateway/`（统一访问入口）

只负责路由、入口鉴权、限流、请求标识和协议转发等入口能力。网关不得访问业务数据库，不得编排订单创建、审批等业务流程，不得依赖业务服务实现包。

业务服务仍必须校验接口权限、调用身份与数据访问范围。对外入口和内部服务地址必须通过部署配置明确隔离。

### `project-auth-service/`（认证服务）

在架构需要独立认证能力时创建，负责身份认证、令牌签发和失效等职责。用户资料和组织管理由既定业务服务维护，认证服务不得重复建立另一套归属不明的用户数据。

使用外部身份平台时，必须明确本地适配代码的归属，不得同时维护功能重复的认证入口。

### `project-modules/`（业务服务聚合）

`project-modules` 是 `packaging=pom` 的空聚合模块，只组织业务服务子模块，不包含 `src/`、业务代码或启动类，不生成可执行包。

- `project-modules/pom.xml` 的 `modules` 登记 `project-order-service`、`project-user-service` 等业务服务。
- 聚合模块和业务服务都继承根父 POM。业务服务的父 POM 路径使用 `../../pom.xml`，统一版本和插件配置由根父 POM 管理。
- 聚合关系不产生服务之间的代码依赖。业务服务不得在 `dependencies` 中引入 `project-modules` 或其他服务的实现模块。
- 各业务服务仍具有独立启动入口、配置和构建产物，按服务分别部署与回滚。

聚合配置示例（`project-modules/pom.xml` 片段）：

```xml
<packaging>pom</packaging>
<modules>
    <module>project-order-service</module>
    <module>project-user-service</module>
</modules>
```

### `project-modules/project-*-service/`（独立业务服务）

每个服务必须具有独立启动入口、应用标识、配置来源、构建产物和部署说明，并按下表维护服务边界。

| 目录 | 职责 | 使用边界 |
| --- | --- | --- |
| `config/` | 应用配置管理 | 不得读取其他服务的私有配置类 |
| `modules/<业务模块>/controller/` | HTTP 接口入口 | 复用内部 Service，不得重复实现远程业务逻辑 |
| `modules/<业务模块>/service/` | 业务服务接口与实现 | 实现类放在 `impl/`，定义当前服务内的业务编排和事务边界 |
| `modules/<业务模块>/mapper/` | 数据库访问接口 | 只能访问当前服务拥有的数据 |
| `modules/<业务模块>/entity/` | 数据库持久化对象 | 仅定义当前服务自有数据的持久化模型 |
| `modules/<业务模块>/dto/` | 数据传输对象 | 存放服务内部专用对象；与接口 DTO 语义和结构一致时直接复用，不重复定义 |
| `modules/<业务模块>/vo/` | 接口展示对象 | 定义当前服务对调用方提供的展示模型 |
| `modules/<业务模块>/client/` | 外部系统访问封装 | 访问其他服务与第三方系统，不得引入对方的服务实现模块 |
| `modules/<业务模块>/converter/` | 对象模型转换 | 仅在需要独立模型时，负责内部模型与接口传输对象的转换 |
| `modules/<业务模块>/listener/`、`job/` | 定时任务、事件与消息处理入口 | 调用本服务业务能力，明确重试和重复触发处理 |
| `src/main/resources/` | 配置与只读资源 | 不得打包其他服务的环境配置 |
| `src/test/` | 测试代码与资源 | 围绕当前服务组织测试，必要时覆盖对外接口及跨服务集成 |
| `db/` | 数据库初始化与升级脚本 | 每个脚本必须能确定所属服务与发布版本 |

### `deploy/` 与 `docs/`（部署与服务说明）

`deploy/` 必须按服务划分脚本和非敏感配置模板，允许按 Linux、Windows 或容器等实际运行环境继续拆分。服务必须能够独立部署，不得依赖手工复制其他服务的 JAR。

`docs/` 必须维护服务清单、数据归属、调用关系和接口说明，每个服务必须列出其依赖的其他服务。

## 模块依赖与服务边界

| 使用方 | 允许依赖 | 不得依赖 |
| --- | --- | --- |
| `project-common-core` | 必要的基础工具库 | Web、数据库、业务 API 和服务实现 |
| `project-common-web` | 公共核心库及匹配的 Web 依赖 | 具体业务 API 和服务实现 |
| `project-order-api` | 必要的公共数据类型与协议依赖 | 订单服务实现、数据库实体、用户服务接口模块 |
| `project-order-service` | 自身 API、所调用服务的 API、所需公共技术库 | 用户等其他服务的实现模块 |
| `project-gateway` | 所需路由和入口控制能力 | 业务数据库、业务 Service 和 Mapper |

1. **数据所有权**：每张业务表必须有唯一的服务归属；不得直连其他服务的表或通过跨服务 SQL 关联取数。共享数据库实例时也必须明确逻辑库或表的访问边界。
2. **远程访问**：跨服务协作采用接口调用或消息交互，明确传输的数据结构，不得把实现模块当作普通 JAR 引入来调用。
3. **依赖无环**：不得通过 API 模块互相依赖隐藏服务循环；出现相互调用时必须调整业务边界、提取协调职责或采用事件协作。
4. **事务边界**：本地事务只覆盖当前服务的本地数据。跨服务写入必须明确幂等、失败补偿和一致性方案，不得认为一个本地事务能够回滚远程操作。
5. **故障边界**：必须明确依赖服务故障时当前服务的业务处理方式。

## 命名与包结构约定

| 类型 | 命名示例 | 约定 |
| --- | --- | --- |
| 业务聚合模块 | `project-modules` | 只聚合业务服务，使用 `pom` 打包类型 |
| 服务实现模块 | `project-order-service` | 放在 `project-modules/` 下，项目名、业务能力和模块职责使用短横线连接 |
| 对外接口模块 | `project-order-api` | 与所属服务使用相同业务名称 |
| 服务根包 | `com.yiqianhe.project.order` | 按服务业务边界划分根包 |
| 对外接口根包 | `com.yiqianhe.project.order.api` | 与服务实现包区分 |
| 本地业务接口 | `OrderService` | 留在服务实现模块，不作为远程客户端使用 |
| 远程接口与调用封装 | `OrderRemoteApi`、`UserClient` | 分别表达服务提供方接口定义和调用方适配职责 |

## 服务配置与接口管理

1. **独立配置**：各服务必须具有唯一应用标识，数据库、注册和调用地址等配置由对应服务维护。
2. **接口归属**：每个 API 模块由服务提供方维护，接口变更必须评估调用方兼容性，明确影响范围和服务发布顺序。
3. **独立产物**：各服务产物必须独立命名并记录版本，能够按服务发布和回滚。
