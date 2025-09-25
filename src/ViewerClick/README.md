# ViewerClick

让你轻松监听 Viewer 的点击事件，并获取经纬度和原始参数

```ts
import { ViewerClick } from "globex";
import { Viewer } from "cesium";

const viewer = new Viewer("container");

ViewerClick(viewer, (lon, lat, event) => {
  console.log(lon, lat, event);
});
```

## 结合使用案例

```ts
import { ViewerClick, RippleMarker } from "globex";
import { Viewer } from "cesium";

const viewer = new Viewer("container");

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
```
