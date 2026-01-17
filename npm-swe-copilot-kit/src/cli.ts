#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import * as path from 'path';
import * as fs from 'fs-extra';

const packageJson = require('../package.json');

interface InitOptions {
    force?: boolean;
    prompts?: boolean;
    agents?: boolean;
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
    .description('Initialize .github/prompts and .github/agents directories in your project')
    .option('-f, --force', 'Overwrite existing files', false)
    .option('-p, --prompts', 'Initialize only prompts', false)
    .option('-a, --agents', 'Initialize only agents', false)
    .option('--all', 'Initialize both prompts and agents (default)', true)
    .action(async (options: InitOptions) => {
        console.log(banner);

        const targetDir = process.cwd();
        const templatesDir = path.join(__dirname, '..', 'templates');

        // Determine what to install
        const installPrompts = options.prompts || (!options.agents && !options.prompts);
        const installAgents = options.agents || (!options.agents && !options.prompts);

        console.log(chalk.blue('📁 Target directory:'), chalk.white(targetDir));
        console.log();

        try {
            if (installPrompts) {
                await copyDirectory(
                    path.join(templatesDir, 'prompts'),
                    path.join(targetDir, '.github', 'prompts'),
                    options.force || false,
                    'prompts'
                );
            }

            if (installAgents) {
                await copyDirectory(
                    path.join(templatesDir, 'agents'),
                    path.join(targetDir, '.github', 'agents'),
                    options.force || false,
                    'agents'
                );
            }

            console.log();
            console.log(chalk.green.bold('✨ Successfully initialized GitHub Copilot configuration!'));
            console.log();
            console.log(chalk.gray('Next steps:'));
            console.log(chalk.white('  1. Review the generated files in .github/prompts and .github/agents'));
            console.log(chalk.white('  2. Customize the prompts to match your project needs'));
            console.log(chalk.white('  3. Use GitHub Copilot Chat with your new prompts and agents'));
            console.log();

        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
            process.exit(1);
        }
    });

program
    .command('list')
    .description('List available templates')
    .action(async () => {
        console.log(banner);

        const templatesDir = path.join(__dirname, '..', 'templates');

        console.log(chalk.blue.bold('📋 Available Templates:\n'));

        // List prompts
        const promptsDir = path.join(templatesDir, 'prompts');
        if (await fs.pathExists(promptsDir)) {
            console.log(chalk.yellow.bold('  Prompts:'));
            const prompts = await fs.readdir(promptsDir);
            for (const prompt of prompts) {
                if (prompt.endsWith('.prompt.md')) {
                    console.log(chalk.white(`    • ${prompt}`));
                }
            }
        }

        console.log();

        // List agents
        const agentsDir = path.join(templatesDir, 'agents');
        if (await fs.pathExists(agentsDir)) {
            console.log(chalk.yellow.bold('  Agents:'));
            const agents = await fs.readdir(agentsDir);
            for (const agent of agents) {
                if (agent.endsWith('.agent.md')) {
                    console.log(chalk.white(`    • ${agent}`));
                }
            }
        }

        console.log();
    });

async function copyDirectory(
    source: string,
    destination: string,
    force: boolean,
    type: string
): Promise<void> {
    const spinner = ora(`Installing ${type}...`).start();

    try {
        // Check if source exists
        if (!(await fs.pathExists(source))) {
            spinner.fail(`Template directory for ${type} not found`);
            return;
        }

        // Check if destination exists
        const destExists = await fs.pathExists(destination);

        if (destExists && !force) {
            spinner.warn(`${chalk.yellow(destination)} already exists. Use --force to overwrite.`);
            return;
        }

        // Ensure parent directory exists
        await fs.ensureDir(path.dirname(destination));

        // Copy directory
        await fs.copy(source, destination, { overwrite: force });

        // Count files
        const files = await countFiles(destination);
        spinner.succeed(`Installed ${chalk.green(files)} ${type} file(s) to ${chalk.cyan(destination)}`);

    } catch (error) {
        spinner.fail(`Failed to install ${type}`);
        throw error;
    }
}

async function countFiles(dir: string): Promise<number> {
    let count = 0;
    const items = await fs.readdir(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = await fs.stat(itemPath);

        if (stat.isFile()) {
            count++;
        } else if (stat.isDirectory()) {
            count += await countFiles(itemPath);
        }
    }

    return count;
}

program.parse();
