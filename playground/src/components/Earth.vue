<template>
    <div class="viewer-container" ref="viewerContainer"></div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import * as Cesium from 'cesium';
  import { RippleMarker, ViewerClick } from "./index";

  const viewerContainer = ref<HTMLDivElement>();
  let viewer: Cesium.Viewer | null = null;

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

    ViewerClick(viewer, (lon, lat, event) => {
      console.log(lon, lat, event);
      const handle = RippleMarker(viewer, {
            lon: lon,
            lat: lat,
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
    });
  });

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
  </style>