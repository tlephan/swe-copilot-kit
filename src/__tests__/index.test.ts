import * as path from 'path';
import * as fs from 'fs-extra';
import { getTemplatesDir, listTemplates, copyPrompts, copyAgents, copySkills, initAll, initPlatform, updateGitignore } from '../index.js';

describe('swe-copilot-kit', () => {
    const testDir = path.join(__dirname, '../../test-output');

    beforeEach(async () => {
        // Clean up test directory before each test
        await fs.remove(testDir);
        await fs.ensureDir(testDir);
    });

    afterAll(async () => {
        // Clean up after all tests
        await fs.remove(testDir);
    });

    describe('getTemplatesDir', () => {
        it('should return a valid templates directory path', () => {
            const templatesDir = getTemplatesDir();
            expect(templatesDir).toBeDefined();
            expect(typeof templatesDir).toBe('string');
            expect(templatesDir).toContain('templates');
        });

        it('should return an existing directory', async () => {
            const templatesDir = getTemplatesDir();
            const exists = await fs.pathExists(templatesDir);
            expect(exists).toBe(true);
        });
    });

    describe('listTemplates', () => {
        it('should return an object with prompts, agents and skills arrays', async () => {
            const templates = await listTemplates();
            expect(templates).toHaveProperty('prompts');
            expect(templates).toHaveProperty('agents');
            expect(templates).toHaveProperty('skills');
            expect(Array.isArray(templates.prompts)).toBe(true);
            expect(Array.isArray(templates.agents)).toBe(true);
            expect(Array.isArray(templates.skills)).toBe(true);
        });

        it('should list prompt files with swe.*.prompt.md pattern', async () => {
            const templates = await listTemplates();
            templates.prompts.forEach(prompt => {
                expect(prompt).toMatch(/^swe\..*\.prompt\.md$/);
            });
            expect(templates.prompts).toContain('swe.commit-code.prompt.md');
        });

        it('should list agent files with swe.*.agent.md pattern', async () => {
            const templates = await listTemplates();
            templates.agents.forEach(agent => {
                expect(agent).toMatch(/^swe\..*\.agent\.md$/);
            });
        });

        it('should list all bundled SWE skills', async () => {
            const templates = await listTemplates();
            expect(templates.skills).toEqual(expect.arrayContaining([
                'swe.code-review',
                'swe.unit-test-generation',
                'swe.integration-test-generation',
                'swe.design',
                'swe.implement',
                'swe.verify'
            ]));
        });
    });

    describe('copyPrompts', () => {
        it('should copy prompts to target directory', async () => {
            const result = await copyPrompts({ targetDir: testDir });

            expect(result.success).toBe(true);
            expect(result.filesCount).toBeGreaterThan(0);
            expect(result.destination).toContain(path.join('.github', 'prompts'));

            const promptsExist = await fs.pathExists(path.join(testDir, '.github', 'prompts'));
            expect(promptsExist).toBe(true);
        });

        it('should fail if destination exists without force option', async () => {
            // First copy
            await copyPrompts({ targetDir: testDir });

            // Second copy without force should fail
            const result = await copyPrompts({ targetDir: testDir, force: false });
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });

        it('should overwrite with force option', async () => {
            // First copy
            await copyPrompts({ targetDir: testDir });

            // Second copy with force should succeed
            const result = await copyPrompts({ targetDir: testDir, force: true });
            expect(result.success).toBe(true);
        });
    });

    describe('copyAgents', () => {
        it('should copy agents to target directory', async () => {
            const result = await copyAgents({ targetDir: testDir });

            expect(result.success).toBe(true);
            expect(result.filesCount).toBeGreaterThanOrEqual(0);
            expect(result.destination).toContain(path.join('.github', 'agents'));

            const agentsExist = await fs.pathExists(path.join(testDir, '.github', 'agents'));
            expect(agentsExist).toBe(true);
        });

        it('should fail if destination exists without force option', async () => {
            // First copy
            await copyAgents({ targetDir: testDir });

            // Second copy without force should fail
            const result = await copyAgents({ targetDir: testDir, force: false });
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe('copySkills', () => {
        it('should copy skills to target directory', async () => {
            const result = await copySkills({ targetDir: testDir });

            expect(result.success).toBe(true);
            expect(result.filesCount).toBeGreaterThanOrEqual(0);
            expect(result.destination).toContain(path.join('.github', 'skills'));

            const skillsExist = await fs.pathExists(path.join(testDir, '.github', 'skills'));
            expect(skillsExist).toBe(true);
        });
    });

    describe('initAll', () => {
        it('should initialize prompts, agents, and skills', async () => {
            const result = await initAll({ targetDir: testDir });

            expect(result.prompts.success).toBe(true);
            expect(result.agents.success).toBe(true);
            expect(result.skills.success).toBe(true);

            const promptsExist = await fs.pathExists(path.join(testDir, '.github', 'prompts'));
            const agentsExist = await fs.pathExists(path.join(testDir, '.github', 'agents'));
            const skillsExist = await fs.pathExists(path.join(testDir, '.github', 'skills'));

            expect(promptsExist).toBe(true);
            expect(agentsExist).toBe(true);
            expect(skillsExist).toBe(true);
        });

        it('should report correct file counts', async () => {
            const result = await initAll({ targetDir: testDir });

            expect(result.prompts.filesCount).toBeGreaterThan(0);
            expect(result.agents.filesCount).toBeGreaterThanOrEqual(0);
            expect(result.skills.filesCount).toBeGreaterThanOrEqual(0);
        });

        it('should not partially initialize when one destination already exists', async () => {
            const existingAgents = path.join(testDir, '.github', 'agents');
            await fs.ensureDir(existingAgents);
            await fs.writeFile(path.join(existingAgents, 'local.agent.md'), 'keep me');

            const result = await initAll({ targetDir: testDir });

            expect(result.prompts.success).toBe(false);
            expect(result.agents.success).toBe(false);
            expect(result.skills.success).toBe(false);
            expect(await fs.pathExists(path.join(testDir, '.github', 'prompts'))).toBe(false);
            expect(await fs.pathExists(path.join(testDir, '.github', 'skills'))).toBe(false);
            expect(await fs.readFile(path.join(existingAgents, 'local.agent.md'), 'utf8')).toBe('keep me');
        });
    });

    describe('initPlatform', () => {
        it.each([
            ['claude-code', '.claude', 'skills'],
            ['antigravity', '.agents', 'skills'],
            ['codex', '.codex', 'agents'],
            ['kiro', '.kiro', 'agents']
        ] as const)('should initialize %s templates in its native layout', async (platform, directory, child) => {
            const result = await initPlatform(platform, { targetDir: testDir });

            expect(result.copies.every(copy => copy.result.success)).toBe(true);
            expect(await fs.pathExists(path.join(testDir, directory, child))).toBe(true);
        });

        it('should convert prompts into portable skills for Claude Code', async () => {
            await initPlatform('claude-code', { targetDir: testDir });
            const skill = path.join(testDir, '.claude', 'skills', 'swe-code-review', 'SKILL.md');

            expect(await fs.pathExists(skill)).toBe(true);
            expect(await fs.readFile(skill, 'utf8')).toContain('name: swe-code-review');
        });

        it('should generate a Codex TOML agent', async () => {
            await initPlatform('codex', { targetDir: testDir });
            const agent = path.join(testDir, '.codex', 'agents', 'swe-coder.toml');

            expect(await fs.readFile(agent, 'utf8')).toContain('name = "swe_coder"');
        });

        it('should not partially initialize a platform when its agent destination exists', async () => {
            const agentsDirectory = path.join(testDir, '.kiro', 'agents');
            await fs.ensureDir(agentsDirectory);

            const result = await initPlatform('kiro', { targetDir: testDir });

            expect(result.copies.every(copy => !copy.result.success)).toBe(true);
            expect(await fs.pathExists(path.join(testDir, '.kiro', 'skills'))).toBe(false);
        });
    });

    describe('updateGitignore', () => {
        it('should create .gitignore if it does not exist', async () => {
            await updateGitignore(testDir);
            const exists = await fs.pathExists(path.join(testDir, '.gitignore'));
            expect(exists).toBe(true);
            const content = await fs.readFile(path.join(testDir, '.gitignore'), 'utf8');
            expect(content).toContain('# Generated SWE Copilot Kit');
            expect(content).toContain('.github/agents/swe.*');
        });

        it('should append to existing .gitignore', async () => {
            const gitignorePath = path.join(testDir, '.gitignore');
            await fs.ensureFile(gitignorePath);
            await fs.writeFile(gitignorePath, 'node_modules\n');
            
            await updateGitignore(testDir);
            
            const content = await fs.readFile(gitignorePath, 'utf8');
            expect(content).toContain('node_modules');
            expect(content).toContain('# Generated SWE Copilot Kit');
        });

        it('should not duplicate if already exists', async () => {
            await updateGitignore(testDir);
            const content1 = await fs.readFile(path.join(testDir, '.gitignore'), 'utf8');
            
            await updateGitignore(testDir);
            const content2 = await fs.readFile(path.join(testDir, '.gitignore'), 'utf8');
            
            expect(content1).toEqual(content2);
        });
    });
});
