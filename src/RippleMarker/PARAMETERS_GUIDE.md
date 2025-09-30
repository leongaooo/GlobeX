# 🎯 RippleMarker 高度响应式参数详解

## 📋 参数说明

### `referenceHeight` - 参考高度

**作用**：这是标记的"最佳观察高度"，用于计算缩放比例。

**工作原理**：

- 当相机高度 = `referenceHeight` 时，标记显示为正常大小（scale = 1）
- 当相机高度 < `referenceHeight` 时，标记会放大
- 当相机高度 > `referenceHeight` 时，标记会缩小

**如何设置**：

```typescript
// 示例1：基于圆锥体高度设置
pyramidHeight: 1000,  // 圆锥体高度 1000m
referenceHeight: 4000, // 参考高度 = 圆锥体高度 + 3000m

// 示例2：基于实际观察需求设置
referenceHeight: 5000, // 在 5000m 高度观察效果最佳

// 示例3：基于场景特点设置
referenceHeight: 10000, // 适合高空观察的场景
```

### `fadeRange` - 淡入淡出范围

**作用**：控制标记开始淡出的距离范围。

**工作原理**：

- 在 `referenceHeight ± fadeRange` 范围内：完全显示（opacity = 1）
- 超出这个范围：开始淡出，距离越远透明度越低
- 当距离超过 `referenceHeight + fadeRange` 时：完全透明（opacity = 0）

**如何设置**：

```typescript
// 示例1：小范围淡出（适合近距离观察）
fadeRange: 1000,  // 1000m 范围内完全显示

// 示例2：中等范围淡出（平衡效果）
fadeRange: 3000,  // 3000m 范围内完全显示

// 示例3：大范围淡出（适合远距离观察）
fadeRange: 5000,  // 5000m 范围内完全显示
```

## 🎨 实际效果演示

### 场景 1：城市地标标记

```typescript
const cityMarker = RippleMarker(viewer, {
  lon: 116.4074,
  lat: 39.9042,
  pyramidHeight: 500, // 500m 高的圆锥体
  heightResponsive: {
    enabled: true,
    referenceHeight: 2000, // 在 2000m 高度观察最佳
    fadeRange: 1500, // 500m-3500m 范围内完全显示
    minScale: 0.5,
    maxScale: 1.5,
  },
});
```

**效果**：

- 500m-3500m：完全显示，大小适中
- 3500m-5000m：逐渐淡出
- > 5000m：完全透明

### 场景 2：高空航拍标记

```typescript
const aerialMarker = RippleMarker(viewer, {
  lon: 121.4737,
  lat: 31.2304,
  pyramidHeight: 2000, // 2000m 高的圆锥体
  heightResponsive: {
    enabled: true,
    referenceHeight: 10000, // 在 10000m 高度观察最佳
    fadeRange: 5000, // 5000m-15000m 范围内完全显示
    minScale: 0.3,
    maxScale: 2.0,
  },
});
```

**效果**：

- 5000m-15000m：完全显示，大小适中
- 15000m-20000m：逐渐淡出
- > 20000m：完全透明

### 场景 3：近距离观察标记

```typescript
const closeMarker = RippleMarker(viewer, {
  lon: 113.2644,
  lat: 23.1291,
  pyramidHeight: 200, // 200m 高的圆锥体
  heightResponsive: {
    enabled: true,
    referenceHeight: 1000, // 在 1000m 高度观察最佳
    fadeRange: 500, // 500m-1500m 范围内完全显示
    minScale: 0.8,
    maxScale: 1.2,
  },
});
```

**效果**：

- 500m-1500m：完全显示，大小适中
- 1500m-2000m：逐渐淡出
- > 2000m：完全透明

## 🔧 参数调优建议

### 1. 根据圆锥体高度设置 referenceHeight

```typescript
// 推荐公式
referenceHeight = pyramidHeight + 2000~5000

// 示例
pyramidHeight: 1000  → referenceHeight: 3000~6000
pyramidHeight: 2000  → referenceHeight: 4000~7000
pyramidHeight: 500   → referenceHeight: 2500~5500
```

### 2. 根据观察需求设置 fadeRange

```typescript
// 近距离观察（城市级别）
fadeRange: 1000~2000

// 中距离观察（区域级别）
fadeRange: 2000~4000

// 远距离观察（国家级别）
fadeRange: 4000~8000
```

### 3. 组合使用示例

```typescript
// 城市地标 - 近距离观察
heightResponsive: {
    referenceHeight: 3000,  // 3000m 最佳观察高度
    fadeRange: 1500,        // 1500m-4500m 完全显示
}

// 山脉标记 - 中距离观察
heightResponsive: {
    referenceHeight: 8000,  // 8000m 最佳观察高度
    fadeRange: 3000,        // 5000m-11000m 完全显示
}

// 国家边界 - 远距离观察
heightResponsive: {
    referenceHeight: 15000, // 15000m 最佳观察高度
    fadeRange: 5000,        // 10000m-20000m 完全显示
}
```

## 🎯 快速配置模板

### 模板 1：城市地标

```typescript
heightResponsive: {
    enabled: true,
    referenceHeight: 3000,  // 3km 最佳观察高度
    fadeRange: 2000,        // 2km 淡出范围
    minScale: 0.5,
    maxScale: 1.5,
    updateInterval: 100,
}
```

### 模板 2：区域标记

```typescript
heightResponsive: {
    enabled: true,
    referenceHeight: 8000,  // 8km 最佳观察高度
    fadeRange: 4000,        // 4km 淡出范围
    minScale: 0.3,
    maxScale: 2.0,
    updateInterval: 100,
}
```

### 模板 3：全球标记

```typescript
heightResponsive: {
    enabled: true,
    referenceHeight: 20000, // 20km 最佳观察高度
    fadeRange: 10000,       // 10km 淡出范围
    minScale: 0.2,
    maxScale: 3.0,
    updateInterval: 100,
}
```

## 💡 使用技巧

1. **从大到小调整**：先设置较大的 `referenceHeight` 和 `fadeRange`，然后根据实际效果逐步调整
2. **观察实际效果**：在浏览器中测试不同高度下的显示效果
3. **考虑场景特点**：城市、山区、海洋等不同场景需要不同的参数
4. **平衡性能**：`fadeRange` 越大，计算越频繁，可以适当增加 `updateInterval`

这样设置后，你的标记就会在不同高度下都有最佳的显示效果！🎉
