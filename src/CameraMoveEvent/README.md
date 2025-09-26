# CameraMoveEvent

监听 Cesium 相机移动事件，实时获取相机位置信息（经纬度、高度），支持控制台打印和位置查询。

## 基础用法

```ts
import { Viewer } from "cesium";
import { CameraMoveEvent } from "globex";

const viewer = new Viewer("container");

// 启用控制台打印（默认）
const cameraTracker = CameraMoveEvent(viewer);

// 禁用控制台打印
const cameraTracker2 = CameraMoveEvent(viewer, {
  enableConsoleLog: false,
});

// 获取当前位置
const position = cameraTracker.getPosition();
if (position) {
  console.log(
    `当前位置: ${position.longitude}, ${position.latitude}, ${position.height}`
  );
}

// 动态控制打印开关
cameraTracker.setConsoleLog(false); // 关闭打印
cameraTracker.setConsoleLog(true); // 开启打印

// 移除监听器
cameraTracker.remove();
```

## 高级用法

### 实时位置监控

```ts
const cameraTracker = CameraMoveEvent(viewer, {
  enableConsoleLog: true,
});

// 定期获取位置信息
setInterval(() => {
  const pos = cameraTracker.getPosition();
  if (pos) {
    // 更新UI显示
    updateLocationDisplay(pos);
  }
}, 1000);

function updateLocationDisplay(position) {
  document.getElementById("longitude").textContent =
    position.longitude.toFixed(6);
  document.getElementById("latitude").textContent =
    position.latitude.toFixed(6);
  document.getElementById("height").textContent = position.height.toFixed(2);
}
```

### 位置变化回调

```ts
let lastPosition = null;

const cameraTracker = CameraMoveEvent(viewer, {
  enableConsoleLog: false, // 关闭默认打印
});

// 自定义位置变化处理
setInterval(() => {
  const currentPos = cameraTracker.getPosition();
  if (currentPos && lastPosition) {
    const distance = calculateDistance(lastPosition, currentPos);
    if (distance > 1000) {
      // 移动超过1公里
      console.log(`相机移动了 ${distance.toFixed(2)} 米`);
      onSignificantMove(currentPos);
    }
  }
  lastPosition = currentPos;
}, 500);

function calculateDistance(pos1, pos2) {
  // 简单的距离计算（实际项目中建议使用更精确的算法）
  const dx = pos1.longitude - pos2.longitude;
  const dy = pos1.latitude - pos2.latitude;
  return Math.sqrt(dx * dx + dy * dy) * 111000; // 粗略转换为米
}

function onSignificantMove(position) {
  // 处理显著位置变化
  console.log("显著位置变化:", position);
}
```

### 多实例管理

```ts
const trackers: CameraMoveEvent[] = [];

// 创建多个监听器
function createTracker(id: string, enableLog: boolean = true) {
  const tracker = CameraMoveEvent(viewer, { enableConsoleLog: enableLog });
  trackers.push(tracker);
  return tracker;
}

// 批量管理
function removeAllTrackers() {
  trackers.forEach((tracker) => tracker.remove());
  trackers.length = 0;
}

function toggleAllLogging(enabled: boolean) {
  trackers.forEach((tracker) => tracker.setConsoleLog(enabled));
}
```

---

## API 参考

### CameraMoveEvent(viewer, options)

创建一个相机移动事件监听器。

**参数:**

- **viewer**: `Cesium.Viewer` 实例
- **options**: `CameraMoveEventOptions` 配置对象

**返回值:** `CameraMoveEvent` 对象，包含控制方法

### CameraMoveEventOptions

- **enableConsoleLog**?: `boolean` - 是否启用控制台打印，默认 `true`

### CameraPosition

相机位置信息接口：

- **longitude**: `number` - 经度（度）
- **latitude**: `number` - 纬度（度）
- **height**: `number` - 高度（米）

### CameraMoveEvent 对象方法

- **remove()**: `() => void` - 移除事件监听器
- **getPosition()**: `() => CameraPosition | null` - 获取当前相机位置
- **setConsoleLog(enabled: boolean)**: `(enabled: boolean) => void` - 设置控制台打印开关

---

## 特性说明

### 事件触发时机

- 监听 `camera.moveEnd` 事件，在相机移动结束后触发
- 初始化时立即获取一次当前位置
- 避免频繁触发，只在移动结束时更新

### 控制台输出格式

```
相机位置: 经度 116.391500°, 纬度 39.907500°, 高度 1500000.00m
```

### 性能优化

- 使用 Cesium 原生事件系统，性能高效
- 自动清理事件监听器，避免内存泄漏
- 支持动态开关控制台打印

### 类型安全

完整的 TypeScript 类型定义，提供智能提示和类型检查。

### 使用场景

- 地图导航应用
- 位置记录和轨迹追踪
- 相机位置监控
- 地理信息展示
- 调试和开发工具

---
