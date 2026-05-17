---
name: pm-dynamic-monitoring
description: >
  当任务执行过程中需要持续监控、发现卡点或异常时使用。涉及进度跟踪、卡点识别、
  资源协调、双向反馈等场景。即使用户没有说"监控"，只要执行启动后需要持续跟踪、
  出现卡点或异常、需要协调资源，就应触发。执行启动后就应持续触发此技能。
argument-hint: "[--interval <minutes>] <execution status reference>"
level: 3
pipeline: [pm-fullchain-execution, pm-dynamic-monitoring, pm-internal-self-check]
handoff-policy: auto
handoff: wiki/summaries/execution/monitoring-report.md
---

# 过程动态运维管控

<Purpose>
实时抓取执行卡点与异常，即时协调、双向反馈。监控是主动巡检，不是被动等待报告——在问题扩散前捕获并处理。没有监控的执行等于盲飞。
</Purpose>

<Use_When>
- 执行过程中需持续监控
- 发现执行异常或进度偏差
- 需要协调资源解决卡点
- 执行者与协调者之间信息不同步
- "帮我看看执行状态"
- "有任务卡住了"
</Use_When>

<Do_Not_Use_When>
- 尚未启动执行（用 pm-fullchain-execution）
- 执行已完成需要自检（用 pm-internal-self-check）
- 只需要查看进度不需要协调
</Do_Not_Use_When>

<Why_This_Exists>
没有监控的执行等于盲飞——问题在沉默中扩散，直到不可收拾。被动等待报告等于没有监控，问题必须被主动发现。卡点不及时处理会阻塞整条依赖链，影响远大于问题本身。
</Why_This_Exists>

<Execution_Policy>
- 主动巡检：不等异常自己浮出水面，定期扫描执行状态
- 发现即处理：卡点发现后立即记录和评估，不拖延
- 双向反馈：上行（执行者→协调者）和下行（协调者→执行者）信息同步
- 闭环验证：问题处理必须有验证闭环，未关闭=未解决
</Execution_Policy>

<Steps>
1. **定期巡检**
   - 进度：是否按计划推进
   - 质量：产出物是否符合标准
   - 风险：是否有新的风险点
   - 资源：资源是否充足

2. **识别卡点和异常**
   - 类型：技术 / 资源 / 依赖 / 决策
   - 影响评估：范围与严重程度
   - 紧迫度：P0 / P1 / P2
   - 原则：发现即记录，不拖延

3. **评估影响**
   - 卡点影响的任务范围
   - 对整体进度的影响
   - 是否需要升级

4. **协调资源解决**
   - 问题升级 → 决策者
   - 资源调配 → 协调者
   - 方案调整 → 执行者

5. **双向反馈**
   - 上行：执行者 → 协调者（问题/进度）
   - 下行：协调者 → 执行者（调整/资源）
   - 原则：信息不滞留

6. **更新监控报告**
   - 发现问题 → 分配处理 → 验证解决 → 关闭记录
   - 未关闭 = 未解决
   - 创建 wiki/summaries/execution/monitoring-report.md
   - 创建 wiki/summaries/execution/blockers.md
   - 创建 wiki/summaries/execution/coordination-log.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/execution/monitoring-report.md, wiki/summaries/execution/blockers.md, wiki/summaries/execution/coordination-log.md
</Tool_Usage>

<Examples>
<Good>
巡检发现任务B卡在依赖A未完成 → 记录卡点(P1) → 协调资源加速A → 反馈执行者B等待时间预计1天 → 1天后验证A完成B可启动
Why good: 主动发现、立即处理、双向反馈、闭环验证
</Good>

<Bad>
等待执行者报告问题，问题已扩散3天才被发现
Why bad: 被动等待不是监控，问题扩散后处理成本倍增
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 卡点无法解决需升级 → 升级至决策者，记录处理过程
- 执行中止 → 保留已执行内容和卡点状态，记录中止原因
- 多个P0卡点同时出现 → 评估是否暂停执行，重新规划
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 所有在执行任务是否都已检查？
- [ ] 卡点是否在发现后立即处理？
- [ ] 监控报告是否有具体数据？
- [ ] 双向反馈是否到位（上行+下行）？
- [ ] 问题处理是否有验证闭环？
- [ ] wiki/summaries/execution/monitoring-report.md 是否已更新？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/execution/
├── monitoring-report.md   # 监控报告
├── blockers.md            # 卡点记录
└── coordination-log.md    # 协调记录
```

## 卡点记录模板（JSON格式）

```json
{
  "blocker_id": "BLK-001",
  "type": "dependency",
  "description": "任务B依赖任务A的产出",
  "impact": "阻塞任务B和下游3个任务",
  "urgency": "P1",
  "owner": "协调者",
  "status": "processing",
  "resolution": "加速任务A执行"
}
```

## Wiki日志模板

```markdown
## [TIMESTAMP] pm-dynamic-monitoring | {level} level

**Type**: dynamic_monitoring
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/execution/monitoring-report.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
