# cesium-kit

cesium-kit 是一个开源的 Cesium 组件工具库，基于 TypeScript 开发，提供一系列即插即用的函数与工具，帮助开发者在 Cesium 场景中快速绘制、标注和交互。

- **快速交付**: 函数式 API，几行代码即可完成绘制与交付。
- **类型安全**: TypeScript 全量类型，开发高效可靠。
- **可扩展性强**: 组件化封装，支持二次开发和自定义扩展。
- **聚焦 Cesium**: 专注三维地球业务场景，开箱即用。

---

## 安装

```bash
# 使用 npm
npm i cesium-kit cesium

# 或使用 pnpm
pnpm add cesium-kit cesium

# 或使用 yarn
yarn add cesium-kit cesium
```

> 说明: `cesium` 是运行时依赖，请在你的应用中一并安装并初始化 `Cesium.Viewer`。

---

## 快速开始

### 使用示例（CameraControl）

```ts
import * as Cesium from "cesium";
import { createCameraControl } from "cesium-kit";
import "cesium-kit/styles/camera-control.css";

const viewer = new Cesium.Viewer("viewerContainer");

const cameraControl = createCameraControl({
  viewer,
  // 基础缩放距离（米）
  zoomDistance: 500,
  // 可选：挂载到指定容器（不传则自动查找）
  containerId: "camera-bar",
  // 可选：是否显示相机信息
  showCameraInfo: false,
  // 可选：平移速度系数（默认 1），配合“高度越低越慢”的自适应步长
  movementSpeedScale: 0.8,
});
```

| 组件名          | 介绍                                                                        | 文档链接                                                       |
| --------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| RippleMarker    | 在已有的 `Cesium.Viewer` 实例中快速添加一个“倒立三棱锥 + 扩散波纹”的标点    | [src/RippleMarker/README.md](src/RippleMarker/README.md)       |
| ViewerClick     | 封装 Viewer 的点击事件，回调函数返回经纬度和原始参数，提供 ts 类型提示      | [src/ViewerClick/README.md](src/ViewerClick/README.md)         |
| CameraMoveEvent | 监听 Cesium 相机移动事件，实时获取相机位置信息，支持控制台打印和位置查询    | [src/CameraMoveEvent/README.md](src/CameraMoveEvent/README.md) |
| CameraControl   | 相机控制组件，提供旋转、平移（前/后/左/右）、街景、缩放、相机状态信息等功能 | [src/Camera-Control/README.md](src/Camera-Control/README.md)   |

## 兼容性与打包说明

- 输出格式: **ESM** 和 **CJS**，并内置 **.d.ts** 类型声明。
- 运行时依赖: `cesium`（请由业务工程安装）。
- Node 版本: 推荐 Node >= 18。

---

## 本地开发与 Playground 体验

### 🚀 快速开始开发

```bash
# 1. 安装依赖
npm i
npm run play:install

# 2. 启动开发环境（推荐）
npm run dev:play
```

这将同时启动：

- **库构建监听**: 自动监听源码变化并构建到 `dist/`
- **Playground 开发服务器**: 在 `http://localhost:5173` 启动 Vue 应用

### 📦 构建与同步流程

项目采用**自动化构建同步**机制：

```bash
# 完整构建（包含自动同步到 playground）
npm run build
```

构建流程：

1. **生成 CSS exports** - 自动扫描 `src/styles/` 并更新 `package.json` exports
2. **TypeScript 打包** - 使用 tsup 构建 ESM/CJS 格式
3. **复制 CSS 文件** - 将样式文件复制到 `dist/styles/`
4. **同步到 playground** - 自动复制整个 `dist/` 到 `playground/src/cesium-kit/`

### 🔄 开发工作流

#### 方式一：实时开发（推荐）

```bash
npm run dev:play
```

- 源码修改 → 自动构建 → playground 自动热更新
- 无需手动操作，开发体验最佳

#### 方式二：手动构建测试

```bash
# 构建并同步到 playground
npm run build

# 启动 playground
npm run play:start
```

#### 方式三：发布前测试

```bash
# 构建并打包
npm run pack

# 在 playground 安装测试
cd playground
npm i ../cesium-kit-*.tgz
npm run dev
```

### 🛠️ 开发环境说明

- **Node 版本**: >= 18
- **包管理器**: npm（推荐）
- **构建工具**: tsup + cpy-cli
- **开发服务器**: Vite + Vue 3
- **Cesium 集成**: vite-plugin-cesium（自动处理静态资源）

### 📁 项目结构

```
cesium-kit/
├── src/                    # 源码目录
│   ├── styles/            # CSS 样式文件
│   ├── RippleMarker/      # 波纹标记组件
│   ├── ViewerClick/       # 点击事件组件
│   ├── CameraMoveEvent/   # 相机移动事件
│   └── Camera-Control/    # 相机控制组件
├── dist/                  # 构建输出
├── playground/            # 开发测试环境
│   └── src/
│       └── cesium-kit/    # 自动同步的构建文件
└── scripts/               # 构建脚本
    └── generate-exports.js # CSS exports 自动生成
```

### 🔧 故障排除

**Q: playground 中组件无法正常显示？**
A: 确保已运行 `npm run build` 并检查 `playground/src/cesium-kit/` 目录是否存在

**Q: CSS 样式不生效？**
A: 检查是否正确导入样式文件：`import 'cesium-kit/styles/camera-control.css'`

**Q: TypeScript 类型错误？**
A: 重新构建项目：`npm run build`，确保类型声明文件是最新的

**Q: 构建失败？**
A: 检查 Node 版本 >= 18，删除 `node_modules` 和 `package-lock.json` 后重新安装

### Cesium 资源与底图（本地稳定预览）

- 已启用 `vite-plugin-cesium`，自动拷贝 Cesium 静态资源与 Workers。
- 为避免外部瓦片/鉴权问题，默认使用 `GridImageryProvider` 与椭球地形，可在验证后换回在线底图与地形。

---

## 参与贡献

欢迎 PR 和 Issue！

### 📚 开发文档

- **[开发环境配置](DEVELOPMENT.md)** - 详细的开发环境搭建指南
- **[贡献指南](CONTRIBUTING.md)** - 完整的贡献流程和代码规范

### 🚀 快速贡献

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/your-username/cesium-kit.git
cd cesium-kit

# 2. 安装依赖并启动开发环境
npm i && npm run play:install
npm run dev:play

# 3. 创建功能分支
git checkout -b feat/your-feature-name

# 4. 开发完成后提交 PR
```

### 📋 贡献规范

- **提交规范**: 使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- **分支模型**: `main` 为稳定分支，`feat/*` 开发新特性，`fix/*` 修复问题
- **代码要求**: 保持类型安全与可读性，补充测试用例和文档
- **测试验证**: 在 playground 中验证功能正常

### 🔗 相关链接

- [Issues](https://github.com/leongaooo/cesium-kit/issues) - Bug 报告和功能建议
- [Discussions](https://github.com/leongaooo/cesium-kit/discussions) - 社区讨论
- [Changelog](CHANGELOG.md) - 版本更新日志

---

## 许可证

MIT © cesium-kit Contributors
