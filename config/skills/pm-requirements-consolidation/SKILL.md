---
name: pm-requirements-consolidation
description: >
  当SubAgent分析完成、多路结果需要汇总合并时使用。涉及一致性检查、冲突解决、
  需求版本锁定等场景。即使用户没有说"汇总需求"，只要有多路分析结果需要收拢、
  需要统一术语、需要解决矛盾、需要锁定版本，就应触发。
argument-hint: "[--version <vX.X>] <consolidation scope>"
level: 2
pipeline: [pm-subagent-analysis, pm-requirements-consolidation, pm-execution-planning]
handoff-policy: approval-required
handoff: wiki/summaries/architecture/final.md
---

# 结果汇总定需求

<Purpose>
收拢各SubAgent分析成果，统一术语、解决冲突、敲定终版需求并锁定版本。锁定后变更走变更流程，不允许随意修改。汇总的核心是"消灭矛盾、统一认知"。
</Purpose>

<Use_When>
- SubAgent已产出结果，但分散在不同文档中
- 多路分析结论存在术语不一致或范围冲突
- 需求需要正式锁定以进入设计阶段
- "帮我汇总这些分析结果"
- "这些结论有矛盾，怎么统一？"
- 多路结论需收拢、需求需正式锁定
</Use_When>

<Do_Not_Use_When>
- SubAgent分析尚未完成（用 pm-subagent-analysis）
- 需求已锁定且无变更（用 pm-execution-planning）
- 只需要单路结果不需要汇总
</Do_Not_Use_When>

<Why_This_Exists>
多路分析必然产生矛盾——术语不一致、范围冲突、依赖歧义。不汇总就推进，等于带着矛盾上路，执行到一半才发现南辕北辙。锁定后的随意变更是范围蔓延的后门，必须走变更流程。
</Why_This_Exists>

<Execution_Policy>
- 逐一确认：不凭印象，逐一核对每个SubAgent的产出
- 冲突必须显式处理：不可回避、不可掩盖
- 术语统一后再锁定：术语歧义会导致后续执行走偏
- 锁定后走变更流程：不走捷径，这是硬性规则
</Execution_Policy>

<HARD-GATE>
需求锁定后，变更必须走变更流程，不允许直接修改终版需求。
</HARD-GATE>

<Steps>
1. **收集结果**
   - 逐一确认：每个SubAgent的产出是否完整
   - 格式统一：文档/代码/数据，统一整理
   - 状态标记：已完成 / 有问题 / 有冲突

2. **一致性检查**
   - 术语：相同概念是否一致命名
   - 边界：范围定义是否存在冲突
   - 依赖：模块间关系是否清晰无歧义

3. **冲突解决**
   - 优先级法：核心需求优先
   - 协商法：利益相关方协商取舍
   - 分层法：按业务层级决定
   - 原则：冲突必须显式处理，不可回避

4. **输出终版需求并锁定版本**
   - 版本号：v1.0
   - 状态：正式版
   - 锁定日期：[日期]
   - 后续变更 → 走变更流程，不走捷径

5. **Wiki维护**
   - 创建 wiki/summaries/requirements/final.md
   - 创建 wiki/summaries/requirements/conflicts.md
   - 创建 wiki/summaries/requirements/glossary.md（DEEP级别）
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/requirements/final.md, wiki/summaries/requirements/conflicts.md, wiki/summaries/requirements/glossary.md
</Tool_Usage>

<Examples>
<Good>
冲突显式记录并解决：
- QA说需要自动化测试，开发说手动测试够了
- 决策：采用自动化测试，因长期维护成本更低
- 记录：wiki/summaries/requirements/conflicts.md #C003
Why good: 冲突显式记录、有决策依据、可追溯
</Good>

<Bad>
冲突假装不存在，汇总时只取一方结论
Why bad: 矛盾不会自行消失，执行到一半会爆发
</Bad>

<Bad>
没有版本号就锁定
Why bad: 无版本号的锁定无法追溯变更，等于没有锁定
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 冲突无法解决 → 升级至决策者，记录分歧点
- 汇总暂缓 → 保留已汇总内容，标记未完成项
- SubAgent产出严重缺失 → 回退至 pm-subagent-analysis
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 所有SubAgent产出是否都已纳入？
- [ ] 术语是否统一？
- [ ] 范围是否一致？依赖是否清晰？
- [ ] 冲突是否全部解决并有记录？
- [ ] 终版需求是否有版本号和锁定日期？
- [ ] wiki/summaries/requirements/final.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/requirements/
├── final.md              # 终版需求文档
├── conflicts.md          # 冲突解决记录
└── glossary.md           # 术语词典（DEEP级别）
```

## 变更流程（JSON格式）

```json
{
  "change_request": {
    "id": "CR-001",
    "from_version": "v1.0",
    "description": "变更描述",
    "impact": "影响范围",
    "approver": "审批人",
    "status": "pending"
  }
}
```

## Wiki日志模板

```markdown
## [TIMESTAMP] pm-requirements-consolidation | {level} level

**Type**: requirements_consolidation
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/requirements/final.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
