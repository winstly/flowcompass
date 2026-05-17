[![npm version](https://img.shields.io/npm/v/winstly@flowcompass?style=flat-square)](https://www.npmjs.com/package/winstly@flowcompass) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE) [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org/)

# FlowCompass

Standard software engineering full-lifecycle orchestration CLI — from investigation to retrospective, driven by AI SubAgents.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Supported Tools](#supported-tools)
- [Command System](#command-system)
- [Skills Overview](#skills-overview)
- [Agents](#agents)
- [Directory Structure](#directory-structure)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- **8-Stage Pipeline**: Structured workflow from investigation through retrospective with hard-gate approvals at critical transitions
- **16 Skills**: Sequential skill execution within each stage, forming a cross-stage chain
- **18 Agents**: Specialized agent personas covering product, architecture, development, testing, DevOps, security, and compliance
- **Multi-Tool Support**: Compatible with Claude Code, OpenCode, Cursor, Windsurf, and Cline
- **Stateful Execution**: Persistent pipeline state and knowledge wiki survive across sessions
- **Iterative Lifecycle**: Retrospective loops back to investigation with iteration counter for continuous improvement

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
# Install globally via npm
npm install -g winstly@flowcompass

# Or use npx directly
npx winstly@flowcompass install
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
flowcompass install --tools claude

# Install to multiple tools
flowcompass install --tools claude,opencode,cursor

# Force overwrite existing installation
flowcompass install --tools claude --force
```

### Other Commands

```bash
# List all stages and skills
flowcompass list

# Check pipeline status
flowcompass status

# Reset pipeline state
flowcompass reset
```

### Invoke Commands

After installation, use slash commands in your CLI tool:

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

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FLOWCOMPASS PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Investigation → Requirements → Architecture → Design → Development → ... │
│       ⚡              🔒             🔒          🔒         ⚡             │
│       ... Testing → Deployment → Retrospective                             │
│            ⚡          ⚡              🔒                                     │
│                                    │                                        │
│                                    └──→ Investigation (next iteration)      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                      Core Skills (16 phases)                                │
│                                                                             │
│  Level 1 — Investigation & Requirements                                     │
│  ┌─────────────────────┬──────────────────────┬─────────────────────┐      │
│  │pm-structural-       │pm-requirements-      │pm-requirements-     │      │
│  │  decomposition      │  initial-review      │  alignment          │      │
│  └─────────────────────┴──────────────────────┴─────────────────────┘      │
│                                                                             │
│  Level 2 — Architecture & Design                                            │
│  ┌────────────────┬─────────────────┬─────────────────┬────────────────┐  │
│  │pm-main-agent-  │pm-subagent-     │pm-requirements- │pm-execution-  │  │
│  │  selection     │  analysis       │  consolidation  │  planning     │  │
│  ├────────────────┴─────────────────┴─────────────────┴────────────────┤  │
│  │pm-plan-user-review                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Level 3 — Development, Testing & Retrospective                             │
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

Each `flowcompass run <stage>` command triggers a stage, which executes a sequence of skills in order. Skills within a stage form a chain — each skill's output feeds into the next. The pipeline state is persisted after each skill completes.

## Supported Tools

| Tool | Skills Dir | Commands Dir | Invocation | Mode |
|------|-----------|--------------|------------|------|
| Claude Code | `.claude/skills` | `.claude/commands` | `/flowcompass:<name>` | CLI |
| OpenCode | `.opencode/skills` | `.opencode/commands` | `/flowcompass:<name>` | CLI |
| Cursor | `.cursor/skills` | `.cursor/commands` | `flowcompass-<name>` | File-driven |
| Windsurf | `.windsurf/skills` | `.windsurf/commands` | `flowcompass-<name>` | File-driven |
| Cline | `.cline/skills` | `.clinerules/workflows` | `flowcompass-<name>` | File-driven |

## Command System

### CLI Commands

| Command | Description |
|---------|-------------|
| `flowcompass install` | Inject pipeline config into AI tool directories |
| `flowcompass run <stage>` | Execute a pipeline stage |
| `flowcompass next` | Advance to the next stage |
| `flowcompass status` | Show current pipeline state |
| `flowcompass list` | List all stages and their skills |
| `flowcompass lint` | Health check for wiki and state files |
| `flowcompass reset` | Reset all pipeline state |

### Pipeline Stages

| Stage | Gate | Skills | Description |
|-------|------|--------|-------------|
| `investigation` | ⚡ auto | pm-structural-decomposition | Decompose project, build Wiki knowledge base |
| `requirements` | 🔒 approval | pm-requirements-initial-review, pm-requirements-alignment | Initial review, then scope alignment with user |
| `architecture` | 🔒 approval | pm-main-agent-selection, pm-subagent-analysis, pm-requirements-consolidation | Agent selection, deep analysis, consolidation |
| `design` | 🔒 approval | pm-execution-planning, pm-plan-user-review | Execution planning, user approval gate |
| `development` | ⚡ auto | pm-fullchain-execution, pm-dynamic-monitoring, pm-internal-self-check | Full-chain execution, monitoring, self-check |
| `testing` | ⚡ auto | pm-visual-verification, pm-dual-qa-review, pm-qa-closure-documentation | Visual verification, dual-QA, closure report |
| `deployment` | ⚡ auto | — | Reserved for future extension |
| `retrospective` | 🔒 approval | pm-user-acceptance, pm-project-closure-iteration | User acceptance, project closure/iteration |

## Skills Overview

| Skill | Level | Gate | Description |
|-------|-------|------|-------------|
| pm-structural-decomposition | 1 | auto | Decompose project with pyramid principle, build Wiki knowledge base |
| pm-requirements-initial-review | 1 | auto | Structural understanding of raw requirements |
| pm-requirements-alignment | 1 | 🔒 approval | Scope delineation and multi-party requirement coordination |
| pm-main-agent-selection | 2 | auto | Agent selection, model matching, task assignment |
| pm-subagent-analysis | 2 | auto | SubAgent dispatch, parallel scheduling, result collection |
| pm-requirements-consolidation | 2 | 🔒 approval | Consistency checking, conflict resolution, version locking |
| pm-execution-planning | 2 | auto | Formulate actionable execution plan (plan = design) |
| pm-plan-user-review | 2 | 🔒 approval | User approval gate before execution begins |
| pm-fullchain-execution | 3 | auto | SubAgent batch startup, parallel/serial scheduling |
| pm-dynamic-monitoring | 3 | auto | Progress tracking, blocker identification, resource coordination |
| pm-internal-self-check | 3 | auto | Functional completeness and logical correctness verification |
| pm-visual-verification | 3 | auto | Browser screenshots, source analysis, visual regression |
| pm-dual-qa-review | 3 | auto | Independent cross-review from business and technical perspectives |
| pm-qa-closure-documentation | 3 | auto | Rectification, verification, delivery judgment |
| pm-user-acceptance | 3 | 🔒 approval | Delivery demonstration, user testing, acceptance sign-off |
| pm-project-closure-iteration | 3 | auto | Material archiving, retrospective, Wiki update |

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
│   ├── skills/           16 skill definitions
│   └── stage-mapping.yaml
├── schemas/              JSON Schema for pipeline state
├── src/
│   ├── cli/              Commander-based CLI
│   ├── commands/         install, run, status, next, list, lint, reset
│   ├── core/             Pipeline engine, adapters, state, wiki sync
│   └── utils/            File system, logger, validation
├── test/                 Vitest test suite
└── package.json
```

### Installation Output

After `flowcompass install`, the target project directory will contain:

```
.claude/
├── skills/                         # 16 skill definitions
├── agents/                         # 18 agent definitions
├── rules/                          # Engineering rules
│   ├── flowcompass-rules.md        # Global pipeline rules
│   ├── frontend.md
│   ├── testing.md
│   ├── backend-api-design.md
│   ├── backend-code-quality.md
│   └── data-pipelines-batch-processing.md
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
├── state.json                      # Pipeline state
├── stage-mapping.yaml
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

### Pipeline State Issues

```bash
# Check pipeline status
flowcompass status

# Reset pipeline state (with confirmation)
flowcompass reset

# Health check for wiki and state files
flowcompass lint
```

### Installation Fails

```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Force overwrite installation
flowcompass install --tools claude --force
```

### Force Re-execution

```bash
# Re-run a stage ignoring completed/in-progress status
flowcompass run investigation --force
```

## License

[MIT](LICENSE)

---

[中文文档](README.zh-CN.md)
