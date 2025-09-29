// src/RippleMarker/index.ts
import * as Cesium from "cesium";
function createLabelCanvas(label) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const font = label.font || "14px sans-serif";
  ctx.font = font;
  const textMetrics = ctx.measureText(label.text);
  const textWidth = textMetrics.width;
  const textHeight = parseInt(font) || 14;
  const padding = label.backgroundPadding || { x: 8, y: 4 };
  const borderRadius = label.backgroundCornerRadius || 4;
  const borderWidth = label.backgroundBorderWidth || 1;
  const canvasWidth = Math.max(textWidth + padding.x * 2, 40);
  const canvasHeight = Math.max(textHeight + padding.y * 2, 20);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.font = font;
  if (label.backgroundColor) {
    ctx.fillStyle = label.backgroundColor;
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(canvasWidth - borderRadius, 0);
    ctx.quadraticCurveTo(canvasWidth, 0, canvasWidth, borderRadius);
    ctx.lineTo(canvasWidth, canvasHeight - borderRadius);
    ctx.quadraticCurveTo(canvasWidth, canvasHeight, canvasWidth - borderRadius, canvasHeight);
    ctx.lineTo(borderRadius, canvasHeight);
    ctx.quadraticCurveTo(0, canvasHeight, 0, canvasHeight - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.fill();
  }
  if (label.backgroundBorderColor && borderWidth > 0) {
    ctx.strokeStyle = label.backgroundBorderColor;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(canvasWidth - borderRadius, 0);
    ctx.quadraticCurveTo(canvasWidth, 0, canvasWidth, borderRadius);
    ctx.lineTo(canvasWidth, canvasHeight - borderRadius);
    ctx.quadraticCurveTo(canvasWidth, canvasHeight, canvasWidth - borderRadius, canvasHeight);
    ctx.lineTo(borderRadius, canvasHeight);
    ctx.quadraticCurveTo(0, canvasHeight, 0, canvasHeight - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.fillStyle = label.fillColor || "#ffffff";
  let textX = canvasWidth / 2;
  let textY = canvasHeight / 2;
  if (label.textAlign === "left") {
    textX = padding.x;
  } else if (label.textAlign === "right") {
    textX = canvasWidth - padding.x;
  }
  if (label.verticalAlign === "top") {
    textY = padding.y + textHeight;
  } else if (label.verticalAlign === "bottom") {
    textY = canvasHeight - padding.y;
  }
  ctx.textAlign = label.textAlign === "left" ? "left" : label.textAlign === "right" ? "right" : "center";
  ctx.textBaseline = label.verticalAlign === "top" ? "top" : label.verticalAlign === "bottom" ? "bottom" : "middle";
  if (label.outlineColor && label.outlineWidth) {
    ctx.strokeStyle = label.outlineColor;
    ctx.lineWidth = label.outlineWidth;
    ctx.strokeText(label.text, textX, textY);
  }
  ctx.fillText(label.text, textX, textY);
  return canvas;
}
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
  const markerId = id || `ripple-marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
      id: `${markerId}_wave_${index}`,
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
        id: `${markerId}_face_${i}`,
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
    const labelHeight = baseHeight + pyramidHeight + 200;
    const labelPosition = Cesium.Cartesian3.fromDegrees(lon, lat, labelHeight);
    if (label.backgroundColor || label.backgroundBorderColor || label.backgroundCornerRadius) {
      const canvas = createLabelCanvas(label);
      labelEntity = viewer.entities.add({
        id: `${markerId}_label`,
        position: labelPosition,
        billboard: {
          image: canvas,
          pixelOffset: label.pixelOffset ? new Cesium.Cartesian2(label.pixelOffset.x, label.pixelOffset.y) : new Cesium.Cartesian2(0, -50),
          scale: label.scale || 1,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      });
    } else {
      const backgroundColor = label.backgroundColor ? Cesium.Color.fromCssColorString(label.backgroundColor) : void 0;
      const backgroundBorderColor = label.backgroundBorderColor ? Cesium.Color.fromCssColorString(label.backgroundBorderColor) : void 0;
      let horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
      let verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
      if (label.textAlign === "left") horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
      else if (label.textAlign === "right") horizontalOrigin = Cesium.HorizontalOrigin.RIGHT;
      if (label.verticalAlign === "top") verticalOrigin = Cesium.VerticalOrigin.TOP;
      else if (label.verticalAlign === "middle") verticalOrigin = Cesium.VerticalOrigin.CENTER;
      labelEntity = viewer.entities.add({
        id: `${markerId}_label`,
        position: labelPosition,
        label: {
          text: label.text,
          font: label.font || "14px sans-serif",
          fillColor: label.fillColor ? Cesium.Color.fromCssColorString(label.fillColor) : Cesium.Color.WHITE,
          outlineColor: backgroundBorderColor || (label.outlineColor ? Cesium.Color.fromCssColorString(label.outlineColor) : Cesium.Color.BLACK),
          outlineWidth: label.backgroundBorderWidth || label.outlineWidth || 2,
          pixelOffset: label.pixelOffset ? new Cesium.Cartesian2(label.pixelOffset.x, label.pixelOffset.y) : new Cesium.Cartesian2(0, -50),
          scale: label.scale || 1,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          horizontalOrigin,
          verticalOrigin,
          // 背景板配置
          backgroundColor,
          backgroundPadding: label.backgroundPadding ? new Cesium.Cartesian2(label.backgroundPadding.x, label.backgroundPadding.y) : new Cesium.Cartesian2(8, 4),
          // 确保标签始终可见
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      });
    }
    entities.push(labelEntity);
  }
  let clickHandler = null;
  if (onClick) {
    if (!viewer._rippleMarkerGlobalHandler) {
      viewer._rippleMarkerGlobalHandler = (event) => {
        const pickedObject = viewer.scene.pick(event.position);
        if (pickedObject && pickedObject.id) {
          const pickedEntity = pickedObject.id;
          const pickedId = pickedEntity.id;
          const markers = viewer._rippleMarkers || [];
          for (const marker of markers) {
            const isCurrentMarker = marker.entities.some((entity) => entity.id === pickedId);
            if (isCurrentMarker && marker.onClick) {
              marker.onClick(marker.data, { lon: marker.lon, lat: marker.lat });
              break;
            }
          }
        }
      };
      viewer.screenSpaceEventHandler.setInputAction(
        viewer._rippleMarkerGlobalHandler,
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      );
    }
    if (!viewer._rippleMarkers) {
      viewer._rippleMarkers = [];
    }
    const markerInfo = {
      markerId,
      onClick,
      data,
      lon,
      lat,
      entities
    };
    viewer._rippleMarkers.push(markerInfo);
    clickHandler = () => {
      const markers = viewer._rippleMarkers || [];
      const index = markers.findIndex((m) => m.markerId === markerId);
      if (index !== -1) {
        markers.splice(index, 1);
      }
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
    const pickedObject = viewer.scene.pick(event.position);
    if (pickedObject && pickedObject.id) {
      return;
    }
    let pickedPosition = viewer.scene.pickPosition(event.position);
    if (!pickedPosition) {
      const ellipsoidPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
      if (ellipsoidPosition) {
        pickedPosition = ellipsoidPosition;
      }
    }
    if (pickedPosition) {
      const cartographic = Cesium2.Cartographic.fromCartesian(pickedPosition);
      const lon = Cesium2.Math.toDegrees(cartographic.longitude);
      const lat = Cesium2.Math.toDegrees(cartographic.latitude);
      callback(lon, lat, event);
    } else {
      console.warn("ViewerClick: \u65E0\u6CD5\u83B7\u53D6\u70B9\u51FB\u4F4D\u7F6E\u7684\u7ECF\u7EAC\u5EA6");
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

// src/Camera-Control/index.ts
import * as Cesium4 from "cesium";
var CameraControl = class {
  constructor(options) {
    this.autoZoomInterval = null;
    this.baseHeight = 0;
    this.cameraInfo = null;
    this.currentZoomLevel = 50;
    this.isAtEndpoint = false;
    this.isDragging = false;
    this.northIndicator = null;
    this.sliderOffset = 0;
    this.zoomSliderRef = null;
    this.viewer = options.viewer;
    this.zoomDistance = options.zoomDistance || 500;
    this.showCameraInfo = options.showCameraInfo || false;
    this.cameraState = {
      longitude: 0,
      latitude: 0,
      height: 0,
      heading: 0,
      pitch: 0,
      roll: 0
    };
    const containerId = options.containerId || this.findViewerContainer();
    this.container = this.createContainer(containerId);
    this.setupEventListeners();
    this.updateCameraState();
    this.startCameraStateUpdate();
    this.appendToPage();
  }
  // 公共方法
  destroy() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
    this.stopAutoZoom();
    if (this.container.parentNode) {
      this.container.remove();
    }
  }
  getContainer() {
    return this.container;
  }
  // 自动添加到页面
  appendToPage() {
    const targetContainer = document.querySelector(
      `#${this.container.id.replace("cesium-kit-camera-control-", "")}`
    );
    if (targetContainer) {
      targetContainer.append(this.container);
    } else {
      document.body.append(this.container);
    }
  }
  createCameraInfo() {
    const cameraInfo = document.createElement("div");
    cameraInfo.className = "cesium-kit-camera-info";
    this.cameraInfo = cameraInfo;
    const positionSection = document.createElement("div");
    positionSection.className = "cesium-kit-info-section";
    const positionTitle = document.createElement("h4");
    positionTitle.textContent = "\u5F53\u524D\u4F4D\u7F6E";
    positionSection.append(positionTitle);
    const positionItems = [
      { label: "\u7ECF\u5EA6:", key: "longitude", unit: "\xB0" },
      { label: "\u7EAC\u5EA6:", key: "latitude", unit: "\xB0" },
      { label: "\u9AD8\u5EA6:", key: "height", unit: "m" }
    ];
    positionItems.forEach(({ label, key, unit }) => {
      const item = document.createElement("div");
      item.className = "cesium-kit-info-item";
      const labelSpan = document.createElement("span");
      labelSpan.textContent = label;
      const valueSpan = document.createElement("span");
      valueSpan.id = `cesium-kit-${key}`;
      valueSpan.textContent = `0${unit}`;
      item.append(labelSpan);
      item.append(valueSpan);
      positionSection.append(item);
    });
    cameraInfo.append(positionSection);
    const orientationSection = document.createElement("div");
    orientationSection.className = "cesium-kit-info-section";
    const orientationTitle = document.createElement("h4");
    orientationTitle.textContent = "\u76F8\u673A\u65B9\u5411";
    orientationSection.append(orientationTitle);
    const orientationItems = [
      { label: "\u671D\u5411:", key: "heading", unit: "\xB0" },
      { label: "\u4FEF\u4EF0:", key: "pitch", unit: "\xB0" },
      { label: "\u7FFB\u6EDA:", key: "roll", unit: "\xB0" }
    ];
    orientationItems.forEach(({ label, key, unit }) => {
      const item = document.createElement("div");
      item.className = "cesium-kit-info-item";
      const labelSpan = document.createElement("span");
      labelSpan.textContent = label;
      const valueSpan = document.createElement("span");
      valueSpan.id = `cesium-kit-${key}`;
      valueSpan.textContent = `0${unit}`;
      item.append(labelSpan);
      item.append(valueSpan);
      orientationSection.append(item);
    });
    cameraInfo.append(orientationSection);
    return cameraInfo;
  }
  createContainer(id) {
    const container = document.createElement("div");
    container.id = `cesium-kit-camera-control-${id}`;
    container.className = "cesium-kit-camera-controls";
    const rotationControl = this.createRotationControl();
    container.append(rotationControl);
    const panControl = this.createPanControl();
    container.append(panControl);
    const streetView = this.createStreetView();
    container.append(streetView);
    const zoomControl = this.createZoomControl();
    container.append(zoomControl);
    if (this.showCameraInfo) {
      const cameraInfo = this.createCameraInfo();
      container.append(cameraInfo);
    }
    return container;
  }
  createPanControl() {
    const panControl = document.createElement("div");
    panControl.className = "cesium-kit-pan-control";
    const controlCircle = document.createElement("div");
    controlCircle.className = "cesium-kit-control-circle";
    const handBtn = document.createElement("button");
    handBtn.className = "cesium-kit-control-btn cesium-kit-hand-btn";
    handBtn.title = "\u5E73\u79FB\u63A7\u5236";
    handBtn.innerHTML = this.getSvgIcon("radix-icons--hand");
    controlCircle.append(handBtn);
    const directions = [
      { dir: "up", title: "\u5411\u4E0A\u5E73\u79FB" },
      { dir: "down", title: "\u5411\u4E0B\u5E73\u79FB" },
      { dir: "left", title: "\u5411\u5DE6\u5E73\u79FB" },
      { dir: "right", title: "\u5411\u53F3\u5E73\u79FB" }
    ];
    directions.forEach(({ dir, title }) => {
      const btn = document.createElement("button");
      btn.className = `cesium-kit-control-btn cesium-kit-arrow-btn ${dir}`;
      btn.title = title;
      btn.addEventListener("click", () => this.panCamera(dir));
      btn.innerHTML = this.getSvgIcon(`line-md--chevron-small-${dir}`);
      controlCircle.append(btn);
    });
    panControl.append(controlCircle);
    return panControl;
  }
  createRotationControl() {
    const rotationControl = document.createElement("div");
    rotationControl.className = "cesium-kit-rotation-control";
    const controlCircle = document.createElement("div");
    controlCircle.className = "cesium-kit-control-circle";
    const compassTrack = document.createElement("div");
    compassTrack.className = "cesium-kit-compass-track";
    controlCircle.append(compassTrack);
    const eyeBtn = document.createElement("button");
    eyeBtn.className = "cesium-kit-control-btn cesium-kit-eye-btn";
    eyeBtn.title = "\u89C6\u89D2\u63A7\u5236";
    eyeBtn.innerHTML = this.getSvgIcon("line-md--compass-loop");
    controlCircle.append(eyeBtn);
    const directions = [
      { dir: "up", title: "\u5411\u4E0A\u65CB\u8F6C" },
      { dir: "down", title: "\u5411\u4E0B\u65CB\u8F6C" },
      { dir: "left", title: "\u5411\u5DE6\u65CB\u8F6C" },
      { dir: "right", title: "\u5411\u53F3\u65CB\u8F6C" }
    ];
    directions.forEach(({ dir, title }) => {
      const btn = document.createElement("button");
      btn.className = `cesium-kit-control-btn cesium-kit-arrow-btn ${dir}`;
      btn.title = title;
      btn.addEventListener("click", () => this.rotateCamera(dir));
      btn.innerHTML = this.getSvgIcon(`line-md--chevron-small-${dir}`);
      controlCircle.append(btn);
    });
    this.northIndicator = document.createElement("div");
    this.northIndicator.className = "cesium-kit-north-indicator";
    this.northIndicator.textContent = "N";
    this.northIndicator.title = "\u91CD\u7F6E\u4E3A\u5317\u65B9\u4F4D";
    this.northIndicator.addEventListener("click", () => this.resetToNorth());
    controlCircle.append(this.northIndicator);
    rotationControl.append(controlCircle);
    return rotationControl;
  }
  createStreetView() {
    const streetView = document.createElement("div");
    streetView.className = "cesium-kit-street-view";
    streetView.innerHTML = this.getSvgIcon("gis--location-man-alt");
    return streetView;
  }
  createZoomControl() {
    const zoomControl = document.createElement("div");
    zoomControl.className = "cesium-kit-zoom-control";
    zoomControl.addEventListener("mouseup", (e) => this.handleMouseUp(e));
    const zoomInBtn = document.createElement("button");
    zoomInBtn.className = "cesium-kit-zoom-btn cesium-kit-zoom-in";
    zoomInBtn.textContent = "+";
    zoomInBtn.title = "\u653E\u5927";
    zoomInBtn.addEventListener("click", () => this.zoomIn());
    zoomControl.append(zoomInBtn);
    const zoomSlider = document.createElement("div");
    zoomSlider.className = "cesium-kit-zoom-slider";
    zoomSlider.addEventListener("click", (e) => this.handleSliderClick(e));
    this.zoomSliderRef = zoomSlider;
    const sliderTrack = document.createElement("div");
    sliderTrack.className = "cesium-kit-slider-track";
    zoomSlider.append(sliderTrack);
    const sliderHandle = document.createElement("div");
    sliderHandle.className = "cesium-kit-slider-handle";
    sliderHandle.style.top = "50%";
    sliderHandle.textContent = "-";
    sliderHandle.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    zoomSlider.append(sliderHandle);
    zoomControl.append(zoomSlider);
    const zoomOutBtn = document.createElement("button");
    zoomOutBtn.className = "cesium-kit-zoom-btn cesium-kit-zoom-out";
    zoomOutBtn.textContent = "-";
    zoomOutBtn.title = "\u7F29\u5C0F";
    zoomOutBtn.addEventListener("click", () => this.zoomOut());
    zoomControl.append(zoomOutBtn);
    return zoomControl;
  }
  // 自动查找Cesium viewer容器
  findViewerContainer() {
    const cesiumContainers = document.querySelectorAll(
      '[class*="cesium"], [id*="cesium"], [class*="viewer"], [id*="viewer"]'
    );
    for (const container of cesiumContainers) {
      if (container.id) {
        return container.id;
      }
    }
    const mapContainers = document.querySelectorAll(
      '[class*="map"], [id*="map"]'
    );
    for (const container of mapContainers) {
      if (container.id) {
        return container.id;
      }
    }
    const firstDiv = document.querySelector("body > div");
    if (firstDiv && firstDiv.id) {
      return firstDiv.id;
    }
    return "cesium-kit-camera-control-default";
  }
  // 获取SVG图标，使用内联SVG代码，支持自适应大小
  getSvgIcon(iconName) {
    const svgIcons = {
      "line-md--compass-loop": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><mask id="prefix__a"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9"><path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3a9 9 0 11-.001 18.001A9 9 0 0112 3z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path fill="#fff" stroke="none" d="M11 11l1 1 1 1-1-1z" transform="rotate(-180 12 12)"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.3s" values="M11 11L12 12L13 13L12 12z;M10.2 10.2L17 7L13.8 13.8L7 17z"/><animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="-180 12 12;0 12 12;0 12 12;0 12 12;0 12 12;270 12 12;-90 12 12;0 12 12;-180 12 12;-35 12 12;-40 12 12;-45 12 12;-45 12 12;-110 12 12;-135 12 12;-180 12 12"/></path><circle cx="12" cy="12" r="1" fill="#000" fill-opacity="0" stroke="none"><animate fill="freeze" attributeName="fill-opacity" begin="0.9s" dur="0.15s" values="0;1"/></circle></g></mask><path fill="currentColor" mask="url(#prefix__a)" d="M0 0h24v24H0z"/></svg>`,
      "line-md--chevron-small-up": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9l-5 5m5-5l5 5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>`,
      "line-md--chevron-small-down": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 15l-5-5m5 5l5-5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>`,
      "line-md--chevron-small-left": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l5-5m-5 5l5 5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>`,
      "line-md--chevron-small-right": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 12l-5-5m5 5l-5 5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>`,
      "radix-icons--hand": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" style="width: 100%; height: 100%;"><path fill="currentColor" d="M7.654 0c.744.008 1.56.448 1.759 1.361q.147-.143.322-.244c.376-.217.8-.257 1.188-.169.768.176 1.435.863 1.498 1.814l.005.07c.31-.227.702-.306 1.15-.217.404.08.911.377 1.198 1.015.282.629.321 1.523-.045 2.762-.331 1.12-.705 2.057-1.042 2.9-.165.413-.322.805-.46 1.185-.425 1.17-.728 2.344-.728 4.023a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5c0-1.037-.69-2.01-1.638-3.04q-.346-.373-.704-.741l-.007-.006c-.24-.247-.48-.497-.706-.745-.448-.49-.87-1.004-1.139-1.54-.238-.457-.407-1.115-.204-1.665l.003-.009c.136-.35.35-.662.674-.87.326-.208.71-.277 1.125-.236.616.06 1.06.334 1.435.665a22 22 0 00-.496-1.251l-.066-.158c-.252-.601-.512-1.236-.684-1.907l-.002-.01a1.82 1.82 0 01.446-1.668 1.61 1.61 0 011.73-.402c.66.232 1.128.757 1.465 1.35q.03-.377.092-.774V1.49C5.989.466 6.865-.008 7.654 0m-.011 1c-.42-.004-.764.228-.832.648-.19 1.231-.129 2.237-.043 3.657q.025.388.049.823a.5.5 0 01-.992.115l-.077-.436c-.104-.642-.264-1.552-.57-2.36-.315-.834-.73-1.406-1.244-1.587a.61.61 0 00-.676.15.82.82 0 00-.195.744c.152.59.384 1.162.636 1.764l.067.162c.23.545.47 1.117.65 1.71v.003c.146.483.24.866.315 1.169q.044.18.081.322a.5.5 0 01-.813.504 10 10 0 01-.681-.67l-.121-.13c-.15-.16-.28-.3-.413-.428-.324-.309-.6-.48-.978-.516h-.003c-.242-.025-.389.02-.485.083-.099.063-.198.177-.28.385-.062.173-.023.518.155.857l.004.009c.203.407.548.838.984 1.315q.326.353.689.725l.01.01c.235.244.48.496.717.754.832.904 1.68 1.972 1.865 3.218h6.046c.055-1.565.368-2.732.78-3.865.157-.434.324-.85.495-1.277.327-.816.667-1.669.987-2.75.328-1.11.24-1.737.09-2.068-.143-.321-.369-.422-.479-.444-.243-.048-.343.013-.412.083-.103.104-.2.304-.277.624-.076.31-.117.662-.16 1.022l-.002.028c-.038.32-.08.677-.163.948a.54.54 0 01-.17.274.5.5 0 01-.366.118c-.289-.024-.46-.272-.466-.545-.01-.394.024-.79.043-1.182.035-.73.069-1.433.016-2.132V2.83c-.032-.499-.375-.827-.723-.906a.64.64 0 00-.466.06c-.132.076-.28.23-.378.53l-.001.005c-.041.123-.083.36-.12.695-.036.323-.062.7-.084 1.081a78 78 0 00-.048.968c-.017.383-.032.712-.048.891a.5.5 0 01-.061.204c-.022.04-.134.252-.424.261a.51.51 0 01-.454-.259c-.061-.11-.067-.24-.07-.366l-.006-.445c-.002-.341-.002-.728-.002-.838 0-1.044-.001-2.056-.092-3.066-.056-.403-.385-.64-.804-.644"/></svg>`,
      "gis--location-man-alt": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="width: 100%; height: 100%;"><path fill="currentColor" d="M49.781 23.592C41.947 23.593 34.184 26.96 35 33.688l2 14.624C37.352 50.886 39.09 55 41.688 55h.185L44 80.53c.092 1.103.892 2 2 2h8c1.108 0 1.908-.897 2-2L58.127 55h.185c2.597 0 4.336-4.115 4.688-6.687l2-14.626c.523-6.733-7.384-10.097-15.219-10.095" color="currentColor"/><path fill="currentColor" d="M50.024 50.908l-.048.126c.016-.038.027-.077.043-.115zM34.006 69.057C19.88 71.053 10 75.828 10 82.857 10 92.325 26.508 100 50 100s40-7.675 40-17.143c0-7.029-9.879-11.804-24.004-13.8l-1.957 3.332C74.685 73.866 82 76.97 82 80.572c0 5.05-14.327 9.143-32 9.143s-32-4.093-32-9.143c-.001-3.59 7.266-6.691 17.945-8.174z" color="currentColor"/><circle cx="50" cy="10.5" r="10.5" fill="currentColor" color="currentColor"/></svg>`
    };
    return svgIcons[iconName] || "";
  }
  // 相机控制方法
  handleMouseDown(event) {
    this.isDragging = true;
    if (this.viewer) {
      this.baseHeight = this.viewer.camera.positionCartographic.height;
    }
    event.preventDefault();
  }
  handleMouseMove(event) {
    if (!this.isDragging || !this.zoomSliderRef) return;
    const rect = this.zoomSliderRef.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const percentage = y / rect.height;
    const sliderPosition = percentage * 100;
    const wasAtEndpoint = this.isAtEndpoint;
    this.isAtEndpoint = sliderPosition < 0 || sliderPosition > 100;
    if (sliderPosition < 0) {
      this.sliderOffset = sliderPosition;
      this.currentZoomLevel = 0;
    } else if (sliderPosition > 100) {
      this.sliderOffset = sliderPosition - 100;
      this.currentZoomLevel = 100;
    } else {
      this.sliderOffset = 0;
      this.currentZoomLevel = Math.round(sliderPosition);
    }
    const sliderHandle = this.container.querySelector(
      ".cesium-kit-slider-handle"
    );
    if (sliderHandle) {
      sliderHandle.style.transition = "";
      sliderHandle.style.top = `${this.currentZoomLevel}%`;
    }
    if (this.isAtEndpoint && !wasAtEndpoint) {
      this.startAutoZoom(sliderPosition < 0 ? "in" : "out");
    } else if (!this.isAtEndpoint && wasAtEndpoint) {
      this.stopAutoZoom();
    }
    if (!this.isAtEndpoint) {
      this.setZoomLevel(this.currentZoomLevel);
    }
  }
  handleMouseUp(_event) {
    if (this.isDragging) {
      this.isDragging = false;
      this.stopAutoZoom();
      this.resetSliderToCenter();
    }
  }
  handleSliderClick(event) {
    if (!this.zoomSliderRef) return;
    const rect = this.zoomSliderRef.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const percentage = y / rect.height;
    const sliderPosition = percentage * 100;
    if (sliderPosition < 0) {
      this.sliderOffset = sliderPosition;
      this.currentZoomLevel = 0;
    } else if (sliderPosition > 100) {
      this.sliderOffset = sliderPosition - 100;
      this.currentZoomLevel = 100;
    } else {
      this.sliderOffset = 0;
      this.currentZoomLevel = Math.round(sliderPosition);
    }
    this.setZoomLevel(this.currentZoomLevel);
  }
  panCamera(direction) {
    const camera = this.viewer.camera;
    switch (direction) {
      case "down": {
        camera.moveDown(1e3);
        break;
      }
      case "left": {
        camera.moveLeft(1e3);
        break;
      }
      case "right": {
        camera.moveRight(1e3);
        break;
      }
      case "up": {
        camera.moveUp(1e3);
        break;
      }
    }
  }
  resetSliderToCenter() {
    const sliderHandle = this.container.querySelector(
      ".cesium-kit-slider-handle"
    );
    if (sliderHandle) {
      sliderHandle.style.transition = "top 0.3s ease-out";
      sliderHandle.style.top = "50%";
      setTimeout(() => {
        this.currentZoomLevel = 50;
        this.sliderOffset = 0;
        sliderHandle.style.transition = "";
      }, 300);
    }
  }
  resetToNorth() {
    this.viewer.camera.setView({
      orientation: {
        heading: 0,
        pitch: this.viewer.camera.pitch,
        roll: 0
      }
    });
  }
  rotateCamera(direction) {
    const currentHeading = this.viewer.camera.heading;
    const currentPitch = this.viewer.camera.pitch;
    let newHeading = currentHeading;
    let newPitch = currentPitch;
    switch (direction) {
      case "down": {
        newPitch = Math.min(newPitch + 0.1, Math.PI / 2);
        break;
      }
      case "left": {
        newHeading = currentHeading - 0.1;
        break;
      }
      case "right": {
        newHeading = currentHeading + 0.1;
        break;
      }
      case "up": {
        newPitch = Math.max(newPitch - 0.1, -Math.PI / 2);
        break;
      }
    }
    this.viewer.camera.setView({
      orientation: {
        heading: newHeading,
        pitch: newPitch,
        roll: this.viewer.camera.roll
      }
    });
  }
  setupEventListeners() {
    document.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    document.addEventListener("mouseup", (e) => this.handleMouseUp(e));
  }
  setZoomLevel(level) {
    const offset = (level - 50) * 100 + this.sliderOffset * 100;
    const targetHeight = this.baseHeight + offset;
    this.viewer.camera.setView({
      destination: Cesium4.Cartesian3.fromDegrees(
        this.cameraState.longitude,
        this.cameraState.latitude,
        targetHeight
      ),
      orientation: {
        heading: this.viewer.camera.heading,
        pitch: this.viewer.camera.pitch,
        roll: this.viewer.camera.roll
      }
    });
  }
  startAutoZoom(direction) {
    if (this.autoZoomInterval) {
      clearInterval(this.autoZoomInterval);
    }
    this.autoZoomInterval = window.setInterval(() => {
      if (direction === "in") {
        this.viewer.camera.zoomIn(this.zoomDistance);
      } else {
        this.viewer.camera.zoomOut(this.zoomDistance);
      }
    }, 16);
  }
  startCameraStateUpdate() {
    setInterval(() => {
      this.updateCameraState();
      this.updateUI();
    }, 100);
  }
  stopAutoZoom() {
    if (this.autoZoomInterval) {
      clearInterval(this.autoZoomInterval);
      this.autoZoomInterval = null;
    }
  }
  updateCameraState() {
    const position = this.viewer.camera.position;
    const cartographic = Cesium4.Cartographic.fromCartesian(position);
    this.cameraState = {
      longitude: Cesium4.Math.toDegrees(cartographic.longitude),
      latitude: Cesium4.Math.toDegrees(cartographic.latitude),
      height: cartographic.height,
      heading: this.viewer.camera.heading,
      pitch: this.viewer.camera.pitch,
      roll: this.viewer.camera.roll
    };
  }
  updateUI() {
    if (this.northIndicator) {
      const radius = 45;
      const angle = -this.cameraState.heading;
      const x = Math.sin(angle) * radius;
      const y = -Math.cos(angle) * radius;
      this.northIndicator.style.transform = `translate(${x}px, ${y}px)`;
    }
    if (this.cameraInfo) {
      const formattedState = {
        longitude: this.cameraState.longitude.toFixed(6),
        latitude: this.cameraState.latitude.toFixed(6),
        height: this.cameraState.height.toFixed(2),
        heading: (this.cameraState.heading * 180 / Math.PI).toFixed(1),
        pitch: (this.cameraState.pitch * 180 / Math.PI).toFixed(1),
        roll: (this.cameraState.roll * 180 / Math.PI).toFixed(1)
      };
      Object.entries(formattedState).forEach(([key, value]) => {
        const element = document.querySelector(`#cesium-kit-${key}`);
        if (element) {
          const unit = key === "height" ? "m" : "\xB0";
          element.textContent = `${value}${unit}`;
        }
      });
    }
  }
  zoomIn() {
    this.viewer.camera.zoomIn(
      this.viewer.camera.positionCartographic.height * 0.2
    );
  }
  zoomOut() {
    this.viewer.camera.zoomOut(
      this.viewer.camera.positionCartographic.height * 0.2
    );
  }
};
function createCameraControl(options) {
  return new CameraControl(options);
}
export {
  CameraControl,
  CameraMoveEvent,
  RippleMarker,
  ViewerClick,
  createCameraControl
};
