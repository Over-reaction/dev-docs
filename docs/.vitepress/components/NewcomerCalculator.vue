<script setup>
import { computed, nextTick, reactive, ref, useId, watch } from "vue";

const fields = [
  { key: "B", label: "基础熟悉时间", unit: "天" },
  { key: "P", label: "项目功能复杂度总分", unit: "分" },
  { key: "E", label: "每天预计熟悉的功能分值", unit: "分/天" },
  { key: "I", label: "额外技术复杂度时间", unit: "天" },
  { key: "Tmin", label: "最短熟悉周期", unit: "天" },
  { key: "Tmax", label: "最长常规熟悉周期", unit: "天" },
];

const inputId = useId();
const values = reactive({ B: 1, P: "", E: 8, I: 0, Tmin: 2, Tmax: 5 });
const showErrors = ref(false);
const result = ref(null);

watch(values, () => {
  result.value = null;
});

const errors = computed(() => {
  const messages = {};

  for (const { key, label } of fields) {
    const value = values[key];
    if (value === "") {
      messages[key] = `请输入${label}。`;
    } else if (key === "E" && (!Number.isFinite(value) || value <= 0)) {
      messages[key] = "请输入大于 0 的数值。";
    } else if (!Number.isFinite(value) || value < 0) {
      messages[key] = "请输入大于或等于 0 的数值。";
    }
  }

  if (!messages.Tmin && !messages.Tmax && values.Tmin > values.Tmax) {
    messages.Tmax = "最长周期须大于或等于最短周期。";
  }

  return messages;
});

function roundUpDays(base, points, dailyPoints) {
  // 将十进制输入统一放大为整数，避免浮点误差多算一天。
  const decimals = [base, points, dailyPoints].map((value) => {
    const [coefficient, exponent = "0"] = value.toString().split("e");
    const [whole, fraction = ""] = coefficient.split(".");
    return {
      digits: BigInt(whole + fraction),
      places: fraction.length - Number(exponent),
    };
  });
  const places = Math.max(0, ...decimals.map((decimal) => decimal.places));
  const scale = 10n ** BigInt(places);
  const [scaledBase, scaledPoints, scaledDailyPoints] = decimals.map(
    (decimal) => decimal.digits * 10n ** BigInt(places - decimal.places),
  );
  const numerator = scaledBase * scaledDailyPoints + scaledPoints * scale;
  const denominator = scaledDailyPoints * scale;
  return (numerator + denominator - 1n) / denominator;
}

async function calculate(event) {
  showErrors.value = true;
  if (Object.keys(errors.value).length) {
    const form = event.currentTarget;
    await nextTick();
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const { B, P, E, I, Tmin, Tmax } = values;
  const roundedDays = roundUpDays(B, P, E);
  const daysBeforeLimits = roundedDays + BigInt(I);
  const days = Math.min(Tmax, Math.max(Tmin, Number(daysBeforeLimits)));

  result.value = { days, roundedDays, daysBeforeLimits };
}
</script>

<template>
  <div class="newcomer-calculator">
    <h2 id="parameters">参数与建议值</h2>

    <form novalidate @submit.prevent="calculate">
      <div class="newcomer-calculator__fields">
        <div v-for="field in fields" :key="field.key">
          <label class="newcomer-calculator__label" :for="`${inputId}-${field.key}`">
            {{ field.label }}
            <span class="newcomer-calculator__symbol">
              <template v-if="field.key.startsWith('T')">T<sub>{{ field.key.slice(1) }}</sub></template>
              <template v-else>{{ field.key }}</template>
            </span>
          </label>
          <div class="newcomer-calculator__control">
            <select v-if="field.key === 'I'" :id="`${inputId}-${field.key}`" v-model="values.I"
              class="newcomer-calculator__input newcomer-calculator__input--select"
              :aria-describedby="`${inputId}-${field.key}-unit`">
              <option :value="0">0</option>
              <option :value="1">1</option>
            </select>
            <input v-else :id="`${inputId}-${field.key}`" v-model="values[field.key]" class="newcomer-calculator__input"
              type="number" required min="0" step="any" inputmode="decimal"
              :placeholder="field.key === 'P' ? '按项目填写' : undefined"
              :aria-invalid="showErrors && errors[field.key] ? 'true' : undefined"
              :aria-describedby="`${inputId}-${field.key}-unit ${inputId}-${field.key}-error`">
            <span :id="`${inputId}-${field.key}-unit`" class="newcomer-calculator__unit">
              {{ field.unit }}
            </span>
          </div>
          <div :id="`${inputId}-${field.key}-error`" class="newcomer-calculator__error">{{ showErrors ?
            errors[field.key] : "" }}
          </div>
        </div>
      </div>
      <button class="newcomer-calculator__button" type="submit">确认计算</button>
    </form>

    <h2 id="formula">计算公式</h2>

    <div class="newcomer-calculator__formula">
      <math display="block">
        <mi>T</mi>
        <mo>=</mo>
        <mi>min</mi>
        <mo>(</mo>
        <msub>
          <mi>T</mi>
          <mi>max</mi>
        </msub>
        <mo>,</mo>
        <mi>max</mi>
        <mo>(</mo>
        <msub>
          <mi>T</mi>
          <mi>min</mi>
        </msub>
        <mo>,</mo>
        <mrow>
          <mo>⌈</mo>
          <mi>B</mi>
          <mo>+</mo>
          <mfrac>
            <mi>P</mi>
            <mi>E</mi>
          </mfrac>
          <mo>⌉</mo>
        </mrow>
        <mo>+</mo>
        <mi>I</mi>
        <mo>)</mo>
        <mo>)</mo>
      </math>
    </div>

    <div role="status" aria-atomic="true">
      <div v-if="result" class="newcomer-calculator__result">
        <div class="newcomer-calculator__result-title">
          预计熟悉周期 <strong>{{ result.days }} 天</strong>
        </div>
        <div>
          ⌈{{ values.B }} + {{ values.P }} ÷ {{ values.E }}⌉ = {{ result.roundedDays }} 天，
          加上 {{ values.I }} 天额外时间后为 {{ result.daysBeforeLimits }} 天。
          <template v-if="result.daysBeforeLimits < values.Tmin">
            按最短周期取 {{ values.Tmin }} 天。
          </template>
          <template v-else-if="result.daysBeforeLimits > values.Tmax">
            按最长周期取 {{ values.Tmax }} 天。
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.newcomer-calculator__fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 16px 20px;
}

.newcomer-calculator__label {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
}

.newcomer-calculator__symbol,
.newcomer-calculator__unit {
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.newcomer-calculator__symbol {
  font-family: var(--vp-font-family-mono);
  font-weight: 400;
}

.newcomer-calculator__control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.newcomer-calculator__input {
  flex: 1;
  min-width: 0;
  min-height: 44px;
  padding: 7px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.newcomer-calculator__input--select {
  appearance: auto;
}

.newcomer-calculator__input[aria-invalid="true"] {
  border-color: var(--vp-c-danger-1);
}

.newcomer-calculator__input:focus-visible,
.newcomer-calculator__button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.newcomer-calculator__unit {
  width: 3em;
  font-size: 13px;
}

.newcomer-calculator__error {
  color: var(--vp-c-danger-1);
  font-size: 13px;
  line-height: 1.5;
}

.newcomer-calculator__error:not(:empty) {
  margin-top: 4px;
}

.newcomer-calculator__button {
  min-height: 44px;
  margin-top: 20px;
  padding: 0 18px;
  border-radius: 8px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-weight: 600;
  cursor: pointer;
}

.newcomer-calculator__button:hover {
  background: var(--vp-button-brand-hover-bg);
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
  font-size: clamp(1.05rem, 4vw, 1.5rem);
}

.newcomer-calculator__result {
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  overflow-wrap: anywhere;
}

.newcomer-calculator__result-title {
  margin-bottom: 4px;
  font-weight: 600;
}

.newcomer-calculator__result-title strong {
  margin-inline-start: 8px;
  color: var(--vp-c-brand-1);
  font-size: 1.25rem;
}
</style>
