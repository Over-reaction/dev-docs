---
layout: page
title: 需求流程
---

<script setup>
import WorkflowPage from "../.vitepress/components/WorkflowPage.vue";
import { requirementFlow } from "./flows/requirement.js";
</script>

<WorkflowPage current="requirements" label="需求流程图" :flow="requirementFlow">
<template #intro>

# 需求流程

新增需求从需求池登记开始，经过客户与部门主管确认，再进入文档评审、开发、测试和发布。

</template>

## 流程说明

1. **登记与沟通。** 在腾讯文档需求池登记，召开需求沟通会议并形成纪要。客户未确认时返回会议纪要，部门主管决定不执行时告知客户并结束。
2. **文档与评审。** 输出原型图、功能清单、业务流程图和需求文档。经过部门主管初审与签字、研发组长初审、客户方案确认与签字，再进入需求评审。需要补文档或重新沟通时，按图中的分支回退。
3. **开发与联调。** 技术评审后在腾讯文档任务表自动新增研发任务并输出技术方案。后端编码、整理接口文档并自测，再交给前端编码和联调。联调未通过时返回接口文档。
4. **测试与发布。** 功能测试通过后请客户进行上线前测试。任一测试未通过时，定责修复后回到自测。客户测试通过后发布上线并记录版本。

研发组长初审和需求评审后的「是否需与客户确认业务规则」，原图均未标注「否」分支的去向。

</WorkflowPage>
