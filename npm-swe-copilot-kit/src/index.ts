/**
 * SWE Copilot Kit
 * 
 * A toolkit for initializing GitHub Copilot prompts and agents in your project.
 */

import * as path from 'path';
import * as fs from 'fs-extra';

export interface CopyOptions {
    force?: boolean;
    targetDir?: string;
}

export interface CopyResult {
    success: boolean;
    filesCount: number;
    destination: string;
    error?: string;
}

/**
 * Get the path to the templates directory
 */
export function getTemplatesDir(): string {
    return path.join(__dirname, '..', 'templates');
}

/**
 * Copy prompts to the target directory
 */
export async function copyPrompts(options: CopyOptions = {}): Promise<CopyResult> {
    const targetDir = options.targetDir || process.cwd();
    const source = path.join(getTemplatesDir(), 'prompts');
    const destination = path.join(targetDir, '.github', 'prompts');

    return copyTemplateDirectory(source, destination, options.force || false);
}

/**
 * Copy agents to the target directory
 */
export async function copyAgents(options: CopyOptions = {}): Promise<CopyResult> {
    const targetDir = options.targetDir || process.cwd();
    const source = path.join(getTemplatesDir(), 'agents');
    const destination = path.join(targetDir, '.github', 'agents');

    return copyTemplateDirectory(source, destination, options.force || false);
}

/**
 * Initialize both prompts and agents
 */
export async function initAll(options: CopyOptions = {}): Promise<{ prompts: CopyResult; agents: CopyResult }> {
    const prompts = await copyPrompts(options);
    const agents = await copyAgents(options);

    return { prompts, agents };
}

/**
 * List available templates
 */
export async function listTemplates(): Promise<{ prompts: string[]; agents: string[] }> {
    const templatesDir = getTemplatesDir();

    const promptsDir = path.join(templatesDir, 'prompts');
    const agentsDir = path.join(templatesDir, 'agents');

    const prompts: string[] = [];
    const agents: string[] = [];

    if (await fs.pathExists(promptsDir)) {
        const files = await fs.readdir(promptsDir);
        prompts.push(...files.filter(f => f.endsWith('.prompt.md')));
    }

    if (await fs.pathExists(agentsDir)) {
        const files = await fs.readdir(agentsDir);
        agents.push(...files.filter(f => f.endsWith('.agent.md')));
    }

    return { prompts, agents };
}

async function copyTemplateDirectory(
    source: string,
    destination: string,
    force: boolean
): Promise<CopyResult> {
    try {
        if (!(await fs.pathExists(source))) {
            return {
                success: false,
                filesCount: 0,
                destination,
                error: `Source directory not found: ${source}`
            };
        }

        const destExists = await fs.pathExists(destination);

        if (destExists && !force) {
            return {
                success: false,
                filesCount: 0,
                destination,
                error: `Destination already exists: ${destination}. Use force option to overwrite.`
            };
        }

        await fs.ensureDir(path.dirname(destination));
        await fs.copy(source, destination, { overwrite: force });

        const filesCount = await countFiles(destination);

        return {
            success: true,
            filesCount,
            destination
        };

    } catch (error) {
        return {
            success: false,
            filesCount: 0,
            destination,
            error: error instanceof Error ? error.message : String(error)
        };
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

export default {
    copyPrompts,
    copyAgents,
    initAll,
    listTemplates,
    getTemplatesDir
};
