---
name: evaluation-system
description: >
  Agent 绩效评估——四维度评分、薪资联动、趋势计算、去留决策。
  retrospective 阶段使用。
argument-hint: "[--agent <codename>] [--task <task-id>]"
level: 2
pipeline: [user-acceptance, evaluation-system, career-system]
handoff-policy: auto
handoff: wiki/summaries/closure/evaluation-report.md
---

# 绩效评估系统

<Purpose>
在任务完成后对参与 Agent 进行四维度绩效评估。评估结果驱动薪资调整、晋升决策和人才池管理。评估是客观的、数据驱动的，不是主观印象。
</Purpose>

<Use_When>
- 任务完成，需要评估参与 Agent
- 需要决定 Agent 去留
- 需要调整 Agent 薪资
- 需要查看 Agent 历史表现趋势
</Use_When>

<Do_Not_Use_When>
- 任务还在执行中——等任务完成
- 需要管理 Agent 生命周期——用 roster-management
- 需要处理晋升/淘汰——用 career-system
</Do_Not_Use_When>

<Why_This_Exists>
没有评估的管理是盲目的。四维度评分让 Agent 的表现可量化、可比较、可追溯。评估结果直接影响去留和晋升，确保团队质量持续提升。
</Why_This_Exists>

<Execution_Policy>
- 评估必须基于事实数据，不能凭印象
- 四维度权重固定：质量 40% / 速度 20% / 资源 20% / 协作 20%
- 评估结果写入 Agent 档案
- 评估完成后自动触发 career-system
</Execution_Policy>

<HARD-GATE>
必须对 team-board.md 中参与任务的每个 Agent 进行评估，不得跳过。
</HARD-GATE>

<Steps>
1. **读取参与 Agent 列表和执行数据**
   - 读取 `.knowledge/org/team-board.md` 获取本次任务参与的 Agent 列表
   - 读取 `.knowledge/org/agent-performance.json` 获取每个 Agent 的执行数据（任务完成数、问题数、阻塞次数、响应质量）
   - 读取 `.knowledge/wiki/summaries/execution/progress-log.md` 获取执行记录
   - 读取 `.knowledge/wiki/summaries/quality/` 获取质量检查结果

2. **逐个评估 Agent 绩效**
   对每个参与的 Agent：
   - 评估质量维度（40%）：代码正确性、Review 通过率、Bug 数量
   - 评估速度维度（20%）：是否按时交付、延期比例
   - 评估资源维度（20%）：Token 消耗、资源效率
   - 评估协作维度（20%）：响应速度、沟通质量、补位意愿

3. **计算总分和趋势**
   - 总分 = 质量×0.4 + 速度×0.2 + 资源×0.2 + 协作×0.2
   - 趋势 = (本次评分 - 历史平均分) / 历史平均分 × 100%

4. **决定去留**
   - 总分 >= 75 → 进入人才池
   - 总分 60-74 → 继续在职，观察下个任务
   - 总分 40-59 → 降级 + 预警
   - 总分 < 40 → 打包经验包 → 淘汰

5. **更新 Agent 档案**
   - 读取 `.knowledge/org/roster.json`
   - 更新每个 Agent 的评分记录和趋势
   - 写回 roster.json

6. **生成评估报告**
   - 创建 wiki/summaries/closure/evaluation-report.md
   - 包含每个 Agent 的详细评分和去留决策
</Steps>

<Tool_Usage>
- 读取工具：Read team-board.md, progress-log.md, roster.json
- 写入工具：Write / Edit evaluation-report.md, roster.json
- 产出路径：wiki/summaries/closure/evaluation-report.md
</Tool_Usage>

<Examples>
<Good>
评估过程：
1. 读取 team-board.md → 发现 3 个 Agent 参与任务
2. 逐个评估：
   - backend-architect: 质量95, 速度90, 资源85, 协作90 → 总分91 → 人才池
   - frontend-developer: 质量80, 速度75, 资源80, 协作85 → 总分80 → 人才池
   - data-engineer: 质量60, 速度50, 资源70, 协作65 → 总分61 → 观察
3. 更新 roster.json
4. 生成 evaluation-report.md
Why good: 基于实际执行数据评估，有明确的去留决策
</Good>

<Bad>
不读取 team-board.md，直接跳过评估
Why bad: 没有评估就无法改进，Agent 管理失去依据
</Bad>
</Examples>

<Final_Checklist>
- [ ] 是否读取了 team-board.md？
- [ ] 是否对每个参与 Agent 进行了评估？
- [ ] 四维度权重是否正确（40/20/20/20）？
- [ ] 评分是否基于事实数据？
- [ ] 去留决策是否明确？
- [ ] roster.json 是否已更新？
- [ ] evaluation-report.md 是否已生成？
</Final_Checklist>

Task: {{ARGUMENTS}}
