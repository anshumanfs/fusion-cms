#!/usr/bin/env node

/**
 * This script helps remove Next.js dependencies after completing the migration to Express/EJS
 */
const fs = require('fs');
const path = require('path');

// Define Next.js related dependencies
const nextDependencies = [
  'next',
  'react',
  'react-dom',
  '@next/font',
  '@next/bundle-analyzer',
  'next-themes',
  '@radix-ui/react-*',
];

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Find Next.js dependencies
const foundDeps = [];
Object.keys(packageJson.dependencies || {}).forEach((dep) => {
  if (
    nextDependencies.some((nextDep) => (nextDep.endsWith('*') ? dep.startsWith(nextDep.slice(0, -1)) : dep === nextDep))
  ) {
    foundDeps.push(dep);
  }
});

// Output results
console.log('=== Next.js Dependency Migration Helper ===');
console.log('The following Next.js related dependencies were found:');
foundDeps.forEach((dep) => console.log(`- ${dep}: ${packageJson.dependencies[dep]}`));
console.log('\nTo remove these dependencies, run:');
console.log(`npm uninstall ${foundDeps.join(' ')}`);
console.log('\nBefore removing these dependencies, ensure that:');
console.log('1. All Next.js components have been migrated to EJS templates');
console.log('2. All React-specific functionality has been reimplemented in vanilla JS');
console.log('3. The Express server is correctly serving all EJS routes');
console.log('4. You have tested the application thoroughly without Next.js');
