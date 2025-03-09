# 倒计时应用 - Days Matter

## 功能特性
✅ 多分类管理 • 🎨 主题颜色定制 • ⏰ 精准时间计算 • 💾 本地数据存储 • 📤 数据导入导出

## 技术栈
| 技术 | 版本 | 用途 |
|------|-------|------|
| Next.js | 13.5.4 | 应用框架 |
| React | 18.2.0 | UI组件开发 |
| Tailwind CSS | 3.3.3 | 样式设计 |
| date-fns | 2.30.0 | 日期处理 |

## 功能演示
<!-- 截图占位区 -->
![界面预览](./demo/demoimg.png)

## 安装指南
```bash
# 克隆仓库
git clone https://github.com/your-repo/countdown-app.git

# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build && npm start
```

## 核心功能
### 分类管理
- 动态添加/删除事件分类
- 智能迁移已删除分类的事件
- 本地存储分类配置

### 数据管理
- 实时自动保存至localStorage
- JSON格式导入导出
- 数据合并/覆盖保护机制

### 主题系统
- 自定义事件颜色标记
- 交互动画效果

## 开发规范
1. 组件目录：`/components`
2. 全局样式：`/styles/globals.css` 
3. 状态管理：React Context API
4. 代码格式化：Prettier + ESLint

## 贡献指南
欢迎提交PR并遵循以下规则：
1. 功能开发创建feature分支
2. Bug修复创建hotfix分支
3. 提交前运行测试用例
4. 更新CHANGELOG.md

## 许可证
[MIT License](./LICENSE)
