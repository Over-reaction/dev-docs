---
aside: false
---

<script setup>
import { withBase } from "vitepress";
import FullscreenPreview from "../.vitepress/components/FullscreenPreview.vue";
</script>

# 前端绩效考核

<FullscreenPreview title="前端绩效考核">

<table class="frontend-performance-table" tabindex="0" aria-label="前端绩效考核指标">
  <thead>
    <tr>
      <th scope="col">考核维度</th>
      <th scope="col">编号</th>
      <th scope="col">指标名称</th>
      <th scope="col">指标权重</th>
      <th scope="col">指标定义与计算口径</th>
      <th scope="col">数据来源（流程记录）</th>
      <th scope="col">扣分 / 计分规则</th>
      <th scope="col">加分项（指标内算分，在总分上增加。总分最高增加10分）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4" class="frontend-performance-table__group">A 交付质量（35%）</td>
      <td>A1</td>
      <td>页面与交互符合度</td>
      <td>10%</td>
      <td>统计页面实现与已确认原型不一致的问题，包括字段遗漏、操作入口缺失、页面结构及交互方式不符。扣分项以<a :href="withBase('/performance/test-defect.html')">《测试缺陷等级量化标准》</a>界面交互判断标准为准。</td>
      <td>《功能测试问题清单》问题类型为：页面还原度与交互</td>
      <td>【扣分】S0：-40分；S1：-25分；S2：-10分；S3：-5分。</td>
      <td>单次需求/优化一次性通过+5</td>
    </tr>
    <tr>
      <td>A2</td>
      <td>生产环境缺陷</td>
      <td>13%</td>
      <td>线上事故定级以<a :href="withBase('/performance/question-list.html')">《问题清单类型合并》</a>标准扣分</td>
      <td>––––––</td>
      <td>【扣分】Q1:0,Q2:-15,Q3:-15,Q4:-15,Q5:-10,Q6:-25,Q7:-10,Q8:-40,Q9:0。</td>
      <td>/（硬指标无加分项）</td>
    </tr>
    <tr>
      <td>A3</td>
      <td>代码质量合规性</td>
      <td>7%</td>
      <td>扫描强制/推荐/参考问题数。</td>
      <td>《代码扫描报告》</td>
      <td>【扣分】强制每条 −30；推荐每条-10分；参考只做提醒，不扣分。</td>
      <td>每个月的代码质量在90分以上+10</td>
    </tr>
    <tr>
      <td>A4</td>
      <td>测试阶段缺陷</td>
      <td>5%</td>
      <td>功能测试问题清单同类型去重。扣分项以<a :href="withBase('/performance/test-defect.html')">《测试缺陷等级量化标准》</a>bug判定标准为准。</td>
      <td>《功能测试问题清单》问题类型为：bug</td>
      <td>【扣分】S0：-40分；S1：-25分；S2：-10分；S3：-5分。</td>
      <td>单次需求/优化一次性通过+5</td>
    </tr>
    <tr>
      <td rowspan="3" class="frontend-performance-table__group">B 进度时效（25%）</td>
      <td>B1</td>
      <td>任务按期完成率</td>
      <td>15%</td>
      <td>未按期完成任务数</td>
      <td>《任务表》</td>
      <td>【扣分】每个超时任务基础扣15分；超时梯度计算：超时第2个工作日，再追加扣5分；第3个工作日，再追加扣8分；第4个工作日起，每日再追加扣10分。</td>
      <td>都没出现+20</td>
    </tr>
    <tr>
      <td>B2</td>
      <td>工作日报填报及时性</td>
      <td>5%</td>
      <td>每日过程记录编写</td>
      <td>《每日异常问题详情》</td>
      <td>【扣分】每次漏记-10分。</td>
      <td></td>
    </tr>
    <tr>
      <td>B3</td>
      <td>问题清单填报及时性</td>
      <td>5%</td>
      <td>问题清单根本原因编写</td>
      <td>《每日异常问题详情》</td>
      <td>【扣分】每个未闭合-10分。</td>
      <td></td>
    </tr>
    <tr>
      <td rowspan="4" class="frontend-performance-table__group">C 流程合规（20%）</td>
      <td>C1</td>
      <td>技术方案评审质量</td>
      <td>5%</td>
      <td>技术方案未按模板规范编写</td>
      <td>《技术方案驳回记录》</td>
      <td>【扣分】每个驳回-10分。</td>
      <td>单次需求/优化一次性通过+5</td>
    </tr>
    <tr>
      <td>C2</td>
      <td>技术文档完整性</td>
      <td>6%</td>
      <td>自测文档缺失</td>
      <td>《前端自测文档》</td>
      <td>【扣分】每个缺失-15分。</td>
      <td>/（流程强制要求无加分项）</td>
    </tr>
    <tr>
      <td>C3</td>
      <td>版本发布规范性</td>
      <td>5%</td>
      <td>无版本发布记录</td>
      <td>《发布版本记录表》</td>
      <td>【扣分】每个缺失-10分。</td>
      <td>/（流程强制要求无加分项）</td>
    </tr>
    <tr>
      <td>C4</td>
      <td>文档抽查合格率</td>
      <td>4%</td>
      <td>流程过程文档（技术方案文档、自测文档）内容不符合模板规范</td>
      <td>《每日异常问题详情》</td>
      <td>【扣分】每个缺失-10分。</td>
      <td>/（流程强制要求无加分项）</td>
    </tr>
    <tr>
      <td class="frontend-performance-table__group">D 协作口碑（20%）</td>
      <td>D1</td>
      <td>部门内协作评价</td>
      <td>20%</td>
      <td>产品3/前端3/组长评分14</td>
      <td>月度互评表</td>
      <td>【计分】权重平均分</td>
      <td>/</td>
    </tr>
  </tbody>
</table>

</FullscreenPreview>

<style>
.frontend-performance-table th:nth-child(-n + 4),
.frontend-performance-table__group {
  white-space: nowrap;
}

.frontend-performance-table__group {
  background-color: var(--vp-c-bg-soft);
}

.frontend-performance-table th:nth-child(6),
.frontend-performance-table th:nth-child(8) {
  min-width: 11rem;
}

.frontend-performance-table th:nth-child(5),
.frontend-performance-table th:nth-child(7) {
  min-width: 16rem;
}
</style>
