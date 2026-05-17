---
name: pm-execution-planning
description: >
  当需求已锁定、需要制定可落地的执行方案时使用。方案即设计——输出设计文档与执行计划，
  两者合一。即使用户没有说"制定执行方案"，只要涉及"怎么做""排期""任务拆分"、
  "如何落地""执行计划"，就应触发。
argument-hint: "[--buffer <percent>] <locked requirements reference>"
level: 2
pipeline: [pm-requirements-consolidation, pm-execution-planning, pm-plan-user-review]
handoff-policy: auto
handoff: wiki/summaries/design/execution-plan.md
---

# 统筹制定执行方案

<Purpose>
同步需求结论至对应Agent，编制可落地执行计划。"方案即设计"——设计文档与执行计划合二为一，避免设计与执行脱节。没有可执行计划的方案不是方案。
</Purpose>

<Use_When>
- 需求已锁定，但"怎么做"还不清晰
- 需要将需求转化为可执行的任务和时间表
- 涉及多个Agent和阶段，需要统筹安排
- "帮我排个计划"
- "这些需求怎么落地？"
- 涉及"怎么做""排期""任务拆分"
</Use_When>

<Do_Not_Use_When>
- 需求尚未锁定（用 pm-requirements-consolidation）
- 已在执行阶段（用 pm-dynamic-monitoring）
- 只需要对计划审批（用 pm-plan-user-review）
</Do_Not_Use_When>

<Why_This_Exists>
设计与执行脱节是项目交付失败的常见原因。设计文档写完没人看，执行时另起炉灶。"方案即设计"将两者合一，确保方案本身就是可执行的。没有Buffer的计划是理想主义的陷阱。
</Why_This_Exists>

<Execution_Policy>
- 方案即设计：设计文档与执行计划合一，不做分离的文档
- 留Buffer：10-20%弹性时间，假设会有意外
- 粒度统一：任务粒度1-3天，可独立执行可验证
- 依赖显式：明确前置任务，画依赖图
- 里程碑可验证：每个阶段必须有可验证的交付物
</Execution_Policy>

<Steps>
1. **分析需求确定实现路径**
   - 输入：终版需求
   - 输出：设计文档 + 执行计划（合一）
   - 原则：方案即设计——不做设计与执行分离的文档

2. **划分阶段定义里程碑**
   - 阶段 → 关键里程碑 → 截止日期
   - 每个阶段必须有可验证的交付物

3. **拆分任务分配执行者**
   - 任务 → 执行者 → 依赖关系 → 截止日期
   - 优先级：P0 / P1 / P2
   - 粒度：1-3天为一个任务单元
   - 原则：可独立执行、可独立验证

4. **明确依赖与时间表留Buffer**
   - 资源：Agent能力匹配，任务并行度
   - 风险：识别关键路径上的风险点，准备应对策略
   - Buffer：留10-20%弹性时间

5. **输出设计+执行计划**
   - 写入 wiki/summaries/design/design.md（设计文档）
   - 写入 wiki/summaries/design/execution-plan.md（执行计划）

6. **Wiki维护**
   - 创建 wiki/summaries/design/design.md
   - 创建 wiki/summaries/design/execution-plan.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/design/design.md, wiki/summaries/design/execution-plan.md
</Tool_Usage>

<Examples>
<Good>
任务粒度1-3天、有Buffer、依赖关系明确
- 阶段1（5天）：基础框架搭建 → 里程碑：框架可运行
  - 任务1.1：数据库设计（1天，P0，无依赖）→ executor(sonnet)
  - 任务1.2：API框架搭建（2天，P0，依赖1.1）→ executor(sonnet)
  - Buffer：1天
Why good: 任务粒度合适、有Buffer、依赖清晰、有里程碑
</Good>

<Bad>
计划排满无Buffer
Why bad: 假设没有意外是理想主义，稍有偏差就全盘延误
</Bad>

<Bad>
依赖关系缺失
Why bad: 不明确的依赖导致并行执行出错
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 资源不足或需求有歧义 → 回溯至 pm-requirements-consolidation 或升级
- 规划暂缓 → 保留已规划内容，记录待决项
- 关键路径风险过高 → 评估是否调整需求或增加资源
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 所有需求项是否都有对应任务？
- [ ] 任务粒度是否1-3天可完成？
- [ ] 依赖关系是否明确？
- [ ] 是否留了10-20% Buffer？
- [ ] 每个阶段是否有可验证的里程碑？
- [ ] 风险是否有应对策略？
- [ ] wiki/summaries/design/execution-plan.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/design/
├── design.md              # 设计文档
└── execution-plan.md      # 执行计划
```

## 状态文件（JSON格式）

```json
{
  "skill": "pm-execution-planning",
  "status": "completed",
  "level": "STANDARD",
  "output": "wiki/summaries/design/execution-plan.md",
  "buffer_percent": 15,
  "next": "pm-plan-user-review"
}
```

## Wiki日志模板

```markdown
## [TIMESTAMP] pm-execution-planning | {level} level

**Type**: execution_planning
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/design/design.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
