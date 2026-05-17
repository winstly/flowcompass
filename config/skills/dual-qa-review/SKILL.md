---
name: dual-qa-review
description: >
  当自检通过、交付物需要专业质检时使用。双QA独立交叉审核，从业务和技术两个视角
  排查漏洞。即使用户没有说"双QA"，只要交付物需要质量把关、需要专业质检、
  需要多视角审查确保无盲区，就应触发双QA。
argument-hint: "[--focus <area>] <self-check approved deliverables>"
level: 3
pipeline: [visual-verification, dual-qa-review, qa-closure-documentation]
handoff-policy: auto
handoff: wiki/summaries/quality/qa-report.md
---

# 双QA交叉质检

<Purpose>
触发双岗位QA独立审核，双向排查漏洞。核心机制是"独立"——两个QA不相互参考，从不同视角检查，确保单一视角的盲区被覆盖。独立是双QA的核心价值，一旦QA之间相互参考，就退化为单QA。
</Purpose>

<Use_When>
- 自检通过需专业质检
- 需多视角检查无盲区
- 进入正式验收前
- "帮我做一下质检"
- "需要从不同角度检查一下"
- 交付物需要质量把关
</Use_When>

<Do_Not_Use_When>
- 自检尚未通过（用 internal-self-check）
- 质检已完成需要闭环（用 qa-closure-documentation）
- 只需要单一视角的快速检查（不适用双QA机制）
</Do_Not_Use_When>

<Why_This_Exists>
单一视角的质检存在盲区——业务视角看不到技术风险，技术视角看不到业务逻辑漏洞。双QA独立审核确保盲区被覆盖。一旦QA之间相互参考，就退化为单QA，双QA机制失效。
</Why_This_Exists>

<Execution_Policy>
- 独立是核心：两个QA必须独立检查，不参考对方结果
- 视角分明：QA-A业务视角，QA-B技术视角，不可混同
- 问题分级：Critical/Major/Minor必须标注，驱动后续处理
- 可复现：每个问题必须有具体描述和复现条件
</Execution_Policy>

<Steps>
1. **准备交付物清单**
   - 明确检查范围和交付物清单
   - 准备需求规格作为检查基准

2. **分配QA-A（业务）和QA-B（技术）并注册到团队看板**
   - QA-A：功能 / 业务视角（用户能用吗？逻辑对吗？）
   - QA-B：技术 / 质量视角（代码好吗？安全吗？性能行吗？）
   - **将 QA-A 和 QA-B 写入 `.knowledge/org/team-board.md`**，角色分别为 `sniper-qa-a` 和 `sniper-qa-b`，负责任务为"业务质检"和"技术质检"，状态为"就绪"
   - 原则：QA Agent 必须在 team-board 中注册，否则 evaluation-system 无法评估其绩效

3. **两个QA独立检查**
   - 两个QA必须独立检查，不参考对方结果
   - 维度不同，盲区互补
   - 一旦相互参考 → 退化为单QA → 双QA机制失效

4. **汇总问题按严重度排序**
   - Critical：阻塞性问题，必须修复
   - Major：重要问题，应该修复
   - Minor：轻微问题，建议修复
   - 去重与排序

5. **输出质检报告**
   - 写入 wiki/summaries/quality/qa-report.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/quality/qa-report.md
</Tool_Usage>

<Examples>
<Good>
QA-A发现业务逻辑漏洞：订单取消后库存未回滚
QA-B发现SQL注入风险：查询参数未做参数化
两个问题互补无盲区，分别记录在各自审核报告中
Why good: 两个QA从不同视角发现不同类型问题，独立检查价值体现
</Good>

<Bad>
QA-A看了QA-B的检查结果再检查
Why bad: 相互参考导致视角趋同，退化为单QA，双QA机制失效
</Bad>

<Bad>
问题不分级，所有问题混在一起
Why bad: 没有分级就无法驱动后续处理优先级
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- QA资源不可用 → 协调QA资源，或降级为单QA+自检补充
- 质检中止 → 保留已完成审核内容，标记未完成项
- 发现严重安全漏洞 → 立即升级至安全团队
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 两个QA是否真正独立检查？有无信息共享？
- [ ] QA-A是否覆盖所有业务维度？
- [ ] QA-B是否覆盖所有技术维度？
- [ ] 每个问题是否有具体描述和复现条件？
- [ ] 问题是否按Critical/Major/Minor分级？
- [ ] wiki/summaries/quality/qa-report.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/quality/
└── qa-report.md           # 双QA质检报告
```

## 检查维度矩阵

| 维度 | QA-A | QA-B |
|---|---|---|
| 功能正确性 | 检查 | |
| 业务逻辑 | 检查 | |
| 代码质量 | | 检查 |
| 性能安全 | | 检查 |
| 文档完整性 | | 检查 |

## Wiki日志模板

```markdown
## [TIMESTAMP] dual-qa-review | {level} level

**Type**: dual_qa_review
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/quality/qa-report.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
