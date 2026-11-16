---
aside: false
---

<script setup>
import FullscreenPreview from "../.vitepress/components/FullscreenPreview.vue";
import PerformanceTable from "../.vitepress/components/PerformanceTable.vue";
import { frontendPerformanceGroups } from "./data/frontend-performance.js";
</script>

# 前端绩效考核

<FullscreenPreview title="前端绩效考核">
  <PerformanceTable :groups="frontendPerformanceGroups" label="前端绩效考核指标" variant="frontend" />
</FullscreenPreview>
