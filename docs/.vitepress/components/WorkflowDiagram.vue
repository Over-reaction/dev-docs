<template>
  <FullscreenPreview v-slot="{ isOpen, openPreview }" :title="label" inline-controls>
    <div class="workflow-diagram overflow-hidden rounded-[8px] border border-divider"
      :class="{ 'has-stages': stages.length, 'is-fullscreen': isOpen }" role="group" :aria-label="label">
      <div class="workflow-toolbar flex flex-wrap justify-end gap-[8px] border-b border-divider p-[8px]">
        <div v-if="stages.length" class="workflow-stage-buttons me-auto flex flex-wrap gap-[8px]" role="group"
          aria-label="定位到流程阶段">
          <button v-for="stage in stages" :key="stage.id" type="button" :data-workflow-stage="stage.data.stageId"
            @click="canvas?.focusStage(stage.id)">
            {{ stage.data.label }}
          </button>
        </div>
        <div class="workflow-zoom-buttons flex flex-wrap gap-[8px]" role="group" aria-label="画布视图">
          <button type="button" aria-label="放大流程图" @click="canvas?.zoomIn()">+</button>
          <button type="button" aria-label="缩小流程图" @click="canvas?.zoomOut()">−</button>
          <button type="button" @click="canvas?.fitView()">查看全图</button>
          <button v-show="!isOpen" type="button" aria-haspopup="dialog" @click="openPreview">全屏预览</button>
        </div>
      </div>
      <div class="workflow-viewport h-[clamp(240px,32vw,340px)]">
        <WorkflowCanvas ref="canvas" :nodes="nodes" :edges="edges" :stages="stages" />
      </div>
    </div>
  </FullscreenPreview>
</template>

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

<style scoped>
@reference "../theme/tailwind.css";

.workflow-toolbar button {
  @apply min-w-[36px] rounded-[6px] border border-divider bg-surface-soft px-[10px] py-[4px] text-[14px] leading-[24px];
}

.workflow-stage-buttons button[data-workflow-stage] {
  @apply border-stage-accent bg-stage-surface;
}

.workflow-toolbar button:hover,
.workflow-toolbar button:focus-visible {
  @apply border-brand;
}

.has-stages .workflow-viewport {
  height: clamp(420px, 62vh, 680px);
}

.workflow-diagram.is-fullscreen {
  @apply flex h-full flex-col rounded-none border-none border-current;
}

.workflow-diagram.is-fullscreen .workflow-viewport {
  @apply h-auto min-h-0 flex-1;
}
</style>
