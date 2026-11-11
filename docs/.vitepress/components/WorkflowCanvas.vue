<template>
  <VueFlow class="workflow-canvas bg-surface-soft" :nodes="diagramNodes" :edges="edges"
    :default-edge-options="edgeOptions" :default-viewport="initialViewport" :connection-mode="ConnectionMode.Strict"
    :min-zoom="0.05" :max-zoom="1.75" :nodes-draggable="false" :nodes-connectable="false" :elements-selectable="false"
    :nodes-focusable="false" :edges-focusable="false" :zoom-on-scroll="true" :prevent-scrolling="true"
    :fit-view-on-init="!stages.length" @init="flow = $event">
    <Background variant="dots" :gap="24" :size="2" color="var(--vp-c-text-3)" aria-hidden="true" />
    <template #edge-workflow-route="edge">
      <WorkflowRoute v-bind="edge" />
    </template>
    <template #node-workflow="{ data }">
      <div v-if="data.shape === 'stage'" :data-workflow-stage="data.stageId" class="workflow-stage flex h-[40px] w-[188px] items-center
        border-l-[3px] border-l-brand bg-surface px-[12px] text-[15px] font-semibold">
        {{ data.label }}
      </div>
      <div v-else :data-workflow-stage="data.stageId" class="workflow-node relative grid h-[64px] w-[128px] box-border place-items-center
        px-[13px] py-0 text-center text-[14px] leading-[1.35] whitespace-pre-line text-content" :class="data.shape">
        <Handle v-for="position in positions" :id="position" :key="'target-' + position" type="target"
          :position="position" />
        <svg class="workflow-node-shape absolute inset-0 size-full fill-surface stroke-content-muted stroke-[1.5]"
          viewBox="0 0 128 64" preserveAspectRatio="none" aria-hidden="true">
          <path v-if="data.shape === 'input'" d="M 18 1 H 127 L 110 63 H 1 Z" />
          <path v-else-if="data.shape === 'document'" d="M 1 1 H 127 V 55 C 77 29 51 80 1 55 Z" />
          <path v-else-if="data.shape === 'decision'" d="M 64 1 L 127 32 L 64 63 L 1 32 Z" />
          <rect v-else-if="data.shape === 'terminal'" x="1" y="8" width="126" height="48" rx="24" />
          <rect v-else x="1" y="1" width="126" height="62" />
        </svg>
        <span class="relative">{{ data.label }}</span>
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
@reference "../theme/tailwind.css";

.workflow-stage[data-workflow-stage] {
  @apply border-l-stage-accent bg-stage-surface;
}

.workflow-node[data-workflow-stage] .workflow-node-shape {
  @apply fill-stage-surface stroke-stage-accent;
}

.workflow-node.decision {
  @apply h-[84px] w-[164px] px-[36px];
}

.workflow-node-shape>* {
  vector-effect: non-scaling-stroke;
}

.workflow-node.document span {
  @apply mb-[6px];
}

.workflow-node :deep(.vue-flow__handle) {
  @apply size-0 min-h-0 min-w-0 border-0 opacity-0;
}

.workflow-node.input :deep(.vue-flow__handle-left) {
  @apply left-[9px];
}

.workflow-node.input :deep(.vue-flow__handle-right) {
  @apply right-[9px];
}

.workflow-node.terminal :deep(.vue-flow__handle-top) {
  @apply top-[8px];
}

.workflow-node.terminal :deep(.vue-flow__handle-bottom),
.workflow-node.document :deep(.vue-flow__handle-bottom) {
  @apply bottom-[8px];
}
</style>
