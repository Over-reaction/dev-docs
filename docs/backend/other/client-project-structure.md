<script setup>
import DirectoryTree from "../../.vitepress/components/DirectoryTree.vue";

const projectStructure = [
  { name: "config", description: "外部配置模板", children: [{ name: "application.example.yml", description: "安装后配置示例" }] },
  { name: "docs", description: "项目说明与技术文档", children: [] },
  { name: "packaging", description: "按目标平台划分的安装与打包配置", children: [{ name: "linux", description: "Linux 安装与服务配置，按需创建", children: [] }, { name: "windows", description: "Windows 安装、启动与更新器打包", children: [] }] },
  { name: "scripts", description: "构建、安装和诊断脚本", children: [] },
  {
    name: "src",
    description: "应用源码与测试",
    children: [
      {
        name: "main",
        description: "生产代码与资源",
        children: [
          {
            name: "java/com/yiqianhe/project/client",
            description: "应用代码根包",
            children: [
              { name: "bootstrap", description: "启动初始化、组件装配和退出清理", children: [] },
              {
                name: "common",
                description: "公共基础代码",
                children: [
                  { name: "constant", description: "通用常量", children: [] },
                  { name: "exception", description: "基础异常定义", children: [] },
                  { name: "util", description: "通用工具类", children: [] },
                ],
              },
              { name: "config", description: "应用配置管理", children: [] },
              { name: "console", description: "命令行或本地控制台入口，按需创建", children: [] },
              {
                name: "integration",
                description: "外部系统和本机设备适配",
                children: [
                  { name: "device", description: "摄像机、串口等设备接入，按需创建", children: [] },
                  { name: "inference", description: "模型加载与推理引擎适配，按需创建", children: [] },
                  {
                    name: "remote",
                    description: "服务端接口访问",
                    children: [
                      { name: "client", description: "外部系统访问封装", children: [] },
                      { name: "dto", description: "数据传输对象", children: [] },
                    ],
                  },
                ],
              },
              {
                name: "modules",
                description: "业务模块",
                children: [
                  {
                    name: "collection",
                    description: "采集业务模块",
                    children: [
                      { name: "converter", description: "对象模型转换", children: [] },
                      { name: "listener", description: "事件与消息处理入口，按需创建", children: [] },
                      { name: "model", description: "采集任务和处理结果等业务模型", children: [] },
                      { name: "repository", description: "本模块本地数据访问", children: [] },
                      {
                        name: "service",
                        description: "业务服务接口与实现",
                        children: [
                          { name: "impl", description: "业务服务实现", children: [{ name: "CollectionServiceImpl.java", description: "编排设备接入、处理和结果保存" }] },
                          { name: "CollectionService.java", description: "采集任务启停等业务能力" },
                        ],
                      },
                    ],
                  },
                  { name: "report", description: "结果上报业务，按需创建", children: [] },
                ],
              },
              {
                name: "storage",
                description: "本地持久化的通用技术实现",
                children: [
                  { name: "database", description: "SQLite 等本地数据库连接与升级，按需创建", children: [] },
                  { name: "file", description: "文件读写、临时文件与清理策略", children: [] },
                ],
              },
              { name: "task", description: "后台执行器、调度与任务生命周期", children: [] },
              {
                name: "ui",
                description: "本地界面，存在桌面界面时创建",
                children: [
                  { name: "component", description: "可复用的界面组件", children: [] },
                  { name: "controller", description: "界面事件处理", children: [] },
                  { name: "view", description: "窗口、页面和视图资源绑定", children: [] },
                ],
              },
              { name: "update", description: "版本检查、更新包校验与更新器交接，按需创建", children: [] },
              { name: "ClientApplication.java", description: "客户端启动入口" },
            ],
          },
          {
            name: "resources",
            description: "配置与只读资源",
            children: [
              { name: "db/migration", description: "本地数据库升级脚本，按需创建", children: [] },
              { name: "templates", description: "只读模板资源，按需创建", children: [] },
              { name: "ui", description: "界面布局、样式与图标，按需创建", children: [] },
              { name: "application.yml", description: "默认配置与外部配置引用" },
              { name: "logback.xml", description: "日志配置，按实际日志框架创建" },
            ],
          },
        ],
      },
      {
        name: "test",
        description: "测试代码与资源",
        children: [
          { name: "java/com/yiqianhe/project/client", description: "应用代码测试", children: [] },
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

# Java 客户端项目结构标准

## 文档版本

| 版本号 | 修订时间   | 修订者 | 备注 |
| ------ | ---------- | ------ | ---- |
| V1.0.0 | 2026/11/12 | 宁海   | 初稿 |

## 文档说明

适用于使用 Maven 构建、运行在用户电脑或边缘设备上的 Java 桌面程序、采集客户端和常驻代理程序。界面允许采用 JavaFX、Swing 或本地 Web 控制台；不要求必须使用 Spring Boot。

本标准与[通用工程标准](/backend/other/project-structure)配套使用，命名、分层职责、配置、依赖、测试资源和交付要求统一在通用标准中维护。

以下以具有采集和上报能力的客户端及根包 `com.yiqianhe.project.client` 为例，业务模块按实际功能替换。设备接入、模型推理、自动更新等目录仅在具备相应能力时创建。点击带有子项的目录行可展开或收起目录。

<DirectoryTree :nodes="projectStructure" />

## 各目录说明与使用规范

### 启动入口与 `bootstrap/`（应用生命周期）

`ClientApplication` 只负责启动应用，具体初始化和退出清理由 `bootstrap/` 统一组织。

- 启动时必须依次完成必要的配置加载、环境校验、组件装配和业务启动，初始化失败必须输出明确原因。
- 存在单实例要求时，必须在启动阶段检查并处理重复启动，不得在界面加载后才发现端口或数据文件冲突。
- 退出清理由 `bootstrap/` 统筹，设备句柄、原生 SDK 和推理会话必须纳入资源关闭范围。
- 不得在启动类中集中实现界面交互、设备采集、模型推理和结果上报。

### `config/`（应用配置管理）

Java `config/` 包负责配置模型、读取、校验和生效过程；项目根目录的 `config/` 只存放面向安装部署的配置模板。

客户端接收服务端配置时，必须针对设备重连、推理会话重建和采集任务重启明确配置生效过程。

### `ui/` 与 `console/`（交互入口）

| 目录 | 职责 | 使用边界 |
| --- | --- | --- |
| `ui/view` | 窗口、页面和显示绑定 | 不得实现设备通信、数据库查询或推理逻辑 |
| `ui/controller` | 接收用户操作、参数校验、调用业务服务和显示结果 | 不得在界面线程执行网络、数据库或长时间运算 |
| `ui/component` | 可复用界面组件 | 不得依赖具体业务模块的实现类 |
| `console` | 命令行或本地控制台适配 | 复用业务服务，不得建立另一套业务规则 |

后台任务更新界面时，必须使用所选 UI 框架规定的线程切换机制。使用本地 Web 控制台时，其 HTTP Controller 放在 `console/`，前端源码独立管理；仅构建后的静态文件按打包规则进入客户端。

无界面程序允许省略 `ui/`。仅使用桌面界面的程序允许省略 `console/`。

### `modules/`（业务模块）

按采集、上报、同步等业务能力划分模块，每个模块内部按职责分层。

| 包名 | 职责 | 使用边界 |
| --- | --- | --- |
| `model` | 当前模块的任务、状态和业务结果 | 不得承载 UI 控件、远程响应原文或外部 SDK 句柄 |
| `repository` | 当前模块的本地数据访问接口与实现 | 封装业务数据读写，复用 `storage/` 的数据库或文件能力 |

采集和上报模块不得直接读取对方的私有文件或 Repository，必须通过对应业务接口协作。

### `integration/`（外部能力适配）

- `remote/` 封装客户端与配套服务端的通信。
- `device/` 封装摄像机、串口、厂商 SDK 等设备访问，必须提供明确的连接、断开、重连和资源释放能力。
- `inference/` 封装模型加载、输入预处理、推理和输出转换，模型路径和执行设备必须由配置提供。

业务服务依赖明确的适配接口，具体协议或厂商实现留在适配层内部。仅单一业务使用的适配器允许放在该业务模块内；跨模块复用后再提取至 `integration/`，不得维护重复封装。

### `storage/`（本地存储基础能力）

存放数据库连接、数据库升级、通用文件读写和清理等技术实现，业务表的增删改查归属对应模块的 `repository/`。

使用本地数据库时，必须明确数据库文件位置、结构版本和升级失败的处理方式。文件存储按下文“安装文件与运行数据分离”组织。

### `task/`（后台任务管理）

负责执行器、调度、取消、超时和应用退出时的任务收尾。具体采集或上报规则仍放在对应业务服务。

- 同一设备或采集任务在启动、停止和配置变更时不得产生重复实例。
- 需要断网补报时，待发送数据必须持久化，明确确认成功、失败重试和重复发送处理规则；不得只保存在内存队列中。

### `update/`（自动更新）

仅在客户端提供自动更新时创建，负责版本检查、下载、更新包完整性与来源校验，以及与独立更新器的交接。

更新前必须处理运行任务、保留用户配置与业务数据；更新失败必须能够恢复可用版本。替换正在运行的程序文件等平台相关操作由打包和更新器方案处理，不得在界面事件中直接覆盖文件。

涉及数据库升级时，更新方案必须明确旧程序与新结构的兼容性及业务数据保留方式。不兼容时不得直接回滚程序，必须先按验证后的数据恢复或迁移方案处理。

### `src/main/resources/`（配置与只读资源）

客户端界面布局、样式和图标放在 `ui/`，本地数据库迁移脚本放在 `db/migration/`。

### `packaging/`、`scripts/` 与 `docs/`（交付文件）

- `packaging/` 按目标操作系统和架构管理安装配置、运行时资源清单、启动入口和更新器配置。只维护项目实际支持的平台。
- 本地 SDK、动态库和模型必须明确版本、平台架构和分发来源；大型文件通过制品管理或安装包流程获取，不得直接混入普通源码目录。
- 客户端交付说明必须额外列出原生依赖、目标架构和更新器分发方式。

## 安装文件与运行数据分离

以下是安装后的目录职责，不属于必须提交版本库的源码结构。安装目录和运行数据目录必须分别解析，运行数据应放在当前用户或服务账号有写权限的位置。

| 位置示例 | 存放内容 | 管理规则 |
| --- | --- | --- |
| 安装目录 `app/` | 可执行 JAR 和依赖 | 随版本发布与替换 |
| 安装目录 `runtime/` | 随包 Java 运行时，按需提供 | 与目标平台和架构匹配 |
| 安装目录 `native/` | 原生 SDK 和动态库，按需提供 | 与 SDK、JVM 及平台架构匹配 |
| 数据目录 `config/` | 用户配置与设备配置 | 升级时保留，敏感项必须受控保存 |
| 数据目录 `data/` | 本地数据库、待上报任务和业务文件 | 按业务保留规则管理，升级时不得误删 |
| 数据目录 `models/` | 外置模型，按需提供 | 记录模型版本和校验信息 |
| 数据目录 `logs/` | 运行日志与诊断记录 | 按通用标准执行滚动归档与容量控制 |
| 数据目录 `cache/`、`temp/` | 可重建缓存、下载与处理中间文件 | 按通用标准执行容量控制与定期清理 |
| 数据目录 `updates/` | 下载的更新包与恢复文件 | 更新完成或恢复后按规则清理 |

Windows 桌面客户端允许使用当前用户的应用数据目录；以服务方式运行时必须明确服务账号可写的数据目录。卸载程序是否删除配置和业务数据必须有明确规则，不得默认随程序覆盖或删除。

## 命名与分层调用约定

| 类型 | 命名示例 | 存放位置 |
| --- | --- | --- |
| 交互控制器 | `CollectionController` | `ui/controller/` 或 `console/` |
| 业务接口与实现 | `CollectionService`、`CollectionServiceImpl` | `modules/collection/service/` 及其 `impl/` |
| 本地数据访问 | `CollectionRepository` | `modules/collection/repository/` |
| 远程访问封装 | `ReportClient` | `integration/remote/client/` |
| 设备和推理适配 | `CameraAdapter`、`InferenceEngine` | `integration/device/`、`integration/inference/` |
| 调度任务 | `ReportRetryTask` | `task/`，内部调用业务服务 |

客户端的交互入口通过业务 Service 编排设备适配与本地 Repository，`bootstrap/` 负责装配具体实现。

## 小型客户端裁剪规则

小型客户端允许仅保留启动入口、配置、业务模块、实际使用的交互入口、外部适配和公共代码。没有本地持久化、设备接入、推理或更新需求时，允许省略对应目录；即使只有一个业务模块，也必须保持交互、业务处理和外部访问的职责边界。

客户端配套的服务端工程必须按[单体项目结构标准](/backend/other/monolith-project-structure)或[微服务项目结构标准](/backend/other/microservice-project-structure)独立组织。
