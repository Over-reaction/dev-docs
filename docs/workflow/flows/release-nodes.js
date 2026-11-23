const releaseStageId = "release";

// 发布节点接入现有流程，测试入口和异常回退由各流程连接。
export function createReleaseNodes({ x, y, stagePosition }) {
  const nodes = [
    { id: "release-version", position: { x, y }, data: { label: "核对版本\nVersion.md", stageId: releaseStageId } },
    { id: "release-merge", position: { x: x + 172, y }, data: { label: "合并代码至\n公共分支", stageId: releaseStageId } },
    { id: "release-manual", position: { x: x + 344, y: y - 46 }, data: { label: "手动打包", stageId: releaseStageId } },
    { id: "release-ci", position: { x: x + 344, y: y + 46 }, data: { label: "CI/CD 自动打包", stageId: releaseStageId } },
    { id: "release-config", position: { x: x + 516, y }, data: { label: "执行发布配置\nVersion.md", stageId: releaseStageId } },
    { id: "release-deploy", position: { x: x + 516, y: y + 144 }, data: { label: "发布系统", stageId: releaseStageId } },
    { id: "release-notify", position: { x: x + 344, y: y + 144 }, data: { label: "通知研发／产品", stageId: releaseStageId } },
    { id: "release-record", position: { x: x + 172, y: y + 144 }, data: { label: "记录发布版本", stageId: releaseStageId } },
    { id: "release-verify", position: { x: x - 18, y: y + 134 }, data: { label: "系统是否\n正常", shape: "decision", stageId: releaseStageId } },
    { id: "release-close", position: { x, y: y + 246 }, data: { label: "闭合任务", shape: "terminal", stageId: releaseStageId } },
  ];
  const edges = [
    { id: "release-version-merge", source: "release-version", target: "release-merge", sourceHandle: "right", targetHandle: "left" },
    { id: "release-merge-manual", source: "release-merge", target: "release-manual", sourceHandle: "right", targetHandle: "left", type: "step" },
    { id: "release-merge-ci", source: "release-merge", target: "release-ci", sourceHandle: "right", targetHandle: "left", type: "step" },
    { id: "release-manual-config", source: "release-manual", target: "release-config", sourceHandle: "right", targetHandle: "left", type: "step" },
    { id: "release-ci-config", source: "release-ci", target: "release-config", sourceHandle: "right", targetHandle: "left", type: "step" },
    { id: "release-config-deploy", source: "release-config", target: "release-deploy", sourceHandle: "bottom", targetHandle: "top" },
    { id: "release-deploy-notify", source: "release-deploy", target: "release-notify", sourceHandle: "left", targetHandle: "right" },
    { id: "release-notify-record", source: "release-notify", target: "release-record", sourceHandle: "left", targetHandle: "right" },
    { id: "release-record-verify", source: "release-record", target: "release-verify", sourceHandle: "left", targetHandle: "right" },
    { id: "release-verify-close", source: "release-verify", target: "release-close", sourceHandle: "bottom", targetHandle: "top", label: "是" },
  ];
  const stage = {
    id: "release-stage",
    position: stagePosition,
    data: { label: "研发发布上线", shape: "stage", stageId: releaseStageId },
  };
  return { stage: { ...stage, focusNodeIds: [stage.id, ...nodes.map(({ id }) => id)] }, nodes, edges };
}
