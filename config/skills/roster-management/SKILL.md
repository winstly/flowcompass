---
name: roster-management
description: >
  Agent 全生命周期管理——招募、组队、评估、晋升、淘汰。
  替代原 pm-main-agent-selection，从静态映射升级为动态弹性团队。
argument-hint: "[--action <recruit|assign|evaluate>] <task description>"
level: 2
pipeline: [requirements-alignment, roster-management, subagent-analysis]
handoff-policy: auto
handoff: wiki/summaries/architecture/agent-roster.md
---

# 花名册管理

<Purpose>
管理 Agent 的全生命周期：从招募、组队、评估到晋升和淘汰。维护 `.knowledge/org/roster.json` 作为组织人员档案的单一数据源。替代原有的静态 Agent 映射，实现动态弹性团队组建。
</Purpose>

<Use_When>
- 需要为新任务招募 Agent
- 需要组建或调整团队
- 需要查看现有 Agent 状态和能力
- 任务完成后需要更新 Agent 档案
</Use_When>

<Do_Not_Use_When>
- 定义组织架构——用 org-charter
- 评估 Agent 绩效——用 evaluation-system
- 管理晋升和淘汰——用 career-system
</Do_Not_Use_When>

<Why_This_Exists>
静态的 Agent 映射无法适应多变的任务需求。动态花名册让团队像真实组织一样运转：有人才池、有选角逻辑、有生命周期管理。好 Agent 被记住，差 Agent 被淘汰。
</Why_This_Exists>

<Execution_Policy>
- CRUD 操作必须通过 `.knowledge/org/roster.json`
- 招募前必须先查人才池
- 每次操作后更新 `updated_at` 时间戳
- 内存槽位不超过上限
</Execution_Policy>

## 数据源

所有人员数据存储在 `.knowledge/org/roster.json`：

```json
{
  "agents": {
    "agent-001": {
      "codename": "Alpha",
      "role": "assault",
      "rank": "sergeant",
      "status": "active",
      "personality": "严谨高效，代码风格简洁",
      "capabilities": ["backend-api", "database-design", "testing"],
      "created_at": "ISO-8601",
      "updated_at": "ISO-8601",
      "task_history": ["task-001", "task-002"],
      "avg_score": 82.5
    }
  },
  "talent_pool": [],
  "memory_slots": { "used": 0, "max": 10 }
}
```

## CRUD 操作

| 操作 | 说明 | 触发时机 |
|------|------|----------|
| Create | 招募新 Agent，分配代号和能力画像 | 人才池无匹配，需新建 |
| Read | 查询 Agent 档案、状态、能力 | 选角、评估、任务分配 |
| Update | 更新状态、能力、评分、军衔 | 任务完成、晋升、评估 |
| Delete | 从在职列表移除（经验包归档后） | 淘汰 |

## 招募流程

```
任务需求 → 分析所需兵种 → 查询 talent_pool
  ↓ 有匹配         ↓ 无匹配
  复用现有 Agent    创建新 Agent
  ↓                  ↓
  更新任务列表      分配代号、性格、能力画像
  ↓                  ↓
  加入任务团队      试用状态
```

### 招募规则

1. **代号生成**：按兵种前缀 + 序号（如 `assault-003`、`sniper-002`）
2. **性格分配**：根据兵种特性随机分配（突击兵→果断、狙击手→耐心、工兵→踏实）
3. **能力画像**：根据任务需求 + 兵种默认能力组合
4. **初始状态**：`status: "trial"`，军衔：`newbie`

## 人才池管理

任务完成后的优秀 Agent（评分 >= 75）进入 `talent_pool`：

```json
{
  "talent_pool": [
    {
      "codename": "Alpha",
      "role": "assault",
      "rank": "sergeant",
      "capabilities": ["backend-api", "database-design"],
      "avg_score": 82.5,
      "task_count": 5,
      "retired_at": "ISO-8601"
    }
  ]
}
```

### 选角逻辑（优先级从高到低）

1. **精确匹配**：talent_pool 中兵种 + 能力完全匹配 → 直接复用
2. **近似匹配**：talent_pool 中兵种匹配、能力部分匹配 → 复用并补充训练
3. **降级匹配**：talent_pool 中高军衔 Agent 可降级执行低兵种任务
4. **无匹配**：招募新 Agent

## 内存槽位规则

| 规则 | 说明 |
|------|------|
| 槽位上限 | 同时在职 Agent 不超过 `memory_slots.max` |
| 槽位释放 | Agent 进入 talent_pool 或被淘汰时释放 |
| 槽位不足 | 优先淘汰评分最低的 Agent |
| talent_pool 不占槽位 | 人才池中的 Agent 不计入在职槽位 |

## 兵种→规则自动注入

招募 Agent 时，根据兵种自动注入对应的编码规范：

| 兵种 | 自动注入的规则 |
|------|---------------|
| 突击兵（编码） | `backend-api-design.md`、`backend-code-quality.md`、`frontend.md`（如果做前端） |
| 狙击手（Review） | `testing.md`、`backend-code-quality.md` |
| 工兵（基建） | `data-pipelines-batch-processing.md`、`backend-api-design.md` |
| 卫生兵（调试） | `testing.md`、`backend-code-quality.md` |
| 侦察兵（调研） | `flowcompass-rules.md`（全局规则） |
| 全员 | `flowcompass-rules.md`（全局规则） |

规则文件位于 `.claude/rules/` 目录。招募 Agent 时，将对应规则内容注入到 Agent 的 prompt 中。Agent 不需要"学习"规则——规则就是它的一部分。

### 自定义规则

用户可以在项目根目录加 `.flowcompass/rules/` 覆盖或扩展默认规则。优先级：用户自定义 > 默认。

<Steps>
0. **增量模式判断**
   - 读取 `.knowledge/org/team-board.md`，如已有 Agent 分配记录，进入增量模式
   - 增量模式：读取 `.knowledge/plans/execution-plan.md`（如有），逐任务比对是否已有 Agent 覆盖
   - 仅对未覆盖的任务执行后续选角步骤，已覆盖的任务跳过
   - 全新模式（team-board 为空）：对所有任务执行完整选角流程

1. **分析任务需求**
   - 读取任务描述，识别所需的兵种和能力
   - 确定任务复杂度和所需 Agent 数量

2. **查询人才池**
   - 读取 `.knowledge/org/roster.json`
   - 按选角逻辑匹配：精确匹配 → 近似匹配 → 降级匹配 → 招募新 Agent

3. **招募或复用 Agent**
   - 如有匹配：复用现有 Agent，更新任务列表
   - 如无匹配：招募新 Agent，分配代号、性格、能力画像

4. **写入团队分配**
   - 将分配结果写入 `.knowledge/org/team-board.md`（增量模式为追加，全新模式为覆盖）
   - 格式必须包含：Agent 代号、角色、负责的任务、状态

5. **更新 roster.json**
   - 更新 Agent 的任务列表和状态
   - 更新 `updated_at` 时间戳
</Steps>

<Team_Board_Format>
team-board.md 必须包含以下格式：

```markdown
# 团队分配表

## 当前任务: {任务名称}

| Agent 代号 | 角色 | 负责任务 | 状态 |
|-----------|------|----------|------|
| {codename} | {role} | {task description} | 就绪 |
| {codename} | {role} | {task description} | 就绪 |

## 依赖关系
- {task A} → {task B} (B 依赖 A 完成)
```
</Team_Board_Format>

<Final_Checklist>
- [ ] roster.json 读写正常
- [ ] 招募流程：先查 talent_pool，无匹配再新建
- [ ] team-board.md 已写入团队分配
- [ ] team-board.md 格式正确（包含代号、角色、任务、状态）
- [ ] 人才池管理：评分 >= 75 才能入库
- [ ] 内存槽位检查通过
- [ ] 兵种规则注入正确
- [ ] 代号生成无冲突
</Final_Checklist>

Task: {{ARGUMENTS}}
