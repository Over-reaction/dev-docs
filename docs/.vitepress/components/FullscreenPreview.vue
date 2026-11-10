<script setup>
import { ref, useId } from "vue";

defineProps({
  title: { type: String, default: "全屏预览" },
});

const dialog = ref(null);
const isOpen = ref(false);
const contentId = useId();

function openPreview() {
  dialog.value.showModal();
  isOpen.value = true;
}
</script>

<template>
  <div class="fullscreen-preview-toolbar">
    <button class="fullscreen-preview-button" type="button" aria-haspopup="dialog" @click="openPreview">
      全屏预览
    </button>
  </div>

  <dialog ref="dialog" class="fullscreen-preview-dialog" :aria-label="title" @close="isOpen = false">
    <header class="fullscreen-preview-header">
      <strong>{{ title }}</strong>
      <button class="fullscreen-preview-button" type="button" autofocus @click="dialog.close()">
        退出全屏
      </button>
    </header>
    <div :id="contentId" class="fullscreen-preview-content"></div>
  </dialog>

  <Teleport :to="`#${contentId}`" :disabled="!isOpen" defer>
    <slot />
  </Teleport>
</template>

<style scoped>
.fullscreen-preview-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.fullscreen-preview-button {
  flex-shrink: 0;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.375rem;
  background: var(--vp-c-bg-soft);
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

.fullscreen-preview-dialog {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.fullscreen-preview-dialog[open] {
  display: flex;
  flex-direction: column;
}

.fullscreen-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.fullscreen-preview-content {
  flex: 1;
  min-height: 0;
  padding-inline: 1rem;
  overflow: auto;
  overscroll-behavior: contain;
}

:global(html:has(.fullscreen-preview-dialog[open])) {
  overflow: hidden;
}
</style>
