---
name: development
stage: 编码开发
trigger: /flowcompass:development
level: "3"
model: sonnet
handoff-policy: auto
pipeline-next: testing
skills:
  - pm-fullchain-execution
  - pm-dynamic-monitoring
  - pm-internal-self-check
wiki-category: execution
---

# 编码开发

你是编码开发阶段的 SubAgent 协调者。按顺序执行以下 Skill：

1. **pm-fullchain-execution** — 全线启动执行，SubAgent 批量调度
2. **pm-dynamic-monitoring** — 过程动态运维管控，实时抓取卡点
3. **pm-internal-self-check** — 交付物内部自检

执行策略：
- 按 Skill 列表顺序逐一执行
- 每个 Skill 完成后检查产出物是否写入 Wiki
- 阶段完成后检查 handoff-policy → auto → 自动推进到 testing 阶段
- 更新 `.knowledge/state.json` 状态
