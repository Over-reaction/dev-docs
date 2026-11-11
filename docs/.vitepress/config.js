import { defineConfig } from "vitepress";

const ruleBadgeTypes = {
  强制: "danger",
  推荐: "warning",
  参考: "note",
};

const frontendHtmlPath = "/frontend/standards/html";

const frontendStandards = [
  { text: "HTML", link: frontendHtmlPath },
  { text: "CSS", link: "/frontend/standards/css" },
  { text: "JavaScript", link: "/frontend/standards/javascript" },
  { text: "Vue 3", link: "/frontend/standards/vue3" },
  { text: "微信小程序", link: "/frontend/standards/weixin" },
];

const frontendOtherStandards = [
  { text: "前端技术方案标准", link: "/frontend/other/technical-design" },
  { text: "Vue 3 项目目录规范", link: "/frontend/other/project-structure" },
];

const backendStandardsPath = "/backend/standards/";

const backendStandards = [
  { text: "编码规约", link: "/backend/standards/coding-guidelines" },
  { text: "异常日志", link: "/backend/standards/exception-logging" },
  { text: "单元测试", link: "/backend/standards/unit-testing" },
  { text: "安全规范", link: "/backend/standards/security" },
  { text: "MySQL 数据库", link: "/backend/standards/mysql" },
  { text: "工程结构", link: "/backend/standards/project-structure" },
];

const backendOtherStandards = [
  { text: "接口文档标准", link: "/backend/other/api-standard" },
  { text: "技术方案标准", link: "/backend/other/technical-design" },
  { text: "接口权限标准", link: "/backend/other/api-permission-design" },
];

const frontendPerformancePath = "/performance/frontend/performance";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "研发规范",
  description: "技术开发指南",
  markdown: {
    config(md) {
      md.core.ruler.before("inline", "rule_badges", (state) => {
        for (const [index, token] of state.tokens.entries()) {
          if (
            token.type === "inline" &&
            state.tokens[index - 1]?.type === "paragraph_open"
          ) {
            token.content = token.content.replace(
              /^\*\*【(强制|推荐|参考)】\*\*/,
              (_, label) =>
                `<Badge type="${ruleBadgeTypes[label]}" text="${label}" />`,
            );
          }
        }
      });
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      {
        text: "工作流程",
        activeMatch: "^/workflow/",
        link: "/workflow/",
      },
      {
        text: "后端标准",
        activeMatch: "^/backend/",
        link: backendStandardsPath,
      },
      {
        text: "前端标准",
        activeMatch: "^/frontend/",
        link: frontendHtmlPath,
      },
      { text: "版本号规范", link: "/changelog/" },
      {
        text: "绩效考核",
        activeMatch: "^/performance/",
        link: frontendPerformancePath,
      },
    ],

    sidebar: {
      "/frontend/": [
        { text: "前端开发标准", items: frontendStandards },
        { text: "专项标准", items: frontendOtherStandards },
      ],
      "/backend/": [
        {
          text: "后端开发标准",
          link: backendStandardsPath,
          items: backendStandards,
        },
        { text: "专项标准", items: backendOtherStandards },
      ],
      "/performance/": [
        {
          text: "绩效考核",
          items: [
            { text: "前端绩效考核", link: frontendPerformancePath },
            { text: "后端绩效考核", link: "/performance/backend/performance" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/Over-reaction/dev-docs" },
    ],
  },
});
