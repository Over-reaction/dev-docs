---
aside: false
---

<script setup>
import ExcelTable from "../../.vitepress/components/ExcelTable.vue";
import FullscreenPreview from "../../.vitepress/components/FullscreenPreview.vue";
import { data } from "../data/frontend-performance.data.js";
</script>

# 前端绩效考核

<FullscreenPreview title="前端绩效考核">
  <ExcelTable
    :table="data"
    label="前端绩效考核指标"
    :column-widths="[88, 128, 60, 120, 80, 220, 144, 260, 92, 220]"
  />
</FullscreenPreview>
