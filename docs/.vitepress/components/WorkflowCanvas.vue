<template>
  <VueFlow class="workflow-canvas" :nodes="diagramNodes" :edges="edges"
    :default-edge-options="edgeOptions" :default-viewport="initialViewport" :connection-mode="ConnectionMode.Strict"
    :min-zoom="0.05" :max-zoom="1.75" :nodes-draggable="false" :nodes-connectable="false" :elements-selectable="false"
    :nodes-focusable="false" :edges-focusable="false" :zoom-on-scroll="true" :prevent-scrolling="true"
    :fit-view-on-init="!stages.length" @init="flow = $event">
    <Background variant="dots" :gap="24" :size="2" color="var(--vp-c-text-3)" aria-hidden="true" />
    <template #edge-workflow-route="edge">
      <WorkflowRoute v-bind="edge" />
    </template>
    <template #node-workflow="{ data }">
      <div v-if="data.shape === 'stage'" class="workflow-canvas__stage" :data-workflow-stage="data.stageId">
        {{ data.label }}
      </div>
      <div v-else class="workflow-canvas__node" :class="data.shape && `workflow-canvas__node--${data.shape}`"
        :data-workflow-stage="data.stageId">
        <Handle v-for="position in positions" :id="position" :key="'target-' + position" type="target"
          :position="position" />
        <svg class="workflow-canvas__node-shape"
          viewBox="0 0 128 64" preserveAspectRatio="none" aria-hidden="true">
          <path v-if="data.shape === 'input'" d="M 18 1 H 127 L 110 63 H 1 Z" />
          <path v-else-if="data.shape === 'document'" d="M 1 1 H 127 V 55 C 77 29 51 80 1 55 Z" />
          <path v-else-if="data.shape === 'decision'" d="M 64 1 L 127 32 L 64 63 L 1 32 Z" />
          <rect v-else-if="data.shape === 'terminal'" x="1" y="8" width="126" height="48" rx="24" />
          <rect v-else x="1" y="1" width="126" height="62" />
        </svg>
        <span class="workflow-canvas__node-label">{{ data.label }}</span>
        <Handle v-for="position in positions" :id="position" :key="'source-' + position" type="source"
          :position="position" />
      </div>
    </template>
  </VueFlow>
</template>


<script setup>
import { computed, shallowRef } from "vue";
import { Background } from "@vue-flow/background";
import { ConnectionMode, Handle, MarkerType, Position, VueFlow } from "@vue-flow/core";
import WorkflowRoute from "./WorkflowRoute.vue";
import "@vue-flow/core/dist/style.css";

const props = defineProps({
  nodes: { type: Array, required: true },
  edges: { type: Array, required: true },
  stages: { type: Array, default: () => [] },
});

const flow = shallowRef(null);
const diagramNodes = computed(() =>
  props.nodes.map((node) => ({ ...node, type: "workflow" })),
);

const positions = [Position.Left, Position.Top, Position.Right, Position.Bottom];
const edgeOptions = {
  type: "straight",
  markerEnd: { type: MarkerType.ArrowClosed, color: "var(--vp-c-text-2)" },
  style: { stroke: "var(--vp-c-text-2)", strokeWidth: 1.5 },
  labelStyle: { fill: "var(--vp-c-text-1)", fontSize: 13 },
  labelBgStyle: { fill: "var(--vp-c-bg-soft)" },
  labelBgPadding: [4, 3],
};

function stageViewport(stage) {
  return { x: 24 - stage.position.x, y: 20 - stage.position.y, zoom: 1 };
}

const initialViewport = computed(() =>
  props.stages.length ? stageViewport(props.stages[0]) : { x: 0, y: 0, zoom: 1 },
);

function zoomIn() {
  return flow.value?.zoomIn();
}

function zoomOut() {
  return flow.value?.zoomOut();
}

function fitView() {
  return flow.value?.fitView({ padding: props.stages.length ? 0.2 : 0.1 });
}

function focusStage(stageId) {
  const stage = props.stages.find(({ id }) => id === stageId);
  if (stage) return flow.value?.setViewport(stageViewport(stage));
}

defineExpose({ zoomIn, zoomOut, fitView, focusStage });
</script>

<style scoped>
.workflow-canvas {
  background-color: var(--vp-c-bg-soft);
}

.workflow-canvas__stage {
  display: flex;
  width: 188px;
  height: 40px;
  align-items: center;
  border-left: 3px solid var(--workflow-stage-accent, var(--vp-c-brand-1));
  background-color: var(--workflow-stage-surface, var(--vp-c-bg));
  padding-inline: 12px;
  font-size: 15px;
  font-weight: 600;
}

.workflow-canvas__node {
  position: relative;
  display: grid;
  box-sizing: border-box;
  width: 128px;
  height: 64px;
  place-items: center;
  padding: 0 13px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.35;
  text-align: center;
  white-space: pre-line;
}

.workflow-canvas__node--decision {
  width: 164px;
  height: 84px;
  padding-inline: 36px;
}

.workflow-canvas__node-shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-text-2);
  stroke-width: 1.5;
}

.workflow-canvas__node[data-workflow-stage] .workflow-canvas__node-shape {
  fill: var(--workflow-stage-surface, var(--vp-c-bg));
  stroke: var(--workflow-stage-accent, var(--vp-c-brand-1));
}

.workflow-canvas__node-shape > * {
  vector-effect: non-scaling-stroke;
}

.workflow-canvas__node-label {
  position: relative;
}

.workflow-canvas__node--document .workflow-canvas__node-label {
  margin-bottom: 6px;
}

.workflow-canvas__node :deep(.vue-flow__handle) {
  width: 0;
  height: 0;
  min-width: 0;
  min-height: 0;
  border-width: 0;
  opacity: 0;
}

.workflow-canvas__node--input :deep(.vue-flow__handle-left) {
  left: 9px;
}

.workflow-canvas__node--input :deep(.vue-flow__handle-right) {
  right: 9px;
}

.workflow-canvas__node--terminal :deep(.vue-flow__handle-top) {
  top: 8px;
}

.workflow-canvas__node--terminal :deep(.vue-flow__handle-bottom),
.workflow-canvas__node--document :deep(.vue-flow__handle-bottom) {
  bottom: 8px;
}
</style>
