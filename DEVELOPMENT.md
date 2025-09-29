# 开发环境配置指南

本指南将帮助您快速搭建 cesium-kit 的开发环境。

## 🛠️ 环境要求

### 必需软件

| 软件    | 版本要求  | 说明              |
| ------- | --------- | ----------------- |
| Node.js | >= 18.0.0 | JavaScript 运行时 |
| npm     | >= 8.0.0  | 包管理器          |
| Git     | 最新版本  | 版本控制          |

### 推荐软件

| 软件                   | 说明                   |
| ---------------------- | ---------------------- |
| VS Code                | 推荐的代码编辑器       |
| Chrome DevTools        | 浏览器调试工具         |
| GitKraken / SourceTree | Git 图形化工具（可选） |

## 🚀 快速搭建

### 1. 克隆项目

```bash
# 克隆主仓库（仅查看）
git clone https://github.com/leongaooo/cesium-kit.git
cd cesium-kit

# 或 Fork 后克隆（用于贡献）
git clone https://github.com/your-username/cesium-kit.git
cd cesium-kit
```

### 2. 安装依赖

```bash
# 安装主项目依赖
npm install

# 安装 playground 依赖
npm run play:install
```

### 3. 验证安装

```bash
# 检查 Node.js 版本
node --version  # 应该 >= 18.0.0

# 检查 npm 版本
npm --version    # 应该 >= 8.0.0

# 运行构建测试
npm run build
```

## 🔧 VS Code 配置

### 推荐扩展

安装以下 VS Code 扩展以获得最佳开发体验：

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "vue.volar",
    "ms-vscode.vscode-json"
  ]
}
```

### 工作区设置

在项目根目录创建 `.vscode/settings.json`：

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "css"
  }
}
```

### 调试配置

创建 `.vscode/launch.json` 用于调试：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Playground",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/playground/src",
      "sourceMaps": true
    }
  ]
}
```

## 📦 包管理器配置

### npm 配置

```bash
# 设置 npm 镜像（可选，提升下载速度）
npm config set registry https://registry.npmmirror.com

# 设置缓存目录
npm config set cache ~/.npm-cache

# 设置日志级别
npm config set loglevel warn
```

### 工作区配置

项目使用 npm workspaces，确保正确配置：

```json
{
  "workspaces": ["playground"]
}
```

## 🌐 网络配置

### Cesium 资源访问

如果遇到 Cesium 资源加载问题，可以配置代理：

```bash
# 设置环境变量
export CESIUM_BASE_URL=https://cesium.com/downloads/cesiumjs/releases/1.103/Build/Cesium/
```

### 开发服务器配置

playground 使用 Vite 开发服务器，默认配置：

```typescript
// playground/vite.config.ts
export default defineConfig({
  server: {
    port: 5173,
    host: true,
    open: true,
  },
});
```

## 🔍 调试技巧

### 浏览器调试

1. **打开开发者工具**：

   - Chrome: `F12` 或 `Ctrl+Shift+I`
   - Firefox: `F12` 或 `Ctrl+Shift+I`

2. **查看控制台**：

   - 检查 JavaScript 错误
   - 查看组件创建日志
   - 验证 API 调用

3. **网络面板**：
   - 检查资源加载
   - 验证 Cesium 静态文件
   - 查看 API 请求

### 组件调试

在 playground 中添加调试代码：

```javascript
// 在 Earth.vue 中添加
console.log("Camera control:", window.cameraControl);
console.log("Viewer:", viewer);

// 检查组件状态
if (window.cameraControl) {
  console.log("Container:", window.cameraControl.getContainer());
}
```

### TypeScript 调试

```bash
# 检查类型错误
npx tsc --noEmit

# 生成类型声明文件
npm run build
```

## 🐛 常见问题

### 问题 1: Node.js 版本不兼容

**错误信息**：

```
Error: Node.js version 16.x is not supported
```

**解决方案**：

```bash
# 使用 nvm 管理 Node.js 版本
nvm install 18
nvm use 18

# 或直接下载安装 Node.js 18+
```

### 问题 2: 依赖安装失败

**错误信息**：

```
npm ERR! peer dep missing
```

**解决方案**：

```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题 3: Cesium 资源加载失败

**错误信息**：

```
Failed to load Cesium workers
```

**解决方案**：

```bash
# 检查网络连接
ping cesium.com

# 配置代理（如需要）
npm config set proxy http://proxy-server:port
```

### 问题 4: 端口被占用

**错误信息**：

```
Port 5173 is in use
```

**解决方案**：

```bash
# 查找占用端口的进程
lsof -i :5173

# 杀死进程
kill -9 <PID>

# 或使用其他端口
npm run play:start -- --port 5174
```

## 📋 开发检查清单

在开始开发前，请确认：

- [ ] Node.js 版本 >= 18
- [ ] npm 版本 >= 8
- [ ] 项目依赖已安装
- [ ] playground 依赖已安装
- [ ] VS Code 扩展已安装
- [ ] 网络连接正常
- [ ] 可以正常访问 Cesium 资源

## 🔄 环境重置

如果遇到无法解决的问题，可以重置开发环境：

```bash
# 1. 清理所有依赖
rm -rf node_modules package-lock.json
rm -rf playground/node_modules playground/package-lock.json

# 2. 清理构建文件
npm run clean

# 3. 重新安装
npm install
npm run play:install

# 4. 重新构建
npm run build
```

## 📞 获取帮助

如果遇到其他问题，可以通过以下方式获取帮助：

- 📖 查看 [README.md](README.md) 文档
- 🐛 提交 [Issue](https://github.com/leongaooo/cesium-kit/issues)
- 💬 参与 [Discussions](https://github.com/leongaooo/cesium-kit/discussions)

---

祝您开发愉快！🎉
