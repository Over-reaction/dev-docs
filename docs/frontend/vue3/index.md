---
outline: [2, 4]
---

# Vue 3 开发标准

前端开发标准系列 · 广州一千河科技有限公司 · 2026 年 11 月

## 文档版本控制

| 版本号 | 修订时间 | 修订者 | 备注 |
| --- | --- | --- | --- |
| V1.0.0 | 2026/11/08 |  | 初稿 |

## 1. 文件信息

### 1.1. 编制依据

本标准以Vue3官方风格指南为基础，用于公司前端Vue3项目编写和代码评审。

参考地址：[Vue 风格指南](https://cn.vuejs.org/style-guide/)。

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

**【推荐】** 在单文件组件的模板中使用 PascalCase 引用组件，例如 `<ArticleCard />`。名称使用含义清晰的完整单词，团队通用的 URL、HTTP、API、UI 等缩写可保留。

**【推荐】** 名称以最通用的概念开头，动作、状态或用途放在后面。例如 `SearchButtonClear.vue` 和 `SearchButtonRun.vue`。

### 3.2. 基础组件和专用子组件

**【强制】** 跨页面复用、与具体业务无关的基础组件使用 `Base` 前缀，例如 `BaseButton.vue`、`BaseTable.vue`。

**【推荐】** 基础组件通过 Props 接收数据并通过事件报告变化，业务接口调用和业务状态更新由上层负责。组件职责应单一。

**【推荐】** 只服务于某个父组件的子组件使用父组件名称作前缀，方便按文件名识别所属关系。

```text
TodoList.vue
TodoListItem.vue
TodoListItemButton.vue
```

### 3.3. 单文件组件块顺序

**【强制】** 项目内统一选择模板在前，脚本在中，样式在后。

```text
<template> → <script> → <style>
<script> → <template> → <style>
```

## 4. Props 声明

### 4.1. 类型和必填项

**【强制】** 显式声明组件接收的 Props。运行时声明至少提供 `type`，并使用 `required: true` 标记必填项。采用 TypeScript 类型式声明时，用类型区分必填和可选字段。

**【推荐】** 当 Props 具有业务约定的默认值时，在声明处显式设置 `default`。存在固定取值范围时，按项目需要添加校验。

### 4.2. 引用类型默认值

**【强制】** 在运行时声明中，数组或对象默认值用工厂函数返回，避免多个组件实例共享同一可变默认对象。

```js
const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
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

在单文件组件的 `<script setup>` 中使用 `defineProps()`。以上示例中的 `props` 可供脚本和模板读取。

## 5. 列表渲染

### 5.1. 稳定且唯一的键

**【强制】** 使用 `v-for` 时，为每个同级列表项绑定稳定且唯一的 `key`。使用 `<template v-for>` 时，键绑定在该 `<template>` 上。

**【推荐】** 优先用稳定的业务标识，例如 `:key="user.id"`。列表可能增删、排序或包含内部状态时，避免用数组下标。

### 5.2. 条件和循环分离

**【强制】** 同一元素上不得同时使用 `v-if` 和 `v-for`。

**【推荐】** 筛选数据时，先通过计算属性生成要展示的列表。若条件只控制某个列表项内的节点，可用 `<template v-for>` 包裹，再在内部节点上使用 `v-if`。

```vue
<template>
  <ul>
    <li v-for="user in activeUsers" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue';

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
<article class="user-card user-card--disabled">
  <h2 class="user-card__header">用户信息</h2>
</article>
```

## 7. 组件通信

### 7.1. 父组件传值和子组件发事件

**【推荐】** 父组件用 Props 传递数据，子组件用事件报告交互结果。子组件显式声明发出的事件，由持有状态的上层决定是否更新。

**【强制】** 子组件将 Props 视为只读输入，包含对象和数组内的属性。谨慎使用 `$parent`，业务状态更新通过明确的事件或公共接口完成。

```vue
<!-- 父组件模板片段 -->
<UserForm :user-info="userInfo" @submit="handleSubmit" />
```

```vue
<!-- UserForm.vue -->
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

const emit = defineEmits(['submit']);

function handleSubmit() {
  emit('submit', props.userInfo.id);
}
</script>
```
