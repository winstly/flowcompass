---
name: user-acceptance
description: >
  当准出报告已完成、需要交付用户最终验收时使用。涉及交付演示、用户测试、问题记录、
  验收签署等场景。即使用户没有说"验收"，只要准出后需要交付用户确认、需要用户
  最终签字，就应触发。准出后必须经过用户验收，签署是必要条件。
argument-hint: "[--demo] <delivery report reference>"
level: 3
pipeline: [qa-closure-documentation, user-acceptance, project-closure-iteration]
handoff-policy: approval-required
handoff: wiki/summaries/closure/acceptance.md
---

# 最终用户正式验收

<Purpose>
交付完整成果与资料，完成用户最终验收与签字确认。用户签署是项目交付的正式闭环标志，不是走过场。没有签署的验收等于没有验收。
</Purpose>

<Use_When>
- 准出报告已签署、需用户最终验收
- 准备正式交付
- 需要用户签字确认项目完成
- "帮我安排验收"
- "交付物准备好了，需要用户确认"
</Use_When>

<Do_Not_Use_When>
- 准出报告尚未完成（用 qa-closure-documentation）
- 用户已签署验收（用 project-closure-iteration）
- 只需要内部测试不需要用户参与
</Do_Not_Use_When>

<Why_This_Exists>
用户签署是项目交付的正式闭环标志，不是走过场。没有签署的验收等于没有验收——只有"签署"和"未签署"，没有"差不多"。验收标准必须与需求对齐，否则验收维度缺失。
</Why_This_Exists>

<Execution_Policy>
- 提前对齐标准：验收前与用户确认标准，避免验收时扯皮
- 逐项确认：交付物清单逐项确认，不遗漏
- 签署为王：只有签署和未签署，没有"差不多"
- 维度全覆盖：功能验收+文档验收+培训验收
</Execution_Policy>

<HARD-GATE>
用户签署是交付的必要闭环条件。无签署 = 未验收。
</HARD-GATE>

<Steps>
1. **交付准备**
   - 交付物清单确认
   - 验收标准提前与用户对齐
   - 测试环境就绪
   - 支持人员到位
   - 原则：不打无准备之仗

2. **对齐验收标准**
   - 功能验收：对照需求逐项检查
   - 文档验收：配套文档是否齐全
   - 培训验收：用户是否掌握使用方式
   - 原则：验收维度必须与需求对齐

3. **交付演示**
   - 向用户演示核心功能
   - 按验收标准逐项展示
   - 记录用户反馈

4. **用户测试与问题记录**
   - 用户测试 → 问题记录 → 修复确认
   - 每个问题必须有记录、有处理、有结论

5. **获取签署**
   - 通过验收 → 签署确认
   - 有条件通过 → 满足指定条件后签署
   - 未通过 → 返工后重新验收
   - 创建 wiki/summaries/closure/acceptance.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/closure/acceptance.md
</Tool_Usage>

<Examples>
<Good>
验收流程：
1. 交付物清单逐项确认（功能、文档、培训材料）
2. 验收标准提前与用户对齐
3. 用户测试发现2个Minor问题 → 记录并修复
4. 用户签署验收确认
Why good: 提前对齐标准、问题有记录有处理、有签署闭环
</Good>

<Bad>
验收时才发现用户期望的功能没做
Why bad: 没有提前对齐验收标准，验收变成扯皮
</Bad>

<Bad>
"差不多"就算通过，没有签署
Why bad: 没有签署的验收等于没有验收
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 验收问题无法解决 → 升级评估，或返工后重新验收
- 验收中止 → 保留已验收内容和未解决问题，记录中止原因
- 用户拒绝验收 → 记录拒绝原因，评估是否需要回退
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 所有需求项是否都有验收结论？
- [ ] 交付物清单是否逐项确认？
- [ ] 验收标准是否与需求对齐？
- [ ] 用户是否已签署确认？
- [ ] 问题是否有处理记录？
- [ ] wiki/summaries/closure/acceptance.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/closure/
└── acceptance.md          # 用户验收确认书
```

## 验收结论类型

```
通过验收 → 签署确认
有条件通过 → 满足指定条件后签署
未通过 → 返工后重新验收
原则：只有"签署"和"未签署"，没有"差不多"
```

## Wiki日志模板

```markdown
## [TIMESTAMP] user-acceptance | {level} level

**Type**: user_acceptance
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/closure/acceptance.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
