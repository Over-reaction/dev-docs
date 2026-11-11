<template>
  <section class="workflow-simulation" aria-label="流程模拟">
    <div class="workflow-simulation__header">
      <div>
        <div v-if="current" class="workflow-simulation__position">
          <span class="workflow-simulation__stage" :data-workflow-stage="currentNode.data.stageId">{{ stageLabel
          }}</span>
          <span>第 {{ history.length }} 步</span>
        </div>
        <h2 ref="heading" class="workflow-simulation__title" tabindex="-1">{{ title }}</h2>
      </div>
      <div v-if="current" class="workflow-simulation__actions workflow-simulation__actions--secondary">
        <button class="workflow-simulation__button workflow-simulation__button--quiet" type="button"
          :disabled="history.length === 1" @click="back">
          上一步
        </button>
        <button class="workflow-simulation__button workflow-simulation__button--quiet" type="button"
          @click="restart">重新开始</button>
      </div>
    </div>

    <div v-if="!current" class="workflow-simulation__actions">
      <button v-for="(start, index) in config.starts" :key="start.id" class="workflow-simulation__button"
        :class="{ 'workflow-simulation__button--primary': index === 0 }" type="button" @click="advance(start.id)">
        {{ start.label }}
      </button>
    </div>
    <template v-else-if="joinId">
      <fieldset class="workflow-simulation__checklist">
        <legend>
          确认完成项
          <span class="workflow-simulation__count" role="status">已完成 {{ current.checked.length }} / {{ outgoing.length
          }}</span>
        </legend>
        <label v-for="edge in outgoing" :key="edge.id" class="workflow-simulation__item">
          <input v-model="current.checked" type="checkbox" :value="edge.id" />
          {{ nodeLabel(edge.target) }}
        </label>
      </fieldset>
      <div class="workflow-simulation__actions">
        <button class="workflow-simulation__button workflow-simulation__button--primary" type="button"
          :disabled="current.checked.length !== outgoing.length" @click="finishGroup">
          进入{{ nodeLabel(joinId) }}
        </button>
      </div>
    </template>
    <template v-else-if="isDecision && choices.length">
      <div class="workflow-simulation__choices">
        <button v-for="choice in choices" :key="choice.edge?.id ?? 'unresolved'" class="workflow-simulation__choice"
          :class="{ 'workflow-simulation__choice--previewed': previewChoice === choice }" type="button"
          @mousemove="hoveredChoice = choice" @mouseleave="hoveredChoice = null" @focus="focusChoice(choice)"
          @blur="focusedChoice = null" @click="chooseBranch(choice)">
          <span class="workflow-simulation__choice-copy">
            <span class="workflow-simulation__choice-label">{{ choice.label }}</span>
            <span class="workflow-simulation__choice-destination">{{ choice.destination }}</span>
          </span>
          <span v-if="choice.edge" class="workflow-simulation__choice-arrow" aria-hidden="true">→</span>
        </button>
      </div>
      <div v-if="waitingForBranch" class="workflow-simulation__notice" role="status">
        流程待确认。「{{ unresolvedBranch }}」的去向有待补充，可重新选择或返回上一步。
      </div>
    </template>
    <div v-else-if="outgoing.length" class="workflow-simulation__actions">
      <button v-for="edge in outgoing" :key="edge.id"
        class="workflow-simulation__button workflow-simulation__button--primary" type="button"
        @click="advance(edge.target, [edge])">
        下一步 · {{ config.questions[edge.target] ?? nodeLabel(edge.target) }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, shallowRef, watchEffect } from "vue";

const props = defineProps({
  config: { type: Object, required: true },
  nodes: { type: Array, required: true },
  edges: { type: Array, required: true },
  stages: { type: Array, required: true },
});

const emit = defineEmits(["progress"]);
const heading = ref(null);
const history = ref([]);
const waitingForBranch = ref(false);
const hoveredChoice = shallowRef(null);
const focusedChoice = shallowRef(null);
const previewChoice = computed(() => hoveredChoice.value ?? focusedChoice.value);
const nodesById = computed(() => new Map(props.nodes.map(node => [node.id, node])));
const current = computed(() => history.value.at(-1));
const currentNode = computed(() => nodesById.value.get(current.value?.id));
const stageLabel = computed(() => props.stages.find(stage => stage.id === currentNode.value?.data.stageId)?.data.label);
const outgoing = computed(() => props.edges.filter(edge => edge.source === current.value?.id));
const isDecision = computed(() => currentNode.value?.data.shape === "decision");
const joinId = computed(() => props.config.joins[current.value?.id]);
const unresolvedBranch = computed(() => props.config.unresolvedBranches[current.value?.id]);
const passLabels = { 是: "通过", 否: "未通过" };

function nodeLabel(id) {
  return nodesById.value.get(id).data.label.replaceAll("\n", "");
}

const title = computed(() => {
  if (!current.value) return "选择模拟起点";
  if (!outgoing.value.length) return "演练完成";
  const label = nodeLabel(current.value.id);
  if (!isDecision.value) return label;
  return props.config.questions[current.value.id] ?? label + "？";
});

function decisionLabel(label) {
  if (currentNode.value.data.label !== "是否通过") return label;
  return passLabels[label] ?? label;
}

const choices = computed(() => {
  const orderedEdges = [...outgoing.value].sort(
    (first, second) => Number(second.label === "是") - Number(first.label === "是"),
  );
  const options = orderedEdges.map(edge => ({
    edge,
    label: decisionLabel(edge.label),
    destination: nodeLabel(edge.target),
  }));
  if (unresolvedBranch.value) {
    options.push({ edge: null, label: unresolvedBranch.value, destination: "流程待确认" });
  }
  return options;
});

function focusChoice(choice) {
  hoveredChoice.value = null;
  focusedChoice.value = choice;
}

function chooseBranch(choice) {
  if (choice.edge) {
    advance(choice.edge.target, [choice.edge]);
  } else {
    waitingForBranch.value = true;
  }
}

function showStep() {
  waitingForBranch.value = false;
  hoveredChoice.value = null;
  focusedChoice.value = null;
  return nextTick(() => heading.value?.focus({ preventScroll: true }));
}

onMounted(showStep);

function advance(id, via = []) {
  history.value.push({ id, via, checked: [] });
  showStep();
}

function finishGroup() {
  const joinEdges = outgoing.value.map(({ target }) =>
    props.edges.find(edge => edge.source === target && edge.target === joinId.value),
  );
  advance(joinId.value, [...outgoing.value, ...joinEdges]);
}

function back() {
  if (history.value.length < 2) return;
  history.value.pop();
  showStep();
}

function restart() {
  history.value = [];
  showStep();
}

watchEffect(() => {
  if (!current.value) {
    emit("progress", null);
    return;
  }

  const traversed = history.value.flatMap(step => step.via);
  const checked = outgoing.value.filter(edge => current.value.checked.includes(edge.id));
  const visitedEdges = new Set([...traversed, ...checked].map(edge => edge.id));
  const visitedNodes = new Set([
    ...history.value.map(step => step.id),
    ...traversed.map(edge => edge.target),
    ...checked.map(edge => edge.target),
  ]);
  const latestEdges = new Set([...current.value.via, ...checked].map(edge => edge.id));

  emit("progress", {
    nodeId: current.value.id,
    visitedNodes,
    visitedEdges,
    latestEdges,
    previewEdge: previewChoice.value?.edge ?? null,
  });
});
</script>

<style scoped>
.workflow-simulation {
  display: grid;
  gap: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  padding: 14px 16px 16px;
}

.workflow-simulation__header,
.workflow-simulation__actions,
.workflow-simulation__position {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.workflow-simulation__header {
  justify-content: space-between;
}

.workflow-simulation__actions--secondary {
  gap: 4px;
}

.workflow-simulation__position {
  margin-bottom: 4px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.workflow-simulation__stage {
  border-radius: 4px;
  background-color: var(--workflow-stage-surface);
  padding-inline: 6px;
  color: var(--workflow-stage-accent);
}

.workflow-simulation .workflow-simulation__title {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.workflow-simulation__title:focus {
  outline: none;
}

.workflow-simulation__button {
  min-height: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
  padding: 5px 12px;
  font-size: 14px;
  line-height: 24px;
}

.workflow-simulation__button--primary {
  border-color: var(--vp-button-brand-border);
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-weight: 600;
}

.workflow-simulation__button--quiet {
  border-color: transparent;
  background-color: transparent;
  padding-inline: 8px;
  color: var(--vp-c-text-2);
}

.workflow-simulation__button:hover:not(:disabled),
.workflow-simulation__button:focus-visible {
  border-color: var(--vp-c-brand-1);
}

.workflow-simulation__button--quiet:hover:not(:disabled) {
  border-color: transparent;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.workflow-simulation__button:disabled {
  cursor: default;
  opacity: 0.5;
}

.workflow-simulation__choices,
.workflow-simulation__checklist {
  display: grid;
  max-inline-size: 38rem;
  gap: 8px;
}

.workflow-simulation__choices {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
}

.workflow-simulation__choice {
  display: grid;
  min-height: 64px;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  padding: 9px 12px;
  text-align: start;
  transition: border-color 140ms ease-out, background-color 140ms ease-out;
}

.workflow-simulation__choice--previewed {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

.workflow-simulation__choice:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.workflow-simulation__choice-copy {
  display: grid;
  gap: 2px;
}

.workflow-simulation__choice-label {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.workflow-simulation__choice-destination {
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.45;
}

.workflow-simulation__choice-arrow {
  color: var(--vp-c-brand-1);
}

.workflow-simulation__checklist {
  min-inline-size: 0;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 124px), 1fr));
  font-size: 14px;
}

.workflow-simulation__checklist legend {
  margin-bottom: 8px;
  padding: 0;
}

.workflow-simulation__count {
  margin-inline-start: 8px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.workflow-simulation__item {
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  padding: 6px 10px;
  cursor: pointer;
}

.workflow-simulation__item:hover,
.workflow-simulation__item:focus-within {
  border-color: var(--vp-c-brand-1);
}

.workflow-simulation__item:has(input:checked) {
  background-color: var(--vp-c-brand-soft);
}

.workflow-simulation__item input {
  accent-color: var(--vp-c-brand-1);
}

.workflow-simulation__notice {
  border-left: 2px solid var(--vp-c-warning-1);
  padding-inline-start: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

@media (prefers-reduced-motion: reduce) {
  .workflow-simulation__choice {
    transition: none;
  }
}
</style>
