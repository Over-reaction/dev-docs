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
  { text: "前端绩效考核", link: "/frontend/other/performance" },
];

const backendDevelopmentStandard = {
  text: "Java开发标准",
  link: "/backend/standards/",
};

const backendOtherStandards = [
  { text: "接口文档标准", link: "/backend/other/api-standard" },
  { text: "技术方案标准", link: "/backend/other/technical-design" },
  { text: "接口权限标准", link: "/backend/other/api-permission-design" },
  { text: "后端绩效考核", link: "/backend/other/performance" },
];

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
        text: "前端标准",
        activeMatch: "^/frontend/",
        link: frontendHtmlPath,
      },
      {
        text: "后端标准",
        activeMatch: "^/backend/",
        link: backendDevelopmentStandard.link,
      },
      { text: "版本更新", link: "/changelog/" },
    ],

    sidebar: {
      "/frontend/": [
        { text: "前端开发标准", items: frontendStandards },
        { text: "专项标准", items: frontendOtherStandards },
      ],
      "/backend/": [
        { text: "后端开发标准", items: [backendDevelopmentStandard] },
        { text: "专项标准", items: backendOtherStandards },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/Over-reaction/dev-docs" },
    ],
  },
});
