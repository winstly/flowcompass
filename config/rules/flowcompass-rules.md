# flowcompass 全局规则

## 1. HARD-GATE 门控规则

approval-required 阶段未获用户明确确认不得推进到下一阶段。确认必须是书面的——用户说"可以""没问题""确认"均可，但沉默不等于确认。

**HARD-GATE 优先级**：当 Skill 包含 `<HARD-GATE>` 标签时，门控条件未满足则不得自动推进，无论 `handoff-policy` 为何值。HARD-GATE 是最高优先级约束，覆盖 auto 策略。

**Skill 级别与 Command 级别交互**：
- 当 Skill 的 `handoff-policy` 为 `approval-required` 时，该 Skill 完成后必须等待用户确认，无论其所在 Command 的 `handoff-policy` 为何值
- 当 Command 的 `handoff-policy` 为 `approval-required` 时，整个阶段完成后必须等待用户确认
- 两者取最严格约束：任一级别要求 approval，则必须 approval

## 2. Pipeline 衔接规则

每个阶段完成后检查 `handoff-policy`：
- `auto` → 自动推进到下一阶段
- `approval-required` → 暂停等待用户确认后再推进

**迭代循环**：`retrospective` 阶段的 `pipeline-next: investigation` 使流水线回到起点，开始新一轮迭代。每次回到 `investigation` 时迭代计数器 +1。

**强制重试**：使用 `--force` 可重新执行 `in_progress` 或 `completed` 阶段：
```bash
flowcompass run <command> --force
```

## 3. Wiki 维护规则

每次阶段执行后必须：
- 更新 `.knowledge/wiki/index.md` 对应区域
- 追加 `.knowledge/logs/evolution-log.md` 执行记录

## 4. 产出物路径规则

所有产出文档统一存放在 `.knowledge/wiki/summaries/<category>/`，Skill 的 handoff 路径必须与父 Command 的 `wiki-category` 一致：
- `investigation/` — 立项调研相关
- `requirements/` — 需求相关
- `architecture/` — 架构相关
- `design/` — 设计相关
- `execution/` — 执行相关
- `quality/` — 质量相关
- `closure/` — 闭环相关

## 5. 状态持久化规则

流水线状态写入 `.knowledge/state.json`（原子写入），每次阶段变更必须更新。

## 6. Skill 执行规则

- SubAgent 按 Command 中定义的 Skill 列表顺序逐一执行
- 每个 Skill 的产出物必须写入 Wiki 指定路径
- Skill 执行失败时记录错误状态，不自动跳过
- Skill 的 `handoff-policy` 决定是否需要暂停等待确认
- 0-skill 阶段（如 deployment）自动标记为完成

## 7. File-driven 模式

非 CLI 工具（cursor, windsurf, cline）使用文件驱动模式：
- 执行时在 `.knowledge/tasks/` 下创建任务文件
- 用户手动完成任务后运行 `flowcompass next` 推进
- 任务文件 pending 状态不会阻塞流水线，而是等待手动完成

## 8. 任务隔离规则

当 `.knowledge/tasks/.current` 存在且内容非空时，当前处于任务模式：

- **写入路径重定向**：所有 `.knowledge/` 下的写入操作重定向至 `.knowledge/tasks/<当前任务>/` 下的对应位置
  - `wiki/summaries/<category>/` → `tasks/<当前任务>/wiki/summaries/<category>/`
  - `wiki/index.md` → `tasks/<当前任务>/wiki/index.md`
  - `logs/evolution-log.md` → `tasks/<当前任务>/wiki/log.md`
  - `state.json` → `tasks/<当前任务>/state.json`
- **主 wiki 只读**：`.knowledge/wiki/` 仍可读取作为上下文参考，但不可写入
- **任务合并**：`pm-project-closure-iteration` 执行时自动检测并合并任务 wiki 至主 wiki
- **无任务时不变**：`.current` 不存在或为空时，所有行为与原始路径一致

任务启动：`/flowcompass:task <task-name>`
任务合并归档：通过 `/flowcompass:retrospective` 正常流程，`pm-project-closure-iteration` 会自动处理
