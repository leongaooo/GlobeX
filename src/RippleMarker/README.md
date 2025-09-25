# RippleMarker

在 Cesium 场景中添加一个带扩散波纹的 3D 标点（倒立三棱锥）

<img src="./RippleMarker.png" alt="RippleMarker" />

```ts
import { Viewer } from "cesium";
import { RippleMarker } from "globex";

const viewer = new Viewer("container");

const handle = RippleMarker(viewer, {
  lon: 116.3913,
  lat: 39.9075,
  height: 0,
  color: "rgba(0,150,255,0.8)",
  maxRadius: 8000,
  duration: 1500,
  loops: Infinity,
  pyramidHeight: 1000,
  baseRadius: 300,
  floatEnabled: true,
  surfaceHeight: 50,
});

// 在需要时移除
handle.remove();
```

---

## API

### RippleMarker(viewer, options)

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
