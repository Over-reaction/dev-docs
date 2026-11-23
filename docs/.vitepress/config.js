import { defineConfig } from "vitepress";
import ruleBadges from "./markdown/rule-badges.js";

// 前端标准的顶部入口与侧边栏分组标题共用概览页。
const frontendStandardsPath = "/frontend/standards/";

// 前端侧边栏的开发标准与专项标准分别维护在两个列表中。
const frontendStandards = [
  { text: "HTML", link: "/frontend/standards/html" },
  { text: "CSS", link: "/frontend/standards/css" },
  { text: "JavaScript", link: "/frontend/standards/javascript" },
  { text: "Vue 3", link: "/frontend/standards/vue3" },
  { text: "微信小程序", link: "/frontend/standards/weixin" },
];

const frontendOtherStandards = [
  { text: "技术方案标准", link: "/frontend/other/technical-design" },
  { text: "自测标准", link: "/frontend/other/self-test" },
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
  {
    text: "通用项目结构标准",
    link: "/backend/other/project-structure",
    collapsed: true,
    items: [
      { text: "单体项目结构标准", link: "/backend/other/monolith-project-structure" },
      { text: "微服务项目结构标准", link: "/backend/other/microservice-project-structure" },
      { text: "客户端项目结构标准", link: "/backend/other/client-project-structure" },
    ],
  },
  { text: "服务器运维指标标准", link: "/backend/other/server-operations-standard" },
];

// 顶部「绩效考核」入口默认打开新人入职页。
const newcomerFormulaPath = "/performance/quantitativeFormula";

// 新人入职页沿用原有地址，与绩效考核页面共用侧边栏。
const performanceSidebar = [
  {
    text: "绩效考核",
    items: [
      { text: "项目对接周期估算", link: newcomerFormulaPath },
      { text: "后端绩效考核", link: "/performance/performance-backend" },
      { text: "前端绩效考核", link: "/performance/performance-frontend" },
    ],
  },
  {
    text: "评分依据",
    items: [
      { text: "测试缺陷等级量化标准", link: "/performance/test-defect" },
      { text: "问题清单类型合并", link: "/performance/question-list" },
    ],
  },
];

// 顶部「岗位职责」入口默认打开研发运维岗职责页。
const devopsResponsibilitiesPath = "/responsibilities/devops";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 站点的默认语言、标题和描述。
  lang: "zh-CN",
  title: "研发规范",
  description: "技术开发指南",
  // 暂时下线测试岗职责页，保留 Markdown 源文件。
  srcExclude: ["responsibilities/testing.md"],
  markdown: {
    config(md) {
      md.use(ruleBadges);
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
        link: frontendStandardsPath,
      },
      {
        text: "岗位职责",
        activeMatch: "^/responsibilities/",
        link: devopsResponsibilitiesPath,
      },
      { text: "版本号规范", link: "/changelog/" },
      {
        text: "绩效考核",
        activeMatch: "^/(performance|quantitativeFormula)/",
        link: newcomerFormulaPath,
      },
    ],

    // 按页面路径前缀选择侧边栏，每个前缀下可以配置多个分组。
    sidebar: {
      "/frontend/": [
        {
          text: "前端开发标准",
          link: frontendStandardsPath,
          items: frontendStandards,
        },
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
            {
              text: "研发运维岗",
              link: devopsResponsibilitiesPath,
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
      "/performance/": performanceSidebar,
    },

    // 在顶部导航显示指向项目仓库的 GitHub 图标。
    socialLinks: [
      { icon: "github", link: "https://github.com/Over-reaction/dev-docs" },
    ],
  },
});
