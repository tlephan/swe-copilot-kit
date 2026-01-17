import * as path from 'path';
import * as fs from 'fs-extra';
import { getTemplatesDir, listTemplates, copyPrompts, copyAgents, initAll } from '../index';

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
        it('should return an object with prompts and agents arrays', async () => {
            const templates = await listTemplates();
            expect(templates).toHaveProperty('prompts');
            expect(templates).toHaveProperty('agents');
            expect(Array.isArray(templates.prompts)).toBe(true);
            expect(Array.isArray(templates.agents)).toBe(true);
        });

        it('should list prompt files with .prompt.md extension', async () => {
            const templates = await listTemplates();
            templates.prompts.forEach(prompt => {
                expect(prompt).toMatch(/\.prompt\.md$/);
            });
        });

        it('should list agent files with .agent.md extension', async () => {
            const templates = await listTemplates();
            templates.agents.forEach(agent => {
                expect(agent).toMatch(/\.agent\.md$/);
            });
        });
    });

    describe('copyPrompts', () => {
        it('should copy prompts to target directory', async () => {
            const result = await copyPrompts({ targetDir: testDir });

            expect(result.success).toBe(true);
            expect(result.filesCount).toBeGreaterThan(0);
            expect(result.destination).toContain('.github/prompts');

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
            expect(result.filesCount).toBeGreaterThan(0);
            expect(result.destination).toContain('.github/agents');

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

    describe('initAll', () => {
        it('should initialize both prompts and agents', async () => {
            const result = await initAll({ targetDir: testDir });

            expect(result.prompts.success).toBe(true);
            expect(result.agents.success).toBe(true);

            const promptsExist = await fs.pathExists(path.join(testDir, '.github', 'prompts'));
            const agentsExist = await fs.pathExists(path.join(testDir, '.github', 'agents'));

            expect(promptsExist).toBe(true);
            expect(agentsExist).toBe(true);
        });

        it('should report correct file counts', async () => {
            const result = await initAll({ targetDir: testDir });

            expect(result.prompts.filesCount).toBeGreaterThan(0);
            expect(result.agents.filesCount).toBeGreaterThan(0);
        });
    });
});
