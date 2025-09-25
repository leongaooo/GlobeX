"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  RippleMarker: () => RippleMarker,
  ViewerClick: () => ViewerClick
});
module.exports = __toCommonJS(index_exports);

// src/RippleMarker/index.ts
var Cesium = __toESM(require("cesium"), 1);
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
  surfaceHeight = 50
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
    animationHandler();
  }
  return {
    remove
  };
}

// src/ViewerClick/index.ts
var Cesium2 = __toESM(require("cesium"), 1);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RippleMarker,
  ViewerClick
});
