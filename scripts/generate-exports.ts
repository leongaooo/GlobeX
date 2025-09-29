#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义类型接口
interface PackageJson {
    exports?: Record<string, string | Record<string, string>>;
    [key: string]: any;
}

interface CssExports {
    [key: string]: string;
}

// 读取 package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 扫描 src/styles 目录中的 CSS 文件
const stylesDir = path.join(__dirname, '..', 'src', 'styles');
const cssFiles: string[] = [];

if (fs.existsSync(stylesDir)) {
    const files = fs.readdirSync(stylesDir);
    files.forEach(file => {
        if (file.endsWith('.css')) {
            cssFiles.push(file);
        }
    });
}

// 生成 CSS exports 映射
const cssExports: CssExports = {};
cssFiles.forEach(file => {
    const exportKey = `./styles/${file}`;
    const exportValue = `./dist/styles/${file}`;
    cssExports[exportKey] = exportValue;
});

// 更新 package.json 的 exports 字段
// 保留现有的非 CSS exports
const existingExports = packageJson.exports || {};
const nonCssExports: Record<string, string | Record<string, string>> = {};

// 分离非 CSS 的 exports
Object.keys(existingExports).forEach(key => {
    if (!key.startsWith('./styles/')) {
        nonCssExports[key] = existingExports[key];
    }
});

// 合并非 CSS exports 和 CSS exports
packageJson.exports = {
    ...nonCssExports,
    ...cssExports
};

// 写回 package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log('✅ CSS exports generated successfully:');
cssFiles.forEach(file => {
    console.log(`  - ./styles/${file} -> ./dist/styles/${file}`);
});
