---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
pageClass: standards-home

hero:
  name: 广州一千河科技有限公司研发规范
  tagline: 查阅开发标准、软件版本管理规范与研发工作流程。
  image:
    src: /standards-hero.svg
    alt: ""
  actions:
    - theme: brand
      text: 查阅后端标准
      link: /backend/standards/
    - theme: brand
      text: 查阅前端标准
      link: /frontend/standards/html
    - theme: alt
      text: 查看版本规范
      link: /changelog/

features:
  - title: 工作流程
    details: 查看新增需求、优化和 BUG 的登记、评审、开发与交付流程。
    link: /workflow/
    linkText: 查看工作流程
  - title: 后端标准
    details: 查阅 Java 开发规范、接口文档标准、技术方案标准和接口权限标准。
    link: /backend/standards/
    linkText: 查看规范
  - title: 前端标准
    details: 查阅 HTML、CSS、JavaScript、Vue 3、微信小程序开发规范和前端技术方案标准。
    link: /frontend/standards/html
    linkText: 查看规范
  - title: 版本更新
    details: 查阅版本号升级规则、发布批次的计算方式和测试版本命名。
    link: /changelog/
    linkText: 查看版本规范
---

<style>
.standards-home {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(
    110deg,
    var(--vp-c-brand-1),
    var(--vp-c-text-1)
  );
  --vp-home-hero-image-background-image: radial-gradient(
    ellipse,
    var(--vp-c-brand-soft),
    transparent 70%
  );
}

.standards-home .VPFeature {
  border-color: var(--vp-c-divider);
}
</style>
