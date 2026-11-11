<template>
  <main class="workflow-page vp-doc">
    <nav class="workflow-page__links" aria-label="工作流程">
      <a v-for="page in pages" :key="page.id" class="workflow-page__link" :href="pageHref(page.url)"
        :aria-current="current === page.id ? 'page' : undefined">{{ page.label }}</a>
    </nav>
    <slot name="intro" />
    <ClientOnly>
      <WorkflowDiagram :label="label" v-bind="flow" />
    </ClientOnly>
    <slot />
  </main>
</template>

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

<style scoped>
.workflow-page {
  max-width: 1520px;
  margin-inline: auto;
  padding-block: 32px 64px;
  padding-inline: clamp(16px, 4vw, 48px);
}

.workflow-page__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.workflow-page__link {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 4px 16px;
  color: var(--vp-c-text-2);
  font-weight: 600;
  text-decoration: none;
}

.workflow-page__link:hover,
.workflow-page__link[aria-current="page"] {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.workflow-page__link[aria-current="page"] {
  background-color: var(--vp-c-brand-soft);
}
</style>
