---
name: pm-subagent-analysis
description: >
  当主Agent已选型、需要下发子Agent进行深度分析时使用。涉及SubAgent指令构建、
  并行调度、结果收集等场景。即使用户没有说"子Agent分析"，只要需要多角度深入分析、
  并行拆解、多路调研，就应触发。
argument-hint: "[--parallel] <task description with context>"
level: 2
pipeline: [pm-main-agent-selection, pm-subagent-analysis, pm-requirements-consolidation]
handoff-policy: auto
handoff: wiki/summaries/architecture/sub-agent-tasks.md
---

# 子Agent精细分析

<Purpose>
下发指令启动SubAgent，开展全维度需求深度拆解。SubAgent的价值在于并行——多Agent同时从不同角度深挖，最终汇总出比单一分析更完整的认知。指令质量决定分析质量。
</Purpose>

<Use_When>
- 主Agent已选型，子任务需要深度分析
- 单一视角不够，需要多角度拆解
- 任务复杂度高，串行分析太慢
- "帮我从多个角度分析一下"
- "并行调研这几个方向"
- 需多Agent并行提升效率
</Use_When>

<Do_Not_Use_When>
- 主Agent尚未选型（用 pm-main-agent-selection）
- 分析已完成，需要汇总（用 pm-requirements-consolidation）
- 任务简单到单一Agent即可完成
</Do_Not_Use_When>

<Why_This_Exists>
单一视角的分析存在盲区，串行分析效率太低。SubAgent并行深挖可以从不同维度同时拆解，汇总出更完整的认知。指令质量决定分析质量——模糊的指令产出模糊的结果。
</Why_This_Exists>

<Execution_Policy>
- 指令五要素：上下文+任务+约束+输出+成功标准，缺一不可
- 能并行的绝不串行：独立任务并行启动，提升吞吐
- 冲突不掩盖：矛盾信息必须显式标记，不能假装不存在
- 监控不缺位：SubAgent可能卡住，需要超时预警机制
</Execution_Policy>

<Steps>
1. **构建SubAgent指令**
   - 上下文：项目背景信息，SubAgent需要知道的
   - 任务描述：具体要做什么
   - 约束条件：边界和限制
   - 输出要求：期望的产出格式
   - 成功标准：如何判断任务完成

2. **启动调度**
   - 独立任务 → 并行启动，提升吞吐
   - 有依赖任务 → 按依赖链串行启动
   - 监控 → 跟踪执行状态，超时预警

3. **监控执行状态**
   - 跟踪每个SubAgent的执行进度
   - 超时预警，评估是否重发指令
   - 发现异常及时处理

4. **收集产出标记冲突**
   - 结构化整理 → 统一格式
   - 交叉验证 → 检查一致性
   - 冲突标记 → 识别矛盾并显式记录（不掩盖分歧）

5. **Wiki维护**
   - 创建 wiki/summaries/design/sub-agent-tasks.md
   - 创建 wiki/summaries/design/sub-agent-results/ 目录
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- Agent调度：并行/按序启动SubAgent
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/design/sub-agent-tasks.md, wiki/summaries/design/sub-agent-results/
</Tool_Usage>

<Examples>
<Good>
完整的SubAgent指令：
- 上下文：电商项目，需要支持多支付方式
- 任务：分析各支付渠道的技术方案和合规要求
- 约束：仅限国内支付渠道，不考虑跨境
- 输出：结构化对比表
- 成功标准：覆盖至少3个主流支付渠道，每个渠道含接入方式、费率、合规要求
Why good: 五要素齐全，SubAgent知道要做什么、怎么做、做到什么程度算完成
</Good>

<Bad>
指令只有"分析一下需求"，没有上下文和成功标准
Why bad: SubAgent不知道项目背景会走偏，无法判断是否完成
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- SubAgent产出不完整或超时 → 评估是否重发指令或降级处理
- 分析暂缓 → 保留已收集结果，标记未完成项
- SubAgent间冲突严重 → 记录分歧点，交由 pm-requirements-consolidation 仲裁
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 每个SubAgent指令是否包含上下文+任务+约束+输出+标准？
- [ ] 所有子任务是否都已下发？是否有分析盲区？
- [ ] 冲突是否显式标记而非掩盖？
- [ ] 独立任务是否并行启动？
- [ ] wiki/summaries/design/sub-agent-tasks.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## SubAgent指令模板（Markdown格式）

```markdown
## 任务：[子任务名称]

### 上下文
[项目背景信息，SubAgent需要知道的]

### 任务描述
[具体要做什么]

### 约束条件
- [约束1]
- [约束2]

### 输出要求
[期望的产出格式]

### 成功标准
[如何判断任务完成]
```

## 产出目录结构

```
wiki/summaries/design/
├── sub-agent-tasks.md        # SubAgent任务分解
└── sub-agent-results/
    ├── agent-1-result.md     # 各SubAgent执行结果
    ├── agent-2-result.md
    └── ...
```

## Wiki日志模板

```markdown
## [TIMESTAMP] pm-subagent-analysis | {level} level

**Type**: subagent_analysis
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/design/sub-agent-tasks.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
