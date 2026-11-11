<template>
  <div v-if="!inlineControls" class="mt-4 flex justify-end">
    <button class="fullscreen-preview-button" type="button" aria-haspopup="dialog" @click="openPreview">
      全屏预览
    </button>
  </div>

  <dialog ref="dialog" class="fullscreen-preview-dialog" :aria-label="title" @close="handleClose">
    <header
      class="flex items-center justify-between gap-4 border-b border-divider px-4 py-3"
    >
      <strong>{{ title }}</strong>
      <button class="fullscreen-preview-button" type="button" autofocus @click="dialog.close()">
        退出全屏
      </button>
    </header>
    <div
      :id="contentId"
      class="min-h-0 flex-1 overscroll-contain"
      :class="inlineControls ? 'overflow-hidden' : 'overflow-auto px-4'"
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
@reference "../theme/tailwind.css";

.fullscreen-preview-button {
  @apply shrink-0 rounded-md border border-divider bg-surface-soft px-3 py-1.5 text-[0.875rem] font-semibold text-content;
}

.fullscreen-preview-button:hover {
  @apply border-brand;
}

.fullscreen-preview-button:focus-visible {
  @apply outline-2 outline-offset-2 outline-brand;
}

.fullscreen-preview-dialog {
  @apply fixed inset-0 m-0 max-h-none w-full max-w-none border-none bg-surface p-0 text-content;
  height: 100%;
  height: 100dvh;
}

.fullscreen-preview-dialog[open] {
  @apply flex flex-col;
}

:global(html:has(.fullscreen-preview-dialog[open])) {
  @apply overflow-hidden;
}
</style>
