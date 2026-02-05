#!/usr/bin/env node

/**
 * SpecSkills Setup
 * 
 * One-time setup wizard that installs specskills workflow files.
 * After installation, everything works through GitHub Copilot commands.
 * 
 * Usage:
 *   npx specskills
 *   npx specskills --yes     (use defaults)
 *   npx specskills --dry-run (preview only)
 */

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(msg, type = 'info') {
  const c = type === 'success' ? colors.green : type === 'header' ? colors.cyan + colors.bright : type === 'error' ? '\x1b[31m' : colors.blue;
  console.log(`${c}${msg}${colors.reset}`);
}

// Managed block helpers for appending/updating content
const MANAGED_START = '<!-- specs-workflow-start -->';
const MANAGED_END = '<!-- specs-workflow-end -->';

function hasManagedBlock(content) {
  return content.includes(MANAGED_START) && content.includes(MANAGED_END);
}

function extractManagedBlock(content) {
  const start = content.indexOf(MANAGED_START);
  const end = content.indexOf(MANAGED_END) + MANAGED_END.length;
  if (start === -1 || end === -1) return null;
  return content.substring(start, end);
}

function replaceManagedBlock(content, newBlock) {
  const oldBlock = extractManagedBlock(content);
  if (oldBlock) {
    return content.replace(oldBlock, newBlock);
  }
  return `${content}\n\n${newBlock}`;
}

function createManagedBlock(content) {
  return `${MANAGED_START}\n\n${content}\n${MANAGED_END}`;
}

function getCopilotInstructionsContent() {
  return `# Specs Workflow

File-based spec-driven development workflow (no CLI required).

## Where Things Go

**Changes (active work):**
- \`specs/changes/<change-name>/\`
  - \`.change.json\` - State tracking
  - \`proposal.md\`, \`specs/\`, \`design.md\`, \`tasks.md\` - Artifacts
  - \`implementation/\` - Work output

**Main Specs (source of truth):**
- \`specs/<capability>/spec.md\`

**Schemas & Templates:**
- \`specs/schemas/\` - Workflow definitions
- \`specs/templates/\` - Artifact templates

## Naming

- **Change names:** kebab-case (e.g., \`add-oauth-login\`)
- **Capabilities:** kebab-case folder + spec.md

## Command Behavior

| Command | Behavior |
|---------|----------|
| \`/specs-new <name>\` | Create change workspace |
| \`/specs-status\` | Show artifact statuses |
| \`/specs-continue\` | Create ONE next-ready artifact |
| \`/specs-ff\` | Fast-forward all artifacts to apply-ready |
| \`/specs-apply\` | Implement tasks and check them off |
| \`/specs-verify\` | Verify implementation matches specs |
| \`/specs-sync\` | Merge change specs to main specs/ |
| \`/specs-archive\` | Complete and move to archive/ |
| \`/specs-validate\` | Validate format and structure |

## Artifact Status

- **blocked:** Dependencies incomplete
- **ready:** Dependencies done, artifact not created
- **done:** Artifact exists

Status flows: \`blocked → ready → done\`

## Delta Spec Format

When modifying specs:

\`\`\`markdown
## ADDED Requirements
### Requirement: New Feature
Description...

## MODIFIED Requirements  
### Requirement: Existing Feature
Updated description...

## REMOVED Requirements
### Requirement: Old Feature
**Reason:** Why removed
**Migration:** How to migrate
\`\`\`

## Key Rules

1. **One capability per folder** in specs/
2. **Check status before continue**
3. **Use checkboxes** in tasks.md: \`- [ ] Task description\`
4. **Verify before archive** - ensure implementation matches specs
5. **Sync then archive** - promote specs before completing`;
}

function prompt(rl, q) {
  return new Promise(resolve => {
    rl.question(`${colors.blue}${q}${colors.reset} `, a => resolve(a.trim()));
  });
}

// Package files to install
const FILES = {
  schemas: ['spec-driven.yaml', 'tdd.yaml'],
  templates: ['proposal.md', 'spec.md', 'design.md', 'tasks.md'],
  prompts: [
    'explore.prompt.md', 'new.prompt.md', 'continue.prompt.md', 'ff.prompt.md',
    'apply.prompt.md', 'verify.prompt.md', 'sync.prompt.md', 'archive.prompt.md',
    'bulk-archive.prompt.md', 'status.prompt.md', 'validate.prompt.md',
    'onboard.prompt.md', 'project-init.prompt.md'
  ],
  scripts: ['validate.js'],
  agents: ['specs.agent.md'],
  root: ['README.md']
};

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const yes = args.includes('--yes') || args.includes('-y');
  const targetDir = process.cwd();
  
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  
  try {
    log(`\n${'='.repeat(50)}`, 'header');
    log('  SpecSkills Setup', 'header');
    log(`${'='.repeat(50)}\n`);
    
    if (dryRun) {
      log('🔍 DRY RUN - Previewing changes\n', 'yellow');
    }
    
    // Detect existing
    const hasSpecs = fs.existsSync(path.join(targetDir, 'specs'));
    const hasAgents = fs.existsSync(path.join(targetDir, '.github/agents/specs.agent.md'));
    const hasCopilot = fs.existsSync(path.join(targetDir, '.github/copilot-instructions.md'));
    
    if (hasSpecs) {
      log('⚠️  specs/ directory already exists\n', 'yellow');
    }
    
    // Configuration
    const config = {
      createAgents: !hasAgents,
      updateCopilot: true,
      schema: 'spec-driven'
    };
    
    if (!yes) {
      log('Configuration:\n', 'header');
      
      if (!hasAgents) {
        const ans = await prompt(rl, 'Create @specs agent? (yes/no) [yes]:') || 'yes';
        config.createAgents = ans.toLowerCase() === 'yes';
      }
      
      if (hasCopilot) {
        const ans = await prompt(rl, 'Update .github/copilot-instructions.md with specs workflow section? (yes/no) [yes]:') || 'yes';
        config.updateCopilot = ans.toLowerCase() === 'yes';
      } else {
        const ans = await prompt(rl, 'Create .github/copilot-instructions.md? (yes/no) [yes]:') || 'yes';
        config.updateCopilot = ans.toLowerCase() === 'yes';
      }
      
      log('\nSchema:');
      log('  1. spec-driven (default) - Full workflow');
      log('  2. tdd - Test-driven development');
      log('  3. rapid - Minimal workflow');
      const schema = await prompt(rl, 'Choose (1/2/3) [1]:') || '1';
      config.schema = { '1': 'spec-driven', '2': 'tdd', '3': 'rapid' }[schema] || 'spec-driven';
    }
    
    // Preview
    log('\n📦 Files to install:\n', 'header');
    const files = [];
    
    if (!hasSpecs) {
      files.push('specs/');
      files.push('specs/schemas/');
      files.push('specs/templates/');
      files.push('specs/changes/');
      files.push('specs/scripts/');
      files.push('.github/prompts/');
      files.push('.github/agents/');
    }
    
    for (const f of FILES.schemas) files.push(`specs/schemas/${f}`);
    for (const f of FILES.templates) files.push(`specs/templates/${f}`);
    for (const f of FILES.prompts) files.push(`.github/prompts/${f}`);
    for (const f of FILES.scripts) files.push(`specs/scripts/${f}`);
    
    for (const f of FILES.agents) files.push(`.github/agents/${f}`);
    if (config.updateCopilot) {
      if (hasCopilot) {
        files.push('.github/copilot-instructions.md (update with managed block)');
      } else {
        files.push('.github/copilot-instructions.md');
      }
    }
    files.push('README.md');
    files.push('specs/config.yaml');
    
    for (const f of files) log(`  + ${f}`, 'success');
    
    // Confirm
    if (!yes && !dryRun) {
      const confirm = await prompt(rl, '\nInstall? (yes/no) [yes]:') || 'yes';
      if (confirm.toLowerCase() !== 'yes') {
        log('Cancelled.', 'yellow');
        rl.close();
        return;
      }
    }
    
    if (dryRun) {
      log('\n✓ Dry run complete', 'success');
      rl.close();
      return;
    }
    
    // Install
    log('\n🚀 Installing...\n');
    
    const pkgDir = path.dirname(__dirname); // Get package directory
    
    // Copy function
    const copy = (src, dest) => {
      const srcPath = path.join(pkgDir, src);
      const destPath = path.join(targetDir, dest);
      
      if (!fs.existsSync(path.dirname(destPath))) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
      }
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        log(`  ✓ ${dest}`, 'success');
      }
    };
    
    // Create directories
    if (!hasSpecs) {
      fs.mkdirSync(path.join(targetDir, 'specs'), { recursive: true });
      fs.mkdirSync(path.join(targetDir, 'specs/schemas'), { recursive: true });
      fs.mkdirSync(path.join(targetDir, 'specs/templates'), { recursive: true });
      fs.mkdirSync(path.join(targetDir, 'specs/changes'), { recursive: true });
      fs.mkdirSync(path.join(targetDir, 'specs/scripts'), { recursive: true });
      fs.mkdirSync(path.join(targetDir, '.github/prompts'), { recursive: true });
      fs.mkdirSync(path.join(targetDir, '.github/agents'), { recursive: true });
    }
    
    // Copy files
    for (const f of FILES.schemas) copy(`schemas/${f}`, `specs/schemas/${f}`);
    for (const f of FILES.templates) copy(`templates/${f}`, `specs/templates/${f}`);
    for (const f of FILES.prompts) copy(`.github/prompts/${f}`, `.github/prompts/${f}`);
    for (const f of FILES.scripts) copy(`scripts/${f}`, `specs/scripts/${f}`);
    
    for (const f of FILES.agents) copy(`.github/agents/${f}`, `.github/agents/${f}`);
    
    // Handle copilot-instructions.md with managed blocks
    if (config.updateCopilot) {
      const destPath = path.join(targetDir, '.github/copilot-instructions.md');
      const newContent = getCopilotInstructionsContent();
      
      if (fs.existsSync(destPath)) {
        const existingContent = fs.readFileSync(destPath, 'utf-8');
        if (hasManagedBlock(existingContent)) {
          // Update existing managed block
          const updatedContent = replaceManagedBlock(existingContent, createManagedBlock(newContent));
          fs.writeFileSync(destPath, updatedContent);
          log('  ✓ .github/copilot-instructions.md (updated managed block)', 'success');
        } else {
          // Append managed block to existing file
          const managedSection = createManagedBlock(newContent);
          const updatedContent = `${existingContent}\n\n${managedSection}`;
          fs.writeFileSync(destPath, updatedContent);
          log('  ✓ .github/copilot-instructions.md (appended managed block)', 'success');
        }
      } else {
        // Create new file with managed block
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, createManagedBlock(newContent));
        log('  ✓ .github/copilot-instructions.md', 'success');
      }
    }
    
    copy('README.md', 'README.md');
    
    // Write config
    fs.writeFileSync(
      path.join(targetDir, 'specs/config.yaml'),
      `schema: ${config.schema}\n\ncontext: |\n  Add your project context here\n\nrules:\n  specs: []\n  tasks: []\n`
    );
    log('  ✓ specs/config.yaml', 'success');
    
    log('\n✅ Setup complete!\n', 'success');
    
    // Instructions
    log('Next steps:\n', 'header');
    log('1. Start the tutorial: /specs-onboard');
    log('2. Or create a change: /specs-new my-feature');
    log('3. Validate anytime: node specs/scripts/validate.js');
    log('\nSee README.md for full documentation.\n');
    
  } catch (err) {
    log(`\n❌ Error: ${err.message}`, 'error');
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
