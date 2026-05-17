---
name: pm-main-agent-selection
description: >
  当需求对齐完成、需要为任务分配合适的Agent类型时使用。涉及Agent选型、模型匹配、
  任务拆分与分配等场景。即使用户没有说"选型Agent"，只要涉及"谁来做""用什么模型"、
  "任务分给谁""选哪个Agent"，就应触发。
argument-hint: "[--model <opus|sonnet|haiku>] <task list or project scope>"
level: 2
pipeline: [pm-requirements-alignment, pm-main-agent-selection, pm-subagent-analysis]
handoff-policy: auto
handoff: wiki/summaries/architecture/agent-selection.md
---

# 主Agent选型初分配

<Purpose>
依据项目目标与模块特征匹配Agent类型，完成首轮任务拆分。选型直接影响执行效率——模型过高浪费资源，过低影响质量。核心是"让合适的人做合适的事"。
</Purpose>

<Use_When>
- 需求对齐完成，"谁来做"还不确定
- 项目涉及多个专业领域，需要不同类型Agent
- 不确定用 opus 还是 sonnet 处理某个任务
- "这个任务分给谁？"
- "帮我拆分任务并分配Agent"
- 涉及"谁来做""用什么模型""任务分给谁"
</Use_When>

<Do_Not_Use_When>
- 需求尚未对齐（用 pm-requirements-alignment）
- 已在执行阶段且分配无问题（用 pm-dynamic-monitoring）
- 只需要深度分析不需要选型（用 pm-subagent-analysis）
- 任务很单一不需要拆分
</Do_Not_Use_When>

<Why_This_Exists>
选型不当会导致两种极端：模型过高浪费资源，模型过低影响质量。没有选型依据的分配等于随意分配，执行效率和质量都无法保障。明确"为什么这样选"比"选了什么"更重要。
</Why_This_Exists>

<Execution_Policy>
- 够用即可：避免模型过高浪费或过低影响质量
- 有据可依：每个选型决策必须有明确依据，不是"感觉合适"
- 可独立验证：任务粒度细化到可独立执行、可独立验证
- 优先级驱动：P0/P1/P2 必须明确，驱动执行顺序
</Execution_Policy>

<Steps>
1. **分析任务特征**
   - 类型：分析 / 设计 / 执行 / 审查
   - 复杂度：高 / 中 / 低
   - 领域：前端 / 后端 / 架构 / 文档
   - 依赖：独立 / 有前置任务

2. **匹配Agent类型与模型**
   - executor（sonnet）：标准执行、代码编写
   - architect（opus）：架构设计、系统规划
   - planner（sonnet）：计划制定、任务分解
   - reviewer（opus）：代码审查、质量把控
   - researcher（haiku/sonnet）：调研、资料收集
   - writer（sonnet）：文档撰写、内容创作

3. **拆分主任务为子任务**
   - 主任务 → 子任务列表
   - 子任务 → Agent + 模型 + 优先级（P0/P1/P2）
   - 粒度标准：可独立执行、可独立验证

4. **分配并记录选型依据**
   - 为什么选这个Agent？
   - 为什么选这个模型？
   - 选型假设和风险是什么？

5. **Wiki维护**
   - 创建 wiki/summaries/design/agent-selection.md
   - 创建 wiki/summaries/design/task-allocation.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- Agent类型与模型选择：
  - executor → sonnet
  - architect → opus
  - planner → sonnet
  - reviewer → opus
  - researcher → haiku/sonnet
  - writer → sonnet
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/design/agent-selection.md, wiki/summaries/design/task-allocation.md
</Tool_Usage>

<Examples>
<Good>
任务：设计微服务架构 → architect(opus)，因架构决策影响全局，需要深度分析
任务：编写用户CRUD接口 → executor(sonnet)，因标准执行任务，sonnet性价比最优
选型依据记录：每个选型决策有明确理由
Why good: 模型匹配复杂度，选型有据可依
</Good>

<Bad>
所有任务都分配 opus
Why bad: 资源浪费，简单任务用高模型没有必要
</Bad>

<Bad>
选型没有依据，"感觉这个合适"
Why bad: 无依据的选型无法复盘和优化
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 任务无法匹配合适Agent → 升级评估是否需要新的Agent类型
- 选型暂缓 → 保留已选型内容，记录待决项
- 资源不足无法满足最优选型 → 降级处理并记录风险
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 所有子任务都分配了Agent和模型？
- [ ] 模型等级是否匹配任务复杂度？
- [ ] 每个选型决策是否有明确依据？
- [ ] 任务粒度是否可独立执行、可独立验证？
- [ ] P0/P1/P2优先级是否明确？
- [ ] wiki/summaries/design/agent-selection.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/design/
├── agent-selection.md     # Agent选型报告
└── task-allocation.md     # 任务分配表
```

## Agent匹配矩阵（JSON格式）

```json
{
  "agents": [
    {"type": "executor", "model": "sonnet", "use_for": "标准执行、代码编写"},
    {"type": "architect", "model": "opus", "use_for": "架构设计、系统规划"},
    {"type": "planner", "model": "sonnet", "use_for": "计划制定、任务分解"},
    {"type": "reviewer", "model": "opus", "use_for": "代码审查、质量把控"},
    {"type": "researcher", "model": "haiku/sonnet", "use_for": "调研、资料收集"},
    {"type": "writer", "model": "sonnet", "use_for": "文档撰写、内容创作"}
  ]
}
```

## Wiki日志模板

```markdown
## [TIMESTAMP] pm-main-agent-selection | {level} level

**Type**: agent_selection
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/design/agent-selection.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
