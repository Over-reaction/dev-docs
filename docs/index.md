---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
pageClass: standards-home

hero:
  name: 公司研发规范
  tagline: 查阅开发标准、软件版本管理规范与研发工作流程。
  image:
    src: /standards-hero.svg
    alt: ""
  actions:
    - theme: brand
      text: 查阅前端标准
      link: /frontend/
    - theme: alt
      text: 查看版本规范
      link: /changelog/

features:
  - title: 前端标准
    details: 查阅 HTML、CSS、JavaScript、Vue 3 和微信小程序的开发规范。
    link: /frontend/
    linkText: 查看规范
  - title: 后端标准
    details: 后端服务的开发规范，内容待补充。
  - title: 版本更新
    details: 查阅版本号升级规则、发布批次的计算方式和测试版本命名。
    link: /changelog/
    linkText: 查看版本规范
  - title: 工作流程
    details: 研发协作与交付流程，内容待补充。
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
