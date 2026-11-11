<template>
  <VueFlow class="workflow-canvas" :nodes="diagramNodes" :edges="diagramEdges" :default-edge-options="edgeOptions"
    :default-viewport="initialViewport" :connection-mode="ConnectionMode.Strict" :min-zoom="0.05" :max-zoom="1.75"
    :nodes-draggable="false" :nodes-connectable="false" :elements-selectable="false" :nodes-focusable="false"
    :edges-focusable="false" :zoom-on-scroll="true" :prevent-scrolling="true" :fit-view-on-init="!stages.length"
    @init="flow = $event">
    <Background variant="dots" :gap="24" :size="2" color="var(--vp-c-text-3)" aria-hidden="true" />
    <template #edge-workflow-route="edge">
      <WorkflowRoute v-bind="edge" />
    </template>
    <template #node-workflow="{ id, data }">
      <div v-if="data.shape === 'stage'" class="workflow-canvas__stage" :data-workflow-stage="data.stageId">
        {{ data.label }}
      </div>
      <div v-else class="workflow-canvas__node" :class="[
        data.shape && `workflow-canvas__node--${data.shape}`,
        {
          'workflow-canvas__node--visited': progress?.visitedNodes.has(id),
          'workflow-canvas__node--current': progress?.nodeId === id,
          'workflow-canvas__node--preview': progress?.previewEdge?.target === id,
        },
      ]" :data-workflow-stage="data.stageId" :aria-current="progress?.nodeId === id ? 'step' : undefined">
        <Handle v-for="position in positions" :id="position" :key="'target-' + position" type="target"
          :position="position" />
        <svg class="workflow-canvas__node-shape" viewBox="0 0 128 64" preserveAspectRatio="none" aria-hidden="true">
          <g :id="`${outlinePrefix}-${id}`" class="workflow-canvas__node-outline">
            <path v-if="data.shape === 'input'" pathLength="100" d="M 18 1 H 127 L 110 63 H 1 Z" />
            <path v-else-if="data.shape === 'document'" pathLength="100" d="M 1 1 H 127 V 55 C 77 29 51 80 1 55 Z" />
            <path v-else-if="data.shape === 'decision'" pathLength="100" d="M 64 1 L 127 32 L 64 63 L 1 32 Z" />
            <rect v-else-if="data.shape === 'terminal'" pathLength="100" x="1" y="8" width="126" height="48" rx="24" />
            <rect v-else pathLength="100" x="1" y="1" width="126" height="62" />
          </g>
          <use v-if="progress?.nodeId === id" :href="`#${outlinePrefix}-${id}`" class="workflow-canvas__node-dot" />
        </svg>
        <span class="workflow-canvas__node-label">{{ data.label }}</span>
        <Handle v-for="position in positions" :id="position" :key="'source-' + position" type="source"
          :position="position" />
      </div>
    </template>
  </VueFlow>
</template>


<script setup>
import { computed, shallowRef, useId, watch } from "vue";
import { Background } from "@vue-flow/background";
import { ConnectionMode, Handle, MarkerType, Position, VueFlow } from "@vue-flow/core";
import WorkflowRoute from "./WorkflowRoute.vue";
import "@vue-flow/core/dist/style.css";

const props = defineProps({
  nodes: { type: Array, required: true },
  edges: { type: Array, required: true },
  stages: { type: Array, default: () => [] },
  progress: { type: Object, default: null },
});

const flow = shallowRef(null);
const outlinePrefix = `workflow-outline-${useId()}`;
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

const diagramEdges = computed(() => props.edges.map((edge) => {
  const style = edge.style ?? edgeOptions.style;
  const markerEnd = edge.markerEnd ?? edgeOptions.markerEnd;
  const previewed = props.progress?.previewEdge?.id === edge.id;
  if (!previewed && !props.progress?.visitedEdges.has(edge.id)) return { ...edge, style, markerEnd };

  const stroke = "var(--vp-c-brand-1)";
  const emphasized = previewed || props.progress.latestEdges.has(edge.id);
  return {
    ...edge,
    style: {
      ...style,
      stroke,
      strokeWidth: emphasized ? 3.5 : 2.5,
      ...(previewed ? { strokeDasharray: "6 4" } : {}),
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: stroke },
  };
}));

watch([
  () => props.progress?.nodeId,
  () => flow.value?.dimensions.value.width,
  () => flow.value?.dimensions.value.height,
], ([id, width, height], [previousId]) => {
  if (!id || !width || !height) return;
  const animate = id !== previousId && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  flow.value.fitView({ nodes: [id], padding: 0.25, maxZoom: 1, duration: animate ? 240 : 0 });
}, { flush: "post" });

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

.workflow-canvas__node.workflow-canvas__node--visited .workflow-canvas__node-shape {
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
}

.workflow-canvas__node.workflow-canvas__node--current .workflow-canvas__node-shape {
  overflow: visible;
  fill: color-mix(in srgb, var(--vp-c-brand-1) 16%, var(--vp-c-bg));
  stroke-width: 3.5;
  animation: workflow-canvas-current-glow 2s ease-in-out infinite;
}

.workflow-canvas__node--current .workflow-canvas__node-label {
  font-weight: 700;
}

.workflow-canvas__node--preview .workflow-canvas__node-outline {
  stroke: var(--vp-c-brand-1);
  stroke-width: 2.5;
  stroke-dasharray: 5 4;
}

@keyframes workflow-canvas-current-glow {

  0%,
  100% {
    filter: drop-shadow(0 0 2px color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent));
  }

  50% {
    filter: drop-shadow(0 0 8px color-mix(in srgb, var(--vp-c-brand-1) 75%, transparent));
  }
}

.workflow-canvas__node-dot {
  fill: none;
  stroke: color-mix(in srgb, var(--vp-c-brand-1) 40%, var(--vp-c-text-1));
  stroke-width: 4.5;
  stroke-linecap: round;
  stroke-dasharray: 0.6 99.4;
  filter: drop-shadow(0 0 2px var(--vp-c-brand-1));
  pointer-events: none;
  animation: workflow-canvas-current-orbit 3.2s linear infinite;
}

@keyframes workflow-canvas-current-orbit {
  to {
    stroke-dashoffset: -100;
  }
}

@media (prefers-reduced-motion: reduce) {
  .workflow-canvas__node.workflow-canvas__node--current .workflow-canvas__node-shape {
    animation: none;
  }

  .workflow-canvas__node-dot {
    display: none;
  }
}

.workflow-canvas__node-outline>* {
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
