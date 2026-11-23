import { createReleaseNodes } from "./release-nodes.js";

const release = createReleaseNodes({ x: 268, y: 132, stagePosition: { x: 356, y: 80 } });

export const bugFlow = {
  stages: [release.stage],
  nodes: [
    {
      id: "1",
      position: { x: -64, y: -32 },
      data: { label: "BUG", stageId: "1" },
    },
    {
      id: "2",
      position: { x: 102.6, y: -32 },
      data: { label: "记录腾讯文档\n问题登记", shape: "input", stageId: "1" },
    },
    {
      id: "3",
      position: { x: 269.2, y: -32 },
      data: { label: "反馈系统负责\n研发人员", stageId: "1" },
    },
    {
      id: "4",
      position: { x: 435.8, y: -32 },
      data: { label: "前后端定责，\n责任人处理", stageId: "1" },
    },
    {
      id: "5",
      position: { x: 602.4, y: -32 },
      data: { label: "研发定位问题\n原因，修复 BUG", stageId: "1" },
    },
    {
      id: "6",
      position: { x: 769, y: -32 },
      data: { label: "产品测试", stageId: "4" },
    },
    release.stage,
    ...release.nodes,
    {
      id: "10",
      position: { x: 440, y: 378 },
      data: { label: "填写问题清单", shape: "document", stageId: "1" },
    },
  ],
  edges: [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      sourceHandle: "right",
      targetHandle: "left",
      type: "step",
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      sourceHandle: "right",
      targetHandle: "left",
      type: "step",
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      sourceHandle: "right",
      targetHandle: "left",
      type: "step",
    },
    {
      id: "e4-5",
      source: "4",
      target: "5",
      sourceHandle: "right",
      targetHandle: "left",
      type: "step",
    },
    {
      id: "e5-6",
      source: "5",
      target: "6",
      sourceHandle: "right",
      targetHandle: "left",
      type: "step",
    },
    {
      id: "e6-release-version",
      source: "6",
      target: "release-version",
      sourceHandle: "bottom",
      targetHandle: "top",
      type: "workflow-route",
      label: "通过",
      data: { waypoints: [[833, 66], [332, 66]], labelSegment: 1 },
    },
    {
      id: "e-release-verify-5",
      source: "release-verify",
      target: "5",
      sourceHandle: "left",
      targetHandle: "bottom",
      type: "workflow-route",
      label: "否 · 返回研发修复",
      data: { waypoints: [[206, 308], [206, 44], [666.4, 44]], labelSegment: 1 },
    },
    ...release.edges,
    {
      id: "e-release-close-10",
      source: "release-close",
      target: "10",
      sourceHandle: "right",
      targetHandle: "left",
    },
  ],
};
