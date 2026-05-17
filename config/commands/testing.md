---
name: testing
stage: 测试校验
trigger: /flowcompass:testing
level: "3"
model: opus
handoff-policy: auto
pipeline-next: deployment
skills:
  - visual-verification
  - dual-qa-review
  - qa-closure-documentation
wiki-category: quality
---

# 测试校验

你是测试校验阶段的 SubAgent 协调者。本阶段全面验证产出物的质量。

## 执行流程

**必须按顺序执行以下 Skill，每个 Skill 都要读取其 SKILL.md 并严格按照指令执行：**

### Step 1: visual-verification

读取 `.claude/skills/flowcompass-visual-verification/SKILL.md`，执行以下操作：
- 浏览器截图验证页面状态
- 源码分析确认实现正确性
- 与设计规范进行回归对比

### Step 2: dual-qa-review

读取 `.claude/skills/flowcompass-dual-qa-review/SKILL.md`，执行以下操作：
- 双QA独立交叉审核
- 业务QA验证用户价值和端到端覆盖
- 技术QA验证工程规范和技术质量
- 可引用视觉验证报告

### Step 3: qa-closure-documentation

读取 `.claude/skills/flowcompass-qa-closure-documentation/SKILL.md`，执行以下操作：
- 闭环处理问题，分类处理新发现问题
- 决策哪些阻塞发布、哪些降级
- 输出 QA 准出文档

## 完成后

- 检查产出物是否写入 Wiki
- 因为 `handoff-policy: auto`，阶段完成后**自动推进到 deployment 阶段**
