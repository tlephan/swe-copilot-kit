#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { copyPrompts, copyAgents, copySkills, listTemplates, CopyResult } from './index';

const packageJson = require('../package.json');

interface InitOptions {
    force?: boolean;
    prompts?: boolean;
    agents?: boolean;
    skills?: boolean;
    all?: boolean;
}

const program = new Command();

// ASCII Art Banner
const banner = `
${chalk.cyan('╔═══════════════════════════════════════════════╗')}
${chalk.cyan('║')}  ${chalk.bold.white('🤖 SWE Copilot Kit')}                           ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.gray('GitHub Copilot Prompts & Agents Initializer')}  ${chalk.cyan('║')}
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
    .option('-p, --prompts', 'Initialize only prompts', false)
    .option('-a, --agents', 'Initialize only agents', false)
    .option('-s, --skills', 'Initialize only skills', false)
    .option('--all', 'Initialize prompts, agents and skills (default)', true)
    .action(async (options: InitOptions) => {
        console.log(banner);

        const targetDir = process.cwd();

        // Determine what to install
        // If specific flags are set, use them. If no specific flags, default to all.
        const specificSelected = options.prompts || options.agents || options.skills;
        
        const installPrompts = options.prompts || (!specificSelected && options.all);
        const installAgents = options.agents || (!specificSelected && options.all);
        const installSkills = options.skills || (!specificSelected && options.all);

        console.log(chalk.blue('📁 Target directory:'), chalk.white(targetDir));
        console.log();

        try {
            if (installPrompts) {
                await runCopy('prompts', () => copyPrompts({ targetDir, force: options.force }));
            }

            if (installAgents) {
                await runCopy('agents', () => copyAgents({ targetDir, force: options.force }));
            }
            
            if (installSkills) {
                await runCopy('skills', () => copySkills({ targetDir, force: options.force }));
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
