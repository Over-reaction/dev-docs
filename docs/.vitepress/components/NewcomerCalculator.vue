<script setup>
import { computed, ref, useId } from "vue";

const props = defineProps({
  projects: { type: Array, required: true },
  dailyWorkHours: { type: Number, required: true },
});

const projectSelectId = useId();
const backgroundDaysId = useId();
const selectedProjectId = ref("");
const backgroundDays = ref(1);
const selectedProject = computed(() =>
  props.projects.find((project) => project.id === selectedProjectId.value),
);
const familiarityHoursSummary = computed(() => {
  if (!selectedProject.value) return "请选择项目";

  const { familiarityHours, featureCounts } = selectedProject.value;
  const { complex, medium, simple } = featureCounts;
  return `${familiarityHours} 小时（复杂功能 ${complex} 个、中等功能 ${medium} 个、简单功能 ${simple} 个）`;
});
const isBackgroundDaysValid = computed(() =>
  Number.isFinite(backgroundDays.value) && backgroundDays.value >= 0,
);
const result = computed(() => {
  if (!selectedProject.value || !isBackgroundDaysValid.value) return null;

  return backgroundDays.value + selectedProject.value.familiarityHours / props.dailyWorkHours;
});
</script>

<template>
  <div class="newcomer-calculator">
    <h2 id="parameters">对接周期计算</h2>

    <div class="newcomer-calculator__fields">
      <div>
        <label class="newcomer-calculator__label" :for="projectSelectId">选择项目</label>
        <select :id="projectSelectId" v-model="selectedProjectId" class="newcomer-calculator__select">
          <option disabled value="">请选择项目</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
        </select>
      </div>
      <div>
        <label class="newcomer-calculator__label" :for="backgroundDaysId">项目背景了解周期</label>
        <div class="newcomer-calculator__control">
          <input :id="backgroundDaysId" v-model="backgroundDays" class="newcomer-calculator__input" type="number"
            required min="0" step="any" inputmode="decimal" :aria-invalid="!isBackgroundDaysValid"
            :aria-describedby="`${backgroundDaysId}-unit ${backgroundDaysId}-error`">
          <span :id="`${backgroundDaysId}-unit`" class="newcomer-calculator__unit">工作日</span>
        </div>
        <div :id="`${backgroundDaysId}-error`" class="newcomer-calculator__error">
          {{ isBackgroundDaysValid ? "" : "请输入大于或等于 0 的数值。" }}
        </div>
      </div>
      <dl>
        <dt class="newcomer-calculator__label">项目功能熟悉总时长</dt>
        <dd class="newcomer-calculator__value">{{ familiarityHoursSummary }}</dd>
      </dl>
      <dl>
        <dt class="newcomer-calculator__label">每日工作时长</dt>
        <dd class="newcomer-calculator__value">{{ dailyWorkHours }} 小时/工作日</dd>
      </dl>
    </div>

    <div role="status" aria-atomic="true">
      <div v-if="result !== null" class="newcomer-calculator__result">
        项目对接周期 <strong>{{ result }} 个工作日</strong>
      </div>
    </div>

    <h2 id="formula">计算公式</h2>

    <div class="newcomer-calculator__formula">
      <math display="block">
        <mrow>
          <mtext>项目对接周期</mtext>
          <mtext v-if="result !== null" class="newcomer-calculator__formula-value">（{{ result }} 个工作日）</mtext>
        </mrow>
        <mo>=</mo>
        <mrow>
          <mtext>项目背景了解周期</mtext>
          <mtext v-if="selectedProject && isBackgroundDaysValid" class="newcomer-calculator__formula-value">
            （{{ backgroundDays }} 个工作日）
          </mtext>
        </mrow>
        <mo>+</mo>
        <mfrac>
          <mrow>
            <mtext>项目功能熟悉总时长</mtext>
            <mtext v-if="selectedProject" class="newcomer-calculator__formula-value">
              （{{ selectedProject.familiarityHours }} 小时）
            </mtext>
          </mrow>
          <mrow>
            <mtext>每日工作时长</mtext>
            <mtext v-if="selectedProject" class="newcomer-calculator__formula-value">（{{ dailyWorkHours }} 小时/工作日）</mtext>
          </mrow>
        </mfrac>
      </math>
    </div>
  </div>
</template>

<style scoped>
.newcomer-calculator__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 20px;
}

@media (max-width: 39.99rem) {
  .newcomer-calculator__fields {
    grid-template-columns: 1fr;
  }
}

.newcomer-calculator__label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
}

.newcomer-calculator__value {
  display: flex;
  align-items: center;
  min-height: 44px;
  margin: 0;
  font-variant-numeric: tabular-nums;
}

.newcomer-calculator__control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.newcomer-calculator__unit {
  color: var(--vp-c-text-2);
  font-size: 13px;
  white-space: nowrap;
}

.newcomer-calculator__select,
.newcomer-calculator__input {
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 7px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.newcomer-calculator__select {
  appearance: auto;
}

.newcomer-calculator__select:focus-visible,
.newcomer-calculator__input:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.newcomer-calculator__input[aria-invalid="true"] {
  border-color: var(--vp-c-danger-1);
}

.newcomer-calculator__error:not(:empty) {
  margin-top: 4px;
  color: var(--vp-c-danger-1);
  font-size: 13px;
  line-height: 1.5;
}

.newcomer-calculator__formula {
  overflow-x: auto;
  padding: 16px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.newcomer-calculator__formula math {
  width: max-content;
  margin-inline: auto;
  font-size: clamp(0.9375rem, 3.25vw, 1.125rem);
}

.newcomer-calculator__formula-value {
  color: var(--vp-c-brand-1);
  font-size: 0.85em;
}

.newcomer-calculator__result {
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  font-weight: 600;
  overflow-wrap: anywhere;
}

.newcomer-calculator__result strong {
  margin-inline-start: 8px;
  color: var(--vp-c-brand-1);
  font-size: 1.25rem;
}
</style>
