/**
 * SWE Copilot Kit
 *
 * Install SWE prompt, agent, and skill templates for supported AI coding tools.
 */

import * as path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';

export type Platform = 'github-copilot' | 'claude-code' | 'antigravity' | 'codex' | 'kiro';

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

export interface PlatformCopyResult {
    type: string;
    result: CopyResult;
}

export interface PlatformInitResult {
    platform: Platform;
    copies: PlatformCopyResult[];
}

interface PlatformDefinition {
    displayName: string;
    skillsDirectory: string;
    agentsDirectory?: string;
    agentFormat?: 'markdown' | 'toml';
    agentAsSkill?: boolean;
}

const platformDefinitions: Record<Exclude<Platform, 'github-copilot'>, PlatformDefinition> = {
    'claude-code': { displayName: 'Claude Code', skillsDirectory: '.claude/skills', agentsDirectory: '.claude/agents', agentFormat: 'markdown' },
    antigravity: { displayName: 'Antigravity', skillsDirectory: '.agents/skills', agentAsSkill: true },
    codex: { displayName: 'Codex', skillsDirectory: '.agents/skills', agentsDirectory: '.codex/agents', agentFormat: 'toml' },
    kiro: { displayName: 'Kiro', skillsDirectory: '.kiro/skills', agentsDirectory: '.kiro/agents', agentFormat: 'markdown' }
};

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));

/** Get the path to the templates directory. */
export function getTemplatesDir(): string {
    return path.join(moduleDirectory, '..', 'templates');
}

/** Copy GitHub Copilot prompt files to the target directory. */
export async function copyPrompts(options: CopyOptions = {}): Promise<CopyResult> {
    const targetDir = options.targetDir || process.cwd();
    const source = path.join(getTemplatesDir(), 'prompts');
    const destination = path.join(targetDir, '.github', 'prompts');
    return copyTemplateDirectory(source, destination, options.force || false, src => {
        if (fs.lstatSync(src).isDirectory()) return true;
        return path.basename(src).startsWith('swe.') && src.endsWith('.prompt.md');
    });
}

/** Copy GitHub Copilot agent files to the target directory. */
export async function copyAgents(options: CopyOptions = {}): Promise<CopyResult> {
    const targetDir = options.targetDir || process.cwd();
    const source = path.join(getTemplatesDir(), 'agents');
    const destination = path.join(targetDir, '.github', 'agents');
    return copyTemplateDirectory(source, destination, options.force || false, src => {
        if (fs.lstatSync(src).isDirectory()) return true;
        return path.basename(src).startsWith('swe.') && src.endsWith('.agent.md');
    });
}

/** Copy GitHub Copilot skills to the target directory. */
export async function copySkills(options: CopyOptions = {}): Promise<CopyResult> {
    const targetDir = options.targetDir || process.cwd();
    const source = path.join(getTemplatesDir(), 'skills');
    const destination = path.join(targetDir, '.github', 'skills');
    return copyTemplateDirectory(source, destination, options.force || false, src => {
        if (src === source) return true;
        return fs.lstatSync(src).isDirectory() || path.basename(src) === 'SKILL.md';
    });
}

/** Initialize the legacy GitHub Copilot layout. */
export async function initAll(options: CopyOptions = {}): Promise<{ prompts: CopyResult; agents: CopyResult; skills: CopyResult }> {
    const targetDir = options.targetDir || process.cwd();
    const destinations = [
        path.join(targetDir, '.github', 'prompts'),
        path.join(targetDir, '.github', 'agents'),
        path.join(targetDir, '.github', 'skills')
    ];
    const conflict = await findDestinationConflict(destinations, options.force || false);
    if (conflict) {
        return {
            prompts: destinationConflictResult(destinations[0], conflict),
            agents: destinationConflictResult(destinations[1], conflict),
            skills: destinationConflictResult(destinations[2], conflict)
        };
    }

    const prompts = await copyPrompts(options);
    const agents = await copyAgents(options);
    const skills = await copySkills(options);
    return { prompts, agents, skills };
}

/**
 * Initialize templates for one supported AI coding tool.
 * Non-Copilot tools receive prompt templates as Agent Skills, the portable
 * replacement for vendor-specific prompt files.
 */
export async function initPlatform(platform: Platform, options: CopyOptions = {}): Promise<PlatformInitResult> {
    if (platform === 'github-copilot') {
        const result = await initAll(options);
        return {
            platform,
            copies: [
                { type: 'prompts', result: result.prompts },
                { type: 'agents', result: result.agents },
                { type: 'skills', result: result.skills }
            ]
        };
    }

    const definition = platformDefinitions[platform];
    const targetDir = options.targetDir || process.cwd();
    const skillsDestination = path.join(targetDir, definition.skillsDirectory);
    const agentsDestination = definition.agentsDirectory ? path.join(targetDir, definition.agentsDirectory) : undefined;
    const conflict = await findDestinationConflict(
        [skillsDestination, agentsDestination].filter((destination): destination is string => Boolean(destination)),
        options.force || false
    );
    if (conflict) {
        const copies: PlatformCopyResult[] = [{ type: 'skills', result: destinationConflictResult(skillsDestination, conflict) }];
        if (agentsDestination) copies.unshift({ type: 'agents', result: destinationConflictResult(agentsDestination, conflict) });
        return { platform, copies };
    }

    const skills = await copyPortableSkills(skillsDestination, options.force || false, definition.agentAsSkill || false);
    const copies: PlatformCopyResult[] = [{ type: 'skills', result: skills }];

    if (agentsDestination && definition.agentFormat) {
        const agents = await copyPortableAgents(agentsDestination, options.force || false, definition.agentFormat);
        copies.unshift({ type: 'agents', result: agents });
    }

    return { platform, copies };
}

/** List the source templates supplied by this package. */
export async function listTemplates(): Promise<{ prompts: string[]; agents: string[]; skills: string[] }> {
    const templatesDir = getTemplatesDir();
    const prompts = await listDirectory(path.join(templatesDir, 'prompts'), file => file.startsWith('swe.') && file.endsWith('.prompt.md'));
    const agents = await listDirectory(path.join(templatesDir, 'agents'), file => file.startsWith('swe.') && file.endsWith('.agent.md'));
    const skillsDir = path.join(templatesDir, 'skills');
    const skills = (await fs.pathExists(skillsDir)) ? (await fs.readdir(skillsDir)).filter(file => file.startsWith('swe.')) : [];
    return { prompts, agents, skills };
}

/** Add the installed platform's generated files to .gitignore. */
export async function updateGitignore(targetDir: string, platform: Platform = 'github-copilot'): Promise<boolean> {
    const gitignorePath = path.join(targetDir, '.gitignore');
    const marker = platform === 'github-copilot'
        ? '# Generated SWE Copilot Kit'
        : `# Generated SWE Copilot Kit (${platformDefinitions[platform].displayName})`;
    try {
        await fs.ensureFile(gitignorePath);
        const content = await fs.readFile(gitignorePath, 'utf8');
        if (content.includes(marker)) return false;
        const prefix = content.endsWith('\n') || content.length === 0 ? '' : '\n';
        await fs.appendFile(gitignorePath, prefix + [marker, ...getIgnoredPaths(platform)].join('\n') + '\n');
        return true;
    } catch (error) {
        console.error('Failed to update .gitignore:', error);
        return false;
    }
}

export function getPlatformDisplayName(platform: Platform): string {
    return platform === 'github-copilot' ? 'GitHub Copilot' : platformDefinitions[platform].displayName;
}

export function isPlatform(value: string): value is Platform {
    return value === 'github-copilot' || value === 'claude-code' || value === 'antigravity' || value === 'codex' || value === 'kiro';
}

async function copyPortableSkills(destination: string, force: boolean, includeAgent: boolean): Promise<CopyResult> {
    try {
        return writeGeneratedFiles(destination, await getSkillEntries(includeAgent), force);
    } catch (error) {
        return failedCopy(destination, error);
    }
}

async function copyPortableAgents(destination: string, force: boolean, format: 'markdown' | 'toml'): Promise<CopyResult> {
    try {
        const agentsDirectory = path.join(getTemplatesDir(), 'agents');
        const files = await listDirectory(agentsDirectory, file => file.startsWith('swe.') && file.endsWith('.agent.md'));
        const entries = await Promise.all(files.map(async file => {
            const content = await fs.readFile(path.join(agentsDirectory, file), 'utf8');
            const name = normaliseName(file);
            return format === 'toml'
                ? { relativePath: `${name}.toml`, content: toCodexAgent(content, name) }
                : { relativePath: `${name}.md`, content: toMarkdownAgent(content, name) };
        }));
        return writeGeneratedFiles(destination, entries, force);
    } catch (error) {
        return failedCopy(destination, error);
    }
}

async function getSkillEntries(includeAgent: boolean): Promise<Array<{ relativePath: string; content: string }>> {
    const templatesDir = getTemplatesDir();
    const entries: Array<{ relativePath: string; content: string }> = [];
    const promptsDirectory = path.join(templatesDir, 'prompts');
    const promptFiles = await listDirectory(promptsDirectory, file => file.startsWith('swe.') && file.endsWith('.prompt.md'));
    for (const file of promptFiles) {
        const name = normaliseName(file);
        entries.push({ relativePath: `${name}/SKILL.md`, content: toSkill(await fs.readFile(path.join(promptsDirectory, file), 'utf8'), name) });
    }

    const skillsDirectory = path.join(templatesDir, 'skills');
    if (await fs.pathExists(skillsDirectory)) {
        for (const directory of await fs.readdir(skillsDirectory)) {
            const source = path.join(skillsDirectory, directory, 'SKILL.md');
            if (await fs.pathExists(source)) {
                const name = normaliseName(directory);
                entries.push({ relativePath: `${name}/SKILL.md`, content: toSkill(await fs.readFile(source, 'utf8'), name) });
            }
        }
    }

    if (includeAgent) {
        const agentsDirectory = path.join(templatesDir, 'agents');
        const agentFiles = await listDirectory(agentsDirectory, file => file.startsWith('swe.') && file.endsWith('.agent.md'));
        for (const file of agentFiles) {
            const name = normaliseName(file);
            entries.push({ relativePath: `${name}/SKILL.md`, content: toSkill(await fs.readFile(path.join(agentsDirectory, file), 'utf8'), name) });
        }
    }
    return entries;
}

async function writeGeneratedFiles(destination: string, entries: Array<{ relativePath: string; content: string }>, force: boolean): Promise<CopyResult> {
    if (await fs.pathExists(destination) && !force) {
        return { success: false, filesCount: 0, destination, error: `Destination already exists: ${destination}. Use force option to overwrite.` };
    }
    await fs.ensureDir(destination);
    await Promise.all(entries.map(entry => fs.outputFile(path.join(destination, entry.relativePath), entry.content)));
    return { success: true, filesCount: entries.length, destination };
}

async function findDestinationConflict(destinations: string[], force: boolean): Promise<string | undefined> {
    if (force) return undefined;
    for (const destination of destinations) {
        if (await fs.pathExists(destination)) return destination;
    }
    return undefined;
}

function destinationConflictResult(destination: string, conflict: string): CopyResult {
    return {
        success: false,
        filesCount: 0,
        destination,
        error: `Initialization was not started because destination already exists: ${conflict}. Use force option to overwrite.`
    };
}

function toSkill(content: string, name: string): string {
    const { description, body } = splitFrontmatter(content);
    return `---\nname: ${name}\ndescription: ${description}\n---\n\n${body.trim()}\n`;
}

function toMarkdownAgent(content: string, name: string): string {
    const { description, body } = splitFrontmatter(content);
    return `---\nname: ${name}\ndescription: ${description}\n---\n\n${body.trim()}\n`;
}

function toCodexAgent(content: string, name: string): string {
    const { description, body } = splitFrontmatter(content);
    const instructions = body.trim().replace(/"""/g, '\\"""');
    return `name = "${name.replace(/-/g, '_')}"\ndescription = "${escapeToml(description)}"\ndeveloper_instructions = """\n${instructions}\n"""\n`;
}

function splitFrontmatter(content: string): { description: string; body: string } {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) return { description: 'Reusable SWE workflow.', body: content };
    const description = match[1].match(/^description:\s*(.+)$/m)?.[1].trim() || 'Reusable SWE workflow.';
    return { description, body: match[2] };
}

function normaliseName(file: string): string {
    return file.replace(/\.(prompt|agent)\.md$/, '').replace(/\.md$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function escapeToml(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function getIgnoredPaths(platform: Platform): string[] {
    switch (platform) {
        case 'github-copilot': return ['.github/agents/swe.*', '.github/prompts/swe.*', '.github/skills/swe.*'];
        case 'claude-code': return ['.claude/agents/swe-*', '.claude/skills/swe-*'];
        case 'antigravity': return ['.agents/skills/swe-*'];
        case 'codex': return ['.codex/agents/swe-*.toml', '.agents/skills/swe-*'];
        case 'kiro': return ['.kiro/agents/swe-*', '.kiro/skills/swe-*'];
    }
}

async function listDirectory(directory: string, predicate: (file: string) => boolean): Promise<string[]> {
    if (!(await fs.pathExists(directory))) return [];
    return (await fs.readdir(directory)).filter(predicate);
}

function failedCopy(destination: string, error: unknown): CopyResult {
    return { success: false, filesCount: 0, destination, error: error instanceof Error ? error.message : String(error) };
}

async function copyTemplateDirectory(source: string, destination: string, force: boolean, filterFn?: (src: string) => boolean): Promise<CopyResult> {
    try {
        if (!(await fs.pathExists(source))) return { success: false, filesCount: 0, destination, error: `Source directory not found: ${source}` };
        if (await fs.pathExists(destination) && !force) {
            return { success: false, filesCount: 0, destination, error: `Destination already exists: ${destination}. Use force option to overwrite.` };
        }
        await fs.ensureDir(path.dirname(destination));
        await fs.copy(source, destination, {
            overwrite: force,
            filter: src => filterFn ? filterFn(src) : fs.lstatSync(src).isDirectory() || path.basename(src).startsWith('swe.')
        });
        return { success: true, filesCount: await countFiles(destination), destination };
    } catch (error) {
        return failedCopy(destination, error);
    }
}

async function countFiles(directory: string): Promise<number> {
    let count = 0;
    for (const item of await fs.readdir(directory)) {
        const itemPath = path.join(directory, item);
        if ((await fs.stat(itemPath)).isFile()) count++;
        else count += await countFiles(itemPath);
    }
    return count;
}

export default { copyPrompts, copyAgents, copySkills, initAll, initPlatform, listTemplates, getTemplatesDir, updateGitignore };
