<script setup>
import { computed } from "vue";

const props = defineProps({
  table: { type: Object, required: true },
  label: { type: String, required: true },
  columnWidths: { type: Array, default: () => [] },
});

const tableStyle = computed(() => {
  if (!props.columnWidths.length) return;

  const width = props.columnWidths.reduce((total, column) => total + column, 0);
  return { minWidth: `${width}px`, tableLayout: "fixed" };
});
</script>

<template>
  <div
    class="my-5 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    role="region" :aria-label="label" tabindex="0">
    <table class="excel-table" :style="tableStyle" :aria-label="label">
      <colgroup v-if="columnWidths.length">
        <col v-for="(width, index) in columnWidths" :key="index" :style="{ width: `${width}px` }" />
      </colgroup>
      <thead>
        <tr v-for="row in table.head" :key="row.number">
          <th v-for="cell in row.cells" :key="cell.address" :rowspan="cell.rowspan" :colspan="cell.colspan"
            :scope="cell.colspan > 1 ? undefined : 'col'">
            {{ cell.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.body" :key="row.number">
          <td v-for="cell in row.cells" :key="cell.address" :rowspan="cell.rowspan" :colspan="cell.colspan">
            {{ cell.text }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@reference "../theme/tailwind.css";

.vp-doc .excel-table {
  @apply m-0 table w-full;
}

.excel-table th,
.excel-table td {
  @apply text-center align-middle whitespace-pre-wrap wrap-anywhere;
}
</style>
