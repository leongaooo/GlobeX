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
        // 检查是否点击了实体（如 RippleMarker）
        const pickedObject = viewer.scene.pick(event.position);
        if (pickedObject && pickedObject.id) {
            // 如果点击了实体，不处理 ViewerClick 事件，让实体的点击事件处理
            return;
        }

        // 首先尝试使用 pickPosition 获取3D位置
        let pickedPosition = viewer.scene.pickPosition(event.position);

        // 如果 pickPosition 失败，使用 camera.pickEllipsoid 作为备用方案
        if (!pickedPosition) {
            const ellipsoidPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
            if (ellipsoidPosition) {
                pickedPosition = ellipsoidPosition;
            }
        }

        if (pickedPosition) {
            const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
            const lon = Cesium.Math.toDegrees(cartographic.longitude);
            const lat = Cesium.Math.toDegrees(cartographic.latitude);
            callback(lon, lat, event);
        } else {
            console.warn('ViewerClick: 无法获取点击位置的经纬度');
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 返回取消绑定的方法
    return () => {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
}