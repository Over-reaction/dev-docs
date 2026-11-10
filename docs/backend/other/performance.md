---
aside: false
---

<script setup>
import ExcelTable from "../../.vitepress/components/ExcelTable.vue";
import FullscreenPreview from "../../.vitepress/components/FullscreenPreview.vue";
import { data } from "../data/backend-performance.data.js";
</script>

# 后端绩效考核

<FullscreenPreview title="后端绩效考核">
  <ExcelTable
    :table="data"
    label="后端绩效考核指标"
    :column-widths="[88, 128, 60, 120, 80, 220, 144, 260, 220]"
  />
</FullscreenPreview>
