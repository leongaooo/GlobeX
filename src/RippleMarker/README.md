# RippleMarker

在 Cesium 场景中添加一个带扩散波纹的 3D 标点（倒立三棱锥），支持标签显示、点击事件、数据绑定和高度响应式缩放。

<img src="./RippleMarker.png" alt="RippleMarker" />

## ✨ 核心特性

- 🎯 **3D 标记**：倒立三棱锥 + 扩散波纹动画
- 🏷️ **自定义标签**：支持背景板、边框、对齐方式
- 🖱️ **点击事件**：独立的事件处理和数据绑定
- 📏 **高度响应式**：基于相机高度的智能缩放和淡入淡出
- 🎨 **视觉优化**：圆锥体保持原尺寸，标签智能缩放
- ⚡ **性能优化**：节流更新、自动清理、错误处理

## 基础用法

```ts
import { Viewer } from "cesium";
import { RippleMarker } from "globex";

const viewer = new Viewer("container");

const marker = RippleMarker(viewer, {
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

// 控制显示/隐藏
marker.show();
marker.hide();
marker.setVisible(false);

// 移除标记
marker.remove();
```

## 🚀 高级用法

### 🎯 高度响应式标记

```ts
const marker = RippleMarker(viewer, {
  lon: 116.3913,
  lat: 39.9075,
  pyramidHeight: 1000,
  label: {
    text: "北京市",
    font: "18px sans-serif",
    fillColor: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backgroundBorderColor: "#ffffff",
    backgroundCornerRadius: 20,
    backgroundPadding: { x: 12, y: 6 },
    textAlign: "center",
    verticalAlign: "middle",
    // 优化标签位置 - 更贴近圆锥体顶部
    heightOffset: 60, // 标签距离圆锥体顶部60米
    pixelOffset: { x: 0, y: -20 }, // 微调像素偏移
  },
  // 高度响应式配置
  heightResponsive: {
    enabled: true,
    referenceHeight: 4000, // 参考高度：圆锥体高度 + 3000m
    minScale: 0.3, // 最小缩放 30%
    maxScale: 1.5, // 最大缩放 150%
    fadeRange: 2000, // 淡入淡出范围 2000m
    updateInterval: 100, // 更新间隔 100ms
  },
  onClick: (data, position) => {
    console.log("点击了标记:", data);
  },
});
```

**高度响应式效果：**

- **< 3000m**：标签适度缩放，完全不隐藏
- **3000m - 参考高度**：标签适度放大，最大 150%
- **> 参考高度**：标签缩小，圆锥体和涟漪同步淡出

### 🏷️ 带标签和点击事件

```ts
const marker = RippleMarker(viewer, {
  lon: 116.3913,
  lat: 39.9075,
  id: "beijing-marker",
  data: {
    name: "北京",
    type: "capital",
    population: 21540000,
  },
  label: {
    text: "北京市",
    font: "18px sans-serif",
    fillColor: "#ffffff",
    outlineColor: "#000000",
    outlineWidth: 2,
    pixelOffset: { x: 0, y: -50 },
    scale: 1.2,
    show: true,
    // 背景板配置
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backgroundBorderColor: "#ffffff",
    backgroundBorderWidth: 1,
    backgroundPadding: { x: 12, y: 6 },
    backgroundCornerRadius: 8,
    textAlign: "center",
    verticalAlign: "middle",
  },
  onClick: (data, position) => {
    console.log("点击了:", data.name);
    console.log("位置:", position.lon, position.lat);
    // 可以在这里处理点击逻辑，如显示详情弹窗等
  },
});
```

### 🌍 多场景配置示例

```ts
// 城市地标 - 近距离观察
const cityMarker = RippleMarker(viewer, {
  lon: 116.3913,
  lat: 39.9075,
  pyramidHeight: 500,
  heightResponsive: {
    enabled: true,
    referenceHeight: 3000, // 3km 最佳观察高度
    fadeRange: 1500, // 1.5km 淡出范围
    minScale: 0.5,
    maxScale: 1.5,
  },
});

// 区域标记 - 中距离观察
const regionMarker = RippleMarker(viewer, {
  lon: 121.4737,
  lat: 31.2304,
  pyramidHeight: 2000,
  heightResponsive: {
    enabled: true,
    referenceHeight: 8000, // 8km 最佳观察高度
    fadeRange: 4000, // 4km 淡出范围
    minScale: 0.3,
    maxScale: 2.0,
  },
});

// 国家边界 - 远距离观察
const countryMarker = RippleMarker(viewer, {
  lon: 113.2644,
  lat: 23.1291,
  pyramidHeight: 5000,
  heightResponsive: {
    enabled: true,
    referenceHeight: 15000, // 15km 最佳观察高度
    fadeRange: 8000, // 8km 淡出范围
    minScale: 0.2,
    maxScale: 3.0,
  },
});
```

### 📦 批量管理标记

```ts
const markers: RippleMarker[] = [];

// 添加多个标记
const cities = [
  { name: "北京", lon: 116.3913, lat: 39.9075 },
  { name: "上海", lon: 121.4737, lat: 31.2304 },
  { name: "广州", lon: 113.2644, lat: 23.1291 },
];

cities.forEach((city) => {
  const marker = RippleMarker(viewer, {
    lon: city.lon,
    lat: city.lat,
    id: `city-${city.name}`,
    data: city,
    label: {
      text: city.name,
      font: "16px sans-serif",
      fillColor: "#00ff88",
      pixelOffset: { x: 0, y: -40 },
    },
    onClick: (data) => {
      alert(`欢迎来到${data.name}！`);
    },
  });
  markers.push(marker);
});

// 批量隐藏所有标记
markers.forEach((marker) => marker.hide());

// 批量删除所有标记
markers.forEach((marker) => marker.remove());
```

---

## 📚 API 参考

### RippleMarker(viewer, options)

创建一个带波纹动画的 3D 标记。

**参数:**

- **viewer**: `Cesium.Viewer` 实例
- **options**: `RippleMarkerOptions` 配置对象

**返回值:** `RippleMarker` 对象，包含控制方法

### RippleMarkerOptions

#### 基础配置

- **lon**: `number` - 经度（必填）
- **lat**: `number` - 纬度（必填）
- **height**?: `number` - 海拔高度（米），默认 `0`
- **id**?: `string` - 唯一标识符，用于事件识别
- **data**?: `any` - 绑定数据，点击时在回调中返回

#### 视觉配置

- **color**?: `string` - 三棱锥颜色，CSS 颜色字符串，默认 `'rgba(0,150,255,0.8)'`
- **pyramidHeight**?: `number` - 三棱锥高度（米），默认 `1000`
- **baseRadius**?: `number` - 三棱锥底部半径（米），默认 `pyramidHeight * 0.3`
- **surfaceHeight**?: `number` - 三棱锥与波纹基准高度（米），默认 `50`

#### 动画配置

- **maxRadius**?: `number` - 波纹最大半径（米），默认 `8000`
- **duration**?: `number` - 单个波纹周期（毫秒），默认 `1500`
- **loops**?: `number` - 循环次数，`Infinity` 表示无限循环，默认 `Infinity`
- **floatEnabled**?: `boolean` - 是否启用上下浮动动画，默认 `true`

#### 高度响应式缩放控制配置

- **heightResponsive**?: `HeightResponsiveOptions` - 高度响应式配置对象

#### HeightResponsiveOptions

- **enabled**?: `boolean` - 是否启用高度响应式缩放，默认 `true`
- **referenceHeight**?: `number` - 参考高度（米），标记在此高度显示最佳，默认 `pyramidHeight + 3000`
- **minScale**?: `number` - 最小缩放比例，默认 `0.1`
- **maxScale**?: `number` - 最大缩放比例，默认 `2.0`
- **fadeRange**?: `number` - 淡入淡出范围（米），默认 `1000`
- **updateInterval**?: `number` - 更新间隔（毫秒），默认 `100`
- **nearShrinkMultiple**?: `number` - 近地最小整体缩小倍数（默认 `13`，表示最低可缩到原始的 `1/13`），相机接近地面时整体会平滑逼近此最小比例，且贴地显示
- **labelBoost**?: `number` - 标签近地可读性增强系数（默认 `1.8`），用于在近地缩小时额外放大标签（与背景）以保证可读
- **labelMinScale**?: `number` - 标签最小缩放下限（默认 `0.8`），用于限制标签在近地时的最小可见尺寸

#### 标签配置

- **label**?: `LabelOptions` - 标签配置对象

#### LabelOptions

**基础配置:**

- **text**?: `string` - 标签文字
- **font**?: `string` - 字体样式，如 `'14px sans-serif'`，默认 `'14px sans-serif'`
- **fillColor**?: `string` - 文字颜色，CSS 颜色字符串，默认 `'#ffffff'`
- **outlineColor**?: `string` - 描边颜色，CSS 颜色字符串，默认 `'#000000'`
- **outlineWidth**?: `number` - 描边宽度，默认 `2`
- **pixelOffset**?: `{ x: number; y: number }` - 像素偏移，默认 `{ x: 0, y: -50 }`
- **scale**?: `number` - 文字缩放，默认 `1.0`
- **show**?: `boolean` - 是否显示标签，默认 `true`

**背景板配置:**

- **backgroundColor**?: `string` - 背景颜色，CSS 颜色字符串
- **backgroundBorderColor**?: `string` - 背景边框颜色，CSS 颜色字符串
- **backgroundBorderWidth**?: `number` - 背景边框宽度，默认 `1`
- **backgroundPadding**?: `{ x: number; y: number }` - 背景内边距，默认 `{ x: 8, y: 4 }`
- **backgroundCornerRadius**?: `number` - 背景圆角半径，默认 `4`

**对齐配置:**

- **textAlign**?: `'left' | 'center' | 'right'` - 文字水平对齐方式，默认 `'center'`
- **verticalAlign**?: `'top' | 'middle' | 'bottom'` - 文字垂直对齐方式，默认 `'bottom'`

**位置配置:**

- **heightOffset**?: `number` - 标签相对于圆锥体顶部的高度偏移（米），默认 `80`

#### 事件配置

- **onClick**?: `(data: any, position: { lon: number, lat: number }) => void` - 点击回调函数

### LabelOptions

- **text**?: `string` - 标签文字
- **font**?: `string` - 字体样式，如 `'16px sans-serif'`，默认 `'14px sans-serif'`
- **fillColor**?: `string` - 文字颜色，CSS 颜色字符串，默认 `'#ffffff'`
- **outlineColor**?: `string` - 描边颜色，CSS 颜色字符串，默认 `'#000000'`
- **outlineWidth**?: `number` - 描边宽度，默认 `2`
- **pixelOffset**?: `{ x: number, y: number }` - 像素偏移，默认 `{ x: 0, y: -45 }`
- **scale**?: `number` - 文字缩放，默认 `1.0`
- **show**?: `boolean` - 是否显示标签，默认 `true`

### RippleMarker 对象方法

- **remove()**: `() => void` - 移除标记及其所有相关实体
- **show()**: `() => void` - 显示标记
- **hide()**: `() => void` - 隐藏标记
- **setVisible(visible: boolean)**: `(visible: boolean) => void` - 设置可见性
- **updateHeightResponsive()**: `() => void` - 手动更新高度响应式效果

---

## 🎯 特性说明

### 🎨 高度响应式缩放

- **智能缩放**：根据相机高度自动调整标签大小
- **淡入淡出**：在可视范围内实现平滑的透明度过渡
- **圆锥体保护**：圆锥体保持原始尺寸，不参与缩放变形
- **涟漪同步**：涟漪与圆锥体同步显示/隐藏

### ⚡ 性能优化

- **节流更新**：避免每帧都更新，使用 `updateInterval` 控制频率
- **高度差检测**：只有高度变化超过 10m 才更新
- **场景兼容性**：检测 viewer 和 scene 状态，自动销毁无效组件
- **自动清理**：当检测到场景错误时，自动销毁组件避免内存泄漏

### 🖱️ 事件处理

- 点击事件会返回绑定的 `data` 和点击位置的经纬度
- 支持多个标记的独立事件处理
- 自动清理事件监听器，避免内存泄漏

### 🎬 动画系统

- 使用 Cesium 的 CallbackProperty 实现高效动画
- 自动启用连续渲染模式，确保动画流畅运行
- 支持上下浮动动画和波纹扩散效果

### 🛡️ 稳定性保障

- 完整的错误处理和异常恢复机制
- 自动管理实体生命周期
- 支持批量操作和统一管理
- 场景销毁时安全清理资源

### 📝 类型安全

完整的 TypeScript 类型定义，提供智能提示和类型检查。

---

## 📖 参数详解

### `referenceHeight` - 参考高度

**作用**：标记的"最佳观察高度"，用于计算缩放比例。

**设置建议**：

```typescript
// 推荐公式
referenceHeight = pyramidHeight + 2000~5000

// 示例
pyramidHeight: 1000  → referenceHeight: 3000~6000
pyramidHeight: 2000  → referenceHeight: 4000~7000
pyramidHeight: 500   → referenceHeight: 2500~5500
```

### `fadeRange` - 淡入淡出范围

**作用**：控制标记开始淡出的距离范围。

**设置建议**：

```typescript
// 近距离观察（城市级别）
fadeRange: 1000~2000

// 中距离观察（区域级别）
fadeRange: 2000~4000

// 远距离观察（国家级别）
fadeRange: 4000~8000
```

### 效果演示

```
相机高度 vs 标记效果：

< 3000m        → 标签适度缩放，完全不隐藏
3000m-参考高度  → 标签适度放大，最大150%
> 参考高度     → 标签缩小，圆锥体和涟漪同步淡出
> 参考高度+范围 → 完全透明消失
```

### 🏷️ 标签位置优化

**问题**：标签距离圆锥体顶部太远，需要手动调整 `pixelOffset`。

**解决方案**：

- **`heightOffset`**：控制标签相对于圆锥体顶部的高度偏移（米）
- **优化默认值**：从 200m 减少到 80m
- **减少像素偏移**：默认 `pixelOffset` 从 `-50` 减少到 `-30`

**使用示例**：

```typescript
label: {
  text: "标记名称",
  heightOffset: 60,        // 标签距离圆锥体顶部60米
  pixelOffset: { x: 0, y: -20 }, // 微调像素偏移
}
```

**推荐设置**：

- **小字体**：`heightOffset: 40-60`
- **中等字体**：`heightOffset: 60-80`
- **大字体**：`heightOffset: 80-120`

---
