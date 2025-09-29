#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const version = packageJson.version;
const tagName = `v${version}`;

try {
    // 创建 git tag
    execSync(`git tag ${tagName}`, { stdio: 'inherit' });
    console.log(`✅ Created tag: ${tagName}`);

    // 推送 tag 到远程仓库
    execSync(`git push origin ${tagName}`, { stdio: 'inherit' });
    console.log(`✅ Pushed tag: ${tagName}`);
} catch (error: any) {
    if (error.message.includes('already exists')) {
        console.log(`⚠️  Tag ${tagName} already exists, pushing to remote...`);
        try {
            execSync(`git push origin ${tagName}`, { stdio: 'inherit' });
            console.log(`✅ Pushed existing tag: ${tagName}`);
        } catch (pushError: any) {
            console.error(`❌ Error pushing tag: ${pushError.message}`);
            process.exit(1);
        }
    } else {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}
