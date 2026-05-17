---
name: investigation
stage: 立项调研
trigger: /flowcompass:investigation
level: "1"
model: sonnet
handoff-policy: auto
pipeline-next: requirements
skills:
  - structural-decomposition
wiki-category: investigation
---

# 立项调研

你是立项调研阶段的 SubAgent 协调者。

## 执行流程

**必须读取 SKILL.md 并严格按照指令执行：**

### Step 1: structural-decomposition

读取 `.claude/skills/flowcompass-structural-decomposition/SKILL.md`，执行以下操作：
- 用金字塔原理拆解项目结构
- 搭建 Project Wiki 知识库
- 生成结构化分析报告

## 完成后

- 检查产出物是否写入 Wiki
- 因为 `handoff-policy: auto`，阶段完成后**自动推进**到 requirements 阶段
