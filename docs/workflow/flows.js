const columnWidth = 196;
const rowHeight = 112;

// 布局坐标以节点中心为准，小数位置可给回退连线留出空间。
function node(id, label, column, row, shape) {
  const [width, height] =
    shape === "stage"
      ? [188, 40]
      : shape === "decision"
        ? [164, 84]
        : [128, 64];
  return {
    id,
    position: {
      x: column * columnWidth - width / 2,
      y: row * rowHeight - height / 2,
    },
    data: { label, shape },
  };
}

function edge(
  source,
  target,
  { from = "bottom", to = "top", label, via, labelSegment } = {},
) {
  return {
    id: `${source}-${target}`,
    source,
    target,
    sourceHandle: from,
    targetHandle: to,
    type: via ? "workflow-route" : "step",
    label,
    ...(via && {
      data: {
        waypoints: via.map(([column, row]) => [
          column * columnWidth,
          row * rowHeight,
        ]),
        labelSegment,
      },
    }),
  };
}

const stages = [
  node("intake-stage", "登记与沟通", 0, 0, "stage"),
  node("review-stage", "文档与评审", 1.25, 0, "stage"),
  node("development-stage", "开发与联调", 7.5, 0, "stage"),
  node("release-stage", "测试与发布", 11.2, 0, "stage"),
];

const artifacts = [
  node("prototype", "原型图", 1.25, 2, "document"),
  node("feature-list", "功能清单", 2.15, 2, "document"),
  node("business-flow", "业务流程图", 3.05, 2, "document"),
  node("requirement-doc", "需求文档", 3.95, 2, "document"),
];

const documentNodes = [
  node("write-docs", "输出需求文档", 2.6, 1),
  ...artifacts,
];

const documentEdges = (next) =>
  artifacts.flatMap(({ id }, index) => {
    const column = 1.25 + index * 0.9;
    return [
      edge("write-docs", id, {
        via: [
          [2.6, 1.5],
          [column, 1.5],
        ],
      }),
      edge(id, next, {
        via: [
          [column, 2.8],
          [2.6, 2.8],
        ],
      }),
    ];
  });

const deliveryNodes = [
  node("technical-review", "研发技术评审会", 7.5, 1),
  node("technical-task", "腾讯文档\n任务表自动新增\n研发任务", 7.5, 2, "input"),
  node("technical-plan", "输出技术方案\n（含后端接口）", 7.5, 3, "document"),
  node("development", "研发编码阶段", 9.2, 1),
  node("backend", "后端编码", 8.7, 2),
  node("api-doc", "接口文档", 9.7, 2, "document"),
  node("backend-check", "后端自测接口\n检查代码逻辑\n提交前端", 9.2, 3),
  node("frontend", "前端编码", 9.2, 4),
  node("integration", "前后端联调", 9.2, 5),
  node("integration-passed", "是否通过", 9.2, 6, "decision"),
  node("self-test-doc", "前端输出自测文档", 9.2, 7, "document"),
  node("functional-test", "功能测试", 11.2, 1),
  node("test-doc", "输出测试文档", 11.2, 2, "document"),
  node("test-passed", "是否通过", 11.2, 3, "decision"),
  node("repair", "前端定责，\n研发修复", 11.2, 5),
  node("customer-test", "反馈客户进行\n上线前测试", 12.9, 1),
  node("customer-test-passed", "是否通过", 12.9, 2, "decision"),
  node("publish", "研发发布上线", 12.9, 3),
  node("record-version", "记录发布版本", 12.9, 4, "input"),
  node("end", "结束", 12.9, 5, "terminal"),
];

const deliveryEdges = [
  edge("technical-review", "technical-task", { label: "是" }),
  edge("technical-task", "technical-plan"),
  edge("technical-plan", "development", {
    from: "right",
    to: "left",
    via: [
      [8.1, 3],
      [8.1, 1],
    ],
  }),
  edge("development", "backend", {
    via: [
      [9.2, 1.5],
      [8.7, 1.5],
    ],
  }),
  edge("development", "api-doc", {
    via: [
      [9.2, 1.5],
      [9.7, 1.5],
    ],
  }),
  edge("backend", "backend-check", {
    via: [
      [8.7, 2.5],
      [9.2, 2.5],
    ],
  }),
  edge("api-doc", "backend-check", {
    via: [
      [9.7, 2.5],
      [9.2, 2.5],
    ],
  }),
  edge("backend-check", "frontend"),
  edge("frontend", "integration"),
  edge("integration", "integration-passed"),
  edge("integration-passed", "api-doc", {
    from: "right",
    to: "right",
    label: "否",
    via: [
      [10.2, 6],
      [10.2, 2],
    ],
  }),
  edge("integration-passed", "self-test-doc", { label: "是" }),
  edge("self-test-doc", "functional-test", {
    from: "right",
    to: "left",
    via: [
      [10.65, 7],
      [10.65, 1],
    ],
  }),
  edge("functional-test", "test-doc"),
  edge("test-doc", "test-passed"),
  edge("test-passed", "repair", { label: "否" }),
  edge("test-passed", "customer-test", {
    from: "right",
    to: "left",
    label: "是",
    via: [
      [12.05, 3],
      [12.05, 1],
    ],
  }),
  edge("customer-test", "customer-test-passed"),
  edge("customer-test-passed", "repair", {
    from: "left",
    to: "right",
    label: "否",
    via: [
      [12.4, 2],
      [12.4, 5],
    ],
    labelSegment: 1,
  }),
  edge("repair", "self-test-doc", {
    to: "bottom",
    via: [
      [11.2, 7.65],
      [9.2, 7.65],
    ],
  }),
  edge("customer-test-passed", "publish", { label: "是" }),
  edge("publish", "record-version"),
  edge("record-version", "end"),
];

const groupReviewNodes = (row) => [
  node("group-review", "研发组长初审", 2.6, row),
  node("group-doubts", "是否存疑", 2.6, row + 1, "decision"),
  node("group-doc-gap", "需求文档\n是否有疏漏", 2.6, row + 2, "decision"),
  node(
    "group-business-rules",
    "是否需与客户\n确认业务规则",
    2.6,
    row + 3,
    "decision",
  ),
  node("group-contact", "记录需确认事项，\n与客户沟通", 2.6, row + 4),
];

const groupReviewEdges = [
  edge("group-review", "group-doubts"),
  edge("group-doubts", "group-doc-gap", { label: "是" }),
  edge("group-doc-gap", "group-business-rules", { label: "否" }),
  edge("group-business-rules", "group-contact", { label: "是" }),
];

const requirementReviewNodes = [
  node("requirements-review", "需求评审会", 5.65, 1),
  node("review-doc-gap", "需求文档\n是否有疏漏", 5.65, 4, "decision"),
  node(
    "review-business-rules",
    "是否需与客户\n确认业务规则",
    5.65,
    5,
    "decision",
  ),
  node("supplement-docs", "补充需求文档", 6.6, 4),
];

function requirementReviewEdges(row) {
  return [
    edge("review-passed", "technical-review", {
      from: "right",
      to: "left",
      label: "是",
      via: [
        [6.25, row],
        [6.25, 1],
      ],
    }),
    edge("review-passed", "review-doc-gap", { label: "否" }),
    edge("review-doc-gap", "supplement-docs", {
      from: "right",
      to: "left",
      label: "是",
    }),
    edge("supplement-docs", "technical-review", {
      from: "right",
      to: "left",
      via: [
        [7.05, 4],
        [7.05, 1],
      ],
    }),
    edge("review-doc-gap", "review-business-rules", { label: "否" }),
  ];
}

export const requirementFlow = {
  stages,
  nodes: [
    ...stages,
    node("start", "客户发起", 0, 1, "terminal"),
    node("new-request", "新增需求", 0, 2),
    node("requirement-pool", "记录腾讯文档\n需求池", 0, 3, "input"),
    node("meeting", "需求沟通会议", 0, 4),
    node("minutes", "会议纪要", 0, 5, "document"),
    node("customer-confirmed", "客户是否确认", 0, 6, "decision"),
    node("execute", "部门主管确认\n是否执行", 0, 7, "decision"),
    node("declined", "告知客户，结束", 0, 8, "terminal"),
    ...documentNodes,
    node("department-review", "部门主管初审", 2.6, 3.5),
    node("department-passed", "是否通过", 2.6, 4.5, "decision"),
    node("department-signature", "签字确认", 2.6, 5.5, "document"),
    ...groupReviewNodes(6.5),
    node("customer-plan", "客户方案确认", 4.25, 6.5),
    node("customer-plan-passed", "是否通过", 4.25, 7.5, "decision"),
    node("customer-signature", "需求文档（签字）", 4.25, 8.5, "document"),
    ...requirementReviewNodes,
    node("review-passed", "是否通过", 5.65, 2, "decision"),
    ...deliveryNodes,
  ],
  edges: [
    edge("start", "new-request"),
    edge("new-request", "requirement-pool"),
    edge("requirement-pool", "meeting"),
    edge("meeting", "minutes"),
    edge("minutes", "customer-confirmed"),
    edge("customer-confirmed", "minutes", {
      from: "left",
      to: "left",
      label: "否",
      via: [
        [-0.64, 6],
        [-0.64, 5],
      ],
    }),
    edge("customer-confirmed", "execute", { label: "是" }),
    edge("execute", "declined", { label: "否" }),
    edge("execute", "write-docs", {
      from: "right",
      to: "left",
      label: "是",
      via: [
        [0.6, 7],
        [0.6, 1],
      ],
    }),
    ...documentEdges("department-review"),
    edge("department-review", "department-passed"),
    edge("department-passed", "write-docs", {
      from: "left",
      label: "否",
      via: [
        [0.92, 4.5],
        [0.92, 0.58],
        [2.6, 0.58],
      ],
    }),
    edge("department-passed", "department-signature", { label: "是" }),
    edge("department-signature", "group-review"),
    ...groupReviewEdges,
    edge("group-doubts", "customer-plan", {
      from: "right",
      to: "left",
      label: "否 · 给出初步完成时间",
      via: [
        [3.67, 7.5],
        [3.67, 6.5],
      ],
      labelSegment: 1,
    }),
    edge("group-doc-gap", "write-docs", {
      from: "left",
      label: "是",
      via: [
        [0.82, 8.5],
        [0.82, 0.58],
        [2.6, 0.58],
      ],
    }),
    edge("group-contact", "meeting", {
      to: "left",
      via: [
        [2.6, 11.1],
        [-0.84, 11.1],
        [-0.84, 4],
      ],
    }),
    edge("customer-plan", "customer-plan-passed"),
    edge("customer-plan-passed", "write-docs", {
      from: "left",
      label: "否",
      via: [
        [3.55, 7.5],
        [3.55, 7.99],
        [0.74, 7.99],
        [0.74, 0.58],
        [2.6, 0.58],
      ],
    }),
    edge("customer-plan-passed", "customer-signature", { label: "是" }),
    edge("customer-signature", "requirements-review", {
      from: "right",
      to: "left",
      via: [
        [4.95, 8.5],
        [4.95, 1],
      ],
    }),
    edge("requirements-review", "review-passed"),
    ...requirementReviewEdges(2),
    edge("review-business-rules", "write-docs", {
      label: "是",
      via: [
        [5.65, 11.4],
        [0.67, 11.4],
        [0.67, 0.58],
        [2.6, 0.58],
      ],
    }),
    ...deliveryEdges,
  ],
};

export const optimizationFlow = {
  stages,
  nodes: [
    ...stages,
    node("start", "客户发起", 0, 1, "terminal"),
    node("optimization", "优化类需求", 0, 2),
    node("issue-registration", "记录腾讯文档\n问题登记", 0, 3, "input"),
    node("meeting", "沟通会议", 0, 4),
    ...documentNodes,
    ...groupReviewNodes(3.5),
    ...requirementReviewNodes,
    node("review-task", "腾讯文档\n任务表自动新增\n研发任务", 5.65, 2, "input"),
    node("review-passed", "是否通过", 5.65, 3, "decision"),
    node("review-contact", "记录需确认事项，\n与客户沟通", 5.65, 6),
    ...deliveryNodes,
  ],
  edges: [
    edge("start", "optimization"),
    edge("optimization", "issue-registration"),
    edge("issue-registration", "meeting"),
    edge("meeting", "write-docs", {
      from: "right",
      to: "left",
      via: [
        [0.6, 4],
        [0.6, 1],
      ],
    }),
    ...documentEdges("group-review"),
    ...groupReviewEdges,
    edge("group-doubts", "requirements-review", {
      from: "right",
      to: "left",
      label: "否",
      via: [
        [4.95, 4.5],
        [4.95, 1],
      ],
    }),
    edge("group-doc-gap", "write-docs", {
      from: "left",
      label: "是",
      via: [
        [0.78, 5.5],
        [0.78, 0.58],
        [2.6, 0.58],
      ],
    }),
    edge("group-contact", "meeting", {
      from: "left",
      to: "bottom",
      via: [[0, 7.5]],
    }),
    edge("requirements-review", "review-task"),
    edge("review-task", "review-passed"),
    ...requirementReviewEdges(3),
    edge("review-business-rules", "review-contact", { label: "是" }),
    edge("review-contact", "meeting", {
      to: "bottom",
      via: [
        [5.65, 8.15],
        [0, 8.15],
      ],
    }),
    ...deliveryEdges,
  ],
};

const bugSteps = [
  ["bug", "BUG"],
  ["register", "记录腾讯文档\n问题登记", "input"],
  ["notify", "反馈系统负责\n研发人员"],
  ["assign", "前后端定责，\n责任人处理"],
  ["fix", "研发定位问题\n原因，修复 BUG"],
  ["test", "产品测试"],
  ["release", "发布上线"],
  ["end", "结束", "terminal"],
];

export const bugFlow = {
  nodes: [
    ...bugSteps.map(([id, label, shape], index) =>
      node(id, label, index * 0.85, 0, shape),
    ),
    node("version-record", "记录发布\n上线版本", 6 * 0.85, 1.2, "document"),
    node("issue-list", "填写问题清单", 7 * 0.85, 1.2, "document"),
  ],
  edges: [
    ...bugSteps
      .slice(1)
      .map(([id], index) =>
        edge(bugSteps[index][0], id, { from: "right", to: "left" }),
      ),
    edge("release", "version-record"),
    edge("end", "issue-list"),
  ],
};
