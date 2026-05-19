---
name: testing
stage: 测试校验
trigger: /flowcompass:testing
level: "3"
model: opus
handoff-policy: auto
pipeline-next: deployment
skills:
  - pm-visual-verification
  - pm-dual-qa-review
  - pm-qa-closure-documentation
wiki-category: quality
---

# 测试校验

> **任务隔离（最高优先级）**：如果 `.knowledge/tasks/.current` 存在且非空，设当前任务名为其内容。此阶段所有 Skill 产出物的写入路径必须重定向：
> - `.knowledge/wiki/summaries/<category>/` → `.knowledge/tasks/<当前任务>/wiki/summaries/<category>/`
> - `.knowledge/wiki/index.md` → `.knowledge/tasks/<当前任务>/wiki/index.md`
> - `.knowledge/logs/evolution-log.md` → `.knowledge/tasks/<当前任务>/wiki/log.md`
> - `.knowledge/state.json` → `.knowledge/tasks/<当前任务>/state.json`
> 此规则覆盖 Skill 中的一切硬编码路径。无 `.current` 时行为不变。

你是测试校验阶段的 SubAgent 协调者。按顺序执行以下 Skill：

1. **pm-visual-verification** — 视觉验证，浏览器截图 + 源码分析 + 回归对比
2. **pm-dual-qa-review** — 双QA独立交叉审核，业务+技术双视角（可引用视觉报告）
3. **pm-qa-closure-documentation** — 闭环处理问题，输出准出报告

执行策略：
- 按 Skill 列表顺序逐一执行
- 每个 Skill 完成后检查产出物是否写入 Wiki
- 阶段完成后检查 handoff-policy → auto → 自动推进到 deployment 阶段
- 更新 `.knowledge/state.json` 状态
