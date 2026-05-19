---
name: task
stage: 任务管理
trigger: /flowcompass:task
level: "1"
model: haiku
handoff-policy: auto
pipeline-next: investigation
skills: []
wiki-category: ""
---

# 任务管理

你是任务管理阶段的执行者。根据用户输入的任务名创建任务沙箱或切换任务上下文。

## 执行步骤

1. **接收任务名参数**
   - 从用户输入中提取任务名（如 `/flowcompass:task feat-login` 中的 `feat-login`）
   - 校验任务名：仅允许小写字母、数字、连字符，必须匹配 `/^[a-z0-9-]+$/`
   - 任务名不能为空

2. **检查现有任务上下文**
   - 读取 `.knowledge/tasks/.current` 文件（如存在）
   - 如果已有活跃任务且不是当前要创建的任务名：
     - 提示用户：当前已有活跃任务 `<existing-task>`，请先完成当前任务（执行 `/flowcompass:retrospective`）或确认切换
     - 用户确认切换后继续

3. **创建任务沙箱**
   - 创建目录 `.knowledge/tasks/<task-name>/`
   - 创建子目录 `.knowledge/tasks/<task-name>/wiki/summaries/`
   - 创建 `.knowledge/tasks/<task-name>/state.json`，内容为初始 pipeline 状态：
     ```json
     {
       "active": true,
       "current_command": null,
       "tool": "claude",
       "mode": "cli",
       "stages": {
         "investigation": { "status": "pending", "current_skill_index": -1, "skills": [] },
         "requirements": { "status": "pending", "current_skill_index": -1, "skills": [] },
         "architecture": { "status": "pending", "current_skill_index": -1, "skills": [] },
         "design": { "status": "pending", "current_skill_index": -1, "skills": [] },
         "development": { "status": "pending", "current_skill_index": -1, "skills": [] },
         "testing": { "status": "pending", "current_skill_index": -1, "skills": [] },
         "deployment": { "status": "pending", "current_skill_index": -1, "skills": [] },
         "retrospective": { "status": "pending", "current_skill_index": -1, "skills": [] }
       },
       "context": { "level": "", "completed_skills": [], "iteration": 0 }
     }
     ```
   - 创建 `.knowledge/tasks/<task-name>/wiki/index.md`：
     ```markdown
     # Task Wiki: <task-name>

     ## Summaries
     ```
   - 创建 `.knowledge/tasks/<task-name>/wiki/log.md`：
     ```markdown
     # Task Log: <task-name>

     ```
   - 确保 `.knowledge/tasks/archive/` 目录存在

4. **设置当前任务**
   - 写入 `.knowledge/tasks/.current`，内容为任务名（一行纯文本，无换行）

5. **输出确认**
   - 告知用户任务沙箱已创建
   - 提示用户后续所有 `/flowcompass:*` 命令将在此任务上下文中执行
   - 提示用户任务完成后执行 `/flowcompass:retrospective` 进行合并归档

## 特殊用法

- `/flowcompass:task` 不带参数时：显示当前活跃任务名（读取 `.current`）和任务状态概览
- 如果 `.current` 指向的任务目录不存在：报告异常并清除 `.current`
