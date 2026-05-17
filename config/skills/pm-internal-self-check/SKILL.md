---
name: pm-internal-self-check
description: >
  当子任务执行完成、交付物需要团队内部自检时使用。涉及功能完整性检查、逻辑正确性验证、
  自检报告输出等场景。即使用户没有说"自检"，只要交付物完成、需要内部质量验证、
  进入QA前需要把关，就应触发。任何交付物在进入QA前都必须经过自检。
argument-hint: "[--strict] <deliverables reference>"
level: 3
pipeline: [pm-dynamic-monitoring, pm-internal-self-check, pm-visual-verification]
handoff-policy: auto
handoff: wiki/summaries/execution/self-review.md
---

# 成果内部自检

<Purpose>
执行团队自行完成功能、逻辑、流程全维度校验。自检是QA前的最后一道防线——自检不通过的交付物不应进入质检环节。自检流于形式等于没有自检。
</Purpose>

<Use_When>
- 子任务完成需自检
- 交付物待检验
- 进入QA前需要内部把关
- "帮我检查一下这个交付物"
- "开发做完了，先自查一下"
</Use_When>

<Do_Not_Use_When>
- 任务尚未执行完成（用 pm-fullchain-execution）
- 需要专业QA质检（用 pm-dual-qa-review）
- 只需要查看进度不需要检验（用 pm-dynamic-monitoring）
</Do_Not_Use_When>

<Why_This_Exists>
自检是QA前的最后一道防线。自检不通过的交付物进入QA，浪费QA时间且无法通过。自检流于形式等于没有自检——逐项检查、有记录有结论，不是打勾走过场。
</Why_This_Exists>

<Execution_Policy>
- 四维覆盖：功能+逻辑+边界+文档，不漏维度不留死角
- 逐项检查：有记录有结论，不是打勾走过场
- P0零容忍：P0问题未修复不得提交QA
- 修复必复检：修复P0后必须重新自检，不能只修不复检
</Execution_Policy>

<HARD-GATE>
P0问题未修复不得提交QA。自检不通过 = 不进入QA。
</HARD-GATE>

<Steps>
1. **确定自检范围**
   - 明确需要自检的交付物
   - 对照需求规格确定检查维度
   - 准备自检清单

2. **执行自检清单**
   - 功能完整性：所有需求点是否实现
   - 逻辑正确性：业务流程是否走通
   - 边界处理：异常输入、空值、边界值
   - 文档完整性：是否配套文档
   - 逐项检查，有记录有结论

3. **问题分级与修复**
   - P0：阻塞性问题，必须修复后才能提交QA
   - P1：重要问题，应该修复
   - P2：轻微问题，记录在案
   - P0问题 → 修复 → 重新自检

4. **输出自检报告**
   - 通过 → 可交付QA
   - P0问题存在 → 必须修复后重新自检
   - 写入 wiki/summaries/execution/self-review.md

5. **Wiki维护**
   - 创建 wiki/summaries/execution/self-review.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/execution/self-review.md
</Tool_Usage>

<Examples>
<Good>
自检清单逐项执行：
- 功能点1：已实现 ✓
- 功能点2：已实现 ✓
- 异常分支：未处理 ✗ (P0)
- 空值处理：已处理 ✓
→ P0修复后重新自检 → 全部通过 → 可交付QA
Why good: 逐项检查、P0零容忍、修复后复检
</Good>

<Bad>
自检清单打勾走过场，所有项直接标"通过"
Why bad: 自检流于形式等于没有自检，P0问题会漏到QA
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- P0问题无法修复 → 升级至协调者，评估是否调整需求
- 自检中止 → 保留已检查内容和问题记录，标记未完成项
- 多个P0问题同时出现 → 评估是否回退到执行阶段
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 所有需求点是否都已检查？
- [ ] 异常分支和边界是否覆盖？
- [ ] 自检是否逐项执行而非走形式？
- [ ] P0问题是否已修复并验证？
- [ ] wiki/summaries/execution/self-review.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/execution/
└── self-review.md         # 内部自检报告
```

## 自检清单模板（Markdown格式）

```markdown
## 自检清单

### 功能检查
- [ ] 功能点1：已实现 / 未实现
- [ ] 功能点2：已实现 / 未实现

### 逻辑检查
- [ ] 主流程：正确 / 有问题
- [ ] 异常分支：已处理 / 未处理

### 边界检查
- [ ] 异常输入处理
- [ ] 空值 / 边界值处理
```

## Wiki日志模板

```markdown
## [TIMESTAMP] pm-internal-self-check | {level} level

**Type**: internal_self_check
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/execution/self-review.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
