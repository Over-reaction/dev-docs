<script setup>
import { useData, withBase } from "vitepress";
import WorkflowDiagram from "./WorkflowDiagram.vue";

defineProps({
  current: { type: String, required: true },
  label: { type: String, required: true },
  flow: { type: Object, required: true },
});

const pages = [
  { id: "requirements", label: "需求", url: "/workflow/" },
  { id: "optimization", label: "优化", url: "/workflow/optimization" },
  { id: "bug", label: "BUG", url: "/workflow/bug" },
];

const { site } = useData();

function pageHref(url) {
  return withBase(site.value.cleanUrls || url.endsWith("/") ? url : `${url}.html`);
}
</script>

<template>
  <main class="workflow-page vp-doc">
    <nav class="workflow-links" aria-label="工作流程">
      <a
        v-for="page in pages"
        :key="page.id"
        :href="pageHref(page.url)"
        :aria-current="current === page.id ? 'page' : undefined"
      >{{ page.label }}</a>
    </nav>
    <slot name="intro" />
    <ClientOnly>
      <WorkflowDiagram :label="label" v-bind="flow" />
    </ClientOnly>
    <slot />
  </main>
</template>

<style scoped>
.workflow-page {
  max-width: 1520px;
  margin: 0 auto;
  padding: 32px clamp(16px, 4vw, 48px) 64px;
}

.workflow-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.workflow-links a {
  padding: 4px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-weight: 600;
  text-decoration: none;
}

.workflow-links a:hover,
.workflow-links a[aria-current="page"] {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.workflow-links a[aria-current="page"] {
  background: var(--vp-c-brand-soft);
}
</style>
