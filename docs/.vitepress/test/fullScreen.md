<script setup>
import ExcelTable from "/.vitepress/components/ExcelTable.vue";
import FullscreenPreview from "/.vitepress/components/FullscreenPreview.vue";

const columns = ["测试项", "操作", "预期效果", "备注"];
const scenarios = [
  ["打开预览", "点击全屏预览", "表格占用整个网页可视区", "浏览器工具栏保留"],
  ["查看宽表", "在窄屏上横向滚动", "可以查看右侧的列", "表格内容保持居中"],
  ["按钮退出", "点击退出全屏", "表格回到文档中", "焦点回到全屏预览按钮"],
  ["键盘退出", "再次打开后按 Esc", "关闭预览并回到文档", "可重复打开和退出"],
];

function makeRow(values, index) {
  return {
    number: index + 1,
    cells: values.map((text, column) => ({ address: column, text })),
  };
}

const table = {
  head: [makeRow(columns, 0)],
  body: scenarios.map(makeRow),
};
</script>

# 全屏预览测试

点击表格上方的按钮打开预览。关闭后可以再次打开，用 `Esc` 测试键盘退出。

<FullscreenPreview title="模拟表格预览">
  <ExcelTable
    :table="table"
    label="全屏预览测试表格"
    :column-widths="[180, 250, 330, 280]"
  />
</FullscreenPreview>
