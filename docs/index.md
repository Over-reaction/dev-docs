---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
pageClass: standards-home

hero:
  name: 研发规范
  company: 广州一千河科技有限公司
  tagline: 查阅研发工作流程、开发标准、岗位职责与版本号管理规范
  image:
    src: /standards-handbook-refined.png
    alt: "一本展开的研发手册，左页是检查清单，右页是流程图。"
    decoding: async
    width: 1080
    height: 720
  actions:
    - theme: brand
      text: 后端标准
      link: /backend/standards/
    - theme: brand
      text: 前端标准
      link: /frontend/standards/html
    - theme: alt
      text: 版本号规范
      link: /changelog/

features:
  - title: 工作流程
    details: 查看新增需求、优化和 BUG 的登记、评审、开发与交付流程。
    link: /workflow/
    linkText: 查看工作流程
  - title: 后端标准
    details: 查阅 Java 开发规范、通用工程标准、项目结构标准、接口文档标准和接口权限标准。
    link: /backend/standards/
    linkText: 查看规范
  - title: 前端标准
    details: 查阅 HTML、CSS、JavaScript、Vue 3、微信小程序开发规范和前端技术方案标准。
    link: /frontend/standards/html
    linkText: 查看规范
  # - title: 岗位职责
  #   details: 明确测试岗、研发运维岗的职责范围、工作产出与协作边界。
  #   link: /responsibilities/testing
  #   linkText: 查看岗位职责
  - title: 版本号规范
    details: 查阅版本号升级规则、发布批次的计算方式和测试版本命名。
    link: /changelog/
    linkText: 查看版本号规范
---
