#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const pythonScriptPath = path.join(__dirname, '..', 'scanner', 'synthscan.py');
const args = process.argv.slice(2);

let result = spawnSync('python3', [pythonScriptPath, ...args], { stdio: 'inherit' });

if (result.error) {
    result = spawnSync('python', [pythonScriptPath, ...args], { stdio: 'inherit' });
    if (result.error) {
        console.error("Failed to start SynthScan. Please ensure Python 3 is installed.");
        process.exit(1);
    }
}
process.exit(result.status);
