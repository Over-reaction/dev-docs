---
aside: false
---

<script setup>
import FullscreenPreview from "../.vitepress/components/FullscreenPreview.vue";
import PerformanceTable from "../.vitepress/components/PerformanceTable.vue";
import { backendPerformanceGroups } from "./data/backend-performance.js";
</script>

# 后端绩效考核

<FullscreenPreview title="后端绩效考核">
  <PerformanceTable :groups="backendPerformanceGroups" label="后端绩效考核指标" />
</FullscreenPreview>
