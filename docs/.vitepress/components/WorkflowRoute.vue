<script setup>
import { computed } from "vue";
import { BaseEdge } from "@vue-flow/core";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  id: String,
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  markerEnd: String,
  label: String,
  labelStyle: Object,
  labelBgStyle: Object,
  labelBgPadding: Array,
  style: Object,
  data: Object,
});

const points = computed(() => [
  [props.sourceX, props.sourceY],
  ...props.data.waypoints,
  [props.targetX, props.targetY],
]);
const path = computed(() => `M ${points.value.map((point) => point.join(" ")).join(" L ")}`);
const labelPosition = computed(() => {
  const index = props.data.labelSegment ?? 0;
  const [start, end] = points.value.slice(index, index + 2);
  return { x: (start[0] + end[0]) / 2, y: (start[1] + end[1]) / 2 };
});
</script>

<template>
  <BaseEdge
    :id="id"
    :path="path"
    :marker-end="markerEnd"
    :style="style"
    :label="label"
    :label-x="labelPosition.x"
    :label-y="labelPosition.y"
    :label-style="labelStyle"
    :label-bg-style="labelBgStyle"
    :label-bg-padding="labelBgPadding"
  />
</template>
