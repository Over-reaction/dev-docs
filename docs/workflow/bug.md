---
layout: page
title: BUG 处理流程
---

<script setup>
import WorkflowPage from "../.vitepress/components/WorkflowPage.vue";
import { bugFlow } from "/workflow/flows/bug.js";
</script>

<WorkflowPage current="bug" label="BUG 处理流程图" :flow="bugFlow">
<template #intro>

# BUG 处理流程

bug类由负责该系统的研发人员判断，进入修复流程。

</template>

## 流程说明

1. 发现 BUG 后，在腾讯文档登记问题，并反馈给负责该系统的研发人员。
2. 前后端确定责任人，由责任人定位问题原因并修复 BUG。
3. **研发发布上线。** 产品测试通过后，核对 `Version.md`，合入目标环境的公共分支，选择手动打包或 CI/CD 自动打包。按 `Version.md` 执行发布配置后发布系统，通知研发和产品并记录实际发布版本。
4. 系统验证正常后闭合任务并填写问题清单。发现异常时返回研发定位并修复 BUG，再交产品复测。

开发、测试、灰度和生产环境分别对应 `dev`、`test`、`gray` 和 `prod` 分支。非生产环境由研发人员操作。生产环境由项目负责人确认发布安排，研发交付，研发运维执行部署。版本计算、部署分工和紧急修复发布要求见 [版本号管理规范](/changelog/) 和 [研发运维岗职责标准](/responsibilities/devops)。

</WorkflowPage>
