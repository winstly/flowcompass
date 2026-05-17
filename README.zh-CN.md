[![npm version](https://img.shields.io/npm/v/@winstly/flowcompass?style=flat-square)](https://www.npmjs.com/package/@winstly/flowcompass) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE) [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org/)

# FlowCompass

标准化软件工程全生命周期 CLI — 将技能、命令、规则和 Agent 注入 AI 工具目录（Claude Code、OpenCode、Cursor、Windsurf、Cline）。

## 目录

- [特性](#特性)
- [快速开始](#快速开始)
- [支持工具](#支持工具)
- [CLI 命令](#cli-命令)
- [命令系统（IDE）](#命令系统ide)
- [技能概览](#技能概览)
- [Agent](#agent)
- [目录结构](#目录结构)
- [常见问题](#常见问题)
- [许可证](#许可证)

## 特性

- **8 阶段流水线**：从立项调研到迭代复盘的结构化工作流，关键阶段设有硬性门控审批
- **20 个技能**：每个阶段内按序执行，包含 5 个军事化组织管理技能
- **18 个 Agent**：覆盖产品、架构、开发、测试、DevOps、安全和合规的专业角色
- **多工具兼容**：支持 Claude Code、OpenCode、Cursor、Windsurf 和 Cline
- **组织管理**：动态花名册、任务分级（S/M/L/XL）、考核评价、职业发展体系
- **知识新鲜度**：基于时间戳的过期检测与复盘审计

## 快速开始

### 前置条件

- Node.js >= 18.0.0
- npm 或 yarn

### 安装

```bash
# 全局安装
npm install -g @winstly/flowcompass

# 或使用 npx 直接运行
npx @winstly/flowcompass install
```

### 交互式安装

```bash
flowcompass install
```

显示欢迎界面，可选择安装到哪些工具。已检测到的工具会高亮显示。

### 安装到指定工具

```bash
# 安装到 Claude Code
flowcompass install --tool claude

# 安装到多个工具
flowcompass install --tools claude,opencode,cursor

# 安装到所有支持的工具
flowcompass install --tools all
```

### 在 IDE 中调用命令

安装完成后，在 AI 工具中使用斜杠命令：

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

## 支持工具

| 工具 | 技能目录 | 命令目录 | 调用方式 | 模式 |
|------|---------|---------|---------|------|
| Claude Code | `.claude/skills` | `.claude/commands` | `/flowcompass:<name>` | CLI |
| OpenCode | `.opencode/skills` | `.opencode/commands` | `flowcompass-<name>` | CLI |
| Cursor | `.cursor/skills` | `.cursor/commands` | `flowcompass-<name>` | 文件驱动 |
| Windsurf | `.windsurf/skills` | `.windsurf/commands` | `flowcompass-<name>` | 文件驱动 |
| Cline | `.cline/skills` | `.clinerules/workflows` | `flowcompass-<name>` | 文件驱动 |

## CLI 命令

FlowCompass CLI **仅是安装器** — 将配置注入 AI 工具目录。执行在 AI 工具中通过斜杠命令完成。

| 命令 | 说明 |
|------|------|
| `flowcompass install` | 将技能、命令、规则和 Agent 注入 AI 工具目录 |
| `flowcompass uninstall` | 移除已注入的目录（保留 `.knowledge/` 用户数据） |
| `flowcompass status` | 查看各已检测工具的安装状态 |

## 命令系统（IDE）

### 流水线阶段

| 阶段 | 门控 | 技能 | 说明 |
|------|------|------|------|
| `investigation` | ⚡ 自动 | structural-decomposition | 分解项目，构建 Wiki 知识库 |
| `requirements` | 🔒 需审批 | requirements-initial-review, requirements-alignment | 初步审查，与用户对齐范围 |
| `architecture` | 🔒 需审批 | roster-management, subagent-analysis, requirements-consolidation | Agent 选择，深度分析，需求整合 |
| `design` | 🔒 需审批 | execution-planning, plan-user-review | 执行计划，用户审批门控 |
| `development` | ⚡ 自动 | fullchain-execution, dynamic-monitoring, internal-self-check | 全链路执行，动态监控，内部自查 |
| `testing` | ⚡ 自动 | visual-verification, dual-qa-review, qa-closure-documentation | 可视化验证，双 QA 交叉审查，交付报告 |
| `deployment` | ⚡ 自动 | — | 预留扩展 |
| `retrospective` | 🔒 需审批 | user-acceptance, evaluation-system, career-system, project-closure-iteration | 用户验收，考核评价，职业发展，项目收尾 |

## 技能概览

所有技能安装时带有 `flowcompass-` 前缀，在 IDE 中通过 `/flowcompass-<name>` 调用。

### 核心工程技能

| 技能 | 级别 | 门控 | 说明 |
|------|------|------|------|
| flowcompass-structural-decomposition | 1 | 自动 | 金字塔原理分解项目，构建 Wiki 知识库 |
| flowcompass-requirements-initial-review | 1 | 自动 | 原始需求的结构化理解 |
| flowcompass-requirements-alignment | 1 | 🔒 需审批 | 范围界定与多方需求协调 |
| flowcompass-roster-management | 2 | 自动 | Agent 生命周期：招聘、分配、考核、晋升/降级 |
| flowcompass-subagent-analysis | 2 | 自动 | SubAgent 调度、并行执行、结果收集 |
| flowcompass-requirements-consolidation | 2 | 🔒 需审批 | 一致性检查、冲突解决、版本锁定 |
| flowcompass-execution-planning | 2 | 自动 | 制定可执行的实施方案（计划即设计） |
| flowcompass-plan-user-review | 2 | 🔒 需审批 | 执行前的用户审批门控 |
| flowcompass-fullchain-execution | 3 | 自动 | SubAgent 批量启动、串并行调度 |
| flowcompass-dynamic-monitoring | 3 | 自动 | 进度跟踪、阻塞识别、资源协调 |
| flowcompass-internal-self-check | 3 | 自动 | 功能完整性与逻辑正确性验证 |
| flowcompass-visual-verification | 3 | 自动 | 浏览器截图、源码分析、视觉回归对比 |
| flowcompass-dual-qa-review | 3 | 自动 | 业务与技术双重视角的独立交叉审查 |
| flowcompass-qa-closure-documentation | 3 | 自动 | 问题整改、验证确认、交付判定 |
| flowcompass-user-acceptance | 3 | 🔒 需审批 | 交付演示、用户测试、验收签字 |
| flowcompass-project-closure-iteration | 3 | 自动 | 资料归档、复盘总结、Wiki 更新 |

### 组织管理技能

| 技能 | 级别 | 门控 | 说明 |
|------|------|------|------|
| flowcompass-org-charter | — | 自动 | 组织架构定义（5 部门 + 参谋部） |
| flowcompass-task-workflow | — | 自动 | 任务分级（S/M/L/XL）、分配与 Token 优化 |
| flowcompass-evaluation-system | — | 自动 | 4 维度评分（质量、效率、协作、成长） |
| flowcompass-career-system | — | 自动 | 晋升/降级规则、经验包、薪资对标 |

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
│   ├── skills/           20 个技能定义
│   └── org/              组织数据层（花名册、薪资、团队看板）
├── src/
│   ├── cli/              Commander CLI（install/uninstall/status）
│   ├── commands/         命令实现
│   ├── core/             适配器、工具检测、命令/技能解析器
│   ├── ui/               欢迎界面
│   └── utils/            文件系统、日志、校验、工具解析
├── test/                 Vitest 测试套件
└── package.json
```

### 安装输出

`flowcompass install` 后，目标项目目录将包含：

```
.claude/
├── skills/                         # 20 个技能定义（flowcompass- 前缀）
│   ├── flowcompass-structural-decomposition/
│   ├── flowcompass-roster-management/
│   ├── flowcompass-org-charter/
│   ├── flowcompass-task-workflow/
│   ├── flowcompass-evaluation-system/
│   ├── flowcompass-career-system/
│   └── ...
├── agents/                         # 18 个 Agent 定义
├── rules/                          # 工程规则
│   └── flowcompass-rules.md        # 全局流水线规则
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
├── org/                            # 组织管理数据
│   ├── roster.json                 # Agent 花名册（初始为空）
│   ├── market-salary.json          # 薪资基准
│   ├── team-board.md               # 团队分配看板
│   └── archive/                    # 历史记录
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

### 查看安装状态

```bash
# 查看各工具的安装状态
flowcompass status
```

### 重新安装

```bash
# 卸载后重新安装
flowcompass uninstall --tool claude
flowcompass install --tool claude
```

### 安装失败

```bash
# 检查 Node.js 版本
node --version  # 应 >= 18.0.0

# 检查锁文件是否过期
rm -rf .knowledge/.install.lock
flowcompass install
```

## 许可证

[MIT](LICENSE)

---

[English](README.md)
