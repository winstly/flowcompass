# FlowCompass 任务隔离规则

## 路径重定向

当 `.knowledge/tasks/.current` 存在且内容非空时，设当前任务名为其内容（去除首尾空白）。所有 `.knowledge/` 下的写入路径重定向：

| 原始路径 | 重定向至 |
|---------|---------|
| `.knowledge/wiki/summaries/<category>/` | `.knowledge/tasks/<当前任务>/wiki/summaries/<category>/` |
| `.knowledge/wiki/index.md` | `.knowledge/tasks/<当前任务>/wiki/index.md` |
| `.knowledge/logs/evolution-log.md` | `.knowledge/tasks/<当前任务>/wiki/log.md` |
| `.knowledge/state.json` | `.knowledge/tasks/<当前任务>/state.json` |

任务沙箱内用 `log.md`，主 wiki 保持 `evolution-log.md`（兼容现有）。

## 读取规则

- 主 wiki（`.knowledge/wiki/`）仍可读（只读参考上下文）
- 任务 wiki（`.knowledge/tasks/<name>/wiki/`）可读可写
- `.knowledge/schema/` 始终共享可读

## 无任务时

当 `.knowledge/tasks/.current` 不存在或内容为空时，所有行为与原始路径一致，不做任何重定向。

## 重要

- 写入文件前必须先检查 `.knowledge/tasks/.current`
- 每次对话开始时读取此文件确定当前任务上下文
- 不要在无任务时创建 `.current` 文件
