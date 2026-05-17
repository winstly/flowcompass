---
name: pm-qa-closure-documentation
description: >
  当双QA质检完成、需要闭环处理问题并输出准出报告时使用。涉及整改执行、验证确认、
  准出判断等场景。即使用户没有说"闭环处理"，只要QA发现问题需要整改、需要判断
  是否可以准出交付，就应触发。QA发现问题不等于结束——必须闭环。
argument-hint: "[--strict] <QA report reference>"
level: 3
pipeline: [pm-dual-qa-review, pm-qa-closure-documentation, pm-user-acceptance]
handoff-policy: auto
handoff: wiki/summaries/quality/delivery.md
---

# 质检闭环输出文档

<Purpose>
梳理质检发现的问题，执行整改，验证修复，输出准出报告。质检发现问题不等于结束——问题必须被修复并验证，才算闭环。未闭环的QA报告等于没有QA。
</Purpose>

<Use_When>
- 双QA完成需闭环
- 需判断是否可准出交付
- QA发现问题需要整改
- "QA发现问题了，怎么处理？"
- "帮我闭环这些问题"
- 需要判断项目是否可以准出交付
</Use_When>

<Do_Not_Use_When>
- QA质检尚未完成（用 pm-dual-qa-review）
- 准出报告已签署（用 pm-user-acceptance）
- 只需要查看QA结果不需要处理
</Do_Not_Use_When>

<Why_This_Exists>
QA发现问题不是终点，闭环才是。未修复的Critical问题直接准出等于没有QA。修复但不验证等于没有修复。准出是严格判断，不是弹性协商。
</Why_This_Exists>

<Execution_Policy>
- Critical零容忍：Critical问题未修复并验证不得准出
- 修复+验证才是闭环：只修不验等于没有闭环
- 问题全记录：Minor问题也要记录在案，不留盲区
- 准出是严格判断：不是弹性协商，不是"差不多就行"
</Execution_Policy>

<HARD-GATE>
Critical问题未修复并验证不得准出。准出是严格判断，不是弹性协商。
</HARD-GATE>

<Steps>
1. **梳理QA问题**
   - 类型分类：功能 / 逻辑 / 代码 / 文档
   - 优先级：Critical（必须修）/ Major（应该修）/ Minor（建议修）
   - 责任人：每个问题明确负责人

2. **分配修复责任人**
   - Critical → 必须修复 → 修复后重测
   - Major → 应该修复 → 视情况决定
   - Minor → 建议修复 → 记录在案

3. **执行整改与验证**
   - 修复 → 验证 → 通过 → 关闭
   - 修复 → 验证 → 失败 → 回退重修
   - 未关闭 = 未解决 = 不闭环

4. **准出判断**
   - 所有Critical已修复并验证 → 准出
   - 存在未关闭的Critical → 不准出
   - 原则：准出是严格判断，不是弹性协商

5. **输出准出报告**
   - 创建 wiki/summaries/quality/rectification.md
   - 创建 wiki/summaries/quality/delivery.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/quality/rectification.md, wiki/summaries/quality/delivery.md
</Tool_Usage>

<Examples>
<Good>
QA发现Critical问题：订单金额计算错误
→ 分配修复责任人：开发张三
→ 修复：修正计算逻辑
→ 验证：跑通所有金额测试用例
→ 关闭：问题已修复并验证
→ 准出判断：所有Critical已关闭 → 准出
Why good: 完整的修复+验证+闭环链，Critical零容忍
</Good>

<Bad>
Critical问题标记为"已知问题"就直接准出
Why bad: Critical不修复就准出等于没有QA
</Bad>

<Bad>
修复了但没有验证就直接关闭
Why bad: 只修不验等于没有闭环
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- Critical问题无法修复 → 升级评估是否调整需求或降级
- 闭环中止 → 保留已修复内容和未关闭问题清单
- 多个Critical问题修复后验证反复失败 → 评估是否回退到执行阶段
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 所有问题是否都有闭环状态（修复+验证+关闭）？
- [ ] 修复验证是否真实有效？
- [ ] 每个问题是否有修复记录+验证记录？
- [ ] Critical问题是否全部关闭？
- [ ] 准出报告是否有签署？
- [ ] wiki/summaries/quality/delivery.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/quality/
├── rectification.md       # 整改文档
└── delivery.md            # 项目准出交付报告
```

## 问题闭环记录模板（JSON格式）

```json
{
  "issue_id": "QA-001",
  "severity": "Critical",
  "description": "订单金额计算错误",
  "owner": "开发张三",
  "fix_description": "修正计算逻辑",
  "verification": "跑通所有金额测试用例",
  "status": "closed",
  "closed_at": "2026-05-16T14:00:00Z"
}
```

## Wiki日志模板

```markdown
## [TIMESTAMP] pm-qa-closure-documentation | {level} level

**Type**: qa_closure_documentation
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/quality/rectification.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
