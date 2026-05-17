[![npm version](https://img.shields.io/npm/v/@winstly/flowcompass?style=flat-square)](https://www.npmjs.com/package/@winstly/flowcompass) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE) [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org/)

# FlowCompass

Standard software engineering full-lifecycle CLI — injects skills, commands, rules, and agents into AI tool directories (Claude Code, OpenCode, Cursor, Windsurf, Cline).

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Supported Tools](#supported-tools)
- [CLI Commands](#cli-commands)
- [Command System (IDE)](#command-system-ide)
- [Skills Overview](#skills-overview)
- [Agents](#agents)
- [Directory Structure](#directory-structure)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- **8-Stage Pipeline**: Structured workflow from investigation through retrospective with hard-gate approvals at critical transitions
- **20 Skills**: Sequential skill execution within each stage, including 5 military org management skills
- **18 Agents**: Specialized agent personas covering product, architecture, development, testing, DevOps, security, and compliance
- **Multi-Tool Support**: Compatible with Claude Code, OpenCode, Cursor, Windsurf, and Cline
- **Org Management**: Dynamic roster, task grading (S/M/L/XL), evaluation, and career system
- **Knowledge Freshness**: Timestamp-based staleness detection with retrospective audit

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
# Install globally via npm
npm install -g @winstly/flowcompass

# Or use npx directly
npx @winstly/flowcompass install
```

### Interactive Installation

```bash
# Run without arguments for interactive mode
flowcompass install
```

Shows a welcome screen and lets you select which tools to install to. Detected tools are highlighted.

### Install to Specific Tools

```bash
# Install to Claude Code
flowcompass install --tool claude

# Install to multiple tools
flowcompass install --tools claude,opencode,cursor

# Install to all supported tools
flowcompass install --tools all
```

### Invoke Commands in IDE

After installation, use slash commands in your AI tool:

```bash
/flowcompass:investigation    # Project investigation
/flowcompass:requirements     # Requirements analysis
/flowcompass:architecture     # Architecture design
```

### Workflow Flow

```
investigation → requirements → architecture → design → development → testing → deployment → retrospective
      ⚡              🔒            🔒         🔒         ⚡             ⚡           ⚡             🔒
```

⚡ = auto-advance · 🔒 = approval-required

## Supported Tools

| Tool | Skills Dir | Commands Dir | Invocation | Mode |
|------|-----------|--------------|------------|------|
| Claude Code | `.claude/skills` | `.claude/commands` | `/flowcompass:<name>` | CLI |
| OpenCode | `.opencode/skills` | `.opencode/commands` | `flowcompass-<name>` | CLI |
| Cursor | `.cursor/skills` | `.cursor/commands` | `flowcompass-<name>` | File-driven |
| Windsurf | `.windsurf/skills` | `.windsurf/commands` | `flowcompass-<name>` | File-driven |
| Cline | `.cline/skills` | `.clinerules/workflows` | `flowcompass-<name>` | File-driven |

## CLI Commands

FlowCompass CLI is an **installer only** — it injects configurations into AI tool directories. Execution happens in the AI tools via slash commands.

| Command | Description |
|---------|-------------|
| `flowcompass install` | Inject skills, commands, rules, and agents into AI tool directories |
| `flowcompass uninstall` | Remove injected directories (preserves `.knowledge/` user data) |
| `flowcompass status` | Show installed state for each detected AI tool |

## Command System (IDE)

### Pipeline Stages

| Stage | Gate | Skills | Description |
|-------|------|--------|-------------|
| `investigation` | ⚡ auto | structural-decomposition | Decompose project, build Wiki knowledge base |
| `requirements` | 🔒 approval | requirements-initial-review, requirements-alignment | Initial review, then scope alignment with user |
| `architecture` | 🔒 approval | roster-management, subagent-analysis, requirements-consolidation | Agent selection, deep analysis, consolidation |
| `design` | 🔒 approval | execution-planning, plan-user-review | Execution planning, user approval gate |
| `development` | ⚡ auto | fullchain-execution, dynamic-monitoring, internal-self-check | Full-chain execution, monitoring, self-check |
| `testing` | ⚡ auto | visual-verification, dual-qa-review, qa-closure-documentation | Visual verification, dual-QA, closure report |
| `deployment` | ⚡ auto | — | Reserved for future extension |
| `retrospective` | 🔒 approval | user-acceptance, evaluation-system, career-system, project-closure-iteration | Acceptance, evaluation, career, closure |

## Skills Overview

All skills are installed with the `flowcompass-` prefix. Invoke them as `/flowcompass-<name>` in your IDE.

### Core Engineering Skills

| Skill | Level | Gate | Description |
|-------|-------|------|-------------|
| flowcompass-structural-decomposition | 1 | auto | Decompose project with pyramid principle, build Wiki knowledge base |
| flowcompass-requirements-initial-review | 1 | auto | Structural understanding of raw requirements |
| flowcompass-requirements-alignment | 1 | 🔒 approval | Scope delineation and multi-party requirement coordination |
| flowcompass-roster-management | 2 | auto | Agent lifecycle: hire, assign, evaluate, promote/demote |
| flowcompass-subagent-analysis | 2 | auto | SubAgent dispatch, parallel scheduling, result collection |
| flowcompass-requirements-consolidation | 2 | 🔒 approval | Consistency checking, conflict resolution, version locking |
| flowcompass-execution-planning | 2 | auto | Formulate actionable execution plan (plan = design) |
| flowcompass-plan-user-review | 2 | 🔒 approval | User approval gate before execution begins |
| flowcompass-fullchain-execution | 3 | auto | SubAgent batch startup, parallel/serial scheduling |
| flowcompass-dynamic-monitoring | 3 | auto | Progress tracking, blocker identification, resource coordination |
| flowcompass-internal-self-check | 3 | auto | Functional completeness and logical correctness verification |
| flowcompass-visual-verification | 3 | auto | Browser screenshots, source analysis, visual regression |
| flowcompass-dual-qa-review | 3 | auto | Independent cross-review from business and technical perspectives |
| flowcompass-qa-closure-documentation | 3 | auto | Rectification, verification, delivery judgment |
| flowcompass-user-acceptance | 3 | 🔒 approval | Delivery demonstration, user testing, acceptance sign-off |
| flowcompass-project-closure-iteration | 3 | auto | Material archiving, retrospective, Wiki update |

### Org Management Skills

| Skill | Level | Gate | Description |
|-------|-------|------|-------------|
| flowcompass-org-charter | — | auto | Organizational structure definition (5 departments + staff HQ) |
| flowcompass-task-workflow | — | auto | Task grading (S/M/L/XL), assignment, and token optimization |
| flowcompass-evaluation-system | — | auto | 4-dimension scoring (quality, efficiency, collaboration, growth) |
| flowcompass-career-system | — | auto | Promotion/demotion rules, experience packs, salary benchmarking |

## Agents

### Product & Management

| Agent | Role | Expertise |
|-------|------|-----------|
| Product Manager | Holistic product lifecycle leader | Discovery, strategy, roadmap, stakeholder alignment |
| Project Shepherd | Cross-functional project coordinator | Timeline management, risk mitigation, on-time delivery |

### Engineering

| Agent | Role | Expertise |
|-------|------|-----------|
| Software Architect | System design specialist | DDD, architectural patterns, trade-off analysis |
| Backend Architect | Scalable backend systems | Microservices, APIs, database architecture |
| Senior Developer | Premium implementation | Advanced CSS, Three.js, premium web experiences |
| Frontend Developer | Modern web UI | React/Vue/Angular, performance, accessibility |
| Data Engineer | Data platform architect | ETL/ELT, lakehouse, Spark, dbt |
| DevOps Automator | Infrastructure automation | IaC, CI/CD, container orchestration |
| Technical Writer | Documentation architect | README, API references, docs-as-code |
| Code Reviewer | Code quality specialist | Correctness, security, maintainability review |
| Security Engineer | Application security | Threat modeling, vulnerability assessment, OWASP |
| SRE | Production reliability | SLOs, observability, chaos engineering |

### Testing

| Agent | Role | Expertise |
|-------|------|-----------|
| API Tester | API testing specialist | Functional/performance/security testing, 95%+ coverage |
| Accessibility Auditor | Inclusive design verification | WCAG 2.2 AA, screen reader, keyboard navigation |
| Performance Benchmarker | Performance optimization | Load/stress testing, Core Web Vitals, capacity planning |

### Operations & Compliance

| Agent | Role | Expertise |
|-------|------|-----------|
| Infrastructure Maintainer | System reliability & operations | Cloud architecture, monitoring, 99.9%+ uptime |
| Incident Response Commander | Production incident management | Severity frameworks, blameless post-mortems |
| Compliance Auditor | Technical compliance | SOC 2, ISO 27001, HIPAA, PCI-DSS |

## Directory Structure

### Project Source

```
flowcompass/
├── bin/                  CLI entry point
├── config/
│   ├── agents/           18 agent persona definitions
│   ├── commands/         8 pipeline stage commands
│   ├── rules/            Engineering rules injected into AI tools
│   ├── skills/           20 skill definitions
│   └── org/              Org data layer (roster, salary, team board)
├── src/
│   ├── cli/              Commander-based CLI (install/uninstall/status)
│   ├── commands/         Command implementations
│   ├── core/             Adapters, tools, command/skill resolvers
│   ├── ui/               Welcome screen
│   └── utils/            File system, logger, validation, tool resolver
├── test/                 Vitest test suite
└── package.json
```

### Installation Output

After `flowcompass install`, the target project directory will contain:

```
.claude/
├── skills/                         # 20 skill definitions (flowcompass- prefix)
│   ├── flowcompass-structural-decomposition/
│   ├── flowcompass-roster-management/
│   ├── flowcompass-org-charter/
│   ├── flowcompass-task-workflow/
│   ├── flowcompass-evaluation-system/
│   ├── flowcompass-career-system/
│   └── ...
├── agents/                         # 18 agent definitions
├── rules/                          # Engineering rules
│   └── flowcompass-rules.md        # Global pipeline rules
└── commands/
    └── flowcompass/                # Namespaced commands
        ├── investigation.md
        ├── requirements.md
        ├── architecture.md
        ├── design.md
        ├── development.md
        ├── testing.md
        ├── deployment.md
        └── retrospective.md
.knowledge/
├── org/                            # Org management data
│   ├── roster.json                 # Agent roster (empty initially)
│   ├── market-salary.json          # Salary benchmarks
│   ├── team-board.md               # Team assignment board
│   └── archive/                    # Historical records
└── wiki/                           # Knowledge base
    ├── index.md
    └── summaries/
```

## Troubleshooting

### Command Not Available

If `/flowcompass:` commands are not available:

1. Verify `flowcompass install` has been run
2. Check if `.claude/commands/flowcompass/` directory exists
3. Restart your CLI tool

### Check Installation Status

```bash
# Show installed state for each detected tool
flowcompass status
```

### Reinstall

```bash
# Remove and reinstall
flowcompass uninstall --tool claude
flowcompass install --tool claude
```

### Installation Fails

```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Check if lock file is stale
rm -rf .knowledge/.install.lock
flowcompass install
```

## License

[MIT](LICENSE)

---

[中文文档](README.zh-CN.md)
