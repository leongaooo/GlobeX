// 封装Viewer的点击事件，回调函数返回经纬度和原始参数，提供ts类型提示，接收一个viewer实例和回调函数

import * as Cesium from 'cesium';

export interface ViewerClickEvent {
    position: Cesium.Cartesian2;
}

export type ViewerClickCallback = (
    lon: number,
    lat: number,
    event: ViewerClickEvent,
) => void;

export function ViewerClick(
    viewer: Cesium.Viewer,
    callback: ViewerClickCallback,
): () => void {
    const handler = viewer.screenSpaceEventHandler;
    handler.setInputAction((event: ViewerClickEvent) => {
        const pickedPosition = viewer.scene.pickPosition(event.position);
        if (pickedPosition) {
            const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
            const lon = Cesium.Math.toDegrees(cartographic.longitude);
            const lat = Cesium.Math.toDegrees(cartographic.latitude);
            callback(lon, lat, event);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 返回取消绑定的方法
    return () => {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
}