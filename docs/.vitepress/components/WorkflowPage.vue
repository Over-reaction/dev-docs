<template>
  <main class="workflow-page vp-doc mx-auto max-w-[1520px] px-[clamp(16px,4vw,48px)] pt-[32px] pb-[64px]">
    <nav class="workflow-links mb-[24px] flex flex-wrap gap-[8px]" aria-label="工作流程">
      <a v-for="page in pages" :key="page.id" :href="pageHref(page.url)"
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
@reference "../theme/tailwind.css";

.workflow-links a {
  @apply rounded-[6px] border border-divider px-[16px] py-[4px] font-semibold text-content-muted no-underline;
}

.workflow-links a:hover,
.workflow-links a[aria-current="page"] {
  @apply border-brand text-brand;
}

.workflow-links a[aria-current="page"] {
  @apply bg-brand-soft;
}
</style>
