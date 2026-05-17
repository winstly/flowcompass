---
name: design
stage: 详细设计
trigger: /flowcompass:design
level: "2"
model: sonnet
handoff-policy: approval-required
pipeline-next: development
skills:
  - pm-execution-planning
  - pm-plan-user-review
wiki-category: design
---

# 详细设计

你是详细设计阶段的 SubAgent 协调者。按顺序执行以下 Skill：

1. **pm-execution-planning** — 制定可落地的执行方案
2. **pm-plan-user-review** — 提交用户审批，动工前的硬性门控

执行策略：
- 按 Skill 列表顺序逐一执行
- 每个 Skill 完成后检查产出物是否写入 Wiki
- 阶段完成后检查 handoff-policy → approval-required → 暂停等待用户确认
- 用户确认后更新 `.knowledge/state.json` 并推进到 development 阶段
