<template>
  <ul class="directory-tree" role="list">
    <li v-for="node in nodes" :key="node.name" class="directory-tree__item">
      <details v-if="node.children?.length" :open="node.defaultOpen">
        <summary class="directory-tree__row">
          <span class="directory-tree__icon directory-tree__icon--folder" aria-hidden="true"></span>
          <span class="directory-tree__name">{{ node.name }}</span>
          <span v-if="node.description" class="directory-tree__description">{{ node.description }}</span>
        </summary>
        <DirectoryTree :nodes="node.children" />
      </details>

      <div v-else class="directory-tree__row">
        <span class="directory-tree__icon"
          :class="node.children ? 'directory-tree__icon--folder' : 'directory-tree__icon--file'"
          aria-hidden="true"></span>
        <span class="directory-tree__name">{{ node.name }}</span>
        <span v-if="node.description" class="directory-tree__description">{{ node.description }}</span>
      </div>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  nodes: { type: Array, required: true },
});
</script>

<style scoped>
.directory-tree {
  --tree-surface: #fbfaf7;
  --tree-accent: #a16407;
  --tree-branch: #e3d8c0;
  --tree-hover: #f3ead6;
  margin: 16px 0;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--tree-surface);
  list-style: none;
}

.dark .directory-tree {
  --tree-surface: #10100f;
  --tree-accent: #f2b90b;
  --tree-branch: #3b3220;
  --tree-hover: #262013;
}

.directory-tree .directory-tree {
  margin: 2px 0 4px;
  margin-inline-start: 20px;
  padding: 0;
  padding-inline-start: 10px;
  border: 0;
  border-inline-start: 1px solid var(--tree-branch);
  border-radius: 0;
  background: transparent;
}

.directory-tree__item {
  margin: 0;
}

.directory-tree__row {
  --tree-row-surface: var(--tree-surface);
  display: grid;
  grid-template-columns: 20px minmax(0, 2fr) minmax(0, 3fr);
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--tree-row-surface);
  line-height: 1.5;
}

summary.directory-tree__row {
  margin: 0;
  cursor: pointer;
  list-style: none;
}

summary.directory-tree__row::-webkit-details-marker {
  display: none;
}

summary.directory-tree__row:hover,
summary.directory-tree__row:focus-visible {
  --tree-row-surface: var(--tree-hover);
}

summary.directory-tree__row:focus-visible {
  outline: 2px solid var(--tree-accent);
  outline-offset: -2px;
}

.directory-tree__name {
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 550;
  overflow-wrap: anywhere;
}

.directory-tree__name:last-child {
  grid-column: 2 / -1;
}

.directory-tree__description {
  color: var(--vp-c-text-2);
  font-size: 13px;
  text-align: end;
  overflow-wrap: anywhere;
}

.directory-tree__icon {
  position: relative;
  justify-self: center;
  border: 1.5px solid currentColor;
  border-radius: 3px;
}

.directory-tree__icon--folder {
  width: 18px;
  height: 12px;
  margin-top: 3px;
  color: var(--tree-accent);
}

.directory-tree__icon--folder::before {
  position: absolute;
  top: -5px;
  left: -1.5px;
  width: 8px;
  height: 5px;
  border: 1.5px solid currentColor;
  border-bottom: 0;
  border-radius: 3px 3px 0 0;
  background: var(--tree-row-surface);
  content: "";
}

details[open]>summary .directory-tree__icon--folder::after {
  position: absolute;
  inset: 2px -1px -1.5px 2px;
  border: 1.5px solid currentColor;
  border-radius: 2px;
  background: var(--tree-row-surface);
  transform: skewX(-15deg);
  content: "";
}

.directory-tree__icon--file {
  width: 13px;
  height: 16px;
  color: var(--vp-c-text-2);
}

.directory-tree__icon--file::after {
  position: absolute;
  inset: 5px 2px auto;
  height: 4px;
  border-block: 1px solid currentColor;
  content: "";
}

@media (max-width: 600px) {
  .directory-tree .directory-tree {
    margin-inline-start: 18px;
    padding-inline-start: 6px;
  }

  .directory-tree__row {
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 2px 8px;
    padding-inline: 8px;
  }

  .directory-tree__description {
    grid-column: 2;
    text-align: start;
  }
}
</style>
