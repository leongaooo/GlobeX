import * as Cesium from 'cesium';

// 创建自定义标签 Canvas
function createLabelCanvas(label: NonNullable<RippleMarkerOptions['label']>): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // 设置字体
    const font = label.font || '14px sans-serif';
    ctx.font = font;

    // 测量文字尺寸
    const textMetrics = ctx.measureText(label.text!);
    const textWidth = textMetrics.width;
    const textHeight = parseInt(font) || 14;

    // 计算背景板尺寸
    const padding = label.backgroundPadding || { x: 8, y: 4 };
    const borderRadius = label.backgroundCornerRadius || 4;
    const borderWidth = label.backgroundBorderWidth || 1;

    const canvasWidth = Math.max(textWidth + padding.x * 2, 40);
    const canvasHeight = Math.max(textHeight + padding.y * 2, 20);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 重新设置字体（canvas 尺寸变化后需要重新设置）
    ctx.font = font;

    // 绘制圆角矩形背景
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

    // 绘制边框
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

    // 绘制文字
    ctx.fillStyle = label.fillColor || '#ffffff';

    // 计算文字位置
    let textX = canvasWidth / 2;
    let textY = canvasHeight / 2;

    if (label.textAlign === 'left') {
        textX = padding.x;
    } else if (label.textAlign === 'right') {
        textX = canvasWidth - padding.x;
    }

    if (label.verticalAlign === 'top') {
        textY = padding.y + textHeight;
    } else if (label.verticalAlign === 'bottom') {
        textY = canvasHeight - padding.y;
    }

    ctx.textAlign = label.textAlign === 'left' ? 'left' : label.textAlign === 'right' ? 'right' : 'center';
    ctx.textBaseline = label.verticalAlign === 'top' ? 'top' : label.verticalAlign === 'bottom' ? 'bottom' : 'middle';

    // 绘制文字描边
    if (label.outlineColor && label.outlineWidth) {
        ctx.strokeStyle = label.outlineColor;
        ctx.lineWidth = label.outlineWidth;
        ctx.strokeText(label.text!, textX, textY);
    }

    // 绘制文字填充
    ctx.fillText(label.text!, textX, textY);

    return canvas;
}

export interface RippleMarkerOptions {
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
    id?: string; // 唯一标识符
    data?: any; // 绑定数据，点击时回调返回
    // 高度响应式配置
    heightResponsive?: {
        enabled?: boolean; // 是否启用高度响应式缩放
        referenceHeight?: number; // 参考高度（圆锥体高度 + 3000m）
        minScale?: number; // 最小缩放比例
        maxScale?: number; // 最大缩放比例
        fadeRange?: number; // 淡入淡出范围（米）
        updateInterval?: number; // 更新间隔（毫秒）
    };
    label?: {
        text?: string; // 标签文字
        font?: string; // 字体样式，如 '14px sans-serif'
        fillColor?: string; // 文字颜色，CSS 颜色字符串
        outlineColor?: string; // 描边颜色，CSS 颜色字符串
        outlineWidth?: number; // 描边宽度
        pixelOffset?: { x: number; y: number }; // 像素偏移
        scale?: number; // 文字缩放
        show?: boolean; // 是否显示标签
        // 新增背景板配置
        backgroundColor?: string; // 背景颜色
        backgroundBorderColor?: string; // 背景边框颜色
        backgroundBorderWidth?: number; // 背景边框宽度
        backgroundPadding?: { x: number; y: number }; // 背景内边距
        backgroundCornerRadius?: number; // 背景圆角半径
        textAlign?: 'left' | 'center' | 'right'; // 文字对齐方式
        verticalAlign?: 'top' | 'middle' | 'bottom'; // 垂直对齐方式
        // 标签位置配置
        heightOffset?: number; // 标签相对于圆锥体顶部的高度偏移（米），默认 80
    };
    onClick?: (data: any, position: { lon: number; lat: number }) => void; // 点击回调
}

export interface RippleMarker {
    remove: () => void;
    show: () => void;
    hide: () => void;
    setVisible: (visible: boolean) => void;
    updateHeightResponsive: () => void; // 手动更新高度响应式效果
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
        id,
        data,
        label,
        heightResponsive,
        onClick,
    }: RippleMarkerOptions,
): RippleMarker {
    // 确保动画与连续渲染开启，避免在部分工程默认 requestRenderMode 下动画不更新
    if (viewer && viewer.scene) {
        viewer.scene.requestRenderMode = false;
        if (viewer.clock) viewer.clock.shouldAnimate = true;
    }

    // 高度响应式配置
    const heightConfig = {
        enabled: heightResponsive?.enabled ?? true,
        referenceHeight: heightResponsive?.referenceHeight ?? (pyramidHeight + 3000),
        minScale: heightResponsive?.minScale ?? 0.1,
        maxScale: heightResponsive?.maxScale ?? 2.0,
        fadeRange: heightResponsive?.fadeRange ?? 1000,
        updateInterval: heightResponsive?.updateInterval ?? 100,
    };

    const entities: Cesium.Entity[] = [];
    const cesiumColor = Cesium.Color.fromCssColorString(color);
    const baseRadiusMeters = baseRadius ?? pyramidHeight * 0.3;
    const floatAmplitude = pyramidHeight * 0.2; // 浮动幅度（米）
    const floatPeriodMs = 2000; // 浮动周期（毫秒）
    const baseHeight = height + surfaceHeight; // 统一控制三棱锥与波纹基准高度

    // 生成唯一的 marker ID
    const markerId = id || `ripple-marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
        // 统一的半径属性，基于传入的 Cesium 时间，避免多次 Date.now 带来的微小差异
        const radiusProperty = new Cesium.CallbackProperty((time) => {
            const safeDuration = Math.max(1, duration);
            const t = time ? Cesium.JulianDate.toDate(time).getTime() : Date.now();
            const elapsed = (t % safeDuration) / safeDuration;
            const wave = (elapsed + index / numWaves) % 1;
            // 至少为 1，避免 0 导致几何异常；并确保为有限数值
            const r = Math.max(1, (wave || 0) * Math.max(1, maxRadius));
            return r;
        }, false);

        const materialProperty = new Cesium.ColorMaterialProperty(
            new Cesium.CallbackProperty((time) => {
                const safeDuration = Math.max(1, duration);
                const t = time ? Cesium.JulianDate.toDate(time).getTime() : Date.now();
                const elapsed = (t % safeDuration) / safeDuration;
                const wave = (elapsed + index / numWaves) % 1;
                const alpha = (1 - wave) ** 2 * 0.6;
                return Cesium.Color.fromAlpha(cesiumColor, alpha);
            }, false),
        );

        return viewer.entities.add({
            id: `${markerId}_wave_${index}`,
            position: tipPosition,
            ellipse: {
                semiMinorAxis: radiusProperty,
                semiMajorAxis: radiusProperty,
                // 底部波纹保持在固定高度（surfaceHeight），不随三棱锥浮动
                height: baseHeight,
                material: materialProperty,
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
                id: `${markerId}_face_${i}`,
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

    // 创建标签实体 - 固定在椎体上方
    let labelEntity: Cesium.Entity | null = null;
    if (label && label.text && label.show !== false) {
        // 优化标签位置计算 - 更贴近圆锥体顶部
        // 公式：圆锥体高度 + 离地高度 + 用户自定义偏移
        const labelOffset = label.heightOffset ?? 80; // 默认80米，用户可自定义
        const labelHeight = baseHeight + pyramidHeight + labelOffset;
        const labelPosition = Cesium.Cartesian3.fromDegrees(lon, lat, labelHeight);

        // 如果有背景板配置，使用 Canvas 创建自定义标签
        if (label.backgroundColor || label.backgroundBorderColor || label.backgroundCornerRadius) {
            const canvas = createLabelCanvas(label);
            labelEntity = viewer.entities.add({
                id: `${markerId}_label`,
                position: labelPosition,
                billboard: {
                    image: canvas,
                    pixelOffset: label.pixelOffset ? new Cesium.Cartesian2(label.pixelOffset.x, label.pixelOffset.y) : new Cesium.Cartesian2(0, -30),
                    scale: label.scale || 1.0,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            });
        } else {
            // 使用原生 Label
            const backgroundColor = label.backgroundColor ? Cesium.Color.fromCssColorString(label.backgroundColor) : undefined;
            const backgroundBorderColor = label.backgroundBorderColor ? Cesium.Color.fromCssColorString(label.backgroundBorderColor) : undefined;

            // 计算文字对齐方式
            let horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
            let verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

            if (label.textAlign === 'left') horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
            else if (label.textAlign === 'right') horizontalOrigin = Cesium.HorizontalOrigin.RIGHT;

            if (label.verticalAlign === 'top') verticalOrigin = Cesium.VerticalOrigin.TOP;
            else if (label.verticalAlign === 'middle') verticalOrigin = Cesium.VerticalOrigin.CENTER;

            labelEntity = viewer.entities.add({
                id: `${markerId}_label`,
                position: labelPosition,
                label: {
                    text: label.text,
                    font: label.font || '14px sans-serif',
                    fillColor: label.fillColor ? Cesium.Color.fromCssColorString(label.fillColor) : Cesium.Color.WHITE,
                    outlineColor: backgroundBorderColor || (label.outlineColor ? Cesium.Color.fromCssColorString(label.outlineColor) : Cesium.Color.BLACK),
                    outlineWidth: label.backgroundBorderWidth || label.outlineWidth || 2,
                    pixelOffset: label.pixelOffset ? new Cesium.Cartesian2(label.pixelOffset.x, label.pixelOffset.y) : new Cesium.Cartesian2(0, -30),
                    scale: label.scale || 1.0,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    horizontalOrigin: horizontalOrigin,
                    verticalOrigin: verticalOrigin,
                    // 背景板配置
                    backgroundColor: backgroundColor,
                    backgroundPadding: label.backgroundPadding ? new Cesium.Cartesian2(label.backgroundPadding.x, label.backgroundPadding.y) : new Cesium.Cartesian2(8, 4),
                    // 确保标签始终可见
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            });
        }
        entities.push(labelEntity);
    }

    // 创建点击事件处理器 - 使用全局事件处理器支持多个 marker
    let clickHandler: (() => void) | null = null;
    if (onClick) {
        // 初始化全局事件处理器（如果还没有的话）
        if (!(viewer as any)._rippleMarkerGlobalHandler) {
            (viewer as any)._rippleMarkerGlobalHandler = (event: any) => {
                const pickedObject = viewer.scene.pick(event.position);

                if (pickedObject && pickedObject.id) {
                    const pickedEntity = pickedObject.id;
                    const pickedId = pickedEntity.id;

                    // 查找所有注册的 marker
                    const markers = (viewer as any)._rippleMarkers || [];
                    for (const marker of markers) {
                        const isCurrentMarker = marker.entities.some((entity: any) => entity.id === pickedId);
                        if (isCurrentMarker && marker.onClick) {
                            marker.onClick(marker.data, { lon: marker.lon, lat: marker.lat });
                            break; // 只触发第一个匹配的 marker
                        }
                    }
                }
            };

            // 添加全局点击事件监听器
            viewer.screenSpaceEventHandler.setInputAction(
                (viewer as any)._rippleMarkerGlobalHandler,
                Cesium.ScreenSpaceEventType.LEFT_CLICK
            );
        }

        // 将当前 marker 注册到全局列表
        if (!(viewer as any)._rippleMarkers) {
            (viewer as any)._rippleMarkers = [];
        }

        const markerInfo = {
            markerId,
            onClick,
            data,
            lon,
            lat,
            entities
        };

        (viewer as any)._rippleMarkers.push(markerInfo);

        // 创建清理函数
        clickHandler = () => {
            // 从全局列表中移除当前 marker
            const markers = (viewer as any)._rippleMarkers || [];
            const index = markers.findIndex((m: any) => m.markerId === markerId);
            if (index !== -1) {
                markers.splice(index, 1);
            }
        };
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

    // 高度响应式功能
    let heightUpdateInterval: number | null = null;
    let lastCameraHeight = 0;

    // 计算缩放和透明度
    function calculateScaleAndOpacity(cameraHeight: number) {
        if (!heightConfig.enabled) {
            return { scale: 1, opacity: 1, pyramidVisible: true, rippleVisible: true };
        }

        const referenceHeight = heightConfig.referenceHeight;
        const heightDiff = Math.abs(cameraHeight - referenceHeight);
        const fadeRange = heightConfig.fadeRange;

        // 计算标签缩放比例（优化算法，避免过度放大）
        let labelScale = 1;
        let opacity = 1;
        let pyramidVisible = true;
        let rippleVisible = true;

        if (cameraHeight < 3000) {
            // 小于3000m时，不隐藏，只进行适度缩放
            const heightRatio = cameraHeight / referenceHeight;
            const maxNearScale = Math.min(heightConfig.maxScale, 1.5);
            const scaleFactor = Math.max(heightConfig.minScale, Math.min(maxNearScale, 1 + (1 - heightRatio) * 0.3));
            labelScale = scaleFactor;
            opacity = 1; // 完全不透明
            pyramidVisible = true;
            rippleVisible = true;
        } else if (cameraHeight < referenceHeight) {
            // 3000m到参考高度之间，适度放大
            const heightRatio = cameraHeight / referenceHeight;
            const maxNearScale = Math.min(heightConfig.maxScale, 1.5);
            const scaleFactor = Math.max(heightConfig.minScale, Math.min(maxNearScale, 1 + (1 - heightRatio) * 0.3));
            labelScale = scaleFactor;
            opacity = 1;
            pyramidVisible = true;
            rippleVisible = true;
        } else {
            // 高于参考高度时，缩小并可能淡出
            const heightRatio = referenceHeight / cameraHeight;
            const scaleFactor = Math.max(heightConfig.minScale, Math.min(heightConfig.maxScale, heightRatio));
            labelScale = scaleFactor;

            // 计算透明度（基于高度差）
            if (heightDiff > fadeRange) {
                opacity = Math.max(0, 1 - (heightDiff - fadeRange) / fadeRange);
            }

            // 圆锥体和涟漪的可见性
            pyramidVisible = opacity > 0.1;
            rippleVisible = opacity > 0.1;
        }

        return {
            scale: labelScale,
            opacity,
            pyramidVisible,
            rippleVisible,
            pyramidOpacity: opacity // 圆锥体使用相同的透明度
        };
    }

    // 统一的显示隐藏控制函数
    function setEntityVisibility(entity: Cesium.Entity, visible: boolean, opacity: number = 1) {
        if (!entity) return;

        entity.show = visible;

        if (visible) {
            // 圆锥体面
            if (entity.polygon && entity.id && String(entity.id).includes('face')) {
                const currentColor = Cesium.Color.fromCssColorString(color);
                entity.polygon.material = new Cesium.ColorMaterialProperty(
                    currentColor.withAlpha(currentColor.alpha * opacity)
                );
            }

            // 涟漪椭圆
            if (entity.ellipse && entity.id && String(entity.id).includes('wave')) {
                // 涟漪的透明度需要特殊处理，因为它使用 CallbackProperty
                // 我们需要重新创建 materialProperty 来应用新的透明度
                const materialProperty = new Cesium.ColorMaterialProperty(
                    new Cesium.CallbackProperty((time) => {
                        const safeDuration = Math.max(1, duration);
                        const t = time ? Cesium.JulianDate.toDate(time).getTime() : Date.now();
                        const elapsed = (t % safeDuration) / safeDuration;
                        const waveIndex = parseInt(String(entity.id).split('_wave_')[1]);
                        const wave = (elapsed + waveIndex / 3) % 1;
                        const baseAlpha = (1 - wave) ** 2 * 0.6;
                        const finalAlpha = baseAlpha * opacity;
                        return Cesium.Color.fromAlpha(cesiumColor, finalAlpha);
                    }, false),
                );
                entity.ellipse.material = materialProperty;
            }

            // 标签
            if (entity.label) {
                entity.label.fillColor = new Cesium.ConstantProperty(
                    Cesium.Color.fromCssColorString(label?.fillColor || '#ffffff').withAlpha(opacity)
                );

                if (label?.outlineColor) {
                    entity.label.outlineColor = new Cesium.ConstantProperty(
                        Cesium.Color.fromCssColorString(label.outlineColor).withAlpha(opacity)
                    );
                }
            }

            // Billboard
            if (entity.billboard) {
                entity.billboard.color = new Cesium.ConstantProperty(
                    Cesium.Color.fromCssColorString(label?.fillColor || '#ffffff').withAlpha(opacity)
                );
            }
        }
    }

    // 更新实体高度响应式效果
    function updateHeightResponsive() {
        if (!heightConfig.enabled || !alive) return;

        try {
            // 检查 viewer 和 scene 是否存在
            if (!viewer || !viewer.scene || !viewer.camera) {
                console.warn('RippleMarker: Viewer or scene is not available, destroying component');
                remove();
                return;
            }

            const cameraHeight = viewer.camera.positionCartographic.height;

            // 如果高度变化不大，跳过更新
            if (Math.abs(cameraHeight - lastCameraHeight) < 10) return;

            lastCameraHeight = cameraHeight;
            const { scale, opacity, pyramidVisible, rippleVisible, pyramidOpacity } = calculateScaleAndOpacity(cameraHeight);

            entities.forEach((entity) => {
                if (!entity) return;

                // 圆锥体不参与缩放，只参与显示/隐藏和透明度
                if (entity.polygon && entity.id && String(entity.id).includes('face')) {
                    setEntityVisibility(entity, pyramidVisible, pyramidOpacity || 1);
                }

                // 涟漪椭圆
                if (entity.ellipse && entity.id && String(entity.id).includes('wave')) {
                    setEntityVisibility(entity, rippleVisible, opacity);
                }

                // 更新标签缩放和透明度（只影响标签，不影响圆锥体）
                if (entity.label) {
                    entity.label.scale = new Cesium.ConstantProperty(scale);
                    entity.label.fillColor = new Cesium.ConstantProperty(
                        Cesium.Color.fromCssColorString(label?.fillColor || '#ffffff').withAlpha(opacity)
                    );

                    if (label?.outlineColor) {
                        entity.label.outlineColor = new Cesium.ConstantProperty(
                            Cesium.Color.fromCssColorString(label.outlineColor).withAlpha(opacity)
                        );
                    }
                }

                // 更新 Billboard 缩放和透明度（自定义标签背景）
                if (entity.billboard) {
                    entity.billboard.scale = new Cesium.ConstantProperty(scale);
                    entity.billboard.color = new Cesium.ConstantProperty(
                        Cesium.Color.fromCssColorString(label?.fillColor || '#ffffff').withAlpha(opacity)
                    );
                }
            });
        } catch (error) {
            console.warn('RippleMarker: Failed to update height responsive:', error);
            // 如果出现严重错误，销毁组件
            if (error instanceof Error && error.message && error.message.includes('scene')) {
                console.warn('RippleMarker: Scene error detected, destroying component');
                // 避免递归调用，直接设置 alive = false 并清理定时器
                alive = false;
                if (heightUpdateInterval) {
                    clearInterval(heightUpdateInterval);
                    heightUpdateInterval = null;
                }
            }
        }
    }

    // 启动高度监听
    if (heightConfig.enabled) {
        heightUpdateInterval = window.setInterval(updateHeightResponsive, heightConfig.updateInterval);
    }

    // 清理函数
    function remove() {
        alive = false;

        // 清理高度监听
        if (heightUpdateInterval) {
            clearInterval(heightUpdateInterval);
            heightUpdateInterval = null;
        }

        // 安全地移除实体，检查 viewer 是否还存在
        try {
            if (viewer && viewer.entities) {
                entities.forEach((entity) => {
                    try {
                        viewer.entities.remove(entity);
                    } catch (error) {
                        console.warn('RippleMarker: Failed to remove entity:', error);
                    }
                });
            }
        } catch (error) {
            console.warn('RippleMarker: Failed to access viewer.entities during cleanup:', error);
        }

        if (clickHandler) {
            clickHandler();
        }
        animationHandler();
    }

    // 显示/隐藏控制
    function show() {
        entities.forEach((entity) => {
            setEntityVisibility(entity, true, 1);
        });
    }

    function hide() {
        entities.forEach((entity) => {
            setEntityVisibility(entity, false, 0);
        });
    }

    function setVisible(visible: boolean) {
        entities.forEach((entity) => {
            setEntityVisibility(entity, visible, visible ? 1 : 0);
        });
    }

    return {
        remove,
        show,
        hide,
        setVisible,
        updateHeightResponsive,
    };
}
