import * as Cesium from 'cesium';

export interface CameraMoveEventOptions {
    enableConsoleLog?: boolean; // 是否启用控制台打印，默认 true
}

export interface CameraPosition {
    longitude: number;
    latitude: number;
    height: number;
}

export interface CameraMoveEvent {
    remove: () => void;
    getPosition: () => CameraPosition | null;
    setConsoleLog: (enabled: boolean) => void;
}

/**
 * 监听 Cesium 相机移动事件，实时获取相机位置信息
 * @param viewer Cesium.Viewer 实例
 * @param options 配置选项
 * @param options.enableConsoleLog 是否启用控制台打印，默认 true
 * @returns 包含控制方法的对象
 */
export function CameraMoveEvent(
    viewer: Cesium.Viewer,
    { enableConsoleLog = true }: CameraMoveEventOptions = {}
): CameraMoveEvent {
    let consoleLogEnabled = enableConsoleLog;
    let currentPosition: CameraPosition | null = null;
    let moveEndHandler: (() => void) | null = null;

    // 获取当前位置
    function getCurrentPosition(): CameraPosition | null {
        if (!viewer || !viewer.camera) return null;

        const camera = viewer.camera;
        const position = camera.position;
        const cartographic = Cesium.Cartographic.fromCartesian(position);

        return {
            longitude: Cesium.Math.toDegrees(cartographic.longitude),
            latitude: Cesium.Math.toDegrees(cartographic.latitude),
            height: cartographic.height
        };
    }

    // 打印位置信息
    function logPosition(position: CameraPosition) {
        if (consoleLogEnabled) {
            console.log(`相机位置: 经度 ${position.longitude.toFixed(6)}°, 纬度 ${position.latitude.toFixed(6)}°, 高度 ${position.height.toFixed(2)}m`);
        }
    }

    // 相机移动结束事件处理
    function onCameraMoveEnd() {
        const position = getCurrentPosition();
        if (position) {
            currentPosition = position;
            logPosition(position);
        }
    }

    // 注册相机移动结束事件
    moveEndHandler = viewer.camera.moveEnd.addEventListener(onCameraMoveEnd);

    // 立即获取一次当前位置
    const initialPosition = getCurrentPosition();
    if (initialPosition) {
        currentPosition = initialPosition;
        logPosition(initialPosition);
    }

    // 清理函数
    function remove() {
        if (moveEndHandler) {
            moveEndHandler();
            moveEndHandler = null;
        }
        currentPosition = null;
    }

    // 设置控制台打印开关
    function setConsoleLog(enabled: boolean) {
        consoleLogEnabled = enabled;
    }

    return {
        remove,
        getPosition: () => currentPosition,
        setConsoleLog
    };
}
