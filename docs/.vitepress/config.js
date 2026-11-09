import { defineConfig } from "vitepress";

const ruleBadgeTypes = {
  强制: "danger",
  推荐: "warning",
  参考: "note",
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "开发",
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
        link: "/frontend/",
        activeMatch: "^/frontend/",
      },
      { text: "版本更新", link: "/changelog/" },
    ],

    sidebar: {
      "/frontend/": [
        {
          text: "前端标准",
          items: [
            { text: "HTML", link: "/frontend/html/" },
            { text: "CSS", link: "/frontend/css/" },
            { text: "JavaScript", link: "/frontend/javascript/" },
            { text: "Vue 3", link: "/frontend/vue3/" },
            { text: "微信小程序", link: "/frontend/weixin/" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
