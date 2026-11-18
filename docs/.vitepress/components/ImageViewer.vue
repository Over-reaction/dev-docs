<template>
  <section class="image-viewer" aria-label="图片预览">
    <canvas ref="canvas" class="image-viewer__viewport" :class="{
      'image-viewer__viewport--ready': scale,
      'image-viewer__viewport--dragging': drag,
      'image-viewer__viewport--laser': scale && laserEnabled,
    }" role="img" :aria-label="alt" @pointerdown="startPointer" @pointermove="movePointer" @pointerup="endLaserStroke"
      @pointerleave="endLaserStroke" @pointercancel="endLaserStroke" @lostpointercapture="stopPan"
      @wheel="zoomWithWheel">
      {{ alt }}
    </canvas>
    <template v-if="scale">
      <div class="image-viewer__controls image-viewer__controls--zoom" role="group" aria-label="图片缩放">
        <button type="button" aria-label="缩小图片" :disabled="zoom <= minZoom" @click="setZoom(zoom / zoomStep)">−</button>
        <output aria-label="缩放比例">{{ Math.round(scale * 100) }}%</output>
        <button type="button" aria-label="放大图片" :disabled="zoom >= maxZoom" @click="setZoom(zoom * zoomStep)">+</button>
        <button class="image-viewer__fit" type="button" @click="fitImage">适应窗口</button>
      </div>
      <div class="image-viewer__controls image-viewer__controls--laser">
        <button type="button" :aria-pressed="laserEnabled" @click="toggleLaser">激光笔</button>
      </div>
    </template>
    <p v-else class="image-viewer__status" role="status">{{ status }}</p>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
});

const minZoom = 0.5;
const maxZoom = 6;
const zoomStep = 1.2;
const wheelStepPixels = 100;
const fitPadding = 24;
const laserDuration = 2000;
const canvas = ref(null);
const image = shallowRef(null);
const viewportSize = shallowRef({ width: 0, height: 0 });
const status = ref("正在加载图片…");
const zoom = ref(1);
const offset = shallowRef({ x: 0, y: 0 });
const drag = shallowRef(null);
const laserEnabled = ref(false);
let context;
let resizeObserver;
let frameId = null;
let laserPoint = null;
let laserTrail = [];

const scale = computed(() => {
  const { width, height } = viewportSize.value;
  if (!image.value || !width || !height) return 0;

  const fitWidth = Math.max(1, width - fitPadding * 2);
  const fitHeight = Math.max(1, height - fitPadding * 2);
  return zoom.value * Math.min(1, fitWidth / image.value.naturalWidth, fitHeight / image.value.naturalHeight);
});

function requestPaint() {
  if (frameId === null) frameId = window.requestAnimationFrame(paint);
}

function paint(now) {
  frameId = null;
  const { width, height } = viewportSize.value;
  if (!width || !height) return;

  const surface = canvas.value;
  const pixelRatio = window.devicePixelRatio || 1;
  const pixelWidth = Math.ceil(width * pixelRatio);
  const pixelHeight = Math.ceil(height * pixelRatio);
  if (surface.width !== pixelWidth) surface.width = pixelWidth;
  if (surface.height !== pixelHeight) surface.height = pixelHeight;

  context.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
  context.clearRect(0, 0, width, height);
  if (!image.value) return;

  const imageWidth = image.value.naturalWidth * scale.value;
  const imageHeight = image.value.naturalHeight * scale.value;
  const x = (width - imageWidth) / 2 + offset.value.x;
  const y = (height - imageHeight) / 2 + offset.value.y;
  context.drawImage(image.value, x, y, imageWidth, imageHeight);
  paintLaser(now);
}

function paintLaser(now) {
  if (!laserTrail.length) return;

  laserTrail = laserTrail.filter((segment) => now - segment.time < laserDuration);
  context.save();
  context.strokeStyle = "#ff3b48";
  context.lineCap = "round";

  for (const { from, to, time } of laserTrail) {
    const opacity = 1 - Math.max(0, now - time) / laserDuration;
    context.globalAlpha = opacity;
    context.lineWidth = 1 + opacity * 3;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
  }

  context.restore();
  if (laserTrail.length) requestPaint();
}

function fitImage() {
  zoom.value = 1;
  offset.value = { x: 0, y: 0 };
}

function setZoom(nextZoom, anchorX = 0, anchorY = 0) {
  const clampedZoom = Math.min(maxZoom, Math.max(minZoom, nextZoom));
  if (clampedZoom === zoom.value) return;

  const ratio = clampedZoom / zoom.value;
  offset.value = {
    x: anchorX + (offset.value.x - anchorX) * ratio,
    y: anchorY + (offset.value.y - anchorY) * ratio,
  };
  zoom.value = clampedZoom;
}

function zoomWithWheel(event) {
  const { deltaMode, deltaY } = event;
  if (!scale.value || !deltaY) return;

  event.preventDefault();

  const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
  let pixels = deltaY;
  if (deltaMode === WheelEvent.DOM_DELTA_LINE) pixels *= 16;
  if (deltaMode === WheelEvent.DOM_DELTA_PAGE) pixels *= height;

  const steps = Math.min(1, Math.max(-1, pixels / wheelStepPixels));
  const anchorX = event.clientX - left - width / 2;
  const anchorY = event.clientY - top - height / 2;
  setZoom(zoom.value * zoomStep ** -steps, anchorX, anchorY);
}

function toggleLaser() {
  laserEnabled.value = !laserEnabled.value;
  if (laserEnabled.value) return;

  laserPoint = null;
  laserTrail = [];
  requestPaint();
}

function trackLaser(event, draw) {
  const { left, top } = event.currentTarget.getBoundingClientRect();
  const point = { x: event.clientX - left, y: event.clientY - top };
  if (draw && laserPoint && (point.x !== laserPoint.x || point.y !== laserPoint.y)) {
    laserTrail.push({ from: laserPoint, to: point, time: performance.now() });
    requestPaint();
  }
  laserPoint = point;
}

function endLaserStroke(event) {
  if (event.isPrimary) laserPoint = null;
}

function startPointer(event) {
  if (!scale.value || !event.isPrimary || event.button !== 0) return;

  if (laserEnabled.value) {
    trackLaser(event, false);
    return;
  }

  event.currentTarget.setPointerCapture(event.pointerId);
  drag.value = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
  };
}

function movePointer(event) {
  if (!event.isPrimary) return;

  if (laserEnabled.value && scale.value) {
    if (event.buttons & 1) trackLaser(event, true);
    return;
  }

  const pointer = drag.value;
  if (pointer?.pointerId !== event.pointerId) return;

  offset.value = {
    x: offset.value.x + (event.clientX - pointer.x),
    y: offset.value.y + (event.clientY - pointer.y),
  };
  pointer.x = event.clientX;
  pointer.y = event.clientY;
}

function stopPan(event) {
  if (drag.value?.pointerId === event.pointerId) drag.value = null;
}

watch([viewportSize, image, scale, offset], requestPaint, { flush: "post" });

onMounted(() => {
  context = canvas.value.getContext("2d");
  if (!context) {
    status.value = "当前浏览器无法绘制图片";
    return;
  }

  resizeObserver = new ResizeObserver(([entry]) => {
    viewportSize.value = entry.contentRect;
  });
  resizeObserver.observe(canvas.value);

  watch(() => props.src, (src, _previousSrc, onCleanup) => {
    image.value = null;
    laserPoint = null;
    laserTrail = [];
    status.value = "正在加载图片…";
    fitImage();

    const source = new Image();
    source.onload = () => { image.value = source; };
    source.onerror = () => { status.value = "图片加载失败"; };
    onCleanup(() => {
      source.onload = null;
      source.onerror = null;
    });
    source.src = src;
  }, { immediate: true });
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (frameId !== null) window.cancelAnimationFrame(frameId);
});
</script>

<style scoped>
.image-viewer {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

.image-viewer__viewport {
  display: block;
  width: 100%;
  height: clamp(360px, 78vh, 1000px);
}

.image-viewer__viewport--ready {
  cursor: grab;
  touch-action: none;
}

.image-viewer__viewport--dragging {
  cursor: grabbing;
}

.image-viewer__viewport--laser {
  cursor: url("/excalidraw-cursors/laser-light.svg") 8 8, crosshair;
}

.dark .image-viewer__viewport--laser {
  cursor: url("/excalidraw-cursors/laser-dark.svg") 8 8, crosshair;
}

.image-viewer__controls {
  position: absolute;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-elv);
  font-size: 14px;
}

.image-viewer__controls--zoom {
  inset-block-end: 16px;
  inset-inline-start: 16px;
}

.image-viewer__controls--laser {
  inset-block-start: 16px;
  inset-inline-end: 16px;
}

.image-viewer__controls button {
  min-width: 40px;
  min-height: 40px;
  padding-inline: 10px;
}

.image-viewer__controls button:hover:enabled {
  background-color: var(--vp-c-bg-soft);
}

.image-viewer__controls--laser button[aria-pressed="true"]:enabled {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.image-viewer__controls button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.image-viewer__controls button:disabled {
  opacity: 0.45;
}

.image-viewer__controls output {
  min-width: 48px;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.image-viewer__fit {
  border-inline-start: 1px solid var(--vp-c-divider);
}

.image-viewer__status {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--vp-c-text-2);
}
</style>
