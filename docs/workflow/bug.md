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
3. 产品测试后发布上线，并记录发布上线版本。
4. 流程结束后填写问题清单。

</WorkflowPage>
