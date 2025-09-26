<template>
    <div class="viewer-container" ref="viewerContainer"></div>
    <div class="control-panel">
      <div class="panel-header">
        <h3>RippleMarker 测试面板</h3>
      </div>

      <div class="panel-section">
        <h4>创建标记</h4>
        <div class="form-group">
          <label>经度:</label>
          <input v-model="markerConfig.lon" type="number" step="0.001" />
        </div>
        <div class="form-group">
          <label>纬度:</label>
          <input v-model="markerConfig.lat" type="number" step="0.001" />
        </div>
        <div class="form-group">
          <label>标签文字:</label>
          <input v-model="markerConfig.labelText" placeholder="输入标签文字" />
        </div>
        <div class="form-group">
          <label>颜色:</label>
          <input v-model="markerConfig.color" type="color" />
        </div>
        <div class="form-group">
          <label>标签颜色:</label>
          <input v-model="markerConfig.labelColor" type="color" />
        </div>
        <button @click="addMarker" class="btn-primary">添加标记</button>
      </div>

      <div class="panel-section" v-if="currentMarker">
        <h4>控制标记</h4>
        <div class="button-group">
          <button @click="showMarker" class="btn-success">显示</button>
          <button @click="hideMarker" class="btn-warning">隐藏</button>
          <button @click="removeMarker" class="btn-danger">删除</button>
        </div>
        <div class="form-group">
          <label>
            <input v-model="markerVisible" @change="toggleMarker" type="checkbox" />
            可见性
          </label>
        </div>
      </div>

      <div class="panel-section">
        <h4>点击事件</h4>
        <div class="log-container">
          <div v-for="(log, index) in clickLogs" :key="index" class="log-item">
            {{ log }}
          </div>
        </div>
        <button @click="clearLogs" class="btn-secondary">清空日志</button>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import * as Cesium from 'cesium';
  import { RippleMarker, ViewerClick } from "./index.js";

  const viewerContainer = ref<HTMLDivElement>();
  let viewer: Cesium.Viewer | null = null;

  // 测试数据
  const markerConfig = ref({
    lon: 116.3915,
    lat: 39.9053,
    labelText: '测试标记',
    color: '#0096ff',
    labelColor: '#ffffff'
  });

  const currentMarker = ref<any>(null);
  const markerVisible = ref(true);
  const clickLogs = ref<string[]>([]);

  onMounted(async () => {
    if (!viewerContainer.value) return;

    // 初始化 Cesium Viewer
    viewer = new Cesium.Viewer(viewerContainer.value, {
      // 显示工具栏
      timeline: false,
      animation: false,
      baseLayerPicker: true,
      fullscreenButton: true,
      vrButton: false,
      geocoder: true,
      homeButton: true,
      infoBox: true,
      sceneModePicker: true,
      selectionIndicator: true,
      navigationHelpButton: true,
      // 使用高德地图作为底图
      // 使用内置网格影像，完全本地渲染，避免任何外部瓦片解码/CORS问题
      imageryProvider: new Cesium.GridImageryProvider({
        cells: 8,
        color: Cesium.Color.fromCssColorString('#4f5b66'),
        glowColor: Cesium.Color.TRANSPARENT,
        backgroundColor: Cesium.Color.fromCssColorString('#1b1f24')
      }),
      // 使用椭球地形，避免对 Ion/外部地形服务的依赖
      terrainProvider: new Cesium.EllipsoidTerrainProvider()
    });

    // 可选：设置基础颜色，瓦片未加载时不至于全黑
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#2b2f3a');

    // 设置默认视角
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, 15000000),
      orientation: {
        heading: 0.0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0.0
      }
    });

    // 启用地球旋转
    viewer.scene.globe.enableLighting = true;

    // 添加一些交互示例
    setupInteractions(viewer);
  });

  // 测试方法
  function addMarker() {
    if (!viewer) return;

    // 删除现有标记
    if (currentMarker.value) {
      currentMarker.value.remove();
    }

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(markerConfig.value.lon, markerConfig.value.lat, 1000),
      duration: 1
    });

    const marker = RippleMarker(viewer, {
      lon: markerConfig.value.lon,
      lat: markerConfig.value.lat,
      height: 0,
      color: markerConfig.value.color + 'cc', // 添加透明度
      maxRadius: 8000,
      duration: 1500,
      loops: Infinity,
      pyramidHeight: 1000,
      baseRadius: 300,
      floatEnabled: true,
      surfaceHeight: 50,
      id: 'test-marker',
      data: {
        name: markerConfig.value.labelText,
        type: 'test',
        timestamp: new Date().toISOString()
      },
      label: {
        text: markerConfig.value.labelText,
        font: '20px sans-serif',
        fillColor: markerConfig.value.labelColor,
        outlineColor: '#000000',
        outlineWidth: 2,
        pixelOffset: { x: 0, y: -50 },
        scale: 1.0,
        show: true
      },
      onClick: (data, position) => {
        const log = `点击标记: ${data.name} (${position.lon.toFixed(4)}, ${position.lat.toFixed(4)})`;
        clickLogs.value.unshift(log);
        if (clickLogs.value.length > 10) {
          clickLogs.value.pop();
        }
      }
    });

    currentMarker.value = marker;
    markerVisible.value = true;
  }

  function showMarker() {
    if (currentMarker.value) {
      currentMarker.value.show();
      markerVisible.value = true;
    }
  }

  function hideMarker() {
    if (currentMarker.value) {
      currentMarker.value.hide();
      markerVisible.value = false;
    }
  }

  function toggleMarker() {
    if (currentMarker.value) {
      currentMarker.value.setVisible(markerVisible.value);
    }
  }

  function removeMarker() {
    if (currentMarker.value) {
      currentMarker.value.remove();
      currentMarker.value = null;
      markerVisible.value = false;
    }
  }

  function clearLogs() {
    clickLogs.value = [];
  }

  // 设置交互功能
  function setupInteractions(viewer: Cesium.Viewer) {
    // 添加点击事件
    viewer.screenSpaceEventHandler.setInputAction((movement: any) => {
      const pickedPosition = viewer.scene.pickPosition(movement.position);
      if (pickedPosition) {
        const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);

        // 在点击位置添加一个标记
        // viewer.entities.add({
        //   position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        //   point: {
        //     pixelSize: 10,
        //     color: Cesium.Color.RED,
        //     outlineColor: Cesium.Color.WHITE,
        //     outlineWidth: 2
        //   },
        //   label: {
        //     text: `${longitude.toFixed(2)}°, ${latitude.toFixed(2)}°`,
        //     font: '14px sans-serif',
        //     fillColor: Cesium.Color.WHITE,
        //     style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //     outlineWidth: 2,
        //     verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //     pixelOffset: new Cesium.Cartesian2(0, -9)
        //   }
        // });
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  // 组件销毁时清理
  onBeforeUnmount(() => {
    if (viewer) {
      viewer.destroy();
      viewer = null;
    }
  });
  </script>

  <style scoped>
  .viewer-container {
    width: 100%;
    height: 100vh;
    position: relative;
  }

  .control-panel {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 300px;
    background: rgba(42, 42, 42, 0.9);
    color: white;
    border-radius: 8px;
    padding: 16px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    z-index: 1000;
    max-height: 80vh;
    overflow-y: auto;
  }

  .panel-header h3 {
    margin: 0 0 16px 0;
    color: #00d4ff;
    font-size: 18px;
    text-align: center;
  }

  .panel-section {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .panel-section:last-child {
    border-bottom: none;
  }

  .panel-section h4 {
    margin: 0 0 12px 0;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-group label {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    color: #cccccc;
  }

  .form-group input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 12px;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
  }

  .form-group input[type="color"] {
    height: 32px;
    padding: 2px;
  }

  .form-group input[type="checkbox"] {
    width: auto;
    margin-right: 8px;
  }

  .button-group {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
    flex: 1;
  }

  .btn-primary {
    background: #00d4ff;
    color: #000;
  }

  .btn-primary:hover {
    background: #00b8e6;
  }

  .btn-success {
    background: #28a745;
    color: white;
  }

  .btn-success:hover {
    background: #218838;
  }

  .btn-warning {
    background: #ffc107;
    color: #000;
  }

  .btn-warning:hover {
    background: #e0a800;
  }

  .btn-danger {
    background: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background: #c82333;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background: #5a6268;
  }

  .log-container {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 8px;
    max-height: 120px;
    overflow-y: auto;
  }

  .log-item {
    font-size: 11px;
    color: #00ff88;
    margin-bottom: 4px;
    padding: 2px 4px;
    background: rgba(0, 255, 136, 0.1);
    border-radius: 2px;
  }

  .log-item:last-child {
    margin-bottom: 0;
  }

  /* 滚动条样式 */
  .control-panel::-webkit-scrollbar,
  .log-container::-webkit-scrollbar {
    width: 6px;
  }

  .control-panel::-webkit-scrollbar-track,
  .log-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .control-panel::-webkit-scrollbar-thumb,
  .log-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  .control-panel::-webkit-scrollbar-thumb:hover,
  .log-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
  </style>