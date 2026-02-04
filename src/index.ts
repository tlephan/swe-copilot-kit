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
 * Copy skills to the target directory
 */
export async function copySkills(options: CopyOptions = {}): Promise<CopyResult> {
    const targetDir = options.targetDir || process.cwd();
    const source = path.join(getTemplatesDir(), 'skills');
    const destination = path.join(targetDir, '.github', 'skills');

    // Skills directory might not exist yet, so we handle it gracefully in copyTemplateDirectory
    // but here we can just proceed.
    return copyTemplateDirectory(source, destination, options.force || false);
}

/**
 * Initialize prompts, agents and skills
 */
export async function initAll(options: CopyOptions = {}): Promise<{ prompts: CopyResult; agents: CopyResult; skills: CopyResult }> {
    const prompts = await copyPrompts(options);
    const agents = await copyAgents(options);
    const skills = await copySkills(options);

    return { prompts, agents, skills };
}

/**
 * List available templates
 */
export async function listTemplates(): Promise<{ prompts: string[]; agents: string[]; skills: string[] }> {
    const templatesDir = getTemplatesDir();

    const promptsDir = path.join(templatesDir, 'prompts');
    const agentsDir = path.join(templatesDir, 'agents');
    const skillsDir = path.join(templatesDir, 'skills');

    const prompts: string[] = [];
    const agents: string[] = [];
    const skills: string[] = [];

    if (await fs.pathExists(promptsDir)) {
        const files = await fs.readdir(promptsDir);
        prompts.push(...files.filter(f => f.startsWith('swe.') && f.endsWith('.prompt.md')));
    }

    if (await fs.pathExists(agentsDir)) {
        const files = await fs.readdir(agentsDir);
        agents.push(...files.filter(f => f.startsWith('swe.') && f.endsWith('.agent.md')));
    }

    if (await fs.pathExists(skillsDir)) {
        const files = await fs.readdir(skillsDir);
        skills.push(...files.filter(f => f.startsWith('swe.') && f.endsWith('.skill.md')));
    }

    return { prompts, agents, skills };
}

/**
 * Update .gitignore to include generated files
 */
export async function updateGitignore(targetDir: string): Promise<boolean> {
    const gitignorePath = path.join(targetDir, '.gitignore');
    const toIgnore = [
        '# Generated SWE Copilot Kit',
        '.github/agents/swe.*',
        '.github/prompts/swe.*',
        '.github/skills/swe.*'
    ];

    try {
        await fs.ensureFile(gitignorePath);
        const content = await fs.readFile(gitignorePath, 'utf8');
        
        if (!content.includes('# Generated SWE Copilot Kit')) {
            const prefix = content.endsWith('\n') || content.length === 0 ? '' : '\n';
            await fs.appendFile(gitignorePath, prefix + toIgnore.join('\n') + '\n');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Failed to update .gitignore:', error);
        return false;
    }
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
        await fs.copy(source, destination, { 
            overwrite: force,
            filter: (src) => {
                // Always allow the root source directory and subdirectories
                if (fs.lstatSync(src).isDirectory()) return true;
                
                const basename = path.basename(src);
                // Allow files that start with 'swe.' or are named 'SKILL.md'
                return basename.startsWith('swe.') || basename === 'SKILL.md';
            }
        });

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
    copySkills,
    initAll,
    listTemplates,
    getTemplatesDir
};
