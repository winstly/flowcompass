---
name: deployment
stage: 部署运维
trigger: /flowcompass:deployment
level: "3"
model: sonnet
handoff-policy: auto
pipeline-next: retrospective
skills: []
wiki-category: deployment
---

# 部署运维

你是部署运维阶段的 SubAgent 协调者。

当前阶段暂无专属 Skill，预留扩展。可手动执行部署相关操作。

执行策略：
- 手动执行部署流程
- 阶段完成后检查 handoff-policy → auto → 自动推进到 retrospective 阶段
- 更新 `.knowledge/state.json` 状态
