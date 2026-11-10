---
outline: [2, 4]
---

# Vue 3 开发标准

## 文档版本

| 版本号 | 修订时间   | 修订者 | 备注 |
| ------ | ---------- | ------ | ---- |
| V1.0.0 | 2026/11/08 | 金晨   | 初稿 |

## 1. 文档信息

### 1.1. 编制依据

本标准以Vue3官方风格指南为基础，用于公司前端Vue3项目编写和代码评审。

参考地址：[Vue3 风格指南](https://cn.vuejs.org/style-guide/)。

### 1.2. 适用范围和规则等级

适用于公司采用 Vue 3 的前端项目及其单文件组件。

强制条款须满足。推荐条款默认采用，参考条款用于指导实现。

## 2. 技术栈与框架选择

### 2.1. 团队基线

**【推荐】** Vue 3 项目使用 Vue 3 作为前端框架，通用 UI 组件优先选用 Element Plus，业务表格优先选用 VxeTable。

### 2.2. 第三方依赖

**【推荐】** 优先复用项目中已有的组件和依赖。同类项目避免重复引入功能相近的第三方库。需要新增依赖时，在评审中说明现有方案无法覆盖的场景。

## 3. 组件结构与命名

### 3.1. 组件名称

**【强制】** 组件名称使用多个单词，应用根组件 `App` 除外。Vue 单文件组件文件名使用 PascalCase，例如 `ArticleCard.vue`。

::: details 详细解释
这样可以避免与现有和未来的 HTML 元素发生冲突，因为所有 HTML 元素都由单个单词组成。也能说明组件的具体用途。
:::

```vue
<!-- ❌ 不推荐：Article.vue 的组件名只有一个单词 -->
<Article />

<!-- ✅ 推荐：ArticleCard.vue 使用多单词组件名和 PascalCase -->
<ArticleCard />
```

**【推荐】** 组件名称命名使用 PascalCase（大驼峰命名）

**【推荐】** 尽量使用完整单词，使用含义清晰的完整单词

```vue
<!-- ❌ 不推荐： -->
<StuInfo />
<UserCfg />

<!-- ✅ 推荐： -->
<StudentInformation />
<UserConfiguration />
```

**【推荐】** 名称以最通用的概念开头，动作、状态或用途放在后面。例如 `SearchButtonClear.vue` 和 `SearchButtonRun.vue`。

::: details 详细解释

**您可能想知道：**

> **“我们为什么要强迫组件名称使用不太自然的语言呢？”**

**在自然英语中，形容词和其他描述词通常出现在名词之前，但也有例外情况，需要使用连接词。例如：**

- _**加**_**牛奶的咖啡**
- _**今日**_**例汤**
- _**博物馆**_**参观者**

**当然，你可以在组件名称中包含这些连接词，但顺序仍然很重要。**

**另请注意，“最高级别”的定义取决于您的应用上下文。例如，假设有一个包含搜索表单的应用。它可能包含如下组件：**

```text
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

**您可能已经注意到，很难看出哪些组件是搜索特有的。现在让我们根据规则重命名这些组件：**

```text
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

**由于编辑器通常按字母顺序组织文件，因此组件之间所有重要的关系现在一目了然。**

**您或许会想用另一种方法来解决这个问题，将所有搜索组件嵌套在一个名为“search”的目录下，将所有设置组件嵌套在一个名为“settings”的目录下。但我们建议仅在非常大的应用（例如包含 100 个以上组件）中才考虑这种方法，原因如下：**

- **通常来说，浏览嵌套的子目录比滚动浏览单个 `components` 目录需要更多的时间。**
- **名称冲突（例如多个 `ButtonDelete.vue` 组件）会使在代码编辑器中快速导航到特定组件变得更加困难。**
- **重构变得更加困难，因为查找和替换通常不足以更新对已移动组件的相对引用。**

:::

### 3.2. 基础组件和专用子组件

**【强制】** 跨页面复用、与具体业务无关的基础组件使用 `Base` 前缀，例如 `BaseButton.vue`、`BaseTable.vue`。

::: details 详细解释
这些组件为应用程序的统一样式和行为奠定了基础。它们只能包含：

- HTML元素，
- 其他基础组件，以及
- 第三方用户界面组件。

但它们永远不会包含全局状态（例如来自[Pinia](https://pinia.vuejs.org/)商店的状态）。

它们的名称通常包含它们所包裹的元素的名称（例如 `<div> BaseButton` BaseTable），除非没有专门用于其特定用途的元素（例如 `<div>` BaseIcon）。如果您为更具体的上下文构建类似的组件，它们几乎总是会使用这些组件（例如，`<div>`BaseButton可能用于 `<div> ButtonSubmit`）。

该约定的一些优点：

- 在编辑器中按字母顺序排列时，应用程序的基本组件都会列在一起，从而更容易识别。
- 由于组件名称应该始终是多词的，因此这种约定可以避免您为简单的组件包装器选择任意前缀（例如MyButton，VueButton）。
- 由于这些组件使用频率很高，您可能希望将它们设为全局组件，而不是到处导入。Vite 可以通过前缀来实现这一点：

  ```javascript
  const modules = import.meta.glob("./src/**/Base*.vue", { eager: true });
  for (const path in modules) {
    const config = modules[path].default;
    const name = config.name || path.match(/Base[A-Z]\w+/)[0];
    app.component(name, config);
  }
  ```

:::

**【推荐】** 基础组件通过 Props 接收数据并通过事件报告变化，业务接口调用和业务状态更新由上层负责。组件职责应单一。

**【推荐】** 只服务于某个父组件的子组件使用父组件名称作前缀，方便按文件名识别所属关系。

```text
# ❌ 不推荐：基础组件缺少 Base 前缀，专用子组件难以看出归属
Button.vue
TodoList.vue
Item.vue
ItemButton.vue

# ✅ 推荐：基础组件使用 Base 前缀，专用子组件沿用父组件名称
BaseButton.vue
TodoList.vue
TodoListItem.vue
TodoListItemButton.vue
```

### 3.3. 单文件组件块顺序

**【强制】** 项目内统一选择模板在前，脚本在中，样式在后。

```text
# ❌ 不推荐：脚本在模板之前
script template style

# ✅ 推荐：依次写模板、脚本和样式
template script style
```

## 4. Props 声明

### 4.1. 类型和必填项

**【强制】** 显式声明组件接收的 Props。运行时声明至少提供 `type`，并使用 `required: true` 标记必填项。采用 TypeScript 类型式声明时，用类型区分必填和可选字段。

**【推荐】** 当 Props 具有业务约定的默认值时，在声明处显式设置 `default`。存在固定取值范围时，按项目需要添加校验。

```js
// ❌ 不推荐：遗漏 status 的必填声明和 title 的业务默认值
defineProps({
  status: String,
  title: String,
});
```

```js
// ✅ 推荐：声明类型、必填项和业务默认值
defineProps({
  status: { type: String, required: true },
  title: { type: String, default: "用户列表" },
});
```

### 4.2. 引用类型默认值

**【强制】** 在运行时声明中，数组或对象默认值用工厂函数返回，避免多个组件实例共享同一可变默认对象。

```js
// ❌ 不推荐：直接把数组和对象作为默认值
defineProps({
  userList: { type: Array, default: [] },
  userInfo: { type: Object, default: {} },
});
```

```js
// ✅ 推荐：由工厂函数为每个实例返回默认值
const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
  userList: {
    type: Array,
    default: () => [],
  },
  userInfo: {
    type: Object,
    default: () => ({}),
  },
});
```

在单文件组件的 `script setup` 块中调用 `defineProps()`。以上示例中的 `props` 可供脚本和模板读取。

## 5. 列表渲染

### 5.1. 稳定且唯一的键

**【强制】** 使用 `v-for` 时，为每个同级列表项绑定稳定且唯一的 `key`。使用 `<template v-for>` 时，键绑定在该 `<template>` 上。

**【推荐】** 优先用稳定的业务标识，例如 `:key="user.id"`。列表可能增删、排序或包含内部状态时，避免用数组下标。

```vue
<!-- ❌ 不推荐：排序或删除后，数组下标可能指向另一位用户 -->
<li v-for="(user, index) in users" :key="index">{{ user.name }}</li>

<!-- ✅ 推荐：使用稳定且唯一的用户 ID -->
<li v-for="user in users" :key="user.id">{{ user.name }}</li>
```

### 5.2. 条件和循环分离

**【强制】** 同一元素上不得同时使用 `v-if` 和 `v-for`。

**【推荐】** 筛选数据时，先通过计算属性生成要展示的列表。若条件只控制某个列表项内的节点，可用 `<template v-for>` 包裹，再在内部节点上使用 `v-if`。

```vue
<!-- ❌ 不推荐：在同一个节点上使用 v-if 和 v-for -->
<li v-for="user in users" v-if="user.isActive" :key="user.id">
  {{ user.name }}
</li>
```

```vue
<!-- ✅ 推荐：先计算要展示的用户，再遍历结果 -->
<template>
  <ul>
    <li v-for="user in activeUsers" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
});

function isActive(user) {
  return user.isActive;
}

const activeUsers = computed(() => props.users.filter(isActive));
</script>
```

## 6. 组件样式

### 6.1. 局部样式

**【推荐】** 组件私有样式优先使用 `<style scoped>`，并优先使用含义明确的类选择器。谨慎使用大范围的元素选择器，例如直接用 `div` 作为组件布局选择器。

```vue
<!-- ❌ 不推荐：全局元素选择器会影响其他组件的按钮 -->
<style>
button {
  padding: 4px 8px;
}
</style>
```

```vue
<!-- ✅ 推荐：使用局部样式和含义明确的类名 -->
<template>
  <button type="button" class="close-button">关闭</button>
</template>

<style scoped>
.close-button {
  padding: 4px 8px;
}
</style>
```

### 6.2. 公共样式与 BEM

**【推荐】** 公共组件暴露全局样式或使用非 scoped 样式时，采用 BEM 命名减少冲突。Block 表示独立块，Element 表示块内组成部分，Modifier 表示状态或变体。

例如 user-card 表示组件，user-card\_\_header 表示内部区域，user-card--disabled 表示禁用状态。修饰类与被修饰的基础类一起使用。

```html
<!-- ❌ 不推荐：通用类名容易和其他组件的全局样式冲突 -->
<article class="card disabled">
  <h2 class="header">用户信息</h2>
</article>

<!-- ✅ 推荐：用 BEM 命名，并同时保留基础类和修饰类 -->
<article class="user-card user-card--disabled">
  <h2 class="user-card__header">用户信息</h2>
</article>
```

## 7. 组件通信

### 7.1. 父组件传值和子组件发事件

**【推荐】** 父组件用 Props 传递数据，子组件用事件报告交互结果。子组件显式声明发出的事件，由持有状态的上层决定是否更新。

**【强制】** 子组件将 Props 视为只读输入，包含对象和数组内的属性。谨慎使用 `$parent`，业务状态更新通过明确的事件或公共接口完成。

```vue
<!-- ❌ 不推荐：子组件直接修改父组件传入的对象 -->
<script setup>
const props = defineProps({
  userInfo: { type: Object, required: true },
});

function handleSubmit() {
  props.userInfo.submitted = true;
}
</script>
```

```vue
<!-- ✅ 推荐：父组件监听事件并负责更新状态 -->
<UserForm :user-info="userInfo" @submit="handleSubmit" />
```

```vue
<!-- ✅ 推荐：UserForm.vue 显式声明并发出提交事件 -->
<template>
  <button type="button" @click="handleSubmit">提交</button>
</template>

<script setup>
const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["submit"]);

function handleSubmit() {
  emit("submit", props.userInfo.id);
}
</script>
```
