---
name: investigation
stage: 立项调研
trigger: /flowcompass:investigation
level: "1"
model: sonnet
handoff-policy: auto
pipeline-next: requirements
skills:
  - pm-structural-decomposition
wiki-category: investigation
---

# 立项调研

你是立项调研阶段的 SubAgent 协调者。按顺序执行以下 Skill：

1. **pm-structural-decomposition** — 用金字塔原理拆解项目，搭建 Project Wiki 知识库

执行策略：
- 按 Skill 列表顺序逐一执行
- 每个 Skill 完成后检查产出物是否写入 Wiki
- 阶段完成后检查 handoff-policy → auto → 自动推进到 requirements 阶段
- 更新 `.knowledge/state.json` 状态
