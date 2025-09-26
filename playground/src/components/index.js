// src/RippleMarker/index.ts
import * as Cesium from "cesium";
function RippleMarker(viewer, {
  lon,
  lat,
  height = 0,
  color = "rgba(0,150,255,0.8)",
  maxRadius = 8e3,
  duration = 1500,
  loops = Infinity,
  pyramidHeight = 1e3,
  baseRadius,
  floatEnabled = true,
  surfaceHeight = 50,
  id,
  data,
  label,
  onClick
}) {
  if (viewer && viewer.scene) {
    viewer.scene.requestRenderMode = false;
    if (viewer.clock) viewer.clock.shouldAnimate = true;
  }
  const entities = [];
  const cesiumColor = Cesium.Color.fromCssColorString(color);
  const baseRadiusMeters = baseRadius ?? pyramidHeight * 0.3;
  const floatAmplitude = pyramidHeight * 0.2;
  const floatPeriodMs = 2e3;
  const baseHeight = height + surfaceHeight;
  const tipPosition = Cesium.Cartesian3.fromDegrees(lon, lat, baseHeight);
  const vertexDegrees = [];
  for (let i = 0; i < 3; i++) {
    const angle = i * 2 * Math.PI / 3;
    const x = lon + baseRadiusMeters * Math.cos(angle) / 111e3;
    const y = lat + baseRadiusMeters * Math.sin(angle) / 111e3;
    vertexDegrees.push({ x, y });
  }
  const numWaves = 3;
  const waveEntities = Array.from({ length: numWaves }, (_, index) => {
    const radiusProperty = new Cesium.CallbackProperty((time) => {
      const safeDuration = Math.max(1, duration);
      const t = time ? Cesium.JulianDate.toDate(time).getTime() : Date.now();
      const elapsed = t % safeDuration / safeDuration;
      const wave = (elapsed + index / numWaves) % 1;
      const r = Math.max(1, (wave || 0) * Math.max(1, maxRadius));
      return r;
    }, false);
    const materialProperty = new Cesium.ColorMaterialProperty(
      new Cesium.CallbackProperty((time) => {
        const safeDuration = Math.max(1, duration);
        const t = time ? Cesium.JulianDate.toDate(time).getTime() : Date.now();
        const elapsed = t % safeDuration / safeDuration;
        const wave = (elapsed + index / numWaves) % 1;
        const alpha = (1 - wave) ** 2 * 0.6;
        return Cesium.Color.fromAlpha(cesiumColor, alpha);
      }, false)
    );
    return viewer.entities.add({
      position: tipPosition,
      ellipse: {
        semiMinorAxis: radiusProperty,
        semiMajorAxis: radiusProperty,
        // 底部波纹保持在固定高度（surfaceHeight），不随三棱锥浮动
        height: baseHeight,
        material: materialProperty
      }
    });
  });
  entities.push(...waveEntities);
  for (let i = 0; i < 3; i++) {
    const v1deg = vertexDegrees[i];
    const v2deg = vertexDegrees[(i + 1) % 3];
    entities.push(
      viewer.entities.add({
        polygon: {
          hierarchy: new Cesium.CallbackProperty((_time) => {
            const t = Date.now();
            const phase = t % floatPeriodMs / floatPeriodMs * 2 * Math.PI;
            const offset = floatEnabled ? Math.sin(phase) * floatAmplitude : 0;
            const tip = Cesium.Cartesian3.fromDegrees(
              lon,
              lat,
              baseHeight + offset
            );
            const v1Local = v1deg ? Cesium.Cartesian3.fromDegrees(
              v1deg.x,
              v1deg.y,
              baseHeight + pyramidHeight + offset
            ) : tip;
            const v2Local = v2deg ? Cesium.Cartesian3.fromDegrees(
              v2deg.x,
              v2deg.y,
              baseHeight + pyramidHeight + offset
            ) : tip;
            return new Cesium.PolygonHierarchy([tip, v1Local, v2Local]);
          }, false),
          // 使用传入颜色作为填充材质，确保颜色应用到面上
          material: new Cesium.ColorMaterialProperty(cesiumColor),
          perPositionHeight: true
        }
      })
    );
  }
  let labelEntity = null;
  if (label && label.text && label.show !== false) {
    const labelPosition = Cesium.Cartesian3.fromDegrees(lon, lat, baseHeight + pyramidHeight + 100);
    labelEntity = viewer.entities.add({
      id: id ? `${id}_label` : void 0,
      position: labelPosition,
      label: {
        text: label.text,
        font: label.font || "14px sans-serif",
        fillColor: label.fillColor ? Cesium.Color.fromCssColorString(label.fillColor) : Cesium.Color.WHITE,
        outlineColor: label.outlineColor ? Cesium.Color.fromCssColorString(label.outlineColor) : Cesium.Color.BLACK,
        outlineWidth: label.outlineWidth || 2,
        pixelOffset: label.pixelOffset ? new Cesium.Cartesian2(label.pixelOffset.x, label.pixelOffset.y) : new Cesium.Cartesian2(0, -45),
        scale: label.scale || 1,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM
      }
    });
    entities.push(labelEntity);
  }
  let clickHandler = null;
  if (onClick) {
    viewer.screenSpaceEventHandler.setInputAction((event) => {
      const pickedObject = viewer.scene.pick(event.position);
      if (pickedObject && pickedObject.id && entities.includes(pickedObject.id)) {
        onClick(data, { lon, lat });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    clickHandler = () => {
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
  }
  let alive = true;
  const animationHandler = viewer.scene.postRender.addEventListener(() => {
    if (!alive) return;
    if (loops !== Infinity) {
      const elapsedTime = Date.now() - startTime;
      const totalDuration = duration * loops;
      if (elapsedTime >= totalDuration) {
        remove();
      }
    }
  });
  const startTime = Date.now();
  function remove() {
    alive = false;
    entities.forEach((entity) => viewer.entities.remove(entity));
    if (clickHandler) {
      clickHandler();
    }
    animationHandler();
  }
  function show() {
    entities.forEach((entity) => {
      entity.show = true;
    });
  }
  function hide() {
    entities.forEach((entity) => {
      entity.show = false;
    });
  }
  function setVisible(visible) {
    entities.forEach((entity) => {
      entity.show = visible;
    });
  }
  return {
    remove,
    show,
    hide,
    setVisible
  };
}

// src/ViewerClick/index.ts
import * as Cesium2 from "cesium";
function ViewerClick(viewer, callback) {
  const handler = viewer.screenSpaceEventHandler;
  handler.setInputAction((event) => {
    const pickedPosition = viewer.scene.pickPosition(event.position);
    if (pickedPosition) {
      const cartographic = Cesium2.Cartographic.fromCartesian(pickedPosition);
      const lon = Cesium2.Math.toDegrees(cartographic.longitude);
      const lat = Cesium2.Math.toDegrees(cartographic.latitude);
      callback(lon, lat, event);
    }
  }, Cesium2.ScreenSpaceEventType.LEFT_CLICK);
  return () => {
    handler.removeInputAction(Cesium2.ScreenSpaceEventType.LEFT_CLICK);
  };
}

// src/CameraMoveEvent/index.ts
import * as Cesium3 from "cesium";
function CameraMoveEvent(viewer, { enableConsoleLog = true } = {}) {
  let consoleLogEnabled = enableConsoleLog;
  let currentPosition = null;
  let moveEndHandler = null;
  function getCurrentPosition() {
    if (!viewer || !viewer.camera) return null;
    const camera = viewer.camera;
    const position = camera.position;
    const cartographic = Cesium3.Cartographic.fromCartesian(position);
    return {
      longitude: Cesium3.Math.toDegrees(cartographic.longitude),
      latitude: Cesium3.Math.toDegrees(cartographic.latitude),
      height: cartographic.height
    };
  }
  function logPosition(position) {
    if (consoleLogEnabled) {
      console.log(`\u76F8\u673A\u4F4D\u7F6E: \u7ECF\u5EA6 ${position.longitude.toFixed(6)}\xB0, \u7EAC\u5EA6 ${position.latitude.toFixed(6)}\xB0, \u9AD8\u5EA6 ${position.height.toFixed(2)}m`);
    }
  }
  function onCameraMoveEnd() {
    const position = getCurrentPosition();
    if (position) {
      currentPosition = position;
      logPosition(position);
    }
  }
  moveEndHandler = viewer.camera.moveEnd.addEventListener(onCameraMoveEnd);
  const initialPosition = getCurrentPosition();
  if (initialPosition) {
    currentPosition = initialPosition;
    logPosition(initialPosition);
  }
  function remove() {
    if (moveEndHandler) {
      moveEndHandler();
      moveEndHandler = null;
    }
    currentPosition = null;
  }
  function setConsoleLog(enabled) {
    consoleLogEnabled = enabled;
  }
  return {
    remove,
    getPosition: () => currentPosition,
    setConsoleLog
  };
}
export {
  CameraMoveEvent,
  RippleMarker,
  ViewerClick
};
