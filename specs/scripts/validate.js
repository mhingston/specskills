#!/usr/bin/env node

/**
 * Specs Validator
 * 
 * Lightweight validation for spec-driven workflow artifacts.
 * Works standalone - no external dependencies required.
 * 
 * Usage:
 *   node scripts/validate.js              # Validate all
 *   node scripts/validate.js --specs      # Validate specs only
 *   node scripts/validate.js --changes    # Validate changes only
 *   node scripts/validate.js --schemas    # Validate schemas only
 *   node scripts/validate.js --json       # JSON output for CI
 */

const fs = require('node:fs');
const path = require('node:path');

// Try to load js-yaml, but make it optional
let yaml = null;
try {
  yaml = require('js-yaml');
} catch (e) {
  // js-yaml not installed, will use basic YAML validation
}

// Validation configuration
const CONFIG = {
  specsDir: 'specs',
  changesDir: 'specs/changes',
  schemasDir: 'specs/schemas',
  configPath: 'specs/config.yaml',
  specsIgnoreDirs: new Set(['changes', 'schemas', 'templates', 'scripts', '.github']),
  requiredSpecHeaders: ['## Purpose', '## Requirements'],
  requiredRequirementKeywords: ['SHALL', 'MUST', 'SHOULD'],
  deltaHeaders: ['## ADDED Requirements', '## MODIFIED Requirements', '## REMOVED Requirements', '## RENAMED Requirements'],
};

// Validation result
class ValidationResult {
  constructor(filePath) {
    this.filePath = filePath;
    this.errors = [];
    this.warnings = [];
    this.valid = true;
  }

  addError(message, line = null) {
    this.errors.push({ message, line });
    this.valid = false;
  }

  addWarning(message, line = null) {
    this.warnings.push({ message, line });
  }
}

// Validate a spec file
function validateSpec(filePath) {
  const result = new ValidationResult(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check required headers
  for (const header of CONFIG.requiredSpecHeaders) {
    if (!content.includes(header)) {
      result.addError(`Missing required header: ${header}`);
    }
  }

  // Check for requirement keywords
  const hasRequirementKeyword = CONFIG.requiredRequirementKeywords.some(keyword => 
    content.includes(keyword)
  );
  if (!hasRequirementKeyword) {
    result.addError('No requirements found (must use SHALL, MUST, or SHOULD)');
  }

  // Check for scenarios
  if (!content.includes('#### Scenario:')) {
    result.addError('No scenarios found (must use "#### Scenario:")');
  }

  // Check for delta sections
  const hasDeltaSection = CONFIG.deltaHeaders.some(header => content.includes(header));
  if (!hasDeltaSection) {
    result.addWarning('No delta sections found (ADDED, MODIFIED, REMOVED, or RENAMED)');
  }

  // Check for RENAMED format
  if (content.includes('## RENAMED Requirements')) {
    const renamedSection = content.split('## RENAMED Requirements')[1];
    if (renamedSection) {
      const hasFrom = renamedSection.match(/\*\*FROM:\*\*|FROM:/i);
      const hasTo = renamedSection.match(/\*\*TO:\*\*|TO:/i);
      if (!hasFrom || !hasTo) {
        result.addWarning('RENAMED Requirements should use FROM:/TO: format');
      }
    }
  }

  return result;
}

// Validate a change
function validateChange(changePath) {
  const results = [];
  const changeJsonPath = path.join(changePath, '.change.json');

  // Validate .change.json exists
  if (!fs.existsSync(changeJsonPath)) {
    const result = new ValidationResult(changeJsonPath);
    result.addError('Missing .change.json file');
    results.push(result);
    return results;
  }

  // Validate .change.json structure
  const changeResult = new ValidationResult(changeJsonPath);
  try {
    const changeData = JSON.parse(fs.readFileSync(changeJsonPath, 'utf-8'));
    
    if (!changeData.name) {
      changeResult.addError('.change.json missing "name" field');
    } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(changeData.name)) {
      changeResult.addError(`.change.json name must be kebab-case: ${changeData.name}`);
    }
    
    if (!changeData.schema) {
      changeResult.addError('.change.json missing "schema" field');
    }
    
    if (!changeData.artifacts || typeof changeData.artifacts !== 'object') {
      changeResult.addError('.change.json missing "artifacts" object');
    } else {
      // Validate artifact statuses
      const validStatuses = ['blocked', 'ready', 'done'];
      for (const [artifactId, artifact] of Object.entries(changeData.artifacts)) {
        if (!artifact.status) {
          changeResult.addError(`Artifact ${artifactId} missing "status" field`);
        } else if (!validStatuses.includes(artifact.status)) {
          changeResult.addError(`Artifact ${artifactId} has invalid status: ${artifact.status}`);
        }
        
        // Check if artifact file exists when status is "done"
        if (artifact.status === 'done' && artifact.path) {
          const artifactPath = path.join(changePath, artifact.path);
          if (!fs.existsSync(artifactPath)) {
            changeResult.addError(`Artifact ${artifactId} marked as done but file not found: ${artifact.path}`);
          }
        }
      }
    }
  } catch (e) {
    changeResult.addError(`Invalid JSON: ${e.message}`);
  }
  results.push(changeResult);

  // Validate specs in change
  const specsDir = path.join(changePath, 'specs');
  if (fs.existsSync(specsDir)) {
    const specDirs = fs.readdirSync(specsDir).filter(f =>
      fs.statSync(path.join(specsDir, f)).isDirectory()
    );

    for (const specDir of specDirs) {
      const specFile = path.join(specsDir, specDir, 'spec.md');
      if (fs.existsSync(specFile)) {
        results.push(validateSpec(specFile));
      }
    }
  }

  return results;
}

// Validate schema files
function validateSchema(schemaPath) {
  const result = new ValidationResult(schemaPath);
  
  try {
    const content = fs.readFileSync(schemaPath, 'utf-8');
    
    // Basic YAML validation - check for required fields
    if (!content.includes('name:')) {
      result.addError('Schema missing "name" field');
    }
    
    if (!content.includes('artifacts:')) {
      result.addError('Schema missing "artifacts" array');
    }
    
    if (yaml) {
      // Enhanced validation with js-yaml
      const schema = yaml.load(content);
      
      if (!schema.name) {
        result.addError('Schema missing "name" field');
      }
      
      if (!schema.artifacts || !Array.isArray(schema.artifacts)) {
        result.addError('Schema missing "artifacts" array');
      } else {
        // Check for duplicate artifact IDs
        const ids = schema.artifacts.map(a => a.id);
        const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
        if (duplicates.length > 0) {
          result.addError(`Duplicate artifact IDs: ${duplicates.join(', ')}`);
        }
      }
    } else {
      result.addWarning('js-yaml not installed, using basic validation only. Install js-yaml for enhanced schema validation.');
    }
  } catch (e) {
    result.addError(`Invalid YAML: ${e.message}`);
  }

  return result;
}

// Main validation function
function validate(options = {}) {
  const allResults = [];

  // Validate schemas
  if (!options.specsOnly && !options.changesOnly) {
    if (fs.existsSync(CONFIG.schemasDir)) {
      const schemas = fs.readdirSync(CONFIG.schemasDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
      for (const schema of schemas) {
        allResults.push(validateSchema(path.join(CONFIG.schemasDir, schema)));
      }
    }
  }

  // Validate specs
  if (!options.changesOnly) {
    if (fs.existsSync(CONFIG.specsDir)) {
      const specDirs = fs.readdirSync(CONFIG.specsDir).filter(f => {
        if (CONFIG.specsIgnoreDirs.has(f)) return false;
        return fs.statSync(path.join(CONFIG.specsDir, f)).isDirectory();
      });

      for (const specDir of specDirs) {
        const specFile = path.join(CONFIG.specsDir, specDir, 'spec.md');
        if (fs.existsSync(specFile)) {
          allResults.push(validateSpec(specFile));
        }
      }
    }
  }

  // Validate changes
  if (!options.specsOnly) {
    if (fs.existsSync(CONFIG.changesDir)) {
      const changes = fs.readdirSync(CONFIG.changesDir).filter(f => {
        const fullPath = path.join(CONFIG.changesDir, f);
        return fs.statSync(fullPath).isDirectory() && f !== 'archive';
      });

      for (const change of changes) {
        const changePath = path.join(CONFIG.changesDir, change);
        const results = validateChange(changePath);
        allResults.push(...results);
      }
    }
  }

  return allResults;
}

// Print results
function printResults(results, format = 'text') {
  if (format === 'json') {
    console.log(JSON.stringify({
      valid: results.every(r => r.valid),
      totalFiles: results.length,
      errors: results.reduce((sum, r) => sum + r.errors.length, 0),
      warnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
      results: results.map(r => ({
        file: r.filePath,
        valid: r.valid,
        errors: r.errors,
        warnings: r.warnings
      }))
    }, null, 2));
    return;
  }

  // Text format
  let hasErrors = false;
  
  for (const result of results) {
    if (result.errors.length > 0 || result.warnings.length > 0) {
      console.log(`\n${result.filePath}`);
      
      for (const error of result.errors) {
        const line = error.line ? `:${error.line}` : '';
        console.log(`  [ERROR${line}] ${error.message}`);
        hasErrors = true;
      }
      
      for (const warning of result.warnings) {
        const line = warning.line ? `:${warning.line}` : '';
        console.log(`  [WARNING${line}] ${warning.message}`);
      }
    }
  }

  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Total: ${results.length} files checked`);
  console.log(`Errors: ${totalErrors}, Warnings: ${totalWarnings}`);
  
  if (hasErrors) {
    console.log('\nValidation failed');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\nValidation passed with warnings');
    process.exit(0);
  } else {
    console.log('\nAll validations passed');
    process.exit(0);
  }
}

// Parse CLI arguments
const args = process.argv.slice(2);
const options = {
  specsOnly: args.includes('--specs'),
  changesOnly: args.includes('--changes'),
  json: args.includes('--json')
};

// Run validation
const results = validate(options);
printResults(results, options.json ? 'json' : 'text');
