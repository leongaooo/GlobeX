# 🎯 RippleMarker 高度响应式缩放功能

## 📋 功能概述

`RippleMarker` 现在支持基于相机高度的智能缩放和淡入淡出效果，让标记在不同高度下都能保持良好的视觉效果。

## ✨ 核心特性

### 🎨 高度响应式缩放

- **智能缩放**：根据相机高度自动调整标记大小
- **淡入淡出**：在可视范围内实现平滑的透明度过渡
- **性能优化**：使用节流机制避免频繁更新

### 🔧 配置选项

```typescript
interface HeightResponsiveConfig {
  enabled?: boolean; // 是否启用高度响应式缩放
  referenceHeight?: number; // 参考高度（圆锥体高度 + 3000m）
  minScale?: number; // 最小缩放比例
  maxScale?: number; // 最大缩放比例
  fadeRange?: number; // 淡入淡出范围（米）
  updateInterval?: number; // 更新间隔（毫秒）
}
```

## 🚀 使用示例

### 基础用法

```typescript
import { RippleMarker } from "cesium-kit";

const marker = RippleMarker(viewer, {
  lon: 116.4074,
  lat: 39.9042,
  pyramidHeight: 1000,
  label: {
    text: "北京市",
    font: "18px sans-serif",
    fillColor: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  // 启用高度响应式功能
  heightResponsive: {
    enabled: true,
    referenceHeight: 4000, // 1000m 圆锥体 + 3000m
    minScale: 0.2,
    maxScale: 3.0,
    fadeRange: 2000,
    updateInterval: 100,
  },
  onClick: (data, position) => {
    console.log("点击了标记:", data);
  },
});
```

### 高级配置

```typescript
// 多个不同高度的标记
const markers = [
  { lat: 39.9042, height: 1000, name: "低海拔标记" },
  { lat: 40.0, height: 2000, name: "中海拔标记" },
  { lat: 40.1, height: 3000, name: "高海拔标记" },
];

markers.forEach((config, index) => {
  const marker = RippleMarker(viewer, {
    lon: 116.4074,
    lat: config.lat,
    pyramidHeight: config.height,
    data: { name: config.name },
    heightResponsive: {
      enabled: true,
      referenceHeight: config.height + 3000,
      minScale: 0.1,
      maxScale: 2.5,
      fadeRange: 1500,
      updateInterval: 50, // 更频繁的更新
    },
    label: {
      text: config.name,
      font: "16px sans-serif",
      fillColor: "#ffffff",
      backgroundColor: `rgba(${index * 50}, 100, 200, 0.8)`,
      backgroundCornerRadius: 15,
      backgroundPadding: { x: 10, y: 5 },
    },
  });
});
```

## 🎯 效果说明

### 📏 缩放逻辑

- **相机高度 < 3000m**：标签适度缩放，完全不隐藏，保持最佳可见性
- **3000m ≤ 相机高度 < 参考高度**：标签适度放大，最大不超过 150%，保持视觉比例
- **相机高度 ≥ 参考高度**：标签缩小，避免遮挡
- **缩放范围**：在 `minScale` 和 `maxScale` 之间动态调整
- **圆锥体**：不参与缩放变形，保持原始尺寸，只参与显示/隐藏
- **涟漪**：与圆锥体同步，参与显示/隐藏效果

### 🌅 淡入淡出逻辑

- **高度 < 3000m**：完全显示（opacity = 1），不隐藏
- **3000m ≤ 高度 < 参考高度**：完全显示（opacity = 1）
- **高度 ≥ 参考高度**：根据距离参考高度的差值计算透明度
- **淡出范围**：在 `fadeRange` 距离内实现平滑过渡
- **圆锥体和涟漪可见性**：当透明度低于 0.1 时完全隐藏

### ⚡ 性能优化

- **节流更新**：避免每帧都更新，使用 `updateInterval` 控制频率
- **高度差检测**：只有高度变化超过 10m 才更新
- **错误处理**：包含完整的 try-catch 错误处理
- **场景兼容性**：检测 viewer 和 scene 状态，自动销毁无效组件
- **自动清理**：当检测到场景错误时，自动销毁组件避免内存泄漏

## 🔧 API 方法

### 手动更新

```typescript
// 手动触发高度响应式更新
marker.updateHeightResponsive();
```

### 显示/隐藏控制

```typescript
marker.show(); // 显示标记
marker.hide(); // 隐藏标记
marker.setVisible(true); // 设置可见性
marker.remove(); // 移除标记
```

## 🎨 视觉效果

### 高度变化时的效果

1. **低空飞行**：标记放大，细节清晰可见
2. **中空飞行**：标记适中，平衡视觉效果
3. **高空飞行**：标记缩小，避免视觉混乱
4. **极高空**：标记淡出，保持场景整洁

### 平滑过渡

- 所有缩放和透明度变化都是平滑的
- 避免突兀的视觉跳跃
- 保持用户体验的连贯性

## 🚀 最佳实践

### 配置建议

```typescript
// 推荐配置
heightResponsive: {
    enabled: true,
    referenceHeight: pyramidHeight + 3000, // 动态计算
    minScale: 0.3,    // 最小 30% 大小
    maxScale: 1.5,    // 最大 150% 大小，避免过度放大
    fadeRange: 3000,  // 3km 淡入淡出范围
    updateInterval: 100, // 100ms 更新间隔
}
```

### 性能考虑

- 对于大量标记，建议适当增加 `updateInterval`
- 根据场景复杂度调整 `fadeRange`
- 在高性能要求的场景中可以禁用此功能

## 🎉 总结

高度响应式缩放功能让 `RippleMarker` 在不同相机高度下都能提供最佳的视觉体验，既保持了标记的可读性，又避免了视觉干扰。通过智能的缩放和淡入淡出机制，让 3D 场景更加自然和美观。
