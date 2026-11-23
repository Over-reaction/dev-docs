---
layout: page
title: 优化流程
---

<script setup>
import WorkflowPage from "../.vitepress/components/WorkflowPage.vue";
import { optimizationFlow } from "./flows/optimization.js";
</script>

<WorkflowPage current="optimization" label="优化流程图" :flow="optimizationFlow">
<template #intro>

# 优化流程

优化类需求从问题登记开始，研发组长初审无疑问时直接进入需求评审。

</template>

## 流程说明

1. **登记与沟通。** 在腾讯文档登记优化事项，召开沟通会议。
2. **文档与评审。** 输出原型图、功能清单、业务流程图和需求文档，提交研发组长初审。文档有疏漏时返回文档输出，业务规则需客户确认时，记录事项并返回沟通会议。进入需求评审时，按原图在腾讯文档任务表自动新增研发任务。
3. **开发与联调。** 技术评审后在腾讯文档任务表自动新增研发任务并输出技术方案。后端编码、整理接口文档并自测，再交给前端编码和联调。联调未通过时返回接口文档。
4. **测试。** 功能测试通过后请客户进行上线前测试。任一测试未通过时，定责修复后回到自测。
5. **研发发布上线。** 客户测试通过后，核对 `Version.md`，合入目标环境的公共分支，选择手动打包或 CI/CD 自动打包。按 `Version.md` 执行发布配置后发布系统，通知研发和产品并记录实际发布版本。系统验证正常后闭合任务，异常时返回研发修复并复测。

开发、测试、灰度和生产环境分别对应 `dev`、`test`、`gray` 和 `prod` 分支。非生产环境由研发人员操作。生产环境由项目负责人确认发布安排，研发交付，研发运维执行部署。版本计算和部署分工见 [版本号管理规范](/changelog/) 和 [研发运维岗职责标准](/responsibilities/devops)。

研发组长初审和需求评审后的「是否需与客户确认业务规则」，原图均未标注「否」分支的去向。

</WorkflowPage>
