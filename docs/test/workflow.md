---
layout: page
title: 流程图预览
search: false
---

<script setup>
import ExcalidrawViewer from "../.vitepress/components/ExcalidrawViewer.vue";
import sceneSource from "/workflow/flow.excalidraw?raw";

const scene = JSON.parse(sceneSource);
</script>

<main class="workflow-test">
  <ExcalidrawViewer :scene="scene" />
</main>

<style scoped>
.workflow-test {
  max-width: 1520px;
  margin-inline: auto;
  padding: 32px clamp(16px, 4vw, 48px);
}
</style>
