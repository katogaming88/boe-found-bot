const { execSync } = require('child_process');
const fs = require('fs');

const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

let failed = false;

function fail(msg) {
  console.error(`✖ ${msg}`);
  failed = true;
}

// 1. CHANGELOG.md must be modified in this PR
const baseRef = process.env.GITHUB_BASE_REF;
if (baseRef) {
  const changedFiles = execSync(`git diff --name-only origin/${baseRef}...HEAD`)
    .toString()
    .trim()
    .split('\n');
  if (!changedFiles.includes('CHANGELOG.md')) {
    fail('CHANGELOG.md must be updated in every PR');
  }
}

// 2. Every versioned entry must follow ## [X.Y.Z] - YYYY-MM-DD
const versionedEntries = changelog
  .split('\n')
  .filter(line => line.startsWith('## [') && !line.startsWith('## [Unreleased]'));

const validFormat = /^## \[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}$/;
for (const entry of versionedEntries) {
  if (!validFormat.test(entry.trim())) {
    fail(`Invalid changelog entry: "${entry.trim()}"\n  Expected: ## [X.Y.Z] - YYYY-MM-DD`);
  }
}

// 3. Latest changelog version must match package.json
if (versionedEntries.length > 0) {
  const match = versionedEntries[0].match(/## \[(\d+\.\d+\.\d+)\]/);
  if (match) {
    const changelogVersion = match[1];
    if (pkg.version !== changelogVersion) {
      fail(`package.json version (${pkg.version}) does not match latest CHANGELOG.md entry (${changelogVersion})`);
    }
  }
}

if (failed) process.exit(1);
console.log('✔ Changelog checks passed');
