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
}
interface RippleMarker {
    remove: () => void;
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
declare function RippleMarker(viewer: Cesium.Viewer, { lon, lat, height, color, maxRadius, duration, loops, pyramidHeight, baseRadius, floatEnabled, surfaceHeight, }: RippleMarkerOptions): RippleMarker;

interface ViewerClickEvent {
    position: Cesium.Cartesian2;
}
type ViewerClickCallback = (lon: number, lat: number, event: ViewerClickEvent) => void;
declare function ViewerClick(viewer: Cesium.Viewer, callback: ViewerClickCallback): () => void;

export { RippleMarker, type RippleMarkerOptions, ViewerClick, type ViewerClickCallback, type ViewerClickEvent };
