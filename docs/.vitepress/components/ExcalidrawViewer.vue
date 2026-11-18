<template>
  <section class="excalidraw-viewer" aria-label="流程图">
    <div ref="canvas" class="excalidraw-viewer__canvas"></div>
    <p v-if="status" class="excalidraw-viewer__status" role="status">{{ status }}</p>
  </section>
</template>

<script setup>
import { useData } from "vitepress";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  scene: { type: Object, required: true },
});

const { isDark } = useData();
const canvas = ref(null);
const status = ref("正在加载流程图…");
let root;
let renderCanvas;

watch(isDark, () => renderCanvas?.());

onMounted(async () => {
  try {
    const [{ createElement }, { createRoot }, { Excalidraw }] = await Promise.all([
      import("react"),
      import("react-dom/client"),
      import("@excalidraw/excalidraw"),
      import("@excalidraw/excalidraw/index.css"),
    ]);

    if (!canvas.value) return;

    let editor;
    let fitted = false;
    const editorProps = {
      initialData: props.scene,
      viewModeEnabled: true,
      langCode: "zh-CN",
      excalidrawAPI(api) {
        editor = api;
      },
      onChange(elements, appState) {
        if (fitted || !editor || appState.isLoading || !elements.length) return;

        fitted = true;
        editor.scrollToContent(elements, { fitToContent: true });
      },
    };

    root = createRoot(canvas.value);
    renderCanvas = () => {
      root.render(createElement(Excalidraw, {
        ...editorProps,
        theme: isDark.value ? "dark" : "light",
      }));
    };
    renderCanvas();
    status.value = "";
  } catch (error) {
    if (!canvas.value) return;

    status.value = "流程图加载失败，请刷新页面重试。";
    console.error("流程图加载失败", error);
  }
});

onBeforeUnmount(() => root?.unmount());
</script>

<style scoped>
.excalidraw-viewer {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.excalidraw-viewer__canvas {
  height: clamp(360px, 78vh, 1000px);
}

.excalidraw-viewer__canvas :deep(.main-menu-trigger),
.excalidraw-viewer__canvas :deep(.help-icon) {
  display: none;
}

.excalidraw-viewer__status {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--vp-c-text-2);
}
</style>
