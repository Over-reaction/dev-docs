---
outline: [2, 3]
---

# HTML 开发标准

前端开发标准系列 · 广州一千河科技有限公司 · 2026 年 11 月

## 文档版本控制

| 版本号 | 修订时间   | 修订者 | 备注 |
| ------ | ---------- | ------ | ---- |
| V1.0.0 | 2026/11/08 | 金晨   | 初稿 |

## 1. 文件信息

### 1.1. 编制依据

本标准以阿里巴巴前端规约《HTML 编码规约》为基础，用于公司前端 HTML 编写和代码评审。

参考地址：[阿里巴巴前端规约 HTML 编码规约](https://github.com/alibaba/f2e-spec/blob/main/docs/coding/html.zh.md)

### 1.2. 适用范围和规则等级

适用于手写 HTML 页面、HTML 片段及模板生成的 HTML。

强制条款须满足。推荐条款默认采用，参考条款用于指导实现。

## 2. 页面文档

### 2.1. 文档声明和根元素

**【强制】** 文档开头必须写明文档类型声明 `<!doctype html>`。

**【强制】** 必须有且只能有一个位于顶层的 `<html>` 元素。显式写出一个 `<head>` 和一个 `<body>`，依次作为根元素的直接子元素。

**【强制】** `<html>` 必须声明与页面主语言匹配的 `lang`，如 `zh-CN` 或 `en-US`。局部内容语言不同时，在相应容器上标注 `lang`。

### 2.2. 元数据和标题

**【强制】** HTML 文件使用 UTF-8 保存。页面级 `<meta>` 放在 `<head>`，首项声明 `<meta charset="utf-8" />`。

**【强制】** 在 `<head>` 中设置唯一的 `<title>`，用能识别页面的文字作标题。

**【推荐】** 响应式页面设置 `width=device-width, initial-scale=1`，保留浏览器缩放。

### 2.3. 资源加载

**【推荐】** 样式表放在 `<head>`。普通脚本放在 `</body>` 前，也可在头部为外部经典脚本设置 `defer`。

**【推荐】** 普通样式和经典脚本省略默认 `type`。ES 模块保留 `type="module"`。

**【推荐】** 同站静态资源优先使用相对地址，第三方资源使用显式 `https://` 地址。

**【推荐】** 仅对当前页的关键资源使用 `preload`，设置正确的 `as` 并实际引用资源。

**【推荐】** 需要提前建立跨源连接时用 `preconnect`，仅需解析 DNS 时用 `dns-prefetch`。

```html
<link rel="preload" href="/assets/hero.webp" as="image" />
<link rel="preconnect" href="https://cdn.example.com" />
<link rel="dns-prefetch" href="https://static.example.com" />
```

### 2.4. 完整页面样板

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>订单查询</title>
    <meta name="description" content="查询订单状态与配送进度" />
    <link rel="stylesheet" href="./index.css" />
  </head>
  <body>
    <main>
      <h1>订单查询</h1>
    </main>
    <script src="./index.js"></script>
  </body>
</html>
```

## 3. HTML 编码

### 3.1. 注释

**【强制】** HTML 注释不得包含凭据、证书、密码、个人信息、内网地址或敏感业务规则。

```html
<!-- 订单状态区 -->
<!--
  订单状态由接口返回
  无结果时展示空状态
-->
```

### 3.2. 标签和属性

**【强制】** HTML 标签名统一使用小写。有值的属性统一使用双引号。

**【推荐】** `<meta>`、`<link>`、`<img>`、`<input>` 等 HTML 空元素统一写作 `/>`，斜线前保留一个空格。普通元素按元素规则写结束标签。

**【推荐】** `disabled`、`checked`、`selected` 等布尔属性仅写属性名。需要关闭时移除属性，写成 `disabled="false"` 仍表示禁用。

**【推荐】** 业务自定义数据属性使用 `data-*`，例如 `data-action="retry"`。

```html
<button type="button" data-action="retry" disabled>重试</button>
<input type="checkbox" name="remember" checked />
```

### 3.3. 语义和可访问性

**【参考】** 按内容和用途选用原生元素。列表使用 `<ul>` 或 `<ol>` 与 `<li>`，页面跳转用带 `href` 的 `<a>`，执行操作用 `<button>`。

**【参考】** 为信息性图片提供表达用途或内容的 `alt`，纯装饰图片使用 `alt=""`。给表单控件提供可访问名称，优先使用关联的 `<label>`。

```html
<label for="order-id">订单号</label>
<input id="order-id" name="orderId" />
<img src="./status.svg" alt="订单已发货" />
<img src="./divider.svg" alt="" />
```
