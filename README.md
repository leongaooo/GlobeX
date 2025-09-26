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

| 组件名          | 介绍                                                                     | 文档链接                                                       |
| --------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------- |
| RippleMarker    | 在已有的 `Cesium.Viewer` 实例中快速添加一个“倒立三棱锥 + 扩散波纹”的标点 | [src/RippleMarker/README.md](src/RippleMarker/README.md)       |
| ViewerClick     | 封装 Viewer 的点击事件，回调函数返回经纬度和原始参数，提供 ts 类型提示   | [src/ViewerClick/README.md](src/ViewerClick/README.md)         |
| CameraMoveEvent | 监听 Cesium 相机移动事件，实时获取相机位置信息，支持控制台打印和位置查询 | [src/CameraMoveEvent/README.md](src/CameraMoveEvent/README.md) |

## 兼容性与打包说明

- 输出格式: **ESM** 和 **CJS**，并内置 **.d.ts** 类型声明。
- 运行时依赖: `cesium`（请由业务工程安装）。
- Node 版本: 推荐 Node >= 18。

---

## 本地开发与 Playground 体验

### 一键启动本地开发

仓库根目录：

```bash
# 安装依赖（根与 playground）
npm i
npm run play:install

# 启动并行开发：左侧监听构建库，右侧启动 playground
yarn dlx echo "If you use yarn, remove this line" # 可删除，仅示意
npm run dev:play
```

说明：

- `npm run dev` 会以监听模式构建库到 `dist/`。
- `npm run play:start` 会启动 `playground`（已配置 `vite-plugin-cesium`）。
- `npm run dev:play` 通过 `concurrently` 同时运行二者。

### 在 playground 使用最新本地包

两种方式：

- 推荐：直接从源码构建并由 Vite 走工作区依赖（已在 `playground` 配好 `vite-plugin-cesium`）。
- 或者：打包本地 tarball 并安装（适合模拟发布前体验）

```bash
# 在仓库根目录构建并打包
npm run build && npm pack

# 在 playground 安装最新 tarball
cd playground
npm i ../cesium-kit-*.tgz
npm run dev
```

若你看到 `does not provide an export named` 等提示，请确保：

- 已重新构建库（`npm run build`）。
- playground 已重启或重新安装 tarball。
- 如仍不生效，删除 `playground/node_modules` 和 `package-lock.json` 后重装。

### Cesium 资源与底图（本地稳定预览）

- 已启用 `vite-plugin-cesium`，自动拷贝 Cesium 静态资源与 Workers。
- 为避免外部瓦片/鉴权问题，默认使用 `GridImageryProvider` 与椭球地形，可在验证后换回在线底图与地形。

---

## 参与贡献

欢迎 PR 和 Issue！

- 提交规范: 使用英语提交信息，示例: `feat: add new ellipse ripple options`
- 分支模型: `main` 为稳定分支，`feat/*` 开发新特性，`fix/*` 修复问题。
- 代码要求: 保持类型安全与可读性，尽量补充最小可复现示例。

---

## 许可证

MIT © cesium-kit Contributors
