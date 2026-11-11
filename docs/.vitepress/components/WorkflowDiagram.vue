<template>
  <FullscreenPreview v-slot="{ isOpen, openPreview }" :title="label" inline-controls>
    <div class="workflow-diagram"
      :class="{ 'workflow-diagram--staged': stages.length, 'workflow-diagram--fullscreen': isOpen }"
      role="group" :aria-label="label">
      <div class="workflow-diagram__toolbar">
        <div v-if="stages.length" class="workflow-diagram__controls workflow-diagram__controls--stages" role="group"
          aria-label="定位到流程阶段">
          <button v-for="stage in stages" :key="stage.id" class="workflow-diagram__button" type="button"
            :data-workflow-stage="stage.data.stageId" @click="canvas?.focusStage(stage.id)">
            {{ stage.data.label }}
          </button>
        </div>
        <div class="workflow-diagram__controls" role="group" aria-label="画布视图">
          <button v-if="simulation" class="workflow-diagram__button workflow-diagram__button--simulation"
            type="button" :aria-expanded="simulating" @click="toggleSimulation">
            {{ simulating ? "退出模拟" : "开始模拟" }}
          </button>
          <button class="workflow-diagram__button" type="button" aria-label="放大流程图" @click="canvas?.zoomIn()">+</button>
          <button class="workflow-diagram__button" type="button" aria-label="缩小流程图" @click="canvas?.zoomOut()">−</button>
          <button class="workflow-diagram__button" type="button" @click="canvas?.fitView()">查看全图</button>
          <button v-show="!isOpen" class="workflow-diagram__button" type="button" aria-haspopup="dialog"
            @click="openPreview">全屏预览</button>
        </div>
      </div>
      <WorkflowSimulation v-if="simulating" class="workflow-diagram__simulation"
        :config="simulation" :nodes="nodes" :edges="edges" :stages="stages"
        @progress="progress = $event" />
      <div class="workflow-diagram__viewport">
        <WorkflowCanvas ref="canvas" :nodes="nodes" :edges="edges" :stages="stages" :progress="progress" />
      </div>
    </div>
  </FullscreenPreview>
</template>

<script setup>
import { ref, shallowRef } from "vue";
import FullscreenPreview from "./FullscreenPreview.vue";
import WorkflowCanvas from "./WorkflowCanvas.vue";
import WorkflowSimulation from "./WorkflowSimulation.vue";

defineProps({
  label: { type: String, required: true },
  nodes: { type: Array, required: true },
  edges: { type: Array, required: true },
  stages: { type: Array, default: () => [] },
  simulation: { type: Object, default: null },
});

const canvas = ref(null);
const simulating = ref(false);
const progress = shallowRef(null);

function toggleSimulation() {
  simulating.value = !simulating.value;
  if (!simulating.value) progress.value = null;
}
</script>

<style scoped>
.workflow-diagram {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.workflow-diagram__toolbar,
.workflow-diagram__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.workflow-diagram__toolbar {
  justify-content: flex-end;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 8px;
}

.workflow-diagram__controls--stages {
  margin-inline-end: auto;
}

.workflow-diagram__button {
  min-width: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
  padding: 4px 10px;
  font-size: 14px;
  line-height: 24px;
}

.workflow-diagram__button[data-workflow-stage] {
  border-color: var(--workflow-stage-accent, var(--vp-c-brand-1));
  background-color: var(--workflow-stage-surface, var(--vp-c-bg));
}

.workflow-diagram__button--simulation {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.workflow-diagram__button:hover,
.workflow-diagram__button:focus-visible {
  border-color: var(--vp-c-brand-1);
}

.workflow-diagram__viewport {
  height: clamp(240px, 32vw, 340px);
}

.workflow-diagram--staged .workflow-diagram__viewport {
  height: clamp(420px, 62vh, 680px);
}

.workflow-diagram--fullscreen {
  display: flex;
  height: 100%;
  flex-direction: column;
  border: 0;
  border-radius: 0;
}

.workflow-diagram--fullscreen .workflow-diagram__simulation {
  max-height: 50%;
  overflow: auto;
}

.workflow-diagram--fullscreen .workflow-diagram__viewport {
  height: auto;
  min-height: 0;
  flex: 1;
}
</style>
