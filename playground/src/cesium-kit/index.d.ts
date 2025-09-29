import * as Cesium from 'cesium';

interface RippleMarkerOptions {
    lon: number;
    lat: number;
    height?: number;
    color?: string;
    maxRadius?: number;
    duration?: number;
    loops?: number;
    pyramidHeight?: number;
    baseRadius?: number;
    floatEnabled?: boolean;
    surfaceHeight?: number;
    id?: string;
    data?: any;
    label?: {
        text?: string;
        font?: string;
        fillColor?: string;
        outlineColor?: string;
        outlineWidth?: number;
        pixelOffset?: {
            x: number;
            y: number;
        };
        scale?: number;
        show?: boolean;
        backgroundColor?: string;
        backgroundBorderColor?: string;
        backgroundBorderWidth?: number;
        backgroundPadding?: {
            x: number;
            y: number;
        };
        backgroundCornerRadius?: number;
        textAlign?: 'left' | 'center' | 'right';
        verticalAlign?: 'top' | 'middle' | 'bottom';
    };
    onClick?: (data: any, position: {
        lon: number;
        lat: number;
    }) => void;
}
interface RippleMarker {
    remove: () => void;
    show: () => void;
    hide: () => void;
    setVisible: (visible: boolean) => void;
}
/**
 * 在Cesium场景中添加一个带扩散波纹的3D标点（倒立三棱锥）
 * @param viewer Cesium.Viewer实例
 * @param options 配置选项
 * @param options.lon 经度
 * @param options.lat 纬度
 * @param options.height 海拔高度（米）
 * @param options.color 颜色（CSS RGBA）
 * @param options.maxRadius 涟漪最大半径（米）
 * @param options.duration 单个涟漪周期（毫秒）
 * @param options.loops 动画循环次数（Infinity为无限）
 * @param options.pyramidHeight 三棱锥高度（米）
 * @param options.baseRadius 三棱锥底部半径（米），控制宽度
 * @param options.floatEnabled 是否启用三棱锥上下浮动动画
 * @param options.surfaceHeight 三棱锥和波纹的基准高度（米）
 * @returns 包含remove方法的对象，用于移除标点
 */
declare function RippleMarker(viewer: Cesium.Viewer, { lon, lat, height, color, maxRadius, duration, loops, pyramidHeight, baseRadius, floatEnabled, surfaceHeight, id, data, label, onClick, }: RippleMarkerOptions): RippleMarker;

interface ViewerClickEvent {
    position: Cesium.Cartesian2;
}
type ViewerClickCallback = (lon: number, lat: number, event: ViewerClickEvent) => void;
declare function ViewerClick(viewer: Cesium.Viewer, callback: ViewerClickCallback): () => void;

interface CameraMoveEventOptions {
    enableConsoleLog?: boolean;
}
interface CameraPosition {
    longitude: number;
    latitude: number;
    height: number;
}
interface CameraMoveEvent {
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
declare function CameraMoveEvent(viewer: Cesium.Viewer, { enableConsoleLog }?: CameraMoveEventOptions): CameraMoveEvent;

interface CameraControlOptions {
    viewer: Cesium.Viewer;
    zoomDistance?: number;
    containerId?: string;
    showCameraInfo?: boolean;
}
interface CameraState {
    longitude: number;
    latitude: number;
    height: number;
    heading: number;
    pitch: number;
    roll: number;
}
declare class CameraControl {
    private autoZoomInterval;
    private baseHeight;
    private cameraInfo;
    private cameraState;
    private container;
    private currentZoomLevel;
    private isAtEndpoint;
    private isDragging;
    private northIndicator;
    private showCameraInfo;
    private sliderOffset;
    private viewer;
    private zoomDistance;
    private zoomSliderRef;
    constructor(options: CameraControlOptions);
    destroy(): void;
    getContainer(): HTMLElement;
    private appendToPage;
    private createCameraInfo;
    private createContainer;
    private createPanControl;
    private createRotationControl;
    private createStreetView;
    private createZoomControl;
    private findViewerContainer;
    private getSvgIcon;
    private handleMouseDown;
    private handleMouseMove;
    private handleMouseUp;
    private handleSliderClick;
    private panCamera;
    private resetSliderToCenter;
    private resetToNorth;
    private rotateCamera;
    private setupEventListeners;
    private setZoomLevel;
    private startAutoZoom;
    private startCameraStateUpdate;
    private stopAutoZoom;
    private updateCameraState;
    private updateUI;
    private zoomIn;
    private zoomOut;
}
declare function createCameraControl(options: CameraControlOptions): CameraControl;

export { CameraControl, type CameraControlOptions, CameraMoveEvent, type CameraMoveEventOptions, type CameraPosition, type CameraState, RippleMarker, type RippleMarkerOptions, ViewerClick, type ViewerClickCallback, type ViewerClickEvent, createCameraControl };
