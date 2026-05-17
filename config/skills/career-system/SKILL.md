---
name: career-system
description: >
  Agent 职业发展——晋升、淘汰、经验包打包与加载。
  retrospective 阶段使用，在 evaluation-system 之后执行。
argument-hint: "[--action <promote|demote|archive>] [--agent <codename>]"
level: 2
pipeline: [evaluation-system, career-system, structural-decomposition]
handoff-policy: auto
handoff: wiki/summaries/closure/career-report.md
---

# 职业发展系统

<Purpose>
在绩效评估之后处理 Agent 的职业发展：晋升、降级、淘汰，以及经验包的打包和加载。确保人才池越积越厚，组织能力持续提升。
</Purpose>

<Use_When>
- 绩效评估完成后，需要处理晋升/淘汰
- 需要为降级 Agent 打包经验包
- 需要为新 Agent 加载历史经验
- 需要查看人才池积累情况
</Use_When>

<Do_Not_Use_When>
- 绩效评估还没完成——先用 evaluation-system
- 需要招募新 Agent——用 roster-management
- 需要定义军衔体系——用 org-charter
</Do_Not_Use_When>

<Why_This_Exists>
评估只是发现问题，职业发展才是解决问题。晋升激励优秀 Agent，淘汰清理低效 Agent，经验包确保知识不流失。人才池越积越厚，团队越打越强。
</Why_This_Exists>

<Execution_Policy>
- 晋升必须满足量化条件，不能凭印象
- 淘汰前必须打包经验包，知识不能丢
- 经验包加载时按兵种匹配
- 人才池定期整理，去除过期数据
</Execution_Policy>

<HARD-GATE>
必须根据 evaluation-report.md 的评估结果处理每个 Agent 的职业发展，不得跳过。
</HARD-GATE>

<Steps>
1. **读取评估结果**
   - 读取 `.knowledge/wiki/summaries/closure/evaluation-report.md` 获取评估结果
   - 读取 `.knowledge/org/roster.json` 获取 Agent 当前状态

2. **处理晋升**
   对每个评估结果中"进入人才池"的 Agent：
   - 检查晋升条件（累计任务数、平均评分）
   - 如果满足条件，更新军衔
   - 更新 roster.json 中的军衔和评分记录

3. **处理降级**
   对每个评估结果中"降级预警"的 Agent：
   - 执行降级（军衔降 1 级）
   - 更新 roster.json
   - 记录降级原因

4. **处理淘汰**
   对每个评估结果中"淘汰"的 Agent：
   - 打包经验包（ strengths、weaknesses、lessons_learned、code_patterns）
   - 保存到 `.knowledge/org/experience-packs/`
   - 从 roster.json 的在职列表中移除
   - 记录淘汰原因

5. **更新人才池**
   - 将评分 >= 75 的 Agent 加入 talent_pool
   - 更新 roster.json 中的人才池数据

6. **生成职业报告**
   - 创建 wiki/summaries/closure/career-report.md
   - 包含晋升、降级、淘汰统计
</Steps>

<Tool_Usage>
- 读取工具：Read evaluation-report.md, roster.json
- 写入工具：Write / Edit roster.json, career-report.md, experience-packs/
- 产出路径：wiki/summaries/closure/career-report.md
</Tool_Usage>

<Examples>
<Good>
职业发展处理：
1. 读取 evaluation-report.md → 发现 3 个 Agent 需要处理
2. 处理晋升：
   - backend-architect: 总分91, 累计任务5 → 满足晋升条件 → 晋升为排长
3. 处理降级：
   - data-engineer: 总分61, 连续2次<60 → 降级为列兵
4. 处理淘汰：
   - 无淘汰
5. 更新 roster.json
6. 生成 career-report.md
Why good: 基于评估结果处理，有明确的晋升/降级/淘汰决策
</Good>

<Bad>
不读取 evaluation-report.md，直接跳过职业发展处理
Why bad: 评估结果没有落地，Agent 管理失去闭环
</Bad>
</Examples>

<Final_Checklist>
- [ ] 是否读取了 evaluation-report.md？
- [ ] 是否对每个 Agent 执行了相应的晋升/降级/淘汰？
- [ ] 淘汰前是否打包了经验包？
- [ ] roster.json 是否已更新？
- [ ] career-report.md 是否已生成？
</Final_Checklist>

Task: {{ARGUMENTS}}
