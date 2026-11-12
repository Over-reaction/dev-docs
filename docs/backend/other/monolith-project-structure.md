<script setup>
import DirectoryTree from "../../.vitepress/components/DirectoryTree.vue";

const projectStructure = [
  { name: "db", description: "数据库初始化与升级脚本", children: [{ name: "init", description: "初始化脚本", children: [] }, { name: "upgrade", description: "按版本归档的升级脚本", children: [] }] },
  { name: "deploy", description: "部署脚本与配置模板", children: [] },
  { name: "docs", description: "项目说明与技术文档", children: [] },
  {
    name: "src",
    description: "应用源码与测试",
    children: [
      {
        name: "main",
        description: "生产代码与资源",
        children: [
          {
            name: "java/com/yiqianhe/project",
            description: "应用代码根包",
            children: [
              {
                name: "common",
                description: "公共基础代码",
                children: [
                  { name: "annotation", description: "通用注解", children: [] },
                  { name: "constant", description: "通用常量", children: [] },
                  { name: "exception", description: "基础异常定义", children: [] },
                  { name: "response", description: "统一响应与分页对象", children: [] },
                  { name: "util", description: "通用工具类", children: [] },
                ],
              },
              {
                name: "config",
                description: "应用配置管理",
                children: [
                  { name: "MybatisConfig.java", description: "持久层配置" },
                  { name: "WebConfig.java", description: "Web 配置" },
                ],
              },
              {
                name: "modules",
                description: "业务模块",
                children: [
                  {
                    name: "order",
                    description: "订单业务模块",
                    children: [
                      { name: "client", description: "外部系统访问封装", children: [] },
                      { name: "controller", description: "HTTP 接口入口", children: [{ name: "OrderController.java", description: "订单接口" }] },
                      { name: "converter", description: "对象模型转换", children: [] },
                      { name: "dto", description: "数据传输对象", children: [{ name: "OrderCreateDTO.java", description: "创建订单入参" }, { name: "OrderQueryDTO.java", description: "订单查询条件" }] },
                      { name: "entity", description: "数据库持久化对象", children: [{ name: "OrderDO.java", description: "订单表映射" }] },
                      { name: "enums", description: "业务枚举", children: [] },
                      { name: "job", description: "定时任务入口，按需创建", children: [] },
                      { name: "listener", description: "事件与消息处理入口，按需创建", children: [] },
                      { name: "manager", description: "组合查询、缓存与外部调用处理，按需创建", children: [] },
                      { name: "mapper", description: "数据库访问接口", children: [{ name: "OrderMapper.java", description: "订单数据访问" }] },
                      {
                        name: "service",
                        description: "业务服务接口与实现",
                        children: [
                          { name: "impl", description: "业务服务实现", children: [{ name: "OrderServiceImpl.java", description: "订单业务处理与事务编排" }] },
                          { name: "OrderService.java", description: "订单业务服务接口" },
                        ],
                      },
                      { name: "vo", description: "接口展示对象", children: [{ name: "OrderVO.java", description: "订单展示数据" }] },
                    ],
                  },
                  { name: "system", description: "用户、角色等系统管理业务", children: [] },
                ],
              },
              { name: "ProjectApplication.java", description: "Spring Boot 启动入口" },
            ],
          },
          {
            name: "resources",
            description: "配置与只读资源",
            children: [
              { name: "mapper/order", description: "MyBatis SQL 映射", children: [{ name: "OrderMapper.xml", description: "订单 SQL 映射" }] },
              { name: "templates", description: "只读模板资源，按需创建", children: [] },
              { name: "application-dev.yml", description: "开发环境非敏感配置" },
              { name: "application.yml", description: "默认配置与外部配置引用" },
              { name: "logback-spring.xml", description: "日志配置，按实际日志框架创建" },
            ],
          },
        ],
      },
      {
        name: "test",
        description: "测试代码与资源",
        children: [
          { name: "java/com/yiqianhe/project/modules/order", description: "订单模块测试", children: [] },
          { name: "resources", description: "测试配置与测试数据", children: [] },
        ],
      },
    ],
  },
  { name: ".gitignore", description: "Git 忽略规则" },
  { name: "pom.xml", description: "Maven 依赖、插件与构建配置" },
  { name: "README.md", description: "项目说明与本地运行步骤" },
];
</script>

# Java 单体项目结构标准

## 文档版本

| 版本号 | 修订时间   | 修订者 | 备注 |
| ------ | ---------- | ------ | ---- |
| V1.0.0 | 2026/11/12 | 宁海   | 初稿 |

## 文档说明

适用于使用 Maven、Spring Boot 和 MyBatis 的 Java Web 单体应用。一个应用作为一个整体构建和部署，内部先按业务模块划分，再按职责分层。单体应用允许使用多个 Maven 模块，是否为单体以部署边界为准。

本标准与[通用工程标准](/backend/other/project-structure)配套使用，命名、分层职责、配置、依赖、测试资源和交付要求统一在通用标准中维护。

以下以单 Maven 模块和根包 `com.yiqianhe.project` 为例。点击带有子项的目录行可展开或收起目录。

<DirectoryTree :nodes="projectStructure" />

## 各目录说明与使用规范

### `src/main/java/`（生产代码）

所有生产 Java 代码必须放在项目根包下。启动类放在根包，配置类放在 `config/`，业务代码统一放在 `modules/`。

- **业务优先**：订单代码集中放在 `modules/order/`，用户、角色等系统管理代码集中放在 `modules/system/`。不得在项目根包建立容纳所有业务的 `controller/`、`service/` 或 `mapper/`。
- **启动范围**：组件与 Mapper 扫描范围必须覆盖实际业务包；改变根包或拆分模块时必须同步检查扫描配置。

### `config/`（应用配置管理）

存放 Web、数据库访问、缓存、线程池、安全等技术配置。仅单个业务模块使用的配置放在该模块的 `config/`，不得集中堆放到全局配置包。

### `common/`（公共基础代码）

单 Maven 模块的公共基础代码集中放在根包下的 `common/`；拆分为多 Maven 模块时，允许迁入 `project-common`。

### `modules/`（业务模块）

当前应用的订单、合同和系统管理等业务分别放在 `modules/order/`、`modules/contract/` 和 `modules/system/`，各模块内部按目录树示例组织。

### `src/main/resources/`（配置与只读资源）

- MyBatis XML 必须按业务模块放入 `mapper/`，例如 `mapper/order/OrderMapper.xml`；文件名必须与 Mapper 接口对应，`namespace` 必须使用接口全限定名，资源扫描路径必须覆盖实际位置。
- 当前应用的导出模板放在 `templates/`。

### `src/test/`（测试代码与资源）

订单模块的 `OrderServiceImplTest` 放在测试根包的 `modules/order/service/impl/` 下。

### `db/`、`deploy/` 与 `docs/`（工程辅助文件）

单体应用的数据库脚本按整个应用的发布版本管理，部署脚本以整体应用为启停和发布单位。

## 分层调用与模块依赖

单体应用的模块协作遵守以下规则：

1. **应用内协作**：跨业务模块必须通过被调用模块的 Service 接口访问其业务能力，不得直接访问其他模块的 Mapper、实现类或私有数据对象。
2. **业务协调**：存在模块相互调用时，必须重新划分职责或抽取协调服务，不能通过拆分 Maven 模块掩盖循环依赖。

## 命名与对象约定

| 类型 | 命名示例 | 存放位置 |
| --- | --- | --- |
| 项目根包 | `com.yiqianhe.project` | `src/main/java/` 下对应目录 |
| 业务服务接口与实现 | `OrderService`、`OrderServiceImpl` | `modules/order/service/` 及其 `impl/` |
| 数据访问接口与 XML | `OrderMapper`、`OrderMapper.xml` | Java `mapper/` 与资源 `mapper/order/` |
| 持久化对象 | `OrderDO` | `modules/order/entity/` |
| 接口入参与查询对象 | `OrderCreateDTO`、`OrderQueryDTO` | `modules/order/dto/` |
| 展示对象 | `OrderVO` | `modules/order/vo/` |
| 对象转换器 | `OrderConverter` | `modules/order/converter/` |

## 多 Maven 模块的单体应用

业务规模扩大时，允许拆分为启动模块、业务模块和公共模块，但仍作为一个应用发布。

| 模块示例 | 职责 | 依赖规则 |
| --- | --- | --- |
| `project-app` | 启动、全局配置和最终打包 | 依赖实际启用的业务模块与公共模块 |
| `project-order` | 订单业务代码与资源 | 依赖公共模块；模块内保持业务分层 |
| `project-system` | 系统管理业务代码与资源 | 依赖公共模块；跨模块协作必须定义明确接口并保持依赖无环 |
| `project-common` | 公共基础能力 | 不得反向依赖业务模块和启动模块 |

只有 `project-app` 启动模块生成最终可执行应用包，业务模块随启动模块一起发布，不得单独作为微服务部署。

## 关联标准

- [微服务项目结构标准](/backend/other/microservice-project-structure)：拆分为独立部署服务时使用。
