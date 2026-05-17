import { Command } from 'commander';
import { join, resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { install } from '../commands/install.js';
import { uninstall } from '../commands/uninstall.js';
import { status } from '../commands/status.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function getConfigDir(): string {
  return resolve(__dirname, '..', '..', 'config');
}

function getVersion(): string {
  const pkgPath = join(__dirname, '..', '..', 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version: string };
  return pkg.version;
}

interface GlobalOpts {
  dir: string;
}

interface InstallUninstallOpts extends GlobalOpts {
  tool?: string;
  tools?: string;
}

function resolveProjectDir(dir: string): string {
  const resolved = resolve(dir);
  // Reject null bytes after resolution
  if (resolved.includes('\0')) {
    throw new Error('Invalid directory: contains null byte');
  }
  return resolved;
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
  .action(async (opts: InstallUninstallOpts) => {
    await install({
      projectDir: resolveProjectDir(opts.dir),
      configDir: getConfigDir(),
      tool: opts.tool,
      tools: opts.tools,
    });
  });

program
  .command('uninstall')
  .description('移除已注入的 Command/Skill/Rules 目录')
  .option('-t, --tool <tool>', '目标工具（如 claude, opencode, cursor）')
  .option('--tools <tools>', '多个工具（逗号分隔，或 "all"）')
  .option('-d, --dir <directory>', '项目目录', process.cwd())
  .action(async (opts: InstallUninstallOpts) => {
    await uninstall({
      projectDir: resolveProjectDir(opts.dir),
      tool: opts.tool,
      tools: opts.tools,
    });
  });

program
  .command('status')
  .description('查看当前流水线状态')
  .option('-d, --dir <directory>', '项目目录', process.cwd())
  .action((opts: GlobalOpts) => {
    status(resolveProjectDir(opts.dir));
  });

program.parse();
