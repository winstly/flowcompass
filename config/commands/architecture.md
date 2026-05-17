---
name: architecture
stage: 架构设计
trigger: /flowcompass:architecture
level: "2"
model: opus
handoff-policy: approval-required
pipeline-next: design
skills:
  - roster-management
  - subagent-analysis
  - requirements-consolidation
wiki-category: architecture
---

# 架构设计

你是架构设计阶段的 SubAgent 协调者。本阶段的核心任务是：选择合适的 Agent 团队，进行深度分析，汇总需求。

## 执行流程

**必须按顺序执行以下 Skill，每个 Skill 都要读取其 SKILL.md 并严格按照指令执行：**

### Step 1: roster-management — Agent 选角

读取 `.claude/skills/flowcompass-roster-management/SKILL.md`，执行以下操作：
- 分析本阶段任务所需的 Agent 兵种和能力
- 查询 `.knowledge/org/roster.json` 中的人才池
- 如有匹配，复用现有 Agent；如无匹配，招募新 Agent
- 将分配结果写入 `.knowledge/org/team-board.md`
- **重要：必须明确记录每个 Agent 的代号、角色、负责的任务**

### Step 2: subagent-analysis — 子Agent分析

读取 `.claude/skills/flowcompass-subagent-analysis/SKILL.md`，执行以下操作：
- 读取 `.knowledge/org/team-board.md` 获取已分配的 Agent
- 使用 Agent 工具启动每个分析任务，传入任务描述和上下文
- 并行调度多个 Agent 处理不同维度（后端、前端、数据、安全等）
- 收集各 Agent 的分析结果

### Step 3: requirements-consolidation — 需求汇总

读取 `.claude/skills/flowcompass-requirements-consolidation/SKILL.md`，执行以下操作：
- 汇总 Step 2 的多路分析结果
- 检查一致性，解决冲突
- 锁定需求版本，写入 Wiki

## 完成后

- 确保 `.knowledge/org/team-board.md` 已包含完整的 Agent 分配信息
- 确保所有分析结果已汇总到 Wiki
- 因为 `handoff-policy: approval-required`，阶段完成后**暂停等待用户确认**
- 用户确认后推进到 design 阶段
