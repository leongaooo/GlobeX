import * as Cesium from 'cesium';

export interface CameraControlOptions {
  viewer: Cesium.Viewer;
  zoomDistance?: number; // 默认500m
  containerId?: string; // 可选，指定容器ID，不指定则自动查找
  showCameraInfo?: boolean; // 是否显示相机信息，默认false
}

export interface CameraState {
  longitude: number;
  latitude: number;
  height: number;
  heading: number;
  pitch: number;
  roll: number;
}

export class CameraControl {
  private autoZoomInterval: null | number = null;
  private baseHeight: number = 0;
  private cameraInfo: HTMLElement | null = null;
  private cameraState: CameraState;
  private container: HTMLElement;
  private currentZoomLevel: number = 50;
  private isAtEndpoint: boolean = false;
  private isDragging: boolean = false;
  private northIndicator: HTMLElement | null = null;
  private showCameraInfo: boolean;
  private sliderOffset: number = 0;
  private viewer: Cesium.Viewer;
  private zoomDistance: number;
  private zoomSliderRef: HTMLElement | null = null;

  constructor(options: CameraControlOptions) {
    this.viewer = options.viewer;
    this.zoomDistance = options.zoomDistance || 500;
    this.showCameraInfo = options.showCameraInfo || false;
    this.cameraState = {
      longitude: 0,
      latitude: 0,
      height: 0,
      heading: 0,
      pitch: 0,
      roll: 0,
    };

    // 自动查找容器或使用指定的容器ID
    const containerId = options.containerId || this.findViewerContainer();
    this.container = this.createContainer(containerId);
    this.setupEventListeners();
    this.updateCameraState();
    this.startCameraStateUpdate();

    // 自动添加到页面
    this.appendToPage();
  }

  // 公共方法
  public destroy(): void {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    this.stopAutoZoom();
    if (this.container.parentNode) {
      this.container.remove();
    }
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

  // 自动添加到页面
  private appendToPage(): void {
    const targetContainer = document.querySelector(
      `#${this.container.id.replace('cesium-kit-camera-control-', '')}`,
    );
    if (targetContainer) {
      targetContainer.append(this.container);
    } else {
      // 如果找不到目标容器，添加到body
      document.body.append(this.container);
    }
  }

  private createCameraInfo(): HTMLElement {
    const cameraInfo = document.createElement('div');
    cameraInfo.className = 'cesium-kit-camera-info';
    this.cameraInfo = cameraInfo;

    // 当前位置
    const positionSection = document.createElement('div');
    positionSection.className = 'cesium-kit-info-section';

    const positionTitle = document.createElement('h4');
    positionTitle.textContent = '当前位置';
    positionSection.append(positionTitle);

    const positionItems = [
      { label: '经度:', key: 'longitude', unit: '°' },
      { label: '纬度:', key: 'latitude', unit: '°' },
      { label: '高度:', key: 'height', unit: 'm' },
    ];

    positionItems.forEach(({ label, key, unit }) => {
      const item = document.createElement('div');
      item.className = 'cesium-kit-info-item';

      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;

      const valueSpan = document.createElement('span');
      valueSpan.id = `cesium-kit-${key}`;
      valueSpan.textContent = `0${unit}`;

      item.append(labelSpan);
      item.append(valueSpan);
      positionSection.append(item);
    });

    cameraInfo.append(positionSection);

    // 相机方向
    const orientationSection = document.createElement('div');
    orientationSection.className = 'cesium-kit-info-section';

    const orientationTitle = document.createElement('h4');
    orientationTitle.textContent = '相机方向';
    orientationSection.append(orientationTitle);

    const orientationItems = [
      { label: '朝向:', key: 'heading', unit: '°' },
      { label: '俯仰:', key: 'pitch', unit: '°' },
      { label: '翻滚:', key: 'roll', unit: '°' },
    ];

    orientationItems.forEach(({ label, key, unit }) => {
      const item = document.createElement('div');
      item.className = 'cesium-kit-info-item';

      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;

      const valueSpan = document.createElement('span');
      valueSpan.id = `cesium-kit-${key}`;
      valueSpan.textContent = `0${unit}`;

      item.append(labelSpan);
      item.append(valueSpan);
      orientationSection.append(item);
    });

    cameraInfo.append(orientationSection);

    return cameraInfo;
  }

  private createContainer(id: string): HTMLElement {
    const container = document.createElement('div');
    container.id = `cesium-kit-camera-control-${id}`;
    container.className = 'cesium-kit-camera-controls';

    // 创建旋转控制
    const rotationControl = this.createRotationControl();
    container.append(rotationControl);

    // 创建平移控制
    const panControl = this.createPanControl();
    container.append(panControl);

    // 创建街景控制
    const streetView = this.createStreetView();
    container.append(streetView);

    // 创建缩放控制
    const zoomControl = this.createZoomControl();
    container.append(zoomControl);

    // 创建相机状态信息（可选）
    if (this.showCameraInfo) {
      const cameraInfo = this.createCameraInfo();
      container.append(cameraInfo);
    }

    return container;
  }

  private createPanControl(): HTMLElement {
    const panControl = document.createElement('div');
    panControl.className = 'cesium-kit-pan-control';

    const controlCircle = document.createElement('div');
    controlCircle.className = 'cesium-kit-control-circle';

    // 平移控制按钮
    const handBtn = document.createElement('button');
    handBtn.className = 'cesium-kit-control-btn cesium-kit-hand-btn';
    handBtn.title = '平移控制';
    handBtn.innerHTML = this.getSvgIcon('radix-icons--hand');
    controlCircle.append(handBtn);

    // 方向控制按钮
    const directions = [
      { dir: 'up', title: '向上平移' },
      { dir: 'down', title: '向下平移' },
      { dir: 'left', title: '向左平移' },
      { dir: 'right', title: '向右平移' },
    ];

    directions.forEach(({ dir, title }) => {
      const btn = document.createElement('button');
      btn.className = `cesium-kit-control-btn cesium-kit-arrow-btn ${dir}`;
      btn.title = title;
      btn.addEventListener('click', () => this.panCamera(dir as any));

      btn.innerHTML = this.getSvgIcon(`line-md--chevron-small-${dir}`);
      controlCircle.append(btn);
    });

    panControl.append(controlCircle);
    return panControl;
  }

  private createRotationControl(): HTMLElement {
    const rotationControl = document.createElement('div');
    rotationControl.className = 'cesium-kit-rotation-control';

    const controlCircle = document.createElement('div');
    controlCircle.className = 'cesium-kit-control-circle';

    // 指南针轨道
    const compassTrack = document.createElement('div');
    compassTrack.className = 'cesium-kit-compass-track';
    controlCircle.append(compassTrack);

    // 视角控制按钮
    const eyeBtn = document.createElement('button');
    eyeBtn.className = 'cesium-kit-control-btn cesium-kit-eye-btn';
    eyeBtn.title = '视角控制';
    eyeBtn.innerHTML = this.getSvgIcon('line-md--compass-loop');
    controlCircle.append(eyeBtn);

    // 方向控制按钮
    const directions = [
      { dir: 'up', title: '向上旋转' },
      { dir: 'down', title: '向下旋转' },
      { dir: 'left', title: '向左旋转' },
      { dir: 'right', title: '向右旋转' },
    ];

    directions.forEach(({ dir, title }) => {
      const btn = document.createElement('button');
      btn.className = `cesium-kit-control-btn cesium-kit-arrow-btn ${dir}`;
      btn.title = title;
      btn.addEventListener('click', () => this.rotateCamera(dir as any));

      btn.innerHTML = this.getSvgIcon(`line-md--chevron-small-${dir}`);
      controlCircle.append(btn);
    });

    // 北方位指示器
    this.northIndicator = document.createElement('div');
    this.northIndicator.className = 'cesium-kit-north-indicator';
    this.northIndicator.textContent = 'N';
    this.northIndicator.title = '重置为北方位';
    this.northIndicator.addEventListener('click', () => this.resetToNorth());
    controlCircle.append(this.northIndicator);

    rotationControl.append(controlCircle);
    return rotationControl;
  }

  private createStreetView(): HTMLElement {
    const streetView = document.createElement('div');
    streetView.className = 'cesium-kit-street-view';

    streetView.innerHTML = this.getSvgIcon('gis--location-man-alt');

    return streetView;
  }

  private createZoomControl(): HTMLElement {
    const zoomControl = document.createElement('div');
    zoomControl.className = 'cesium-kit-zoom-control';
    zoomControl.addEventListener('mouseup', (e) => this.handleMouseUp(e));

    // 放大按钮
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'cesium-kit-zoom-btn cesium-kit-zoom-in';
    zoomInBtn.textContent = '+';
    zoomInBtn.title = '放大';
    zoomInBtn.addEventListener('click', () => this.zoomIn());
    zoomControl.append(zoomInBtn);

    // 滑块
    const zoomSlider = document.createElement('div');
    zoomSlider.className = 'cesium-kit-zoom-slider';
    zoomSlider.addEventListener('click', (e) => this.handleSliderClick(e));
    this.zoomSliderRef = zoomSlider;

    const sliderTrack = document.createElement('div');
    sliderTrack.className = 'cesium-kit-slider-track';
    zoomSlider.append(sliderTrack);

    const sliderHandle = document.createElement('div');
    sliderHandle.className = 'cesium-kit-slider-handle';
    sliderHandle.style.top = '50%';
    sliderHandle.textContent = '-';
    sliderHandle.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    zoomSlider.append(sliderHandle);

    zoomControl.append(zoomSlider);

    // 缩小按钮
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'cesium-kit-zoom-btn cesium-kit-zoom-out';
    zoomOutBtn.textContent = '-';
    zoomOutBtn.title = '缩小';
    zoomOutBtn.addEventListener('click', () => this.zoomOut());
    zoomControl.append(zoomOutBtn);

    return zoomControl;
  }

  // 自动查找Cesium viewer容器
  private findViewerContainer(): string {
    // 查找包含Cesium viewer的元素
    const cesiumContainers = document.querySelectorAll(
      '[class*="cesium"], [id*="cesium"], [class*="viewer"], [id*="viewer"]',
    );

    for (const container of cesiumContainers) {
      if (container.id) {
        return container.id;
      }
    }

    // 如果没找到，查找map相关的容器
    const mapContainers = document.querySelectorAll(
      '[class*="map"], [id*="map"]',
    );
    for (const container of mapContainers) {
      if (container.id) {
        return container.id;
      }
    }

    // 最后尝试查找body下的第一个div
    const firstDiv = document.querySelector('body > div');
    if (firstDiv && firstDiv.id) {
      return firstDiv.id;
    }

    // 如果都没找到，返回默认ID
    return 'cesium-kit-camera-control-default';
  }

  // 获取SVG图标，使用内联SVG代码，支持自适应大小
  private getSvgIcon(iconName: string): string {
    const svgIcons: Record<string, string> = {
      'line-md--compass-loop': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><mask id="prefix__a"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9"><path stroke-dasharray="64" stroke-dashoffset="64" d="M12 3a9 9 0 11-.001 18.001A9 9 0 0112 3z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path fill="#fff" stroke="none" d="M11 11l1 1 1 1-1-1z" transform="rotate(-180 12 12)"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.3s" values="M11 11L12 12L13 13L12 12z;M10.2 10.2L17 7L13.8 13.8L7 17z"/><animateTransform attributeName="transform" dur="9s" repeatCount="indefinite" type="rotate" values="-180 12 12;0 12 12;0 12 12;0 12 12;0 12 12;270 12 12;-90 12 12;0 12 12;-180 12 12;-35 12 12;-40 12 12;-45 12 12;-45 12 12;-110 12 12;-135 12 12;-180 12 12"/></path><circle cx="12" cy="12" r="1" fill="#000" fill-opacity="0" stroke="none"><animate fill="freeze" attributeName="fill-opacity" begin="0.9s" dur="0.15s" values="0;1"/></circle></g></mask><path fill="currentColor" mask="url(#prefix__a)" d="M0 0h24v24H0z"/></svg>`,
      'line-md--chevron-small-up': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9l-5 5m5-5l5 5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>`,
      'line-md--chevron-small-down': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 15l-5-5m5 5l5-5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>`,
      'line-md--chevron-small-left': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l5-5m-5 5l5 5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>`,
      'line-md--chevron-small-right': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 100%; height: 100%;"><path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-dashoffset="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 12l-5-5m5 5l-5 5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="10;0"/></path></svg>`,
      'radix-icons--hand': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" style="width: 100%; height: 100%;"><path fill="currentColor" d="M7.654 0c.744.008 1.56.448 1.759 1.361q.147-.143.322-.244c.376-.217.8-.257 1.188-.169.768.176 1.435.863 1.498 1.814l.005.07c.31-.227.702-.306 1.15-.217.404.08.911.377 1.198 1.015.282.629.321 1.523-.045 2.762-.331 1.12-.705 2.057-1.042 2.9-.165.413-.322.805-.46 1.185-.425 1.17-.728 2.344-.728 4.023a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5c0-1.037-.69-2.01-1.638-3.04q-.346-.373-.704-.741l-.007-.006c-.24-.247-.48-.497-.706-.745-.448-.49-.87-1.004-1.139-1.54-.238-.457-.407-1.115-.204-1.665l.003-.009c.136-.35.35-.662.674-.87.326-.208.71-.277 1.125-.236.616.06 1.06.334 1.435.665a22 22 0 00-.496-1.251l-.066-.158c-.252-.601-.512-1.236-.684-1.907l-.002-.01a1.82 1.82 0 01.446-1.668 1.61 1.61 0 011.73-.402c.66.232 1.128.757 1.465 1.35q.03-.377.092-.774V1.49C5.989.466 6.865-.008 7.654 0m-.011 1c-.42-.004-.764.228-.832.648-.19 1.231-.129 2.237-.043 3.657q.025.388.049.823a.5.5 0 01-.992.115l-.077-.436c-.104-.642-.264-1.552-.57-2.36-.315-.834-.73-1.406-1.244-1.587a.61.61 0 00-.676.15.82.82 0 00-.195.744c.152.59.384 1.162.636 1.764l.067.162c.23.545.47 1.117.65 1.71v.003c.146.483.24.866.315 1.169q.044.18.081.322a.5.5 0 01-.813.504 10 10 0 01-.681-.67l-.121-.13c-.15-.16-.28-.3-.413-.428-.324-.309-.6-.48-.978-.516h-.003c-.242-.025-.389.02-.485.083-.099.063-.198.177-.28.385-.062.173-.023.518.155.857l.004.009c.203.407.548.838.984 1.315q.326.353.689.725l.01.01c.235.244.48.496.717.754.832.904 1.68 1.972 1.865 3.218h6.046c.055-1.565.368-2.732.78-3.865.157-.434.324-.85.495-1.277.327-.816.667-1.669.987-2.75.328-1.11.24-1.737.09-2.068-.143-.321-.369-.422-.479-.444-.243-.048-.343.013-.412.083-.103.104-.2.304-.277.624-.076.31-.117.662-.16 1.022l-.002.028c-.038.32-.08.677-.163.948a.54.54 0 01-.17.274.5.5 0 01-.366.118c-.289-.024-.46-.272-.466-.545-.01-.394.024-.79.043-1.182.035-.73.069-1.433.016-2.132V2.83c-.032-.499-.375-.827-.723-.906a.64.64 0 00-.466.06c-.132.076-.28.23-.378.53l-.001.005c-.041.123-.083.36-.12.695-.036.323-.062.7-.084 1.081a78 78 0 00-.048.968c-.017.383-.032.712-.048.891a.5.5 0 01-.061.204c-.022.04-.134.252-.424.261a.51.51 0 01-.454-.259c-.061-.11-.067-.24-.07-.366l-.006-.445c-.002-.341-.002-.728-.002-.838 0-1.044-.001-2.056-.092-3.066-.056-.403-.385-.64-.804-.644"/></svg>`,
      'gis--location-man-alt': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="width: 100%; height: 100%;"><path fill="currentColor" d="M49.781 23.592C41.947 23.593 34.184 26.96 35 33.688l2 14.624C37.352 50.886 39.09 55 41.688 55h.185L44 80.53c.092 1.103.892 2 2 2h8c1.108 0 1.908-.897 2-2L58.127 55h.185c2.597 0 4.336-4.115 4.688-6.687l2-14.626c.523-6.733-7.384-10.097-15.219-10.095" color="currentColor"/><path fill="currentColor" d="M50.024 50.908l-.048.126c.016-.038.027-.077.043-.115zM34.006 69.057C19.88 71.053 10 75.828 10 82.857 10 92.325 26.508 100 50 100s40-7.675 40-17.143c0-7.029-9.879-11.804-24.004-13.8l-1.957 3.332C74.685 73.866 82 76.97 82 80.572c0 5.05-14.327 9.143-32 9.143s-32-4.093-32-9.143c-.001-3.59 7.266-6.691 17.945-8.174z" color="currentColor"/><circle cx="50" cy="10.5" r="10.5" fill="currentColor" color="currentColor"/></svg>`,
    };

    return svgIcons[iconName] || '';
  }

  // 相机控制方法
  private handleMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    if (this.viewer) {
      this.baseHeight = this.viewer.camera.positionCartographic.height;
    }
    event.preventDefault();
  }

  private handleMouseMove(event: MouseEvent): void {
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
      '.cesium-kit-slider-handle',
    ) as HTMLElement;
    if (sliderHandle) {
      sliderHandle.style.transition = '';
      sliderHandle.style.top = `${this.currentZoomLevel}%`;
    }

    if (this.isAtEndpoint && !wasAtEndpoint) {
      this.startAutoZoom(sliderPosition < 0 ? 'in' : 'out');
    } else if (!this.isAtEndpoint && wasAtEndpoint) {
      this.stopAutoZoom();
    }

    if (!this.isAtEndpoint) {
      this.setZoomLevel(this.currentZoomLevel);
    }
  }

  private handleMouseUp(_event: MouseEvent): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.stopAutoZoom();
      this.resetSliderToCenter();
    }
  }

  private handleSliderClick(event: MouseEvent): void {
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

  private panCamera(direction: 'down' | 'left' | 'right' | 'up'): void {
    const camera = this.viewer.camera;

    switch (direction) {
      case 'down': {
        camera.moveDown(1000);
        break;
      }
      case 'left': {
        camera.moveLeft(1000);
        break;
      }
      case 'right': {
        camera.moveRight(1000);
        break;
      }
      case 'up': {
        camera.moveUp(1000);
        break;
      }
    }
  }

  private resetSliderToCenter(): void {
    const sliderHandle = this.container.querySelector(
      '.cesium-kit-slider-handle',
    ) as HTMLElement;
    if (sliderHandle) {
      sliderHandle.style.transition = 'top 0.3s ease-out';
      sliderHandle.style.top = '50%';

      setTimeout(() => {
        this.currentZoomLevel = 50;
        this.sliderOffset = 0;
        sliderHandle.style.transition = '';
      }, 300);
    }
  }

  private resetToNorth(): void {
    this.viewer.camera.setView({
      orientation: {
        heading: 0,
        pitch: this.viewer.camera.pitch,
        roll: 0,
      },
    });
  }

  private rotateCamera(direction: 'down' | 'left' | 'right' | 'up'): void {
    const currentHeading = this.viewer.camera.heading;
    const currentPitch = this.viewer.camera.pitch;

    let newHeading = currentHeading;
    let newPitch = currentPitch;

    switch (direction) {
      case 'down': {
        newPitch = Math.min(newPitch + 0.1, Math.PI / 2);
        break;
      }
      case 'left': {
        newHeading = currentHeading - 0.1;
        break;
      }
      case 'right': {
        newHeading = currentHeading + 0.1;
        break;
      }
      case 'up': {
        newPitch = Math.max(newPitch - 0.1, -Math.PI / 2);
        break;
      }
    }

    this.viewer.camera.setView({
      orientation: {
        heading: newHeading,
        pitch: newPitch,
        roll: this.viewer.camera.roll,
      },
    });
  }

  private setupEventListeners(): void {
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
  }

  private setZoomLevel(level: number): void {
    const offset = (level - 50) * 100 + this.sliderOffset * 100;
    const targetHeight = this.baseHeight + offset;

    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        this.cameraState.longitude,
        this.cameraState.latitude,
        targetHeight,
      ),
      orientation: {
        heading: this.viewer.camera.heading,
        pitch: this.viewer.camera.pitch,
        roll: this.viewer.camera.roll,
      },
    });
  }

  private startAutoZoom(direction: 'in' | 'out'): void {
    if (this.autoZoomInterval) {
      clearInterval(this.autoZoomInterval);
    }

    this.autoZoomInterval = window.setInterval(() => {
      if (direction === 'in') {
        this.viewer.camera.zoomIn(this.zoomDistance);
      } else {
        this.viewer.camera.zoomOut(this.zoomDistance);
      }
    }, 16);
  }

  private startCameraStateUpdate(): void {
    setInterval(() => {
      this.updateCameraState();
      this.updateUI();
    }, 100);
  }

  private stopAutoZoom(): void {
    if (this.autoZoomInterval) {
      clearInterval(this.autoZoomInterval);
      this.autoZoomInterval = null;
    }
  }

  private updateCameraState(): void {
    const position = this.viewer.camera.position;
    const cartographic = Cesium.Cartographic.fromCartesian(position);

    this.cameraState = {
      longitude: Cesium.Math.toDegrees(cartographic.longitude),
      latitude: Cesium.Math.toDegrees(cartographic.latitude),
      height: cartographic.height,
      heading: this.viewer.camera.heading,
      pitch: this.viewer.camera.pitch,
      roll: this.viewer.camera.roll,
    };
  }

  private updateUI(): void {
    // 更新北方位指示器
    if (this.northIndicator) {
      const radius = 45;
      const angle = -this.cameraState.heading;
      const x = Math.sin(angle) * radius;
      const y = -Math.cos(angle) * radius;
      this.northIndicator.style.transform = `translate(${x}px, ${y}px)`;
    }

    // 更新相机状态信息
    if (this.cameraInfo) {
      const formattedState = {
        longitude: this.cameraState.longitude.toFixed(6),
        latitude: this.cameraState.latitude.toFixed(6),
        height: this.cameraState.height.toFixed(2),
        heading: ((this.cameraState.heading * 180) / Math.PI).toFixed(1),
        pitch: ((this.cameraState.pitch * 180) / Math.PI).toFixed(1),
        roll: ((this.cameraState.roll * 180) / Math.PI).toFixed(1),
      };

      Object.entries(formattedState).forEach(([key, value]) => {
        const element = document.querySelector(`#cesium-kit-${key}`);
        if (element) {
          const unit = key === 'height' ? 'm' : '°';
          element.textContent = `${value}${unit}`;
        }
      });
    }
  }

  private zoomIn(): void {
    this.viewer.camera.zoomIn(
      this.viewer.camera.positionCartographic.height * 0.2,
    );
  }

  private zoomOut(): void {
    this.viewer.camera.zoomOut(
      this.viewer.camera.positionCartographic.height * 0.2,
    );
  }
}

// 导出创建函数
export function createCameraControl(
  options: CameraControlOptions,
): CameraControl {
  return new CameraControl(options);
}
