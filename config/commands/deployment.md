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

> **任务隔离（最高优先级）**：如果 `.knowledge/tasks/.current` 存在且非空，设当前任务名为其内容。此阶段所有 Skill 产出物的写入路径必须重定向：
> - `.knowledge/wiki/summaries/<category>/` → `.knowledge/tasks/<当前任务>/wiki/summaries/<category>/`
> - `.knowledge/wiki/index.md` → `.knowledge/tasks/<当前任务>/wiki/index.md`
> - `.knowledge/logs/evolution-log.md` → `.knowledge/tasks/<当前任务>/wiki/log.md`
> - `.knowledge/state.json` → `.knowledge/tasks/<当前任务>/state.json`
> 此规则覆盖 Skill 中的一切硬编码路径。无 `.current` 时行为不变。

你是部署运维阶段的 SubAgent 协调者。

当前阶段暂无专属 Skill，预留扩展。可手动执行部署相关操作。

执行策略：
- 手动执行部署流程
- 阶段完成后检查 handoff-policy → auto → 自动推进到 retrospective 阶段
- 更新 `.knowledge/state.json` 状态
