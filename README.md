# GlobeX

GlobeX 是一个开源的 Cesium 组件工具库，基于 TypeScript 开发，提供一系列即插即用的函数与工具，帮助开发者在 Cesium 场景中快速绘制、标注和交互。

- **快速交付**: 函数式 API，几行代码即可完成绘制与交付。
- **类型安全**: TypeScript 全量类型，开发高效可靠。
- **可扩展性强**: 组件化封装，支持二次开发和自定义扩展。
- **聚焦 Cesium**: 专注三维地球业务场景，开箱即用。

---

## 安装

```bash
# 使用 npm
npm i globex cesium

# 或使用 pnpm
double-click to copy
pnpm add globex cesium

# 或使用 yarn
yarn add globex cesium
```

> 说明: `cesium` 是运行时依赖，请在你的应用中一并安装并初始化 `Cesium.Viewer`。

---

## 快速开始

| 组件名       | 介绍                                                                     | 文档链接                                                 |
| ------------ | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| RippleMarker | 在已有的 `Cesium.Viewer` 实例中快速添加一个“倒立三棱锥 + 扩散波纹”的标点 | [src/RippleMarker/README.md](src/RippleMarker/README.md) |

## 兼容性与打包说明

- 输出格式: **ESM** 和 **CJS**，并内置 **.d.ts** 类型声明。
- 运行时依赖: `cesium`（请由业务工程安装）。
- Node 版本: 推荐 Node >= 18。

---

## 本地开发

```bash
# 安装依赖
npm i

# 开发构建（监听模式）
npm run dev

# 产物构建
npm run build
```

项目结构:

```
GlobeX/
  ├─ src/
  │  └─ index.ts
  ├─ dist/              # 构建产物（自动生成）
  ├─ package.json
  ├─ tsconfig.json
  ├─ README.md
  ├─ .gitignore
  └─ .npmignore
```

---

## 参与贡献

欢迎 PR 和 Issue！

- 提交规范: 使用英语提交信息，示例: `feat: add new ellipse ripple options`
- 分支模型: `main` 为稳定分支，`feat/*` 开发新特性，`fix/*` 修复问题。
- 代码要求: 保持类型安全与可读性，尽量补充最小可复现示例。

---

## 许可证

MIT © GlobeX Contributors
