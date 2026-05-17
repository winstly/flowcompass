---
name: pm-fullchain-execution
description: >
  当用户审批通过、所有任务需要正式启动执行时使用。涉及SubAgent批量启动、
  并行/串行调度、进度跟踪等场景。即使用户没有说"启动执行"，只要审批通过、
  项目进入开发执行阶段、需要全线推进落地，就应立即触发。
argument-hint: "[--parallel] <approved execution plan reference>"
level: 3
pipeline: [pm-plan-user-review, pm-fullchain-execution, pm-dynamic-monitoring]
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
- 用户尚未审批通过（用 pm-plan-user-review）
- 已在执行阶段（用 pm-dynamic-monitoring）
- 只需要调整计划而非执行（用 pm-execution-planning）
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

<Steps>
1. **确认任务清单和依赖**
   - 任务清单最终确认
   - Agent状态检查（就绪/忙碌/不可用）
   - 资源就位确认
   - 依赖链最终校验

2. **独立任务并行启动**
   - 识别无依赖的独立任务
   - 批量并行启动，提升吞吐
   - 原则：能并行的绝不串行

3. **有依赖任务按序启动**
   - 按依赖链顺序启动
   - 前置任务完成后才启动后续任务
   - 原则：依赖不满足不启动

4. **监控执行状态**
   - 里程碑检查点
   - 产出物验收
   - 问题升级机制
   - 原则：执行不是"启动就完事"，必须持续跟踪

5. **收集产出物**
   - 收集每个SubAgent的产出
   - 结构化整理产出物清单

6. **Wiki维护**
   - 创建 wiki/summaries/execution/progress-log.md
   - 创建 wiki/summaries/execution/execution-log.md
   - 创建 wiki/summaries/execution/dependency-map.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- Agent调度：并行/按序启动SubAgent
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/execution/progress-log.md, wiki/summaries/execution/execution-log.md, wiki/summaries/execution/dependency-map.md
</Tool_Usage>

<Examples>
<Good>
执行调度：
- 并行启动：任务A(独立) + 任务B(独立) + 任务C(独立)
- 按序启动：任务D(依赖A) → 等A完成后再启动
- 里程碑：阶段1完成 → 验收产出物 → 启动阶段2
Why good: 独立任务并行、有依赖按序、有里程碑验收
</Good>

<Bad>
所有任务串行启动，即使没有依赖
Why bad: 浪费时间，独立任务应该并行提升效率
</Bad>

<Bad>
启动后就不管了，没有进度跟踪
Why bad: 执行不是启动就完事，必须有持续跟踪和产出验收
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 关键Agent不可用或依赖链断裂 → 协调资源或调整启动顺序
- 执行中止 → 保留已启动任务状态，记录中止原因
- 启动后发现计划有误 → 回退至 pm-execution-planning 调整
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 所有审批通过的任务是否都已启动？
- [ ] 依赖关系是否正确？有无串行任务被错误并行？
- [ ] Agent是否全部就位？
- [ ] 每个任务启动是否有记录？
- [ ] 进度是否有跟踪机制？
- [ ] wiki/summaries/execution/progress-log.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/execution/
├── progress-log.md        # 进展日志
├── execution-log.md       # 执行日志
└── dependency-map.md      # 依赖关系图
```

## 执行模式示意

```
主Agent协调
  ├── SubAgent1 → 产出1
  ├── SubAgent2 → 产出2  （并行）
  └── SubAgent3 → 产出3
      ↓
    汇总检查
```

## Wiki日志模板

```markdown
## [TIMESTAMP] pm-fullchain-execution | {level} level

**Type**: fullchain_execution
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/execution/progress-log.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
