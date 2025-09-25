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
    baseRadius?: number; // 三棱锥底部半径（米），控制宽度
    floatEnabled?: boolean; // 是否启用上下浮动动画
    surfaceHeight?: number; // 三棱锥与波纹基准高度（米）
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
export function RippleMarker(
    viewer: Cesium.Viewer,
    {
        lon,
        lat,
        height = 0,
        color = 'rgba(0,150,255,0.8)',
        maxRadius = 8000,
        duration = 1500,
        loops = Infinity,
        pyramidHeight = 1000,
        baseRadius,
        floatEnabled = true,
        surfaceHeight = 50,
    }: RippleMarkerOptions,
): RippleMarker {
    const entities: Cesium.Entity[] = [];
    const cesiumColor = Cesium.Color.fromCssColorString(color);
    const baseRadiusMeters = baseRadius ?? pyramidHeight * 0.3;
    const floatAmplitude = pyramidHeight * 0.2; // 浮动幅度（米）
    const floatPeriodMs = 2000; // 浮动周期（毫秒）
    const baseHeight = height + surfaceHeight; // 统一控制三棱锥与波纹基准高度

    // 基础位置（金字塔底部中心点）已不需要单独变量，仅计算尖端位置
    const tipPosition = Cesium.Cartesian3.fromDegrees(lon, lat, baseHeight); // 尖端位置

    // 计算三棱锥底部三个顶点（经纬度）
    const vertexDegrees: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3;
        const x = lon + (baseRadiusMeters * Math.cos(angle)) / 111_000; // 粗略的经度转换
        const y = lat + (baseRadiusMeters * Math.sin(angle)) / 111_000; // 粗略的纬度转换
        vertexDegrees.push({ x, y });
    }

    // 去掉线条，仅保留由面组成的倒立三棱锥（下方的多边形面会完成展示）

    // 创建动态波纹圈
    const numWaves = 3; // 同时显示的波纹数量
    const waveEntities = Array.from({ length: numWaves }, (_, index) => {
        return viewer.entities.add({
            position: tipPosition,
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty((_time) => {
                    const elapsed = (Date.now() % duration) / duration;
                    const wave = (elapsed + index / numWaves) % 1;
                    return wave * maxRadius;
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty((_time) => {
                    const elapsed = (Date.now() % duration) / duration;
                    const wave = (elapsed + index / numWaves) % 1;
                    return wave * maxRadius;
                }, false),
                // 底部波纹保持在固定高度（surfaceHeight），不随三棱锥浮动
                height: baseHeight,
                material: new Cesium.ColorMaterialProperty(
                    new Cesium.CallbackProperty((_time) => {
                        const elapsed = (Date.now() % duration) / duration;
                        const wave = (elapsed + index / numWaves) % 1;
                        const alpha = (1 - wave) ** 2 * 0.6;
                        return Cesium.Color.fromAlpha(cesiumColor, alpha);
                    }, false),
                ),
            },
        });
    });
    entities.push(...waveEntities);

    // 创建三棱锥的面
    for (let i = 0; i < 3; i++) {
        const v1deg = vertexDegrees[i];
        const v2deg = vertexDegrees[(i + 1) % 3];
        entities.push(
            viewer.entities.add({
                polygon: {
                    hierarchy: new Cesium.CallbackProperty((_time) => {
                        const t = Date.now();
                        const phase = ((t % floatPeriodMs) / floatPeriodMs) * 2 * Math.PI;
                        const offset = floatEnabled ? Math.sin(phase) * floatAmplitude : 0;
                        const tip = Cesium.Cartesian3.fromDegrees(
                            lon,
                            lat,
                            baseHeight + offset,
                        );
                        const v1Local = v1deg
                            ? Cesium.Cartesian3.fromDegrees(
                                v1deg.x,
                                v1deg.y,
                                baseHeight + pyramidHeight + offset,
                            )
                            : tip;
                        const v2Local = v2deg
                            ? Cesium.Cartesian3.fromDegrees(
                                v2deg.x,
                                v2deg.y,
                                baseHeight + pyramidHeight + offset,
                            )
                            : tip;
                        return new Cesium.PolygonHierarchy([tip, v1Local, v2Local]);
                    }, false),
                    // 使用传入颜色作为填充材质，确保颜色应用到面上
                    material: new Cesium.ColorMaterialProperty(cesiumColor),
                    perPositionHeight: true,
                },
            }),
        );
    }

    let alive = true;

    // 动画更新
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

    // 清理函数
    function remove() {
        alive = false;
        entities.forEach((entity) => viewer.entities.remove(entity));
        animationHandler();
    }

    return {
        remove,
    };
}
