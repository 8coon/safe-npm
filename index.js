#!/usr/bin/env node

const os = require('os');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');

// Determine current node version
const nodeVersion = process.versions.node.split('.')[0];
console.log(`[npm-s] Using node v${nodeVersion}...`);

// Determine working dir and important paths
const random = crypto.randomBytes(8).toString('hex');
const tempDir = path.resolve(`.npm-s_${nodeVersion}_${random}`);

const files = [
    'package.json',
    'package-lock.json',
    '.npmrc',
].map((name) => ({
    name,
    src: path.resolve('./' + name),
    dst: path.join(tempDir, name),
}));

// Create temp dir and copy important files
fs.mkdirSync(tempDir);

files.forEach((file) => {
    if (fs.existsSync(file.src)) {
        fs.copyFileSync(file.src, file.dst);
    }
});

// Run the command in docker
try {
    cp.spawnSync('docker', [
        'run',
        '-it',
        '-v', tempDir + ':' + '/project',
        '-v', path.resolve('./node_modules') + ':/project/node_modules',
        '-w', '/project',
        `node:${nodeVersion}-slim`,
        'npm',
        ...process.argv.slice(2),
    ], {
        stdio: [process.stdin, process.stdout, process.stderr],
        encoding: 'utf-8',
    });
} catch (error) {
    console.error(error);
    process.exitCode = 1;
}

// Copy important files back
files.forEach((file) => {
    if (fs.existsSync(file.dst)) {
        fs.copyFileSync(file.dst, file.src);
        fs.rmSync(file.dst);
    }
});

// Delete temp dir
fs.rmSync(tempDir, {recursive: true, force: true});
