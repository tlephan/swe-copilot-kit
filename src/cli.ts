#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { CopyResult, getPlatformDisplayName, initPlatform, isPlatform, listTemplates, Platform, updateGitignore } from './index.js';

import packageJson from '../package.json' with { type: 'json' };

interface InitOptions {
    force?: boolean;
    gitignore?: boolean;
    platform?: string;
    claudeCode?: boolean;
    antigravity?: boolean;
    codex?: boolean;
    kiro?: boolean;
}

const program = new Command();

program
    .name('swe-copilot-kit')
    .description('Initialize SWE templates for AI coding tools')
    .version(packageJson.version);

program
    .command('init')
    .description('Initialize templates for an AI coding tool')
    .option('-f, --force', 'Overwrite existing files', false)
    .option('--gitignore', 'Add generated template paths to .gitignore', false)
    .option('-p, --platform <platform>', 'Target: github-copilot, claude-code, antigravity, codex, or kiro', 'github-copilot')
    .option('--claude-code', 'Alias for --platform claude-code', false)
    .option('--antigravity', 'Alias for --platform antigravity', false)
    .option('--codex', 'Alias for --platform codex', false)
    .option('--kiro', 'Alias for --platform kiro', false)
    .action(async (options: InitOptions) => {
        const platform = resolvePlatform(options);
        if (!platform) {
            console.error(chalk.red('Error: select exactly one supported platform.'));
            process.exitCode = 1;
            return;
        }

        const targetDir = process.cwd();
        const platformName = getPlatformDisplayName(platform);
        console.log(chalk.bold(`SWE Copilot Kit - ${platformName}`));
        console.log(chalk.blue('Target directory:'), chalk.white(targetDir));
        console.log();

        try {
            const initialization = await initPlatform(platform, { targetDir, force: options.force });
            for (const copy of initialization.copies) {
                reportCopy(copy.type, copy.result);
            }

            if (initialization.copies.some(copy => !copy.result.success)) {
                process.exitCode = 1;
                return;
            }

            if (options.gitignore) {
                const gitignoreSpinner = ora('Updating .gitignore...').start();
                const updated = await updateGitignore(targetDir, platform);
                updated ? gitignoreSpinner.succeed('Updated .gitignore') : gitignoreSpinner.info('.gitignore already up to date');
            }

            console.log();
            console.log(chalk.green.bold(`Successfully initialized ${platformName} configuration.`));
            console.log(chalk.gray('Review and customize the generated templates before using them.'));
        } catch (error) {
            console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
            process.exitCode = 1;
        }
    });

program
    .command('list')
    .description('List available source templates')
    .action(async () => {
        const templates = await listTemplates();
        for (const [type, files] of Object.entries(templates)) {
            console.log(chalk.yellow.bold(`${type}:`));
            files.forEach(file => console.log(`  ${file}`));
        }
    });

function reportCopy(type: string, result: CopyResult): void {
    if (result.success) {
        console.log(chalk.green(`Installed ${result.filesCount} ${type} file(s) to ${result.destination}`));
        return;
    }
    console.log(chalk.yellow(`Skipped ${type}: ${result.error}`));
}

function resolvePlatform(options: InitOptions): Platform | undefined {
    const aliases: Platform[] = [];
    if (options.claudeCode) aliases.push('claude-code');
    if (options.antigravity) aliases.push('antigravity');
    if (options.codex) aliases.push('codex');
    if (options.kiro) aliases.push('kiro');
    if (aliases.length > 1 || (aliases.length === 1 && options.platform !== 'github-copilot' && options.platform !== aliases[0])) return undefined;
    if (aliases.length === 1) return aliases[0];
    return options.platform && isPlatform(options.platform) ? options.platform : undefined;
}

program.parse();
