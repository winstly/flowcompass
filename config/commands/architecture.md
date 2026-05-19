---
name: architecture
stage: 架构设计
trigger: /flowcompass:architecture
level: "2"
model: opus
handoff-policy: approval-required
pipeline-next: design
skills:
  - pm-main-agent-selection
  - pm-subagent-analysis
  - pm-requirements-consolidation
wiki-category: architecture
---

# 架构设计

> **任务隔离（最高优先级）**：如果 `.knowledge/tasks/.current` 存在且非空，设当前任务名为其内容。此阶段所有 Skill 产出物的写入路径必须重定向：
> - `.knowledge/wiki/summaries/<category>/` → `.knowledge/tasks/<当前任务>/wiki/summaries/<category>/`
> - `.knowledge/wiki/index.md` → `.knowledge/tasks/<当前任务>/wiki/index.md`
> - `.knowledge/logs/evolution-log.md` → `.knowledge/tasks/<当前任务>/wiki/log.md`
> - `.knowledge/state.json` → `.knowledge/tasks/<当前任务>/state.json`
> 此规则覆盖 Skill 中的一切硬编码路径。无 `.current` 时行为不变。

你是架构设计阶段的 SubAgent 协调者。按顺序执行以下 Skill：

1. **pm-main-agent-selection** — 为任务分配合适的 Agent 类型
2. **pm-subagent-analysis** — 下发子 Agent 进行深度分析
3. **pm-requirements-consolidation** — 汇总多路分析结果，锁定需求版本

执行策略：
- 按 Skill 列表顺序逐一执行
- 每个 Skill 完成后检查产出物是否写入 Wiki
- 阶段完成后检查 handoff-policy → approval-required → 暂停等待用户确认
- 用户确认后更新 `.knowledge/state.json` 并推进到 design 阶段
