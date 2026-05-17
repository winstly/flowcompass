---
name: project-closure-iteration
description: >
  当用户验收完成、项目需要闭环归档与经验沉淀时使用。涉及资料归档、复盘总结、
  Agent能力模型提炼、Wiki知识库更新等场景。即使用户没有说"闭环"，只要验收后
  需要归档、需要复盘、需要沉淀经验，就应触发。验收后必须闭环，这不是可选项。
argument-hint: "[--retro] <acceptance sign-off reference>"
level: 3
pipeline: [career-system, project-closure-iteration, structural-decomposition]
handoff-policy: auto
handoff: wiki/summaries/closure/retro.md
---

# 项目闭环沉淀迭代

<Purpose>
全项目资料归档，沉淀项目规则与Agent能力模型，同步更新Wiki知识库。闭环不是终点——沉淀的经验成为下一个项目的起点。不做闭环沉淀，等于把经验丢进了黑洞。
</Purpose>

<Use_When>
- 用户验收完成需归档
- 需沉淀经验
- Wiki需同步更新
- "项目做完了，帮我总结一下"
- "归档一下项目资料"
- 需要提炼Agent能力模型
</Use_When>

<Do_Not_Use_When>
- 用户验收尚未完成（用 user-acceptance）
- 项目尚未启动（用 structural-decomposition）
- 只需要查看项目资料不需要归档
</Do_Not_Use_When>

<Why_This_Exists>
闭环不是终点，沉淀是下一个项目的起点。经验不沉淀等于经验不存在——下次从零开始。Agent能力模型不从实践中提炼就是拍脑袋。归档不可检索等于没归档。
</Why_This_Exists>

<Execution_Policy>
- 归档可检索：所有资料必须可检索可追溯
- 沉淀有料：必须有具体做法而非空泛总结
- 模型有据：Agent能力模型必须从实践中提炼
- Wiki必更新：知识必须积累，否则每次从零开始
</Execution_Policy>

<Steps>
1. **归档所有项目资料**
   - 项目文档 → 归档目录
   - 代码 → 版本库标签
   - 产出物 → 交付库
   - 原则：可检索、可追溯

2. **复盘执行过程**
   - 做对了什么：可复用的做法
   - 做错了什么：需要避免的坑
   - 可以改进什么：优化建议
   - 原则：经验不沉淀 = 经验不存在

3. **沉淀经验和规则**
   - 成功经验：可复用的做法
   - 失败教训：需要避免的坑
   - 优化建议：可以改进的点
   - 项目规范：哪些做法被验证有效
   - 执行模式：哪些模式可以复用

4. **提炼Agent能力模型**
   - 哪些Prompt模板效果好
   - 哪些Agent组合效率高
   - 哪些模型选型决策正确/失误
   - 原则：从实践中提炼，不是拍脑袋

5. **更新Wiki知识库**
   - 新增页面：本次项目产生的知识点
   - 更新页面：已有页面需要补充/修正
   - 索引同步：更新wiki/index.md
   - 原则：知识必须积累，否则每次从零开始

6. **提交复盘报告**
   - 创建 wiki/summaries/closure/retro.md
   - 创建 wiki/summaries/closure/lessons-learned.md
   - 创建 wiki/summaries/closure/agent-models.md
   - 更新 wiki/index.md（在对应 Summaries 区域添加条目）
   - 追加 logs/evolution-log.md

7. **知识库保鲜审计**
   - 检查 wiki 文件的 `status` 字段
   - 使用 `git diff --name-only` 对比 wiki 生成后的文件变更
   - 标记受影响的 wiki 条目为 `stale`
   - 刷新 stale 条目（或记录待刷新清单供用户确认）
   - 原则：只刷新 stale 的，不全量重建
</Steps>

<Tool_Usage>
- 写入工具：Write / Edit
- 产出路径：wiki/summaries/closure/retro.md, wiki/summaries/closure/lessons-learned.md, wiki/summaries/closure/agent-models.md
</Tool_Usage>

<Examples>
<Good>
复盘内容：
- 做对了：SubAgent并行分析使需求拆解效率提升3倍
- 做错了：任务粒度太粗导致执行偏差
- 改进：任务粒度统一为1-3天
- Agent模型：executor(sonnet)用于标准CRUD效率最优
Why good: 有具体做法、有数据支撑、可直接复用
</Good>

<Bad>
复盘只有"注意质量""加强沟通"之类的空话
Why bad: 空泛总结无法复用，等于没有沉淀
</Bad>

<Bad>
归档了但无法检索
Why bad: 归档不可检索等于没归档
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 关键资料缺失无法归档 → 回溯补充，确保归档完整
- 闭环中止 → 保留已归档内容，标记未完成项
- 复盘发现系统性问题 → 记录并升级至组织层面
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 所有项目资料是否都已归档？
- [ ] 归档是否可检索可追溯？
- [ ] 复盘是否有具体做法而非空泛总结？
- [ ] 经验是否可被下一个项目直接复用？
- [ ] Agent模型是否有实际项目数据支撑？
- [ ] wiki/summaries/closure/retro.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/closure/
├── retro.md               # 项目复盘文档
├── lessons-learned.md     # 经验沉淀
└── agent-models.md        # Agent能力模型提炼
```

## 经验沉淀模板（JSON格式）

```json
{
  "lesson_id": "LL-001",
  "category": "execution",
  "type": "success",
  "description": "SubAgent并行分析使需求拆解效率提升3倍",
  "reusable": true,
  "applies_to": ["需求拆解", "多模块项目"]
}
```

## Agent能力模型模板（JSON格式）

```json
{
  "model_id": "AM-001",
  "agent_type": "executor",
  "model": "sonnet",
  "suitable_for": "标准CRUD开发",
  "evidence": "项目中6个CRUD模块全部按时完成，质量达标",
  "not_suitable_for": "架构决策"
}
```

## Wiki日志模板

```markdown
## [TIMESTAMP] project-closure-iteration | {level} level

**Type**: project_closure_iteration
**Level**: {QUICK|STANDARD|DEEP}
**Changes**:
- Created wiki/summaries/closure/retro.md
- Updated wiki/index.md
```
</Advanced>

Task: {{ARGUMENTS}}
