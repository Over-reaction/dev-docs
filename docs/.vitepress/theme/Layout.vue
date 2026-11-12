<script setup>
import { computed, nextTick, ref } from "vue";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import HomeHeroTitle from "../components/HomeHeroTitle.vue";
import DocsAskPanel from "../components/DocsAskPanel.vue";

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
const askOpen = ref(false);
const askTrigger = ref(null);

async function closeAsk() {
  askOpen.value = false;
  await nextTick();
  askTrigger.value?.focus({ preventScroll: true });
}

const homeHero = computed(() => {
  const { layout, pageClass, hero } = frontmatter.value;
  if (layout === "home" && pageClass === "standards-home" && hero?.name) {
    return hero;
  }
});
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <button
        ref="askTrigger"
        class="docs-ask-trigger"
        type="button"
        aria-haspopup="dialog"
        :aria-expanded="askOpen"
        :aria-controls="askOpen ? 'docs-ask-panel' : undefined"
        @click="askOpen ? closeAsk() : askOpen = true"
      >问研发规范</button>
    </template>
    <template v-if="homeHero" #home-hero-info>
      <HomeHeroTitle :title="homeHero.name" :company="homeHero.company" :tagline="homeHero.tagline" />
    </template>
  </Layout>
  <DocsAskPanel :open="askOpen" @close="closeAsk" />
</template>

<style scoped>
.docs-ask-trigger {
  flex: none;
  margin-inline: 0.75rem 0.25rem;
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  color: var(--vp-c-text-1);
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
}

.docs-ask-trigger:hover,
.docs-ask-trigger[aria-expanded="true"] {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>
