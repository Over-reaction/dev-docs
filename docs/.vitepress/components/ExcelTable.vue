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
  <div class="excel-table-scroll" role="region" :aria-label="label" tabindex="0">
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
.excel-table-scroll {
  margin: 1.25rem 0;
  overflow-x: auto;
}

.excel-table-scroll:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.vp-doc .excel-table {
  display: table;
  width: 100%;
  margin: 0;
}

.excel-table th,
.excel-table td {
  text-align: center;
  vertical-align: middle;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
