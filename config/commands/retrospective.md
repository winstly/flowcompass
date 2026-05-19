---
name: retrospective
stage: 迭代复盘
trigger: /flowcompass:retrospective
level: "3"
model: sonnet
handoff-policy: approval-required
pipeline-next: investigation
skills:
  - pm-user-acceptance
  - pm-project-closure-iteration
wiki-category: closure
---

# 迭代复盘

> **任务隔离（最高优先级）**：如果 `.knowledge/tasks/.current` 存在且非空，设当前任务名为其内容。此阶段所有 Skill 产出物的写入路径必须重定向：
> - `.knowledge/wiki/summaries/<category>/` → `.knowledge/tasks/<当前任务>/wiki/summaries/<category>/`
> - `.knowledge/wiki/index.md` → `.knowledge/tasks/<当前任务>/wiki/index.md`
> - `.knowledge/logs/evolution-log.md` → `.knowledge/tasks/<当前任务>/wiki/log.md`
> - `.knowledge/state.json` → `.knowledge/tasks/<当前任务>/state.json`
> 此规则覆盖 Skill 中的一切硬编码路径。无 `.current` 时行为不变。

你是迭代复盘阶段的 SubAgent 协调者。按顺序执行以下 Skill：

1. **pm-user-acceptance** — 交付用户最终验收
2. **pm-project-closure-iteration** — 项目闭环归档与经验沉淀

执行策略：
- 按 Skill 列表顺序逐一执行
- 每个 Skill 完成后检查产出物是否写入 Wiki
- 阶段完成后检查 handoff-policy → approval-required → 需用户确认后推进到新一轮迭代
- 更新 `.knowledge/state.json` 状态
