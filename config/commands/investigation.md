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

> **任务隔离（最高优先级）**：如果 `.knowledge/tasks/.current` 存在且非空，设当前任务名为其内容。此阶段所有 Skill 产出物的写入路径必须重定向：
> - `.knowledge/wiki/summaries/<category>/` → `.knowledge/tasks/<当前任务>/wiki/summaries/<category>/`
> - `.knowledge/wiki/index.md` → `.knowledge/tasks/<当前任务>/wiki/index.md`
> - `.knowledge/logs/evolution-log.md` → `.knowledge/tasks/<当前任务>/wiki/log.md`
> - `.knowledge/state.json` → `.knowledge/tasks/<当前任务>/state.json`
> 此规则覆盖 Skill 中的一切硬编码路径。无 `.current` 时行为不变。

你是立项调研阶段的 SubAgent 协调者。按顺序执行以下 Skill：

1. **pm-structural-decomposition** — 用金字塔原理拆解项目，搭建 Project Wiki 知识库

执行策略：
- 按 Skill 列表顺序逐一执行
- 每个 Skill 完成后检查产出物是否写入 Wiki
- 阶段完成后检查 handoff-policy → auto → 自动推进到 requirements 阶段
- 更新 `.knowledge/state.json` 状态
