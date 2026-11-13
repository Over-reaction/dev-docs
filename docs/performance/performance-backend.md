---
aside: false
---

<script setup>
import { withBase } from "vitepress";
import FullscreenPreview from "../.vitepress/components/FullscreenPreview.vue";
</script>

# 后端绩效考核

<FullscreenPreview title="后端绩效考核">

<table class="backend-performance-table" tabindex="0" aria-label="后端绩效考核指标">
  <thead>
    <tr>
      <th scope="col">考核维度权重</th>
      <th scope="col">编号</th>
      <th scope="col">指标名称</th>
      <th scope="col">指标权重</th>
      <th scope="col">指标定义与计算口径</th>
      <th scope="col">数据来源（流程记录）</th>
      <th scope="col">扣分 / 计分规则（指标分扣完截止）</th>
      <th scope="col">加分项（指标内算分，在总分上增加。总分最高增加10分）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4" class="backend-performance-table__group">A 交付质量（35%）</td>
      <td>A1</td>
      <td>接口交付质量</td>
      <td>10%</td>
      <td>按<a :href="withBase('/backend/other/api-standard.html')">《接口文档标准》</a>完成接口文档编写及接口交付。接口文档必须包含请求地址、请求方式、请求参数、字段说明、参数校验、响应结构、错误码及请求示例；接口实际行为必须与文档一致；必须在约定时间内具备前后端联调条件。</td>
      <td>Apifox线上接口文档、《前后端联调问题清单》</td>
      <td>1. 文档缺少必填字段，每项扣5分；<br>2. 接口实际行为与文档不一致，每项扣20分；<br>3. 文档错误导致返工，每次扣30分。<br>同一任务中同一问题按最高扣分项执行，不重复累计。</td>
      <td>单次需求/优化任务接口文档一次性通过+5</td>
    </tr>
    <tr>
      <td>A2</td>
      <td>生产环境缺陷</td>
      <td>13%</td>
      <td>考核开发代码、业务逻辑及技术实现缺陷导致的生产环境异常。以经确认归属于后端研发责任的线上问题为统计范围；按照<a :href="withBase('/performance/question-list.html')">《问题清单类型合并定义》</a>标准执行。同一根本原因产生的重复告警、关联异常及重复反馈按同一问题合并统计，独立问题分别统计。</td>
      <td>《问题清单》</td>
      <td>Q1：0分；<br>Q2：扣15分；<br>Q3：扣15分；<br>Q4：扣15分；<br>Q5：扣10分；<br>Q6：扣25分；<br>Q7：扣10分；<br>Q8：扣40分；<br>Q9：0分。</td>
      <td>/（硬指标无加分项）</td>
    </tr>
    <tr>
      <td>A3</td>
      <td>代码质量合规性</td>
      <td>7%</td>
      <td>以代码扫描报告为依据，统计本考核周期新增及修改代码中的规范问题。按照强制规范、推荐规范、参考规范三个等级进行分类；</td>
      <td>《代码扫描报告》</td>
      <td>【强制】规范问题每条扣30分；<br>【推荐】规范问题每条扣10分；<br>【参考】规范问题仅记录，不扣分。</td>
      <td>每个月的代码质量平均在90分以上+10；<br>主动优化公共代码、消除历史遗留规范问题，每条问题加1分。</td>
    </tr>
    <tr>
      <td>A4</td>
      <td>测试阶段缺陷</td>
      <td>5%</td>
      <td>考核功能测试阶段发现的后端研发责任缺陷。相同业务功能、相同根本原因的问题合并统计；不同根本原因的问题分别统计。按照<a :href="withBase('/performance/test-defect.html')">《测试缺陷等级量化标准》</a>进行扣分。</td>
      <td>《功能测试问题清单》</td>
      <td>S0：-40分；<br>S1：-25分；<br>S2：-10分；<br>S3：-5分。</td>
      <td>单次需求/优化一次性通过+5</td>
    </tr>
    <tr>
      <td rowspan="3" class="backend-performance-table__group">B 进度时效（25%）</td>
      <td>B1</td>
      <td>任务按期完成率</td>
      <td>15%</td>
      <td>考核研发任务是否按照约定时间完成。任务完成时间以实际提交交付并达到验收条件的时间为准；经审批确认的任务延期或计划调整，按照调整后的时间统计。</td>
      <td>《任务表》</td>
      <td>每个超时任务基础扣15分；超时第2个工作日追加扣5分；第3个工作日追加扣8分；第4个工作日起，每日追加扣10分。</td>
      <td>都没出现+20</td>
    </tr>
    <tr>
      <td>B2</td>
      <td>工作日报填报及时性</td>
      <td>5%</td>
      <td>考核每日工作记录的提交及时性及内容完整性。日报必须包含当日完成事项、任务进度。</td>
      <td>《每日异常问题详情》</td>
      <td>每次未按规定时间提交扣10分。</td>
      <td></td>
    </tr>
    <tr>
      <td>B3</td>
      <td>问题清单填报及时性</td>
      <td>5%</td>
      <td>考核研发过程中发现的问题是否及时登记、分析及更新。根本原因因其他因素无法及时确认的，应先提前上报。</td>
      <td>《每日异常问题详情》</td>
      <td>每次问题登记后根本原因未及时未按要求补充，或处理完成后未更新闭环状态，扣10分。</td>
      <td></td>
    </tr>
    <tr>
      <td rowspan="4" class="backend-performance-table__group">C 流程合规（20%）</td>
      <td>C1</td>
      <td>技术方案评审质量</td>
      <td>5%</td>
      <td>考核技术方案是否按照<a :href="withBase('/backend/other/technical-design.html')">《技术方案标准》</a>编写。</td>
      <td>《技术方案驳回记录》</td>
      <td>因方案内容缺失、技术分析不充分或设计不合理导致评审驳回，每次扣10分。因需求变更或评审意见调整导致的非方案质量问题不扣分。</td>
      <td>提出有效的技术架构优化方案并获得评审通过，加5分。</td>
    </tr>
    <tr>
      <td>C2</td>
      <td>技术文档完整性</td>
      <td>6%</td>
      <td>考核研发任务所要求的技术过程文档是否完整输出并归档，包括《技术方案文档》、《接口文档》。</td>
      <td>《接口文档》</td>
      <td>每缺少一份规定必须输出的技术文档，扣15分。<br>简单BUG等仍需编写技术方案的事项文档统计。</td>
      <td>/（流程强制要求无加分项）</td>
    </tr>
    <tr>
      <td>C3</td>
      <td>版本发布规范性</td>
      <td>5%</td>
      <td>考核研发版本交付及发布记录是否完整。记录必须包含版本号、代码分支、变更内容、数据库脚本、配置变更及发布说明。</td>
      <td><a :href="withBase('/changelog')">《发布版本记录表》</a></td>
      <td>每次发布缺少规定的版本记录，扣10分。</td>
      <td>/（流程强制要求无加分项）</td>
    </tr>
    <tr>
      <td>C4</td>
      <td>文档抽查合格率</td>
      <td>4%</td>
      <td>考核《技术方案文档》、《接口文档》等过程文档的实际内容是否符合企业文档模板及规范。重点检查内容完整性、准确性、格式规范性及与实际实现的一致性。</td>
      <td>《每日异常问题详情》</td>
      <td>每份抽查不合格文档扣10分；同一文档存在多个问题，按一份不合格文档统计。</td>
      <td>/（流程强制要求无加分项）</td>
    </tr>
    <tr>
      <td class="backend-performance-table__group">D 协作口碑（20%）</td>
      <td>D2</td>
      <td>部门内协作评价</td>
      <td>20%</td>
      <td>考核研发人员在需求沟通、技术协作、接口联调、问题处理及跨岗位协作中的表现。评分构成：产品人员评分3分、前端人员评分3分、研发组长评分14分。综合得分为三方评分之和，满分20分。</td>
      <td>《月度互评表》</td>
      <td>按各评价人员实际评分累计，满分20分。折算公式：实际得分÷20×100，再乘以指标权重。</td>
      <td>/</td>
    </tr>
  </tbody>
</table>

</FullscreenPreview>

<style>
.backend-performance-table th:nth-child(-n + 5),
.backend-performance-table__group {
  white-space: nowrap;
}

.backend-performance-table__group {
  background-color: var(--vp-c-bg-soft);
}

.backend-performance-table th:nth-child(n + 6) {
  min-width: 11rem;
}

.backend-performance-table th:nth-child(6),
.backend-performance-table th:nth-child(8) {
  min-width: 16rem;
}
</style>
