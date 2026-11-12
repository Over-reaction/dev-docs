<script setup>
import { useData } from "vitepress";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  title: { type: String, required: true },
  company: String,
  tagline: String,
});

const sweepDuration = 17500;
const trailDuration = 2400;
const trailOpacities = [0.95, 0.55, 0.32, 0.16];
const speckSizes = [2, 2, 3, 3, 5, 8];
const { isDark } = useData();
const heading = ref(null);
const canvas = ref(null);
const isPainted = ref(false);

let context;
let motionPreference;
let resizeObserver;
let intersectionObserver;
let isInView = true;
let frameId = 0;
let previousTime = 0;
let sweepTime = 0;
let effectTime = 0;
let pointer = null;
let drawing;

function createSpeck(start) {
  return {
    start,
    duration: 650 + Math.random() * 700,
    position: Math.random(),
    distance: 5 + Math.random() * 10,
    size: speckSizes[Math.floor(Math.random() * speckSizes.length)],
    hollow: Math.random() < 0.5,
  };
}

function measureTitle() {
  if (!context) return;

  const headingRect = heading.value.getBoundingClientRect();
  const canvasRect = canvas.value.getBoundingClientRect();
  const { width, height } = canvasRect;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  isPainted.value = false;
  canvas.value.width = Math.round(width * scale);
  canvas.value.height = Math.round(height * scale);

  const style = window.getComputedStyle(heading.value);
  const font = (size) => `${style.fontWeight} ${size} ${style.fontFamily}`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.font = font(style.fontSize);
  context.textAlign = "left";
  context.textBaseline = "alphabetic";

  const leftPadding = parseFloat(style.paddingLeft);
  const rightPadding = parseFloat(style.paddingRight);
  const topPadding = parseFloat(style.paddingTop);
  const bottomPadding = parseFloat(style.paddingBottom);
  const availableWidth = headingRect.width - leftPadding - rightPadding;
  let metrics = context.measureText(props.title);
  if (availableWidth > 0 && metrics.width > availableWidth) {
    context.font = font(`${(parseFloat(style.fontSize) * availableWidth) / metrics.width}px`);
    metrics = context.measureText(props.title);
  }
  const left = headingRect.left - canvasRect.left + leftPadding + metrics.actualBoundingBoxLeft;
  const textHeight = headingRect.height - topPadding - bottomPadding;
  const baseline = headingRect.top - canvasRect.top + topPadding +
    (textHeight + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;

  let prefix = "";
  const glyphs = [];
  for (const character of props.title) {
    prefix += character;
    if (!character.trim()) continue;

    const glyphMetrics = context.measureText(character);
    const x = left + context.measureText(prefix).width - glyphMetrics.width;
    const bounds = {
      left: x - glyphMetrics.actualBoundingBoxLeft,
      right: x + glyphMetrics.actualBoundingBoxRight,
      top: baseline - glyphMetrics.actualBoundingBoxAscent,
      bottom: baseline + glyphMetrics.actualBoundingBoxDescent,
    };
    glyphs.push({
      character,
      x,
      bounds,
      center: (bounds.left + bounds.right) / 2,
      outline: 0,
    });
  }

  drawing = width > 0 && height > 0 && glyphs.length
    ? {
      width,
      height,
      baseline,
      glyphs,
      color: style.color,
      accent: style.getPropertyValue("--standards-home-accent").trim(),
      specks: Array.from({ length: 8 }, (_, index) => createSpeck(effectTime - index * 105)),
      selection: null,
    }
    : null;
  syncAnimation();
}

function pointOnBox(box, distance) {
  const width = box.right - box.left;
  const height = box.bottom - box.top;

  if (distance < width) {
    return { x: box.left + distance, y: box.top, normalX: 0, normalY: -1 };
  }
  distance -= width;
  if (distance < height) {
    return { x: box.right, y: box.top + distance, normalX: 1, normalY: 0 };
  }
  distance -= height;
  if (distance < width) {
    return { x: box.right - distance, y: box.bottom, normalX: 0, normalY: 1 };
  }
  return { x: box.left, y: box.bottom - (distance - width), normalX: -1, normalY: 0 };
}

function drawSelectionEffects(box, opacity, labelBounds) {
  const perimeter = 2 * (box.right - box.left + box.bottom - box.top);
  const head = (effectTime % trailDuration) / trailDuration * perimeter;

  for (const offset of [0, perimeter / 2]) {
    for (const [index, fade] of trailOpacities.entries()) {
      const distance = (head + offset - index * 6 + perimeter) % perimeter;
      const { x, y } = pointOnBox(box, distance);
      const size = index === 0 ? 3 : 2;
      context.globalAlpha = opacity * fade;
      context.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
    }
  }

  const { specks } = drawing;
  for (let index = 0; index < specks.length; index++) {
    let speck = specks[index];
    if (effectTime - speck.start >= speck.duration) {
      speck = createSpeck(effectTime);
      specks[index] = speck;
    }

    const phase = (effectTime - speck.start) / speck.duration;
    if (phase >= 0.7) continue;

    const point = pointOnBox(box, speck.position * perimeter);
    const { distance, size } = speck;
    const x = Math.round(point.x + point.normalX * distance - size / 2);
    const y = Math.round(point.y + point.normalY * distance - size / 2);
    if (
      x < labelBounds.right && x + size > labelBounds.left &&
      y < labelBounds.bottom && y + size > labelBounds.top
    ) continue;

    context.globalAlpha = opacity * 0.68 * Math.sin(Math.PI * phase / 0.7);
    if (speck.hollow) {
      context.strokeRect(x + 0.5, y + 0.5, size, size);
    } else {
      context.fillRect(x, y, size, size);
    }
  }
}

function drawSelection(target, ease) {
  if (target) {
    const padding = 5;
    const { bounds } = target;
    const nextBox = {
      left: bounds.left - padding,
      right: bounds.right + padding,
      top: bounds.top - padding,
      bottom: bounds.bottom + padding,
    };
    const selection = drawing.selection ?? { box: { ...nextBox }, opacity: 0, glyph: target };
    for (const edge of Object.keys(nextBox)) {
      selection.box[edge] += (nextBox[edge] - selection.box[edge]) * ease;
    }
    selection.glyph = target;
    drawing.selection = selection;
  }

  const selection = drawing.selection;
  if (!selection) return;
  selection.opacity += ((target ? 1 : 0) - selection.opacity) * ease;
  if (!target && selection.opacity < 0.01) {
    drawing.selection = null;
    return;
  }

  const { box, glyph, opacity } = selection;
  const { accent } = drawing;
  context.save();
  context.fillStyle = accent;
  context.strokeStyle = accent;
  context.globalAlpha = 0.58 * opacity;
  context.lineWidth = 1;
  context.strokeRect(box.left, box.top, box.right - box.left, box.bottom - box.top);

  context.globalAlpha = opacity;
  for (const x of [box.left, box.right]) {
    for (const y of [box.top, box.bottom]) {
      context.fillRect(x - 2, y - 2, 4, 4);
    }
  }

  const { bounds } = glyph;
  const width = Math.round(bounds.right - bounds.left);
  const height = Math.round(bounds.bottom - bounds.top);
  const label = `${glyph.character}  ${width} × ${height}`;
  context.font = "500 10px ui-monospace, monospace";
  context.textBaseline = "middle";
  const labelWidth = context.measureText(label).width;
  const labelX = Math.max(0, Math.min(box.left, drawing.width - labelWidth));
  const labelY = Math.max(6, box.top - 13);
  drawSelectionEffects(box, opacity, {
    left: labelX - 2,
    right: labelX + labelWidth + 2,
    top: labelY - 6,
    bottom: labelY + 6,
  });
  context.globalAlpha = opacity * 0.8;
  context.fillText(label, labelX, labelY);
  context.restore();
}

function getPointerTarget(glyphs, { x, y }) {
  const hitSlop = 12;
  let target = null;
  let closestDistance = hitSlop;

  for (const glyph of glyphs) {
    const { left, right, top, bottom } = glyph.bounds;
    if (y < top - hitSlop || y > bottom + hitSlop) continue;

    const distance = Math.max(left - x, x - right, 0);
    if (distance < closestDistance) {
      target = glyph;
      closestDistance = distance;
    }
  }
  return target;
}

function renderFrame(now) {
  const delta = previousTime ? Math.min(now - previousTime, 50) : 16;
  previousTime = now;
  effectTime += delta;
  if (!pointer) sweepTime = (sweepTime + delta) % sweepDuration;

  const { width, height, baseline, glyphs, color } = drawing;
  const first = glyphs[0].center;
  const last = glyphs[glyphs.length - 1].center;
  const progress = (1 - Math.cos((sweepTime / sweepDuration) * Math.PI * 2)) / 2;
  const x = first + (last - first) * progress;
  const target = pointer
    ? getPointerTarget(glyphs, pointer)
    : glyphs.reduce((closest, glyph) =>
      Math.abs(glyph.center - x) < Math.abs(closest.center - x) ? glyph : closest,
    );
  const ease = 1 - Math.exp(-delta / 80);

  context.clearRect(0, 0, width, height);
  context.fillStyle = color;
  context.strokeStyle = color;
  context.lineWidth = 1;
  context.lineJoin = "round";
  context.setLineDash([2, 2]);
  for (const glyph of glyphs) {
    glyph.outline += ((glyph === target ? 1 : 0) - glyph.outline) * ease;
    if (glyph.outline < 0.995) {
      context.globalAlpha = 1 - glyph.outline;
      context.fillText(glyph.character, glyph.x, baseline);
    }
    if (glyph.outline > 0.005) {
      context.globalAlpha = 0.72 * glyph.outline;
      context.strokeText(glyph.character, glyph.x, baseline);
    }
  }

  context.setLineDash([]);
  context.globalAlpha = 1;
  drawSelection(target, ease);
  isPainted.value = true;
  frameId = window.requestAnimationFrame(renderFrame);
}

function syncAnimation() {
  if (drawing && isInView && !motionPreference.matches) {
    if (!frameId) frameId = window.requestAnimationFrame(renderFrame);
    return;
  }

  window.cancelAnimationFrame(frameId);
  frameId = 0;
  previousTime = 0;
  if (motionPreference.matches) isPainted.value = false;
}

function trackPointer(event) {
  if (event.pointerType === "touch") return;
  const { left, top } = canvas.value.getBoundingClientRect();
  pointer = { x: event.clientX - left, y: event.clientY - top };
}

watch([() => props.title, isDark], measureTitle, { flush: "post" });

onMounted(() => {
  context = canvas.value.getContext("2d");
  if (!context) return;

  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionPreference.addEventListener("change", syncAnimation);

  resizeObserver = new ResizeObserver(measureTitle);
  resizeObserver.observe(heading.value);
  intersectionObserver = new IntersectionObserver(([entry]) => {
    isInView = entry.isIntersecting;
    if (!isInView) pointer = null;
    syncAnimation();
  });
  intersectionObserver.observe(heading.value);

  measureTitle();
  document.fonts?.ready.then(() => {
    if (heading.value) measureTitle();
  });
});

onBeforeUnmount(() => {
  window.cancelAnimationFrame(frameId);
  motionPreference?.removeEventListener("change", syncAnimation);
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
});
</script>

<template>
  <div class="home-hero-title">
    <p v-if="company" class="home-hero-title__company">{{ company }}</p>
    <h1 ref="heading" class="home-hero-title__heading" :class="{ 'home-hero-title__heading--painted': isPainted }"
      @pointerenter="trackPointer" @pointermove="trackPointer" @pointerleave="pointer = null">
      <span class="home-hero-title__text">{{ title }}</span>
      <canvas ref="canvas" class="home-hero-title__canvas" aria-hidden="true" />
    </h1>
    <p v-if="tagline" class="home-hero-title__tagline">{{ tagline }}</p>
  </div>
</template>

<style scoped>
.home-hero-title {
  container-type: inline-size;
  color: var(--standards-home-ink);
  text-align: start;
}

.home-hero-title__company {
  width: fit-content;
  margin-block-end: 0.375rem;
  color: var(--vp-c-text-1);
  font-size: 1.375rem;
  font-size: clamp(1.375rem, 7.2cqw, 2.5rem);
  font-weight: 800;
  line-height: 1.25;
}

@supports (background-clip: text) {
  @media (forced-colors: none) {
    .home-hero-title__company {
      background-image: var(--standards-home-company-gradient);
      background-clip: text;
      color: transparent;
    }
  }
}

.home-hero-title__heading {
  position: relative;
  margin-inline: -0.625rem;
  padding: max(1.5rem, 0.3em) 0.625rem 0.16em;
  font-size: clamp(2.75rem, 8vw, 6.5rem);
  font-size: clamp(2.75rem, 20cqw, 6.5rem);
  font-weight: 800;
  line-height: 1.08;
  overflow-wrap: anywhere;
}

.home-hero-title__tagline {
  margin-block-start: 0.75rem;
  color: var(--vp-c-text-2);
  font-size: clamp(0.9375rem, 3.4cqw, 1.125rem);
  line-height: 1.65;
}

.home-hero-title__canvas {
  position: absolute;
  inset: -0.5rem -0.75rem;
  width: calc(100% + 1.5rem);
  height: calc(100% + 1rem);
  pointer-events: none;
  visibility: hidden;
}

.home-hero-title__heading--painted .home-hero-title__canvas {
  visibility: visible;
}

.home-hero-title__heading--painted .home-hero-title__text {
  color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  .home-hero-title__heading--painted .home-hero-title__canvas {
    visibility: hidden;
  }

  .home-hero-title__heading--painted .home-hero-title__text {
    color: inherit;
  }
}
</style>
