---
layout: page
title: 流程图图片预览
search: false
---

<script setup>
import { withBase } from "vitepress";
import ImageViewer from "../.vitepress/components/ImageViewer.vue";
</script>

<main class="workflow-test">
  <ImageViewer :src="withBase('/flow.png')" alt="任务填写流程图" />
</main>

<style scoped>
.workflow-test {
  max-width: 1520px;
  margin-inline: auto;
  padding: 32px clamp(16px, 4vw, 48px);
}
</style>
