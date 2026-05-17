---
name: requirements-initial-review
description: >
  当收到新业务需求、用户口头提功能想法、需求文档太模糊、或需要对需求做初步评估时使用。
  需求初审是需求分析阶段的第一步，确保原始需求被结构化理解。
  即使用户只是随口提了一句需求，也应触发此技能进行初步梳理。
argument-hint: "[--source <来源>] <需求描述>"
level: 1
pipeline: [structural-decomposition, requirements-initial-review, requirements-alignment]
handoff-policy: auto
handoff: wiki/summaries/requirements/summary.md
---

# 需求接入初审

<Purpose>
接收业务需求，用金字塔思想完成概要梳理与浅层逻辑分析。目标不是深入细节，而是搞清楚"需求在说什么"。初审是整个需求流的第一道关卡，确保在深入之前先理解需求本身。
</Purpose>

<Use_When>
- 收到新的业务需求
- 用户口头提了一个功能想法
- 需求文档太模糊，需要初步梳理
- "这个需求到底要什么？"
- "帮我初步评估一下这个需求"
- 需求初步评估、快速判断需求方向
</Use_When>

<Do_Not_Use_When>
- 需求已经过深度分析和确认（用 requirements-alignment）
- 正在做技术方案设计（用 execution-planning）
- 正在划定业务范围与In/Out Scope（用 requirements-alignment）
</Do_Not_Use_When>

<Why_This_Exists>
不清楚的需求是项目失败的第一大原因。初审确保在深入之前先理解需求在说什么。没有初审，后续所有分析和执行都建立在模糊甚至错误的理解之上，返工成本指数级增长。
</Why_This_Exists>

<Execution_Policy>
- 金字塔优先：目标→功能→细节，先搞清Why再搞清What最后看How
- 不做假设：未确认项标注[CONF:LOW]，不把假设当确认
- 保留溯源：记录需求来源和原始表述，确保可追溯
- 浅层即可：不深入技术细节，不设计方案，只做概要梳理
</Execution_Policy>

<Steps>
1. **接收原始需求**
   - 记录来源：用户对话 / PRD文档 / 邮件
   - 保留原始表述，不做转译或润色
   - 评估复杂度：QUICK(3-5问) / STANDARD(5-8问) / DEEP(8+问)

2. **金字塔梳理**
   - 顶层（Why）：核心业务目标——需求要解决什么问题
   - 中层（What）：关键功能点——需要做什么
   - 底层（How）：具体细节——初步实现思路（仅标注，不深入）

3. **浅层分析**
   - 完整性：需求是否有明显缺失
   - 矛盾性：是否存在自相矛盾
   - 依赖性：是否依赖外部系统/模块
   - 可行性：初步评估实现难度

4. **输出需求概要**
   - 写入 wiki/summaries/requirements/summary.md
   - 包含：来源、核心目标、关键功能、依赖关系、初步评估
   - 未确认项标注 [CONF:LOW]

5. **Wiki维护**
   - 创建 wiki/summaries/requirements/summary.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/requirements/summary.md
</Tool_Usage>

<Examples>
<Good>
需求："电商系统需要支持多种支付方式"
金字塔拆解：
- Why：统一支付入口，提升用户支付转化率
- What：微信支付、支付宝、银行卡
- How：回调处理、对账机制
- 依赖：支付网关、银行接口
- 可行性：高，成熟方案
Why good: 从目标到功能到细节逐层拆解，未深入技术实现，保留了溯源
</Good>

<Bad>
直接列出技术实现："需要集成微信支付SDK和支付宝SDK"
Why bad: 跳过了金字塔梳理，直接进入技术细节，没有搞清楚业务目标
</Bad>

<Bad>
跳过初审直接进入需求对齐
Why bad: 对齐需要以概要为基础，没有概要的对齐是空中楼阁
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 需求信息严重不足，无法完成概要梳理 → 升级至用户补充
- 需求涉及多个不相关业务域 → 拆分为多个需求分别初审
- 需求明确撤销 → 记录到项目记忆，停止处理
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 需求来源是否记录？
- [ ] 金字塔三层（Why/What/How）是否完整？
- [ ] 未确认项是否标注 [CONF:LOW]？
- [ ] 浅层分析四个维度是否都覆盖？
- [ ] wiki/summaries/requirements/summary.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出模板（Markdown格式）

```markdown
# 需求概要

## 来源
[需求来源]

## 核心目标
[一句话业务目标]

## 关键功能
- [功能1]
- [功能2]

## 依赖关系
[识别的依赖]

## 初步评估
- 完整性：完整 / 有缺失
- 可行性：高 / 中 / 低
- 优先级：P0 / P1 / P2
```

## 状态文件（JSON格式）

```json
{
  "skill": "requirements-initial-review",
  "status": "completed",
  "complexity": "STANDARD",
  "output": "wiki/summaries/requirements/summary.md",
  "confidence": "HIGH",
  "next": "requirements-alignment"
}
```

## Wiki日志模板

```markdown
## [TIMESTAMP] requirements-initial-review | {level} level

**Type**: requirement_initial_review
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/requirements/summary.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
