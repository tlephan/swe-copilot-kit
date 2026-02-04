#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { copyPrompts, copyAgents, copySkills, listTemplates, CopyResult, updateGitignore } from './index';

const packageJson = require('../package.json');

interface InitOptions {
    force?: boolean;
    claudeCode?: boolean;
    antigravity?: boolean;
}

const program = new Command();



// ASCII Art Banner
const banner = `
${chalk.cyan('╔═══════════════════════════════════════════════╗')}
${chalk.cyan('║')}  ${chalk.bold.white('🤖 SWE Copilot Kit')}                           ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.gray('Copilot Prompts, Agents, Skills Initializer')}  ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════════════╝')}
`;

program
    .name('swe-copilot-kit')
    .description('CLI tool to initialize GitHub Copilot prompts and agents in your project')
    .version(packageJson.version);

program
    .command('init')
    .description('Initialize .github/prompts, .github/agents and .github/skills directories')
    .option('-f, --force', 'Overwrite existing files', false)
    .option('--claude-code', 'Initialize for Claude Code (Coming soon)', false)
    .option('--antigravity', 'Initialize for Antigravity (Coming soon)', false)
    .action(async (options: InitOptions) => {
        console.log(banner);

        if (options.claudeCode) {
            console.log(chalk.yellow('⚠️  Claude Code support is coming soon!'));
            return;
        }

        if (options.antigravity) {
            console.log(chalk.yellow('⚠️  Antigravity support is coming soon!'));
            return;
        }

        const targetDir = process.cwd();

        console.log(chalk.blue('📁 Target directory:'), chalk.white(targetDir));
        console.log();

        try {
            await runCopy('prompts', () => copyPrompts({ targetDir, force: options.force }));
            await runCopy('agents', () => copyAgents({ targetDir, force: options.force }));
            await runCopy('skills', () => copySkills({ targetDir, force: options.force }));

            const gitignoreSpinner = ora('Updating .gitignore...').start();
            try {
                const updated = await updateGitignore(targetDir);
                if (updated) {
                    gitignoreSpinner.succeed('Updated .gitignore');
                } else {
                    gitignoreSpinner.info('.gitignore already up to date');
                }
            } catch (error) {
                gitignoreSpinner.fail('Failed to update .gitignore');
            }

            console.log();
            console.log(chalk.green.bold('✨ Successfully initialized GitHub Copilot configuration!'));
            console.log();
            console.log(chalk.gray('Next steps:'));
            console.log(chalk.white('  1. Review the generated files in .github/prompts, .github/agents and .github/skills'));
            console.log(chalk.white('  2. Customize the templates to match your project needs'));
            console.log(chalk.white('  3. Use GitHub Copilot Chat with your new templates'));
            console.log();

        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

async function runCopy(type: string, copyFn: () => Promise<CopyResult>) {
    const spinner = ora(`Installing ${type}...`).start();
    try {
        const result = await copyFn();
        if (result.success) {
            spinner.succeed(`Installed ${chalk.green(result.filesCount)} ${type} file(s) to ${chalk.cyan(result.destination)}`);
        } else {
             // If failure is due to existing files and no force
            if (result.error && result.error.includes('already exists')) {
                spinner.warn(chalk.yellow(result.error));
            } else if (result.error && result.error.includes('Source directory not found')) {
                 spinner.fail(`Failed to install ${type}: ${result.error}`);
            } else {
                spinner.fail(`Failed to install ${type}: ${result.error}`);
            }
        }
    } catch (e) {
        spinner.fail(`Failed to install ${type}: ${e instanceof Error ? e.message : String(e)}`);
    }
}

program
    .command('list')
    .description('List available templates')
    .action(async () => {
        console.log(banner);

        console.log(chalk.blue.bold('📋 Available Templates:\n'));

        const templates = await listTemplates();

        if (templates.prompts.length > 0) {
            console.log(chalk.yellow.bold('  Prompts:'));
            for (const prompt of templates.prompts) {
                console.log(chalk.white(`    • ${prompt}`));
            }
            console.log();
        }

        if (templates.agents.length > 0) {
            console.log(chalk.yellow.bold('  Agents:'));
            for (const agent of templates.agents) {
                console.log(chalk.white(`    • ${agent}`));
            }
            console.log();
        }

        if (templates.skills.length > 0) {
            console.log(chalk.yellow.bold('  Skills:'));
            for (const skill of templates.skills) {
                console.log(chalk.white(`    • ${skill}`));
            }
            console.log();
        }
    });


program.parse();
