---
aside: false
---

<script setup>
import NewcomerCalculator from "../.vitepress/components/NewcomerCalculator.vue";

const dailyWorkHours = 8;
const hoursPerFeature = { simple: 1, medium: 2, complex: 3 };
const projects = [
  { id: "safety", name: "安监系统", featureCounts: { complex: 5, medium: 3, simple: 5 } },
  { id: "hr", name: "人力系统", featureCounts: { complex: 12, medium: 9, simple: 6 } },
].map((project) => {
  const { simple, medium, complex } = project.featureCounts;
  const familiarityHours =
    simple * hoursPerFeature.simple +
    medium * hoursPerFeature.medium +
    complex * hoursPerFeature.complex;

  return { ...project, familiarityHours };
});
</script>

# 项目对接周期估算

<NewcomerCalculator :projects="projects" :daily-work-hours="dailyWorkHours" />

## 参数说明

| 指标               | 说明                                                                 |
| ------------------ | -------------------------------------------------------------------- |
| 项目背景了解周期   | 了解项目背景、搭建开发环境等基础准备所需的工作日数，默认 1，可修改。 |
| 项目功能熟悉总时长 | 选择项目后显示总时长（小时）和各等级的功能数量。                     |
| 每日工作时长       | 每个工作日的工作时长，按页面配置，单位为小时/工作日，默认 8。        |
| 项目对接周期       | 项目背景了解周期与功能熟悉所需工作日数之和，单位为工作日。           |

## 计算公式说明

1. 选择项目后，按各等级的功能数量和单个功能熟悉时长，计算项目功能熟悉总时长。
2. 将项目功能熟悉总时长除以每日工作时长，换算成功能熟悉所需的工作日数。
3. 加上项目背景了解周期，得到预计的项目对接周期。

以安监系统为例，项目背景了解周期为 1 个工作日，项目功能熟悉总时长为 26 小时，每日工作时长为 8 小时。代入公式 `项目对接周期 = 1 + 26 ÷ 8 = 4.25`，预计对接周期为 **4.25 个工作日**。

## 项目功能熟悉总时长的估算

以项目功能清单中的可独立验收功能为统计单位。参照下表评估复杂度，每项功能按符合的最高等级计入一次。

| 功能等级       | 单个功能分值 | 单个功能熟悉时长（小时）      | 前端评估标准                                           | 后端评估标准                                             |
| -------------- | ------------ | ----------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| N1（简单功能） | 1 分         | {{ hoursPerFeature.simple }}  | 普通列表、详情、基础表单、简单交互                     | 单表 CRUD、普通查询、基础数据校验                        |
| N2（中等功能） | 2 分         | {{ hoursPerFeature.medium }}  | 动态表单、组件联动、多状态交互、较复杂数据展示         | 多表关联、事务处理、较复杂条件查询、业务规则校验         |
| N3（复杂功能） | 3 分         | {{ hoursPerFeature.complex }} | 复杂表单、多步骤流程、可视化、跨系统交互、复杂状态管理 | 工作流、复杂业务计算、跨系统数据同步、复杂权限或并发处理 |

**项目功能熟悉总时长 = 简单功能数量 × 单个简单功能熟悉时长 + 中等功能数量 × 单个中等功能熟悉时长 + 复杂功能数量 × 单个复杂功能熟悉时长**
