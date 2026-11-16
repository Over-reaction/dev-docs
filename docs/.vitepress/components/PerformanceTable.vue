<script setup>
defineProps({
  groups: { type: Array, required: true },
  label: { type: String, required: true },
  variant: { type: String, default: "backend" },
});
</script>

<template>
  <table class="performance-table" :class="`performance-table--${variant}`" tabindex="0" :aria-label="label">
    <thead>
      <tr>
        <th scope="col">考核维度{{ variant === "backend" ? "权重" : "" }}</th>
        <th scope="col">编号</th>
        <th scope="col">指标名称</th>
        <th scope="col">指标权重</th>
        <th scope="col">指标定义与计算口径</th>
        <th scope="col">数据来源（流程记录）</th>
        <th scope="col">扣分 / 计分规则{{ variant === "backend" ? "（指标分扣完截止）" : "" }}</th>
        <th scope="col">加分项（指标内算分，在总分上增加。总分最高增加10分）</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="group in groups" :key="group.code">
        <tr v-for="(indicator, index) in group.indicators" :key="indicator.code">
          <td v-if="index === 0" :rowspan="group.indicators.length > 1 ? group.indicators.length : undefined"
            class="performance-table__group">
            {{ group.code }} {{ group.name }}（{{ group.weight }}%）
          </td>
          <td>{{ indicator.code }}</td>
          <td>{{ indicator.name }}</td>
          <td>{{ indicator.weight }}%</td>
          <td v-html="indicator.definition"></td>
          <td>{{ indicator.source }}</td>
          <td class="performance-table__multiline-cell">{{ indicator.scoring }}</td>
          <td class="performance-table__multiline-cell">{{ indicator.bonus }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
.performance-table th:nth-child(-n + 4),
.performance-table--backend th:nth-child(5),
.performance-table__group {
  white-space: nowrap;
}

.performance-table__group {
  background-color: var(--vp-c-bg-soft);
}

.performance-table__multiline-cell {
  white-space: pre-line;
}

.performance-table th:nth-child(n + 6) {
  min-width: 11rem;
}

.performance-table--backend th:nth-child(6),
.performance-table--backend th:nth-child(8),
.performance-table--frontend th:nth-child(5),
.performance-table--frontend th:nth-child(7) {
  min-width: 16rem;
}
</style>
