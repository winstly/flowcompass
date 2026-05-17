# 选角算法（Selection Algorithm）

本文档定义从 talent_pool 中选择 Agent 的匹配算法，作为 task-workflow 技能的参考。

## 匹配优先级

1. **精确匹配**（权重 1.0）：兵种 + 所有能力标签完全匹配
2. **近似匹配**（权重 0.7）：兵种匹配，能力标签覆盖 >= 60%
3. **降级匹配**（权重 0.5）：高军衔 Agent 可降级执行低兵种任务
4. **新兵匹配**（权重 0.3）：无历史数据，只能试用

## 匹配分数计算

```
score = base_weight × capability_coverage × rank_factor × history_factor

其中：
- base_weight: 匹配类型权重（精确 1.0 / 近似 0.7 / 降级 0.5 / 新兵 0.3）
- capability_coverage: 能力标签匹配比例（匹配数 / 需求数）
- rank_factor: 军衔系数（新兵 0.5 / 列兵 0.6 / 班长 0.7 / 排长 0.8 / 连长 0.9 / 营长 1.0）
- history_factor: 历史评分系数（avg_score / 100，新兵为 0.5）
```

## 选角流程

```
输入：任务所需兵种 + 能力标签
  │
  ▼
查询 talent_pool → 计算每个候选人的匹配分数
  │
  ▼
按分数降序排列 → 取 top-N（N = 任务需要人数）
  │
  ▼
检查内存槽位 → 槽位不足时淘汰最低分
  │
  ▼
输出：选中的 Agent 列表
```
