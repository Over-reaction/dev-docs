---
outline: [2, 4]
---

# 微信小程序代码开发标准

## 文档版本控制

| 版本号 | 修订时间   | 修订者 | 备注 |
| ------ | ---------- | ------ | ---- |
| V1.0.0 | 2026/11/08 | 金晨   | 初稿 |

## 1. 文件信息

### 1.1. 编制依据

本标准以微信小程序开发指南为基础，用于公司前端微信原生小程序项目编写和代码评审。参考地址：[微信小程序开发指南](https://developers.weixin.qq.com/miniprogram/dev/framework/)

### 1.2. 适用范围和规则等级

强制条款须满足。推荐条款默认采用，参考条款用于指导实现。

## 2. 工程结构和配置

### 2.1. 技术栈和目录

**【推荐】** 使用微信原生框架和微信开发者工具，通用 UI 优先复用 TDesign 小程序组件。按业务划分页面、复用组件和服务，文件夹及文件名用小写短横线风格。

**【强制】** 小程序根目录包含 app.js 和 app.json。使用全局样式时提供 app.wxss。页面及自定义组件的脚本、模板、配置和样式文件使用相同目录与主文件名。

```text
miniprogram/
  app.js
  app.json
  app.wxss
  pages/
    order-list/index.js
    order-list/index.wxml
    order-list/index.json
    order-list/index.wxss
  components/
  services/
```

### 2.2. 页面注册

**【强制】** 页面路径须在 app.json 的 pages 或相应分包的 pages 中声明。路径按实际大小写书写，不带扩展名。JSON 使用双引号，不加注释和尾逗号。

## 3. WXML 和 WXSS

### 3.1. 模板和事件

**【推荐】** 使用小程序原生组件表达结构和交互，例如 view、text、button。模板负责展示和绑定，数据过滤与格式化优先在脚本中完成。

**【强制】** 可能增删、重排或承载输入状态的列表使用稳定且同级唯一的业务键。对象数组写作 wx:key="id"，这里的 id 是字段名，不能写成插值。

**【推荐】** 事件优先用 bind:tap 等形式绑定。仅在确需阻止冒泡时用 catch。通过绑定节点传入 data-id 时，在处理函数中从 event.currentTarget.dataset 读取。

```html
<block wx:if="{{orders.length}}">
  <button
    wx:for="{{orders}}"
    wx:key="id"
    class="order-list__item"
    data-id="{{item.id}}"
    bind:tap="openOrder"
  >
    {{item.title}}
  </button>
</block>
<text wx:else>暂无订单</text>
```

### 3.2. 样式和尺寸

**【推荐】** WXSS 优先使用类选择器，公共类名沿用公司 CSS 标准的 BEM 约定，例如 order-list\_\_item。全局样式只放通用规则，业务样式放在页面或组件中。

**【推荐】** 宽度随屏幕变化的布局按设计选择百分比、弹性布局或视口单位。维护 rpx 样式时考虑取整差异，在不同尺寸的真机上核对。

## 4. 页面生命周期和状态

### 4.1. 生命周期

**【推荐】** 在 onLoad 读取并校验路由参数，按需初始化页面。在 onShow 仅刷新需要恢复的数据。在 onHide 暂停可见性相关任务，在 onUnload 清理定时器、监听器和未完成的页面任务。

**【推荐】** 处理重复点击、并发请求和返回顺序。页面销毁后忽略旧回调，切换筛选条件后避免旧请求覆盖新状态。

### 4.2. 更新渲染数据

**【强制】** 更新渲染数据使用 setData，禁止直接改写 this.data 来刷新视图。传入可序列化的字段，避免传入 undefined，空值按业务语义使用 null、空数组或空字符串。

**【推荐】** data 主要保存模板依赖的状态。一次提交有关联的变化，只传变动字段。请求任务句柄等无需渲染的对象保存在页面实例或相应模块。

```js
// 页面收到订单数据后的状态更新
this.setData({
  orders,
  loading: false,
  errorMessage: "",
});
```

### 4.3. 页面跳转

**【强制】** 非 tabBar 页面可用 wx.navigateTo，tabBar 页面用 wx.switchTab。路由参数按需编码并在目标页校验，URL 中不传凭据或敏感个人信息。

```js
// 写在 Page 的 openOrder 事件处理函数中
const { id } = event.currentTarget.dataset;
if (typeof id !== "string" || !id) {
  return;
}
wx.navigateTo({
  url: `/pages/order-detail/index?id=${encodeURIComponent(id)}`,
});
```

## 5. 自定义组件和 TDesign

### 5.1. 组件边界

**【推荐】** 组件职责单一，复用组件通过 properties 接收输入，通过 triggerEvent 通知上层。由持有业务状态的页面或模块执行写入。通用组件不直接请求业务接口。

**【强制】** 自定义组件使用 Component 注册。公司组件的 JSON 显式声明 "component": true，引用方通过 usingComponents 注册标签。保持组件样式隔离，跨组件定制优先使用其公开接口。

```js
// components/order-card/index.js
Component({
  properties: {
    orderId: String,
  },
  methods: {
    handleSelect() {
      this.triggerEvent("select", { id: this.data.orderId });
    },
  },
});
```

```html
<order-card order-id="{{item.id}}" bind:select="handleSelect" />
```

组件内部交互节点绑定 handleSelect。父页面通过事件的 detail.id 读取所选订单。

### 5.2. 组件库接入

**【推荐】** 通过依赖清单和锁文件管理 tdesign-miniprogram。按项目约定构建 npm 依赖，在使用组件的页面或组件 JSON 中声明 usingComponents。

```json
{
  "usingComponents": {
    "t-button": "tdesign-miniprogram/button/button"
  }
}
```

## 6. 网络请求和异常处理

### 6.1. 域名与结果判定

**【强制】** 上线请求使用 HTTPS，按小程序管理后台配置对应的服务器域名。体验版和上线验证须开启域名与证书校验。

## 7. 登录与隐私

### 7.1. 隐私接口和降级

**【强制】** 使用平台隐私接口或组件前，在小程序管理后台如实配置用户隐私保护指引，并按微信流程同步用户同意状态。仅收集完成当前功能所需的信息。

**【推荐】** 在用户使用相关功能时申请所需权限。为拒绝、取消和 API 不可用设计可理解的提示与可用的替代流程。

## 8. 性能和发布

### 8.1. 性能和兼容性

**【推荐】** 合并连续的 setData 更新，避免在滚动回调中高频刷新。长列表按需加载，控制渲染节点和图片资源体积，用真机验证首屏和滚动表现。

**【推荐】** 将低频业务按需要拆为分包。tabBar 页面放在主包，核对分包间的引用限制。包体限制以上传工具和平台当期校验为准。

**【强制】** 使用新增平台 API 或组件能力时，核对最低基础库与目标客户端支持情况。必要时通过 wx.canIUse 等方式做能力判断，并验证降级路径。
