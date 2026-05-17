---
name: pm-structural-decomposition
description: >
  当新项目启动、项目结构需要初始化、或项目Wiki知识库需要搭建/更新时使用。
  涉及项目拆解、架构认知建立、知识库初始化等场景均应触发此技能。
  即使用户没有明确说"拆解项目"，只要提到项目启动、初始化、搭知识库，就应触发。
argument-hint: "[--mode FULL|SCOPE|DELTA] [--project <name>] <brief project description>"
level: 1
pipeline: [pm-project-closure-iteration, pm-structural-decomposition, pm-requirements-initial-review]
handoff-policy: auto
handoff: wiki/summaries/investigation/structural-decomposition.md
---

# 工程结构化拆解

<Purpose>
用金字塔原理拆解项目，搭建并维护 Project Wiki 知识库。Wiki 是整个工作流的知识底座——后续所有步骤的产出物最终都会沉淀到 Wiki 中。没有 Wiki 的项目是盲目的，每一步都在重新发现已有知识。
</Purpose>

<Use_When>
- 新项目启动，需要建立全局认知
- 项目 Wiki 不存在，需要初始化
- 项目 Wiki 已存在但可能过时，需要扫描更新
- "这个项目到底是什么？"
- "帮我理一下项目结构"
- 需要为后续工作流建立知识基座
</Use_When>

<Do_Not_Use_When>
- 已有完整且最新的项目上下文——直接进入需求分析
- 正在执行具体实现任务——用 pm-execution-planning
- 只需要修改单个文件——直接动手，无需拆解
</Do_Not_Use_When>

<Why_This_Exists>
项目失败的第一大原因不是技术不行，而是"不知道自己在做什么"。结构化拆解确保团队（包括 LLM Agent）在动手之前对项目有共同认知。Wiki 持续积累，避免每次对话都从零开始。
</Why_This_Exists>

<Execution_Policy>
- 先读后写：扫描现有 Wiki 和代码再动手，不要假设项目状态
- 金字塔优先：从 Why 到 What 到 How，不要一上来就钻细节
- 增量更新：已有 Wiki 时只更新变更部分，不要全量重建
- 每个模块可独立交付为粒度标准
</Execution_Policy>

<Mode_Selection>

| Mode | When | What to Check |
|------|------|---------------|
| FULL | 首次 / 完全重建 | 全部模块 + 架构 + 规范 |
| SCOPE | 特定模块/功能 | 定向分析 + 影响范围 |
| DELTA | 代码变更后 | 仅变更部分 |

Intent parsing:
```
FULL:   "完整拆解", "初始化", "从头开始"
SCOPE:  "分析XX模块", "看看XX架构"
DELTA:  "更新", "同步变更"
```
</Mode_Selection>

<Steps>
1. **检查 Wiki 状态**
   - 读取 `.knowledge/wiki/index.md` 判断是否存在
   - 不存在 → FULL 模式初始化
   - 存在但可能过时 → DELTA 模式增量更新
   - 用户指定模块 → SCOPE 模式定向分析

2. **金字塔拆解**
   ```
   顶层：项目核心目标（Why）
   中层：关键模块划分（What）
   底层：具体功能与交付物（How）
   ```

3. **输出 Wiki 结构**
   ```
   wiki/
   ├── index.md              # Wiki 索引
   ├── architecture.md       # 架构概览
   ├── module-map.md         # 模块关系图
   └── standards.md          # 项目规范
   ```

4. **自检**
   - 完整性：是否回答了"项目是什么"？
   - 无重叠：模块间职责是否清晰？
   - 有证据：每个结论有文件/代码支撑？
   - 置信度标注：`[CONF:HIGH]` / `[CONF:MEDIUM]` / `[CONF:LOW]`

5. **Wiki维护**
   - 创建 wiki/summaries/investigation/structural-decomposition.md
   - 创建 wiki/summaries/investigation/module-map.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 使用 `explore` agent（haiku）扫描代码结构和现有 Wiki
- FULL 模式：扫描全量代码后输出
- DELTA 模式：对比 `.knowledge/wiki/` 与当前代码差异
- 写入使用 Write 工具，不要用 Bash echo
- 产出路径：wiki/summaries/investigation/structural-decomposition.md, wiki/summaries/investigation/module-map.md
</Tool_Usage>

<Examples>
<Good>
金字塔拆解输出：
```
Why: 构建电商后台管理系统，支持订单处理和库存管理
What: 订单模块、库存模块、用户模块、报表模块
How:
  - 订单模块：创建/查询/取消订单，对接支付
  - 库存模块：入库/出库/盘点，低库存预警
  - 用户模块：注册/登录/权限，RBAC
  - 报表模块：日报/周报/自定义查询
```
Why good: 三个层级完整，每个模块有清晰边界，模块之间不重叠。
</Good>

<Bad>
扁平列表式拆解：
```
- 用户表、订单表、商品表、库存表、日志表
- 登录接口、下单接口、支付接口、查询接口
```
Why bad: 没有 Why 和 What 层，直接跳到实现细节。看不出来这是一个什么系统、解决什么问题。
</Bad>

<Bad>
一次 FULL 永远 FULL：
"项目 Wiki 三个月前建的，我重新完整拆解一遍。"
Why bad: 三个月前的 Wiki 可能 80% 还有效。应该 DELTA 模式增量更新，只更新变更部分。
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 信息严重不足无法拆解 → 与用户补充上下文后再继续
- 项目暂缓 → 记录到项目记忆，不强制推进
- Wiki 初始化后立即被后续步骤引用 → 正常流转，无需等待
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] Wiki 索引（index.md）已创建/更新
- [ ] 架构概览（architecture.md）覆盖所有核心模块
- [ ] 模块关系图（module-map.md）标注依赖
- [ ] 每个模块有清晰边界，无重叠
- [ ] 置信度标注完成
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 思维模型

第一性原理追溯目标，系统思维理清依赖，黄金思维圈驱动 Why→What→How，批判性思维验证完整性。

## Wiki日志模板

```markdown
## [TIMESTAMP] pm-structural-decomposition | {level} level

**Type**: structural_decomposition
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/investigation/structural-decomposition.md
- Updated wiki/index.md
```

## 配置

```json
{
  "pm": {
    "structuralDecomposition": {
      "defaultMode": "FULL",
      "wikiPath": ".knowledge/wiki/",
      "logPath": ".knowledge/logs/evolution-log.md"
    }
  }
}
```

## 状态文件

```json
{
  "active": true,
  "mode": "FULL|SCOPE|DELTA",
  "wiki_exists": true,
  "modules_identified": 4,
  "confidence_avg": 0.85,
  "started_at": "ISO-8601"
}
```
</Advanced>

Task: {{ARGUMENTS}}
