<script setup>
import { nextTick, onUnmounted, ref, watch } from "vue";

const props = defineProps({ open: Boolean });
const emit = defineEmits(["close"]);
const suggestions = [
  "var a = 123 符合公司 JavaScript 规范吗？",
  "1.3.2 只修复三个 Bug，这批发什么版本？",
  "需求评审通过后，下一步是什么？",
];

const input = ref(null);
const log = ref(null);
const draft = ref("");
const turns = ref([]);
const pending = ref(false);
let request;

async function scrollToLatest() {
  await nextTick();
  if (log.value) log.value.scrollTop = log.value.scrollHeight;
}

watch(() => props.open, async (open) => {
  if (!open) return;
  await scrollToLatest();
  input.value?.focus();
});

async function ask(value = draft.value) {
  const question = value.trim();
  if (!question || pending.value) return;

  const turn = turns.value.push({ question, answer: "", sources: [], error: "" }) - 1;
  draft.value = "";
  pending.value = true;
  request = new AbortController();
  const { signal } = request;
  await scrollToLatest();

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || typeof data?.answer !== "string" || !Array.isArray(data.sources)) {
      throw new Error(data?.error || "问答服务暂时不可用，请稍后重试。");
    }
    turns.value[turn].answer = data.answer;
    turns.value[turn].sources = data.sources;
  } catch (error) {
    if (signal.aborted) return;
    turns.value[turn].error = error instanceof TypeError
      ? "连接问答服务失败，请稍后重试。"
      : error.message;
    if (!draft.value) draft.value = question;
  } finally {
    pending.value = false;
    request = undefined;
    await scrollToLatest();
  }
}

function handleEnter(event) {
  if (event.isComposing) return;
  event.preventDefault();
  ask();
}

onUnmounted(() => request?.abort());
</script>

<template>
  <Teleport v-if="open" to="body">
    <section
      id="docs-ask-panel"
      class="docs-ask"
      role="dialog"
      aria-labelledby="docs-ask-title"
      @keydown.esc.stop.prevent="emit('close')"
    >
      <header class="docs-ask__header">
        <h2 id="docs-ask-title">问研发规范</h2>
        <button class="docs-ask__close" type="button" aria-label="关闭问答" @click="emit('close')">×</button>
      </header>

      <div ref="log" class="docs-ask__log" role="log" aria-label="问答记录">
        <div v-if="!turns.length" class="docs-ask__suggestions">
          <p>可以询问开发规范、版本号、工作流程和绩效考核。</p>
          <button v-for="question in suggestions" :key="question" type="button" @click="ask(question)">
            {{ question }}
          </button>
        </div>
        <div v-for="(turn, index) in turns" :key="index" class="docs-ask__turn">
          <p class="docs-ask__question">{{ turn.question }}</p>
          <p v-if="turn.error" class="docs-ask__error" role="alert">{{ turn.error }}</p>
          <p v-else-if="turn.answer" class="docs-ask__answer">{{ turn.answer }}</p>
          <p v-else class="docs-ask__status" role="status">正在查找相关条款并生成回答…</p>
          <ul v-if="turn.sources.length" class="docs-ask__sources" aria-label="引用的站内文档">
            <li v-for="source in turn.sources" :key="`${source.url}:${source.heading}`">
              <a :href="source.url" @click="emit('close')">
                {{ source.title }}<template v-if="source.heading !== source.title"> · {{ source.heading }}</template>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <form class="docs-ask__form" @submit.prevent="ask()">
        <textarea
          ref="input"
          v-model="draft"
          rows="2"
          maxlength="3000"
          aria-label="输入关于研发规范的问题"
          placeholder="输入问题或粘贴代码…"
          @keydown.enter.exact="handleEnter"
        ></textarea>
        <button class="docs-ask__send" type="submit" :disabled="pending || !draft.trim()">发送</button>
      </form>
    </section>
  </Teleport>
</template>

<style scoped>
.docs-ask {
  position: fixed;
  z-index: 80;
  inset-inline-end: 1.25rem;
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  width: min(28rem, calc(100vw - 2.5rem));
  height: min(37rem, calc(100dvh - var(--vp-nav-height) - 2rem));
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 1rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: var(--vp-shadow-3);
  font-size: 0.875rem;
  line-height: 1.65;
}

.docs-ask__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.docs-ask__header h2 {
  font-size: 1rem;
  font-weight: 650;
}

.docs-ask__close {
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  color: var(--vp-c-text-2);
  font-size: 1.25rem;
}

.docs-ask__close:hover,
.docs-ask__suggestions button:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
}

.docs-ask__log {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1rem;
}

.docs-ask__suggestions {
  display: grid;
  gap: 0.5rem;
  color: var(--vp-c-text-2);
}

.docs-ask__suggestions button {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  text-align: start;
}

.docs-ask__turn + .docs-ask__turn {
  margin-top: 1.25rem;
}

.docs-ask__question,
.docs-ask__answer {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.docs-ask__question {
  width: fit-content;
  max-width: 92%;
  margin: 0 0 0.75rem auto;
  padding: 0.375rem 0.75rem;
  border-radius: 0.625rem;
  background: var(--vp-c-brand-soft);
}

.docs-ask__status {
  color: var(--vp-c-text-2);
}

.docs-ask__error {
  color: var(--vp-c-danger-1);
}

.docs-ask__sources {
  display: grid;
  gap: 0.25rem;
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.8125rem;
}

.docs-ask__sources a {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

.docs-ask__form {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
}

.docs-ask__form textarea {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  background: var(--vp-c-bg-soft);
  resize: none;
}

.docs-ask__form textarea:focus-visible {
  outline: 1px solid var(--vp-c-brand-1);
}

.docs-ask__send {
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
  font-weight: 600;
}

.docs-ask__send:disabled {
  opacity: 0.55;
}

@media (max-width: 600px) {
  .docs-ask {
    inset-inline: 0.75rem;
    bottom: max(0.75rem, env(safe-area-inset-bottom));
    width: auto;
  }

  .docs-ask__form textarea {
    font-size: 1rem;
  }
}
</style>
