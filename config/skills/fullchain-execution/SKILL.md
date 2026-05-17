---
name: fullchain-execution
description: >
  当用户审批通过、所有任务需要正式启动执行时使用。涉及SubAgent批量启动、
  并行/串行调度、进度跟踪等场景。即使用户没有说"启动执行"，只要审批通过、
  项目进入开发执行阶段、需要全线推进落地，就应立即触发。
argument-hint: "[--parallel] <approved execution plan reference>"
level: 3
pipeline: [plan-user-review, fullchain-execution, dynamic-monitoring]
handoff-policy: auto
handoff: wiki/summaries/execution/progress-log.md
---

# 全链路任务正式动工

<Purpose>
批量启动所有SubAgent，全线推进项目落地。关键原则：独立任务并行启动，有依赖任务按序启动。审批一旦通过就应立即执行，不允许在门控后继续犹豫。
</Purpose>

<Use_When>
- 用户已审批通过执行计划
- 所有前置条件就绪，等待启动
- 项目进入开发执行阶段
- "审批过了，开始做吧"
- "全线启动，并行推进"
</Use_When>

<Do_Not_Use_When>
- 用户尚未审批通过（用 plan-user-review）
- 已在执行阶段（用 dynamic-monitoring）
- 只需要调整计划而非执行（用 execution-planning）
</Do_Not_Use_When>

<Why_This_Exists>
审批通过后不立即执行等于审批浪费。独立任务串行启动浪费时间，有依赖任务并行启动会导致执行错误。正确的调度策略是执行效率的基础。
</Why_This_Exists>

<Execution_Policy>
- 能并行的绝不串行：独立任务并行启动，提升吞吐
- 有依赖的严格按序：依赖不满足不启动
- 启动后必须持续跟踪：执行不是"启动就完事"
- 产出必须验收：每个任务完成必须有产出物验收步骤
</Execution_Policy>

<HARD-GATE>
必须使用 team-board.md 中分配的 Agent 执行任务，不得自行执行。
**team-board.md 为空或任务覆盖不足时，禁止启动任何执行任务，必须先回退到 roster-management 完成选角组队。**
</HARD-GATE>

<Steps>
1. **读取团队分配和执行计划，校验覆盖完整性**
   - 读取 `.knowledge/org/team-board.md` 获取已分配的 Agent 列表
   - **如果 team-board.md 中无 Agent 分配记录（看板为空），立即停止执行，回退到 roster-management 完成选角和组队，确认 team-board 非空后方可继续**
   - 读取 `.knowledge/plans/execution-plan.md` 获取任务清单和依赖关系
   - **逐任务比对：execution-plan 中的每个任务是否在 team-board 中有对应 Agent。如有任务无 Agent 覆盖，立即停止执行，回退到 roster-management 补充选角，确保所有任务均有 Agent 覆盖后方可继续**
   - 确认每个任务对应的 Agent 代号和角色

2. **确认任务清单和依赖**
   - 任务清单最终确认
   - Agent状态检查（就绪/忙碌/不可用）
   - 资源就位确认
   - 依赖链最终校验

3. **使用 Agent 工具启动任务**
   - 对于每个任务，使用 Agent 工具启动对应的 SubAgent
   - Prompt 中包含：任务描述、上下文、约束条件、输出要求
   - 独立任务 → 并行启动多个 Agent
   - 有依赖任务 → 等前置 Agent 完成后再启动

4. **监控执行状态**
   - 跟踪每个 Agent 的执行进度
   - 记录里程碑检查点
   - 问题升级机制

5. **收集产出物**
   - 收集每个 Agent 的产出
   - 结构化整理产出物清单
   - 验证产出物完整性

6. **Wiki维护**
   - 创建 wiki/summaries/execution/progress-log.md
   - 创建 wiki/summaries/execution/execution-log.md
   - 更新 wiki/index.md
</Steps>

<Tool_Usage>
- Agent调度：使用 Agent 工具启动 SubAgent，传入任务描述和上下文
- 读取工具：Read team-board.md, execution-plan.md
- 写入工具：Write / Edit progress-log.md
- 产出路径：wiki/summaries/execution/progress-log.md
</Tool_Usage>

<Examples>
<Good>
执行调度：
1. 读取 team-board.md → 获取 Agent 列表
2. 读取 execution-plan.md → 获取任务清单
3. 使用 Agent 工具启动任务：
   - Agent("backend-architect", "实现用户认证模块，要求...")
   - Agent("frontend-developer", "实现登录页面，要求...")
4. 收集产出，写入 progress-log.md
Why good: 使用分配的 Agent 执行任务，有明确的委托
</Good>

<Bad>
直接自己执行所有任务，不使用 team-board.md 中的 Agent
Why bad: 没有利用团队分工，Agent 选择阶段白做
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 关键Agent不可用或依赖链断裂 → 协调资源或调整启动顺序
- 执行中止 → 保留已启动任务状态，记录中止原因
- 启动后发现计划有误 → 回退至 execution-planning 调整
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 是否读取了 team-board.md？
- [ ] 是否使用 Agent 工具启动任务？
- [ ] 每个任务是否有对应的 Agent 代号？
- [ ] 依赖关系是否正确？有无串行任务被错误并行？
- [ ] 每个任务启动是否有记录？
- [ ] wiki/summaries/execution/progress-log.md 是否已写入？
</Final_Checklist>

Task: {{ARGUMENTS}}
