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

以第一个组件 `addCesiumRippleMarker` 为例，在已有的 `Cesium.Viewer` 实例中快速添加一个“倒立三棱锥 + 扩散波纹”的标点。

```ts
import { Viewer } from 'cesium'
import { addCesiumRippleMarker } from 'globex'

const viewer = new Viewer('container')

const handle = addCesiumRippleMarker(viewer, {
  lon: 116.3913,
  lat: 39.9075,
  height: 0,
  color: 'rgba(0,150,255,0.8)',
  maxRadius: 8000,
  duration: 1500,
  loops: Infinity,
  pyramidHeight: 1000,
  baseRadius: 300,
  floatEnabled: true,
  surfaceHeight: 50,
})

// 在需要时移除
handle.remove()
```

---

## API

### addCesiumRippleMarker(viewer, options)

- **viewer**: `Cesium.Viewer` 实例
- **options**: `RippleMarkerOptions`
  - **lon**: number，经度
  - **lat**: number，纬度
  - **height**?: number，海拔高度（米），默认 0
  - **color**?: string，CSS 颜色（支持 rgba），默认 `'rgba(0,150,255,0.8)'`
  - **maxRadius**?: number，波纹最大半径（米），默认 8000
  - **duration**?: number，单个波纹周期（毫秒），默认 1500
  - **loops**?: number，循环次数，`Infinity` 表示无限
  - **pyramidHeight**?: number，三棱锥高度（米），默认 1000
  - **baseRadius**?: number，三棱锥底部半径（米），控制宽度，默认 `pyramidHeight * 0.3`
  - **floatEnabled**?: boolean，是否启用上下浮动动画，默认 true
  - **surfaceHeight**?: number，三棱锥与波纹基准高度（米），默认 50

返回值: `{ remove: () => void }` 用于移除该标点。

---

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

## 发布到 npm

1. 确保已登录 npm
   ```bash
   npm login
   ```
2. 版本号管理
   ```bash
   npm version patch   # 或 minor / major
   ```
3. 构建并发布
   ```bash
   npm publish --access public
   ```

> 若使用 `pnpm`，可替换为 `pnpm publish --access public`。

---

## 参与贡献

欢迎 PR 和 Issue！

- 提交规范: 使用英语提交信息，示例: `feat: add new ellipse ripple options`
- 分支模型: `main` 为稳定分支，`feat/*` 开发新特性，`fix/*` 修复问题。
- 代码要求: 保持类型安全与可读性，尽量补充最小可复现示例。

---

## 许可证

MIT © GlobeX Contributors
