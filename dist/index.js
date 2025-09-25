// src/index.ts
import * as Cesium from "cesium";
function addCesiumRippleMarker(viewer, {
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
    return viewer.entities.add({
      position: tipPosition,
      ellipse: {
        semiMinorAxis: new Cesium.CallbackProperty((_time) => {
          const elapsed = Date.now() % duration / duration;
          const wave = (elapsed + index / numWaves) % 1;
          return wave * maxRadius;
        }, false),
        semiMajorAxis: new Cesium.CallbackProperty((_time) => {
          const elapsed = Date.now() % duration / duration;
          const wave = (elapsed + index / numWaves) % 1;
          return wave * maxRadius;
        }, false),
        // 底部波纹保持在固定高度（surfaceHeight），不随三棱锥浮动
        height: baseHeight,
        material: new Cesium.ColorMaterialProperty(
          new Cesium.CallbackProperty((_time) => {
            const elapsed = Date.now() % duration / duration;
            const wave = (elapsed + index / numWaves) % 1;
            const alpha = (1 - wave) ** 2 * 0.6;
            return Cesium.Color.fromAlpha(cesiumColor, alpha);
          }, false)
        )
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
export {
  addCesiumRippleMarker
};
