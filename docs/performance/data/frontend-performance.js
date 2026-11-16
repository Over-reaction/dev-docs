export const frontendPerformanceGroups = [
  {
    code: "A",
    name: "交付质量",
    weight: 35,
    indicators: [
      {
        code: "A1",
        name: "页面与交互符合度",
        weight: 10,
        definition:
          '统计页面实现与已确认原型不一致的问题，包括字段遗漏、操作入口缺失、页面结构及交互方式不符。扣分项以<a href="/performance/test-defect.html">《测试缺陷等级量化标准》</a>界面交互判断标准为准。',
        source: "《功能测试问题清单》问题类型为：页面还原度与交互",
        scoring: `S0：-40分；
          S1：-25分；
          S2：-10分；
          S3：-5分。`,
        bonus: "单次需求/优化一次性通过+5",
      },
      {
        code: "A2",
        name: "生产环境缺陷",
        weight: 13,
        definition:
          '考核开发代码、业务逻辑及技术实现缺陷导致的生产环境异常。以经确认归属于前端研发责任的线上问题为统计范围；按照<a href="/performance/question-list.html">《问题清单类型合并定义》</a>标准执行。同一根本原因产生的重复告警、关联异常及重复反馈按同一问题合并统计，独立问题分别统计。',
        source: "《问题清单》",
        scoring: `Q1：0分；
          Q2：扣15分；
          Q3：扣15分；
          Q4：扣15分；
          Q5：扣10分；
          Q6：扣25分；
          Q7：扣10分；
          Q8：扣40分；
          Q9：0分。`,
        bonus: "/（硬指标无加分项）",
      },
      {
        code: "A3",
        name: "代码质量合规性",
        weight: 7,
        definition: "扫描强制/推荐/参考问题数。",
        source: "《代码扫描报告》",
        scoring: "【扣分】强制每条 −30；推荐每条-10分；参考只做提醒，不扣分。",
        bonus: "每个月的代码质量在90分以上+10",
      },
      {
        code: "A4",
        name: "测试阶段缺陷",
        weight: 5,
        definition:
          '功能测试问题清单同类型去重。扣分项以<a href="/performance/test-defect.html">《测试缺陷等级量化标准》</a>bug判定标准为准。',
        source: "《功能测试问题清单》问题类型为：bug",
        scoring: "【扣分】S0：-40分；S1：-25分；S2：-10分；S3：-5分。",
        bonus: "单次需求/优化一次性通过+5",
      },
    ],
  },
  {
    code: "B",
    name: "进度时效",
    weight: 25,
    indicators: [
      {
        code: "B1",
        name: "任务按期完成率",
        weight: 15,
        definition: "未按期完成任务数",
        source: "《任务表》",
        scoring:
          "【扣分】每个超时任务基础扣15分；超时梯度计算：超时第2个工作日，再追加扣5分；第3个工作日，再追加扣8分；第4个工作日起，每日再追加扣10分。",
        bonus: "都没出现+20",
      },
      {
        code: "B2",
        name: "工作日报填报及时性",
        weight: 5,
        definition: "每日过程记录编写",
        source: "《每日异常问题详情》",
        scoring: "【扣分】每次漏记-10分。",
        bonus: "",
      },
      {
        code: "B3",
        name: "问题清单填报及时性",
        weight: 5,
        definition: "问题清单根本原因编写",
        source: "《每日异常问题详情》",
        scoring: "【扣分】每个未闭合-10分。",
        bonus: "",
      },
    ],
  },
  {
    code: "C",
    name: "流程合规",
    weight: 20,
    indicators: [
      {
        code: "C1",
        name: "技术方案评审质量",
        weight: 5,
        definition: "技术方案未按模板规范编写",
        source: "《技术方案驳回记录》",
        scoring: "【扣分】每个驳回-10分。",
        bonus: "单次需求/优化一次性通过+5",
      },
      {
        code: "C2",
        name: "技术文档完整性",
        weight: 6,
        definition: "自测文档缺失",
        source: "《前端自测文档》",
        scoring: "【扣分】每个缺失-15分。",
        bonus: "/（流程强制要求无加分项）",
      },
      {
        code: "C3",
        name: "版本发布规范性",
        weight: 5,
        definition: "无版本发布记录",
        source: "《发布版本记录表》",
        scoring: "【扣分】每个缺失-10分。",
        bonus: "/（流程强制要求无加分项）",
      },
      {
        code: "C4",
        name: "文档抽查合格率",
        weight: 4,
        definition: "流程过程文档（技术方案文档、自测文档）内容不符合模板规范",
        source: "《每日异常问题详情》",
        scoring: "【扣分】每个缺失-10分。",
        bonus: "/（流程强制要求无加分项）",
      },
    ],
  },
  {
    code: "D",
    name: "协作口碑",
    weight: 20,
    indicators: [
      {
        code: "D1",
        name: "部门内协作评价",
        weight: 20,
        definition: "产品3/前端3/组长评分14",
        source: "月度互评表",
        scoring: "【计分】权重平均分",
        bonus: "/",
      },
    ],
  },
];
