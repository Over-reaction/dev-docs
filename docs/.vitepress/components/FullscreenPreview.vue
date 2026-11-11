<template>
  <div v-if="!inlineControls" class="fullscreen-preview-trigger">
    <button class="fullscreen-preview-button" type="button" aria-haspopup="dialog" @click="openPreview">
      全屏预览
    </button>
  </div>

  <dialog ref="dialog" class="fullscreen-preview" :aria-label="title" @close="handleClose">
    <header class="fullscreen-preview__header">
      <strong>{{ title }}</strong>
      <button class="fullscreen-preview-button" type="button" autofocus @click="dialog.close()">
        退出全屏
      </button>
    </header>
    <div
      :id="contentId"
      class="fullscreen-preview__content"
      :class="{ 'fullscreen-preview__content--scrollable': !inlineControls }"
    ></div>
  </dialog>

  <Teleport :to="`#${contentId}`" :disabled="!isOpen" defer>
    <slot :is-open="isOpen" :open-preview="openPreview" />
  </Teleport>
</template>

<script setup>
import { nextTick, ref, useId } from "vue";

defineProps({
  title: { type: String, default: "全屏预览" },
  inlineControls: { type: Boolean, default: false },
});

const dialog = ref(null);
const isOpen = ref(false);
const contentId = useId();
let opener;

function openPreview(event) {
  opener = event.currentTarget;
  dialog.value.showModal();
  isOpen.value = true;
}

async function handleClose() {
  isOpen.value = false;
  await nextTick();
  opener?.focus();
}
</script>

<style scoped>
.fullscreen-preview-trigger {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.fullscreen-preview-button {
  flex-shrink: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.375rem;
  background-color: var(--vp-c-bg-soft);
  padding: 0.375rem 0.75rem;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  font-weight: 600;
}

.fullscreen-preview-button:hover {
  border-color: var(--vp-c-brand-1);
}

.fullscreen-preview-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.fullscreen-preview {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  height: 100dvh;
  max-height: none;
  margin: 0;
  border: 0;
  background-color: var(--vp-c-bg);
  padding: 0;
  color: var(--vp-c-text-1);
}

.fullscreen-preview[open] {
  display: flex;
  flex-direction: column;
}

.fullscreen-preview__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0.75rem 1rem;
}

.fullscreen-preview__content {
  min-height: 0;
  flex: 1;
  overflow: hidden;
  overscroll-behavior: contain;
}

.fullscreen-preview__content--scrollable {
  overflow: auto;
  padding-inline: 1rem;
}

:global(html:has(.fullscreen-preview[open])) {
  overflow: hidden;
}
</style>
