import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "开发",
  description: "技术开发指南",
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
