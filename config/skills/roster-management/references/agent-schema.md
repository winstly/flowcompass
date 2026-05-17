# Agent 数据模式（Agent Schema）

本文档定义 `.knowledge/org/roster.json` 中 Agent 对象的完整数据模式。

## Agent 对象结构

```json
{
  "id": "string — 唯一标识，格式: agent-{NNN}",
  "codename": "string — 代号，如 Alpha、Bravo",
  "role": "string — 兵种: assault|sniper|engineer|medic|scout",
  "rank": "string — 军衔: newbie|private|sergeant|lieutenant|captain|major",
  "status": "string — 状态: trial|active|retired|dismissed",
  "personality": "string — 性格描述",
  "capabilities": ["string — 能力标签列表"],
  "created_at": "ISO-8601 — 创建时间",
  "updated_at": "ISO-8601 — 最后更新时间",
  "task_history": ["string — 已完成任务 ID 列表"],
  "avg_score": "number — 历史平均评分 (0-100)",
  "current_task": "string|null — 当前任务 ID",
  "salary_weight": "number — 薪资权重系数 (默认 1.0)"
}
```

## Roster 顶层结构

```json
{
  "agents": { "agent-001": { ...Agent对象 } },
  "talent_pool": [ { ...Agent对象(精简版) } ],
  "memory_slots": { "used": 0, "max": 10 },
  "last_updated": "ISO-8601"
}
```

## 状态流转

```
trial → active → retired
                → dismissed
```
