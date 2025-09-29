# Contributing to cesium-kit

感谢您对 cesium-kit 项目的关注！我们欢迎任何形式的贡献，包括但不限于：

- 🐛 Bug 修复
- ✨ 新功能开发
- 📚 文档改进
- 🧪 测试用例
- 💡 建议和反馈

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Git**: 最新版本

### 开发环境搭建

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/your-username/cesium-kit.git
cd cesium-kit

# 2. 安装依赖
npm i
npm run play:install

# 3. 启动开发环境
npm run dev:play
```

## 📋 开发流程

### 1. 创建功能分支

```bash
# 从 main 分支创建新分支
git checkout -b feat/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 开发新功能

#### 添加新组件

1. **创建组件目录**：

   ```bash
   mkdir src/YourComponent
   ```

2. **创建组件文件**：

   ```bash
   # 创建 index.ts
   touch src/YourComponent/index.ts

   # 创建 README.md
   touch src/YourComponent/README.md
   ```

3. **更新主入口**：

   ```typescript
   // src/index.ts
   export * from "./YourComponent";
   ```

4. **添加样式文件**（如需要）：
   ```bash
   # 创建样式文件
   touch src/styles/your-component.css
   ```

#### 修改现有组件

- 直接编辑 `src/ComponentName/index.ts`
- 更新对应的 `README.md` 文档
- 如修改了样式，更新 `src/styles/` 中的 CSS 文件

### 3. 测试和验证

```bash
# 构建项目
npm run build

# 检查 playground 中的效果
npm run play:start
```

### 4. 提交代码

```bash
# 添加修改的文件
git add .

# 提交（使用规范的提交信息）
git commit -m "feat: add new camera control component"
# 或
git commit -m "fix: resolve ripple marker positioning issue"
```

### 5. 推送并创建 PR

```bash
# 推送到你的 fork
git push origin feat/your-feature-name

# 在 GitHub 上创建 Pull Request
```

## 📝 代码规范

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**类型说明**：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例**：

```bash
feat(camera): add zoom control functionality
fix(marker): resolve positioning issue on high latitudes
docs: update installation guide
```

### TypeScript 规范

- 使用严格的 TypeScript 配置
- 为所有公共 API 提供类型定义
- 使用 JSDoc 注释说明复杂逻辑

```typescript
/**
 * 创建相机控制组件
 * @param options 配置选项
 * @param options.viewer Cesium 查看器实例
 * @param options.zoomDistance 缩放距离（米）
 * @returns 相机控制实例
 */
export function createCameraControl(
  options: CameraControlOptions
): CameraControl {
  // 实现代码
}
```

### CSS 规范

- 使用 BEM 命名规范
- 组件样式使用 `cesium-kit-` 前缀
- 支持主题定制

```css
/* 组件容器 */
.cesium-kit-camera-control {
}

/* 组件元素 */
.cesium-kit-camera-control__slider {
}

/* 组件修饰符 */
.cesium-kit-camera-control--disabled {
}
```

## 🧪 测试指南

### 在 playground 中测试

1. **启动开发环境**：

   ```bash
   npm run dev:play
   ```

2. **在 playground/src/components/Earth.vue 中添加测试代码**

3. **验证功能**：
   - 检查控制台是否有错误
   - 验证组件是否正常显示
   - 测试交互功能

### 测试清单

- [ ] 组件能正常创建和销毁
- [ ] 所有配置选项都能正常工作
- [ ] 样式在不同浏览器中显示正常
- [ ] TypeScript 类型检查通过
- [ ] 没有控制台错误或警告

## 📚 文档要求

### 组件文档结构

每个组件都应该有完整的 README.md，包含：

````markdown
# ComponentName 组件

## 特性

- 功能点 1
- 功能点 2

## 安装

```bash
npm install cesium-kit
```
````

## 基础使用

```javascript
// 代码示例
```

## 配置选项

| 参数 | 类型 | 默认值 | 描述 |

## API 参考

### 方法

### 事件

## 完整示例

## 注意事项

## 故障排除

````

### 示例代码要求

- 提供完整可运行的示例
- 包含错误处理
- 注释说明关键步骤

## 🔄 构建和发布流程

### 自动构建同步

项目使用自动化构建同步机制：

```bash
npm run build
````

构建流程：

1. 自动生成 CSS exports
2. TypeScript 编译
3. 复制样式文件
4. 同步到 playground

### 版本发布

```bash
# 更新版本号并构建
npm run pack

# 发布到 npm
npm publish
```

## 🐛 Bug 报告

提交 Bug 报告时，请包含：

1. **环境信息**：

   - Node.js 版本
   - npm 版本
   - 浏览器版本
   - 操作系统

2. **复现步骤**：

   - 详细的操作步骤
   - 预期结果
   - 实际结果

3. **代码示例**：

   - 最小可复现的代码
   - 错误信息截图

4. **相关日志**：
   - 控制台错误信息
   - 网络请求日志

## 💡 功能建议

提交功能建议时，请考虑：

1. **使用场景**：具体的使用场景和需求
2. **API 设计**：建议的 API 接口设计
3. **兼容性**：对现有功能的影响
4. **实现复杂度**：实现的难易程度

## 📞 联系方式

- **Issues**: [GitHub Issues](https://github.com/leongaooo/cesium-kit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/leongaooo/cesium-kit/discussions)

## 📄 许可证

贡献的代码将使用 [MIT 许可证](LICENSE) 发布。

---

再次感谢您的贡献！🎉
