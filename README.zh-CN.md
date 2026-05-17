[![npm version](https://img.shields.io/npm/v/winstly@flowcompass?style=flat-square)](https://www.npmjs.com/package/winstly@flowcompass) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE) [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org/)

# FlowCompass

标准化软件工程全生命周期编排 CLI — 从立项调研到迭代复盘，由 AI SubAgent 驱动。

## 目录

- [特性](#特性)
- [快速开始](#快速开始)
- [架构](#架构)
- [支持工具](#支持工具)
- [命令系统](#命令系统)
- [技能概览](#技能概览)
- [Agent](#agent)
- [目录结构](#目录结构)
- [常见问题](#常见问题)
- [许可证](#许可证)

## 特性

- **8 阶段流水线**：从立项调研到迭代复盘的结构化工作流，关键阶段设有硬性门控审批
- **16 个技能**：每个阶段内按序执行，形成跨阶段链式调用
- **18 个 Agent**：覆盖产品、架构、开发、测试、DevOps、安全和合规的专业角色
- **多工具兼容**：支持 Claude Code、OpenCode、Cursor、Windsurf 和 Cline
- **有状态执行**：持久化的流水线状态和知识库 Wiki 跨会话保留
- **迭代式生命周期**：迭代复盘回环至立项调研，通过迭代计数器持续改进

## 快速开始

### 前置条件

- Node.js >= 18.0.0
- npm 或 yarn

### 安装

```bash
# 全局安装
npm install -g winstly@flowcompass

# 或使用 npx 直接运行
npx winstly@flowcompass install
```

### 交互式安装

```bash
flowcompass install
```

显示欢迎界面，可选择安装到哪些工具。已检测到的工具会高亮显示。

### 安装到指定工具

```bash
# 安装到 Claude Code
flowcompass install --tools claude

# 安装到多个工具
flowcompass install --tools claude,opencode,cursor

# 强制覆盖已有安装
flowcompass install --tools claude --force
```

### 其他命令

```bash
# 列出所有阶段和技能
flowcompass list

# 查看流水线状态
flowcompass status

# 重置流水线状态
flowcompass reset
```

### 调用命令

安装完成后，在 CLI 工具中使用斜杠命令：

```bash
/flowcompass:investigation    # 立项调研
/flowcompass:requirements     # 需求分析
/flowcompass:architecture     # 架构设计
```

### 工作流

```
立项调研 → 需求分析 → 架构设计 → 详细设计 → 编码开发 → 测试校验 → 部署运维 → 迭代复盘
   ⚡           🔒           🔒         🔒         ⚡            ⚡           ⚡            🔒
```

⚡ = 自动推进 · 🔒 = 需审批

## 架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLOWCOMPASS 流水线                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  立项调研 → 需求分析 → 架构设计 → 详细设计 → 编码开发 → ...                 │
│     ⚡          🔒          🔒         🔒         ⚡                       │
│     ... 测试校验 → 部署运维 → 迭代复盘                                       │
│          ⚡          ⚡            🔒                                         │
│                                    │                                        │
│                                    └──→ 立项调研（下一迭代）                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                      核心技能（16 个阶段）                                    │
│                                                                             │
│  Level 1 — 立项调研 & 需求分析                                               │
│  ┌─────────────────────┬──────────────────────┬─────────────────────┐      │
│  │pm-structural-       │pm-requirements-      │pm-requirements-     │      │
│  │  decomposition      │  initial-review      │  alignment          │      │
│  └─────────────────────┴──────────────────────┴─────────────────────┘      │
│                                                                             │
│  Level 2 — 架构设计 & 详细设计                                                │
│  ┌────────────────┬─────────────────┬─────────────────┬────────────────┐  │
│  │pm-main-agent-  │pm-subagent-     │pm-requirements- │pm-execution-  │  │
│  │  selection     │  analysis       │  consolidation  │  planning     │  │
│  ├────────────────┴─────────────────┴─────────────────┴────────────────┤  │
│  │pm-plan-user-review                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Level 3 — 编码开发、测试校验 & 迭代复盘                                      │
│  ┌────────────────┬─────────────────┬─────────────────┐                   │
│  │pm-fullchain-   │pm-dynamic-      │pm-internal-     │                   │
│  │  execution     │  monitoring      │  self-check     │                   │
│  ├────────────────┴─────────────────┴─────────────────┤                   │
│  │pm-visual-verification  │pm-dual-qa-review  │pm-qa-closure-doc  │       │
│  ├────────────────────────┴────────────────────┴────────────────────┤     │
│  │pm-user-acceptance  │pm-project-closure-iteration                │     │
│  └────────────────────┴────────────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

每条 `flowcompass run <stage>` 命令触发一个阶段，该阶段按序执行一组技能。阶段内的技能形成链式结构——前一个技能的输出作为下一个技能的输入。流水线状态在每个技能完成后持久化。

## 支持工具

| 工具 | 技能目录 | 命令目录 | 调用方式 | 模式 |
|------|---------|---------|---------|------|
| Claude Code | `.claude/skills` | `.claude/commands` | `/flowcompass:<name>` | CLI |
| OpenCode | `.opencode/skills` | `.opencode/commands` | `/flowcompass:<name>` | CLI |
| Cursor | `.cursor/skills` | `.cursor/commands` | `flowcompass-<name>` | 文件驱动 |
| Windsurf | `.windsurf/skills` | `.windsurf/commands` | `flowcompass-<name>` | 文件驱动 |
| Cline | `.cline/skills` | `.clinerules/workflows` | `flowcompass-<name>` | 文件驱动 |

## 命令系统

### CLI 命令

| 命令 | 说明 |
|------|------|
| `flowcompass install` | 将流水线配置注入 AI 工具目录 |
| `flowcompass run <stage>` | 执行指定流水线阶段 |
| `flowcompass next` | 推进到下一阶段 |
| `flowcompass status` | 查看当前流水线状态 |
| `flowcompass list` | 列出所有阶段及其技能 |
| `flowcompass lint` | Wiki 与状态文件健康检查 |
| `flowcompass reset` | 重置全部流水线状态 |

### 流水线阶段

| 阶段 | 门控 | 技能 | 说明 |
|------|------|------|------|
| `investigation` | ⚡ 自动 | pm-structural-decomposition | 分解项目，构建 Wiki 知识库 |
| `requirements` | 🔒 需审批 | pm-requirements-initial-review, pm-requirements-alignment | 初步审查，与用户对齐范围 |
| `architecture` | 🔒 需审批 | pm-main-agent-selection, pm-subagent-analysis, pm-requirements-consolidation | Agent 选择，深度分析，需求整合 |
| `design` | 🔒 需审批 | pm-execution-planning, pm-plan-user-review | 执行计划，用户审批门控 |
| `development` | ⚡ 自动 | pm-fullchain-execution, pm-dynamic-monitoring, pm-internal-self-check | 全链路执行，动态监控，内部自查 |
| `testing` | ⚡ 自动 | pm-visual-verification, pm-dual-qa-review, pm-qa-closure-documentation | 可视化验证，双 QA 交叉审查，交付报告 |
| `deployment` | ⚡ 自动 | — | 预留扩展 |
| `retrospective` | 🔒 需审批 | pm-user-acceptance, pm-project-closure-iteration | 用户验收，项目收尾/迭代 |

## 技能概览

| 技能 | 级别 | 门控 | 说明 |
|------|------|------|------|
| pm-structural-decomposition | 1 | 自动 | 金字塔原理分解项目，构建 Wiki 知识库 |
| pm-requirements-initial-review | 1 | 自动 | 原始需求的结构化理解 |
| pm-requirements-alignment | 1 | 🔒 需审批 | 范围界定与多方需求协调 |
| pm-main-agent-selection | 2 | 自动 | Agent 选择、模型匹配、任务分配 |
| pm-subagent-analysis | 2 | 自动 | SubAgent 调度、并行执行、结果收集 |
| pm-requirements-consolidation | 2 | 🔒 需审批 | 一致性检查、冲突解决、版本锁定 |
| pm-execution-planning | 2 | 自动 | 制定可执行的实施方案（计划即设计） |
| pm-plan-user-review | 2 | 🔒 需审批 | 执行前的用户审批门控 |
| pm-fullchain-execution | 3 | 自动 | SubAgent 批量启动、串并行调度 |
| pm-dynamic-monitoring | 3 | 自动 | 进度跟踪、阻塞识别、资源协调 |
| pm-internal-self-check | 3 | 自动 | 功能完整性与逻辑正确性验证 |
| pm-visual-verification | 3 | 自动 | 浏览器截图、源码分析、视觉回归对比 |
| pm-dual-qa-review | 3 | 自动 | 业务与技术双重视角的独立交叉审查 |
| pm-qa-closure-documentation | 3 | 自动 | 问题整改、验证确认、交付判定 |
| pm-user-acceptance | 3 | 🔒 需审批 | 交付演示、用户测试、验收签字 |
| pm-project-closure-iteration | 3 | 自动 | 资料归档、复盘总结、Wiki 更新 |

## Agent

### 产品与管理

| Agent | 角色 | 专长 |
|-------|------|------|
| Product Manager | 全生命周期产品负责人 | 发掘、策略、路线图、利益相关者对齐 |
| Project Shepherd | 跨职能项目协调者 | 时间线管理、风险缓解、按时交付 |

### 工程

| Agent | 角色 | 专长 |
|-------|------|------|
| Software Architect | 系统设计专家 | DDD、架构模式、权衡分析 |
| Backend Architect | 可扩展后端系统 | 微服务、API、数据库架构 |
| Senior Developer | 高级实现专家 | 高级 CSS、Three.js、精品 Web 体验 |
| Frontend Developer | 现代 Web UI | React/Vue/Angular、性能、无障碍 |
| Data Engineer | 数据平台架构师 | ETL/ELT、湖仓一体、Spark、dbt |
| DevOps Automator | 基础设施自动化 | IaC、CI/CD、容器编排 |
| Technical Writer | 文档架构师 | README、API 参考、文档即代码 |
| Code Reviewer | 代码质量专家 | 正确性、安全、可维护性审查 |
| Security Engineer | 应用安全 | 威胁建模、漏洞评估、OWASP |
| SRE | 生产可靠性 | SLO、可观测性、混沌工程 |

### 测试

| Agent | 角色 | 专长 |
|-------|------|------|
| API Tester | API 测试专家 | 功能/性能/安全测试，95%+ 覆盖率 |
| Accessibility Auditor | 无障碍审计专家 | WCAG 2.2 AA、屏幕阅读器、键盘导航 |
| Performance Benchmarker | 性能基准测试专家 | 负载/压力测试、Core Web Vitals、容量规划 |

### 运维与合规

| Agent | 角色 | 专长 |
|-------|------|------|
| Infrastructure Maintainer | 系统可靠性与运维 | 云架构、监控、99.9%+ 可用性 |
| Incident Response Commander | 生产事件管理 | 严重等级框架、无指责复盘 |
| Compliance Auditor | 技术合规审计 | SOC 2、ISO 27001、HIPAA、PCI-DSS |

## 目录结构

### 项目源码

```
flowcompass/
├── bin/                  CLI 入口
├── config/
│   ├── agents/           18 个 Agent 人设定义
│   ├── commands/         8 个流水线阶段命令
│   ├── rules/            注入 AI 工具的工程规则
│   ├── skills/           16 个技能定义
│   └── stage-mapping.yaml
├── schemas/              流水线状态 JSON Schema
├── src/
│   ├── cli/              Commander CLI 框架
│   ├── commands/         install、run、status、next、list、lint、reset
│   ├── core/             流水线引擎、适配器、状态管理、Wiki 同步
│   └── utils/            文件系统、日志、校验工具
├── test/                 Vitest 测试套件
└── package.json
```

### 安装输出

`flowcompass install` 后，目标项目目录将包含：

```
.claude/
├── skills/                         # 16 个技能定义
├── agents/                         # 18 个 Agent 定义
├── rules/                          # 工程规则
│   ├── flowcompass-rules.md        # 全局流水线规则
│   ├── frontend.md
│   ├── testing.md
│   ├── backend-api-design.md
│   ├── backend-code-quality.md
│   └── data-pipelines-batch-processing.md
└── commands/
    └── flowcompass/                # 命名空间命令
        ├── investigation.md
        ├── requirements.md
        ├── architecture.md
        ├── design.md
        ├── development.md
        ├── testing.md
        ├── deployment.md
        └── retrospective.md
.knowledge/
├── state.json                      # 流水线状态
├── stage-mapping.yaml
└── wiki/                           # 知识库
    ├── index.md
    └── summaries/
```

## 常见问题

### 命令不可用

如果 `/flowcompass:` 命令不可用：

1. 确认已运行 `flowcompass install`
2. 检查 `.claude/commands/flowcompass/` 目录是否存在
3. 重启 CLI 工具

### 流水线状态异常

```bash
# 查看流水线状态
flowcompass status

# 重置流水线状态（需确认）
flowcompass reset

# Wiki 与状态文件健康检查
flowcompass lint
```

### 安装失败

```bash
# 检查 Node.js 版本
node --version  # 应 >= 18.0.0

# 强制覆盖安装
flowcompass install --tools claude --force
```

### 强制重新执行

```bash
# 忽略已完成/进行中状态，重新执行阶段
flowcompass run investigation --force
```

## 许可证

[MIT](LICENSE)

---

[English](README.md)
