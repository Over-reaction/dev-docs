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
4. **测试与发布。** 功能测试通过后请客户进行上线前测试。任一测试未通过时，定责修复后回到自测。客户测试通过后，研发完成分支合并和发布交付，研发运维按项目负责人确认的发布安排执行部署并记录版本。具体打包、验证和部署分工按[研发运维岗职责标准](/responsibilities/devops)执行。

研发组长初审和需求评审后的「是否需与客户确认业务规则」，原图均未标注「否」分支的去向。

</WorkflowPage>
