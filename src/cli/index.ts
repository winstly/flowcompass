import { Command } from 'commander';
import { join, resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { install } from '../commands/install.js';
import { run } from '../commands/run.js';
import { status } from '../commands/status.js';
import { next } from '../commands/next.js';
import { list } from '../commands/list.js';
import { reset } from '../commands/reset.js';
import { lint } from '../commands/lint.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getConfigDir(): string {
  return resolve(__dirname, '..', '..', 'config');
}

function getVersion(): string {
  const pkgPath = join(__dirname, '..', '..', 'package.json');
  return JSON.parse(readFileSync(pkgPath, 'utf-8')).version;
}

const program = new Command();

program
  .name('flowcompass')
  .description('标准软件工程全生命周期 CLI 工具')
  .version(getVersion());

program
  .command('install')
  .description('注入 Command/Skill/Rules 到 AI 工具目录')
  .option('-t, --tool <tool>', '目标工具（如 claude, opencode, cursor）')
  .option('--tools <tools>', '多个工具（逗号分隔，或 "all"）')
  .option('-d, --dir <directory>', '项目目录', process.cwd())
  .action(async (opts) => {
    await install({
      projectDir: resolve(opts.dir),
      configDir: getConfigDir(),
      tool: opts.tool,
      tools: opts.tools,
    });
  });

program
  .command('run <command>')
  .description('执行指定阶段（启动 SubAgent）')
  .option('-d, --dir <directory>', '项目目录', process.cwd())
  .option('-t, --tool <tool>', 'AI 工具 (claude, opencode, cursor, windsurf, cline)', 'claude')
  .option('--force', '强制重新执行（忽略 in_progress / completed 状态）')
  .action(async (commandName, opts) => {
    await run(resolve(opts.dir), getConfigDir(), commandName, opts.tool, opts.force);
  });

program
  .command('status')
  .description('查看当前流水线状态')
  .option('-d, --dir <directory>', '项目目录', process.cwd())
  .action(async (opts) => {
    await status(resolve(opts.dir));
  });

program
  .command('next')
  .description('推进到下一阶段')
  .option('-d, --dir <directory>', '项目目录', process.cwd())
  .option('-t, --tool <tool>', 'AI 工具 (claude, opencode, cursor, windsurf, cline)', 'claude')
  .action(async (opts) => {
    await next(resolve(opts.dir), getConfigDir(), opts.tool);
  });

program
  .command('list')
  .description('列出所有阶段和 Command')
  .action(async () => {
    await list(getConfigDir());
  });

program
  .command('lint')
  .description('检查 Wiki 健康状态')
  .option('-d, --dir <directory>', '项目目录', process.cwd())
  .action(async (opts) => {
    await lint(resolve(opts.dir));
  });

program
  .command('reset')
  .description('重置流水线状态')
  .option('-d, --dir <directory>', '项目目录', process.cwd())
  .action(async (opts) => {
    await reset(resolve(opts.dir));
  });

program.parse();
