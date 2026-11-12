<script setup>
import { computed } from "vue";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import HomeHeroTitle from "../components/HomeHeroTitle.vue";

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
const homeHero = computed(() => {
  const { layout, pageClass, hero } = frontmatter.value;
  if (layout === "home" && pageClass === "standards-home" && hero?.name) {
    return hero;
  }
});
</script>

<template>
  <Layout>
    <template v-if="homeHero" #home-hero-info>
      <HomeHeroTitle :title="homeHero.name" :company="homeHero.company" :tagline="homeHero.tagline" />
    </template>
  </Layout>
</template>
