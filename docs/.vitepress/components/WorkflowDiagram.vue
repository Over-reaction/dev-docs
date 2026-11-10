<script setup>
import { ref } from "vue";
import FullscreenPreview from "./FullscreenPreview.vue";
import WorkflowCanvas from "./WorkflowCanvas.vue";

defineProps({
  label: { type: String, required: true },
  nodes: { type: Array, required: true },
  edges: { type: Array, required: true },
  stages: { type: Array, default: () => [] },
});

const canvas = ref(null);
</script>

<template>
  <FullscreenPreview v-slot="{ isOpen, openPreview }" :title="label" inline-controls>
    <div class="workflow-diagram" :class="{ 'has-stages': stages.length, 'is-fullscreen': isOpen }" role="group"
      :aria-label="label">
      <div class="workflow-toolbar">
        <div v-if="stages.length" class="workflow-stage-buttons" role="group" aria-label="定位到流程阶段">
          <button v-for="stage in stages" :key="stage.id" type="button" @click="canvas?.focusStage(stage.id)">
            {{ stage.data.label }}
          </button>
        </div>
        <div class="workflow-zoom-buttons" role="group" aria-label="画布视图">
          <button type="button" aria-label="放大流程图" @click="canvas?.zoomIn()">+</button>
          <button type="button" aria-label="缩小流程图" @click="canvas?.zoomOut()">−</button>
          <button type="button" @click="canvas?.fitView()">查看全图</button>
          <button v-show="!isOpen" type="button" aria-haspopup="dialog" @click="openPreview">全屏预览</button>
        </div>
      </div>
      <div class="workflow-viewport">
        <WorkflowCanvas ref="canvas" :nodes="nodes" :edges="edges" :stages="stages" />
      </div>
    </div>
  </FullscreenPreview>
</template>

<style scoped>
.workflow-diagram {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.workflow-toolbar {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.workflow-stage-buttons,
.workflow-zoom-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.workflow-stage-buttons {
  margin-inline-end: auto;
}

.workflow-toolbar button {
  min-width: 36px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  line-height: 24px;
}

.workflow-toolbar button:hover,
.workflow-toolbar button:focus-visible {
  border-color: var(--vp-c-brand-1);
}

.workflow-viewport {
  height: clamp(240px, 32vw, 340px);
}

.has-stages .workflow-viewport {
  height: clamp(420px, 62vh, 680px);
}

.workflow-diagram.is-fullscreen {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 0;
  border-radius: 0;
}

.workflow-diagram.is-fullscreen .workflow-viewport {
  flex: 1;
  min-height: 0;
  height: auto;
}
</style>
