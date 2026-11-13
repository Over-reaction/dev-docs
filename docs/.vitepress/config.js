import { defineConfig } from "vitepress";

// 将规范条目的标记映射为 VitePress 徽标样式。
const ruleBadgeTypes = {
  强制: "danger",
  推荐: "warning",
  参考: "note",
};

// 顶部「前端标准」入口直接打开前端开发标准的第一篇文档。
const frontendHtmlPath = "/frontend/standards/html";

// 前端侧边栏的开发标准与专项标准分别维护在两个列表中。
const frontendStandards = [
  { text: "HTML", link: frontendHtmlPath },
  { text: "CSS", link: "/frontend/standards/css" },
  { text: "JavaScript", link: "/frontend/standards/javascript" },
  { text: "Vue 3", link: "/frontend/standards/vue3" },
  { text: "微信小程序", link: "/frontend/standards/weixin" },
];

const frontendOtherStandards = [
  { text: "前端技术方案标准", link: "/frontend/other/technical-design" },
  { text: "Vue 3 项目结构标准", link: "/frontend/other/project-structure" },
];

// 后端标准的顶部入口与侧边栏分组标题共用概览页。
const backendStandardsPath = "/backend/standards/";

// 后端侧边栏的开发标准与专项标准分别维护在两个列表中。
const backendStandards = [
  { text: "编码规约", link: "/backend/standards/coding-guidelines" },
  { text: "异常日志", link: "/backend/standards/exception-logging" },
  { text: "单元测试", link: "/backend/standards/unit-testing" },
  { text: "安全规范", link: "/backend/standards/security" },
  { text: "MySQL 数据库", link: "/backend/standards/mysql" },
];

const backendOtherStandards = [
  { text: "接口文档标准", link: "/backend/other/api-standard" },
  { text: "技术方案标准", link: "/backend/other/technical-design" },
  { text: "接口权限标准", link: "/backend/other/api-permission-design" },
  { text: "通用工程标准", link: "/backend/other/project-structure" },
  {
    text: "单体项目结构标准",
    link: "/backend/other/monolith-project-structure",
  },
  {
    text: "微服务项目结构标准",
    link: "/backend/other/microservice-project-structure",
  },
  {
    text: "客户端项目结构标准",
    link: "/backend/other/client-project-structure",
  },
];

// 顶部「绩效考核」入口默认打开前端绩效考核页。
const frontendPerformancePath = "/performance/frontend/performance";

// 顶部「岗位职责」入口默认打开测试岗职责页。
const testingResponsibilitiesPath = "/responsibilities/testing";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 站点的默认语言、标题和描述。
  lang: "zh-CN",
  title: "研发规范",
  description: "技术开发指南",
  markdown: {
    config(md) {
      // 在 Markdown 行内解析前，将段落开头的 **【强制】**、**【推荐】** 或 **【参考】** 转为徽标。
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
    // 顶部导航的 link 是点击后的跳转地址，activeMatch 用正则匹配栏目内应高亮该入口的页面。
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
      {
        text: "岗位职责",
        activeMatch: "^/responsibilities/",
        link: testingResponsibilitiesPath,
      },
      { text: "版本号规范", link: "/changelog/" },
      {
        text: "绩效考核",
        activeMatch: "^/performance/",
        link: frontendPerformancePath,
      },
    ],

    // 按页面路径前缀选择侧边栏，每个前缀下可以配置多个分组。
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
      "/responsibilities/": [
        {
          text: "岗位职责",
          items: [
            { text: "测试岗", link: testingResponsibilitiesPath },
            {
              text: "研发运维岗",
              link: "/responsibilities/devops",
              collapsed: false,
              items: [
                {
                  text: "专业术语说明",
                  link: "/responsibilities/devops-glossary",
                },
              ],
            },
          ],
        },
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

    // 在顶部导航显示指向项目仓库的 GitHub 图标。
    socialLinks: [
      { icon: "github", link: "https://github.com/Over-reaction/dev-docs" },
    ],
  },
});
