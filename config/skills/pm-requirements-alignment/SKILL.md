---
name: pm-requirements-alignment
description: >
  当需求概要已出、需要与用户确认项目范围和目标时使用。涉及范围划定、In/Out Scope确认、
  多方需求协调等场景。即使用户没有说"对齐需求"，只要在讨论项目范围、确认做什么不做什么、
  划定业务边界、协调多方期望，就应触发。
argument-hint: "[--stakeholder <name>] <project brief or requirements summary>"
level: 1
pipeline: [pm-requirements-initial-review, pm-requirements-alignment, pm-main-agent-selection]
handoff-policy: approval-required
handoff: wiki/summaries/requirements/alignment.md
---

# 需求对齐确认

<Purpose>
与用户对齐项目目标，划定业务范围。核心是"明确做什么和不做什么"，避免范围蔓延。排除比纳入更重要，口头共识必须书面化。
</Purpose>

<Use_When>
- 需求概要完成了，但"到底做什么"还不清晰
- 多方对项目目标理解不一致
- 业务范围模糊，边界待定
- "这个功能做不做？"频繁出现
- 讨论项目范围、确认做什么不做什么
- 划定业务边界、协调多方期望
- "帮我确认一下范围"
</Use_When>

<Do_Not_Use_When>
- 需求概要还没做（回到 pm-requirements-initial-review）
- 已经在执行中（太晚了，用 pm-dynamic-monitoring）
- 正在做技术方案设计（用 pm-execution-planning）
- 需要深度拆解需求细节（用 pm-subagent-analysis）
</Do_Not_Use_When>

<Why_This_Exists>
范围蔓延是项目超期的第一大原因。明确排除项比纳入项更重要。没有对齐的需求会持续膨胀，最终导致项目失控。对齐确保所有干系人对"做什么"和"不做什么"达成书面共识。
</Why_This_Exists>

<Execution_Policy>
- 排除优先：Out of Scope 比 In Scope 更重要，防蔓延的关键
- 书面为王：口头共识必须文档化，无书面确认视为未对齐
- TBD有主：待定项必须指定负责人和截止日期
- 逐项对齐：每个范围条目不能存在两种解读
</Execution_Policy>

<HARD-GATE>
In/Out Scope 未获用户确认不得进入下一阶段。无书面确认的对齐等于未对齐。
</HARD-GATE>

<Steps>
1. **明确目标**
   - 用户期望的是什么？
   - 成功的判断标准是什么？
   - 核心价值交付是什么？

2. **划定 In/Out Scope**
   - In Scope：明确纳入（必须交付）
   - Out of Scope：明确排除（不做的事项）
   - TBD：待定项 → 必须指定负责人和截止日期
   - 原则：排除比纳入更重要

3. **关联模块**
   - 目标 → 涉及的功能模块
   - 模块间依赖关系
   - 影响范围评估

4. **获取用户书面确认**
   - 口头对齐 → 文档化 → 用户签字/邮件回复
   - 无书面确认 = 未对齐
   - 保留沟通记录作为依据

5. **Wiki维护**
   - 创建 wiki/summaries/requirements/alignment.md
   - 创建 wiki/summaries/requirements/scope.md
   - 创建 wiki/summaries/requirements/stakeholder-signoff.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/requirements/alignment.md, wiki/summaries/requirements/scope.md, wiki/summaries/requirements/stakeholder-signoff.md
</Tool_Usage>

<Examples>
<Good>
明确排除"不做国际化、不做移动端"的对齐确认书
- In Scope: PC端核心交易流程、微信支付
- Out of Scope: 国际化、移动端、邮件通知
- TBD: 是否支持支付宝 → 负责人:张三, 截止:5月20日
- 用户邮件回复确认
Why good: 排除项明确、TBD有负责人和截止日、有书面确认
</Good>

<Bad>
"什么都做"的范围界定
Why bad: 没有排除项=什么都做=范围必然蔓延
</Bad>

<Bad>
口头对齐后就推进，没有书面确认
Why bad: 口头共识无法追溯，后续理解偏差无人负责
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 干系人无法达成一致 → 升级至决策者，记录分歧点
- 范围争议无法解决 → 升级至决策者仲裁
- 项目暂缓 → 记录到项目记忆，保留已对齐内容
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 项目目标是否一句话能说清？
- [ ] In/Out Scope 是否均有明确项？
- [ ] 每个范围条目是否不存在两种解读？
- [ ] TBD 是否都有负责人和截止日期？
- [ ] 是否获得用户书面确认（邮件/签署）？
- [ ] wiki/summaries/requirements/alignment.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/requirements/
├── alignment.md           # 需求对齐确认书
├── scope.md               # 范围界定文档
└── stakeholder-signoff.md # 干系人签署记录
```

## 状态文件（JSON格式）

```json
{
  "skill": "pm-requirements-alignment",
  "status": "completed",
  "level": "STANDARD",
  "output": "wiki/summaries/requirements/alignment.md",
  "gate_passed": true,
  "next": "pm-main-agent-selection"
}
```

## Wiki日志模板

```markdown
## [TIMESTAMP] pm-requirements-alignment | {level} level

**Type**: requirements_alignment
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/requirements/alignment.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
