import chalk from 'chalk';

type LogLevel = 'quiet' | 'normal' | 'verbose' | 'debug';

class Logger {
  private level: LogLevel = 'normal';
  private levels: Record<LogLevel, number> = {
    quiet: 0,
    normal: 1,
    verbose: 2,
    debug: 3,
  };

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  info(msg: string): void {
    if (this.levels[this.level] >= this.levels.normal) {
      console.log(chalk.blue('ℹ'), msg);
    }
  }

  success(msg: string): void {
    if (this.levels[this.level] >= this.levels.normal) {
      console.log(chalk.green('✔'), msg);
    }
  }

  warn(msg: string): void {
    if (this.levels[this.level] >= this.levels.normal) {
      console.log(chalk.yellow('⚠'), msg);
    }
  }

  error(msg: string): void {
    console.error(chalk.red('✖'), msg);
  }

  verbose(msg: string): void {
    if (this.levels[this.level] >= this.levels.verbose) {
      console.log(chalk.gray('…'), msg);
    }
  }

  debug(msg: string): void {
    if (this.levels[this.level] >= this.levels.debug) {
      console.log(chalk.magenta('⚙'), msg);
    }
  }
}

export const logger = new Logger();
