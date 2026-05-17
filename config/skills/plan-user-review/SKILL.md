---
name: plan-user-review
description: >
  当执行计划制定完成、需要提交用户审批后方可动工时使用。
  这是动工前的硬性门控——未获用户确认不得启动执行。
  即使用户说"计划看起来不错"，也必须获得书面确认。
argument-hint: "[--interactive] <execution plan reference>"
level: 2
pipeline: [execution-planning, plan-user-review, fullchain-execution]
handoff-policy: approval-required
handoff: wiki/summaries/design/plan-approval.md
---

# 执行计划用户终审

<Purpose>
提交完整执行计划，确认流程、排期、范围符合用户预期。这是动工前的最后一道门——没有用户确认的计划就是一纸空文。未经审批就开工是项目失控的第一步。
</Purpose>

<HARD-GATE>
未获用户书面确认，不得启动任何执行任务。没有例外。
</HARD-GATE>

<Use_When>
- 执行计划已制定完成
- 需要用户确认后方可动工
- 关键里程碑需要用户认可
- 排期或范围需要用户决策
- 用户说"计划做好了，帮我看看"
</Use_When>

<Do_Not_Use_When>
- 用户已明确批准——直接进入 fullchain-execution
- 计划还在草拟中——回到 execution-planning
- 只是一个小改动不需要正式审批——常识判断即可
</Do_Not_Use_When>

<Why_This_Exists>
"我以为你想要这个"是项目失败的第二大原因。用户审批确保执行团队和用户对"做什么、什么时候做、做到什么程度"达成一致。跳过审批 = 赌上整个项目的方向。
</Why_This_Exists>

<Execution_Policy>
- 一次完整呈现：把计划一次性给用户看，不要挤牙膏
- 记录异议：用户的每一条意见都要记录，不要凭记忆
- 诚实评估：做不到的不要承诺，留有余地比过度承诺更负责任
- 书面确认是必要条件：口头说"可以"不够，必须有确认记录
</Execution_Policy>

<Steps>
1. **准备交付物**
   - 执行计划文档
   - 时间线 / 甘特图
   - 资源分配表
   - 风险说明

2. **用户评审**
   - 展示计划概览
   - 说明关键决策点
   - 收集反馈意见
   - 记录异议点

3. **决策处理**
   ```
   无异议 → 书面确认
   有异议 → 修改后复审
   无法满足 → 协商调整范围/排期
   ```

4. **确认记录**
   ```markdown
   ## 用户终审确认

   用户：[姓名]
   日期：[日期]
   结果：✅ 通过 / ❌ 有异议

   意见：
   - [意见1]

   签字/确认：[是/否]
   ```

5. **Wiki维护**
   - 创建 wiki/summaries/design/plan-approval.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/design/plan-approval.md
</Tool_Usage>

<Examples>
<Good>
完整的评审记录：
```
终审确认
用户：张三
日期：2026-05-16
结果：✅ 通过（有条件）

意见：
1. 排期可以，但第三阶段需要提前到D+7
2. 希望增加一个回滚方案

处理：
1. 已调整第三阶段排期
2. 已在执行计划中增加回滚方案章节

签字确认：是
```
Why good: 有意见、有处理、有确认。不是"看起来不错就行"。
</Good>

<Bad>
跳过评审：
"计划做完了，我觉得用户应该没问题，直接开始执行吧。"
Why bad: "我觉得"不是确认。没有用户确认就动工是违反硬性门控的。
</Bad>

<Bad>
没有记录异议：
"用户提了几个意见，我记住了，回头改一下。"
Why bad: 凭记忆处理意见必然遗漏。每条意见必须书面记录并逐条处理。
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 用户多次拒绝同一计划 → 可能需要回到 execution-planning 重新制定
- 用户要求缩小范围 → 回到 execution-planning 调整方案
- 用户无法参与评审 → 暂停，等待用户可用，不代为审批
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 执行计划完整呈现给用户
- [ ] 用户每条意见已记录
- [ ] 意见已逐条处理
- [ ] 书面确认已获得
- [ ] wiki/summaries/design/plan-approval.md 已创建
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## Wiki日志模板

```markdown
## [TIMESTAMP] plan-user-review | {level} level

**Type**: plan_user_review
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/design/plan-approval.md
- Updated wiki/index.md
```

## 配置

```json
{
  "pm": {
    "planUserReview": {
      "requireWrittenApproval": true,
      "allowVerbalApproval": false
    }
  }
}
```
</Advanced>

Task: {{ARGUMENTS}}
