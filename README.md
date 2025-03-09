# 倒计时应用 - Days Matter

![应用截图](https://github.com/Qcaid/Countdown/blob/60e8cf1691f2bca41af0ae61ccb79d1f2bb904f5/demo/demoimg.png)

## 功能特性
- 📅 创建/删除倒计时事件
- 🎨 自定义事件颜色
- 📦 本地存储数据持久化
- 📥📤 数据导入导出功能
- 🗂️ 分类筛选管理
- ⏱️ 实时秒级刷新
- 📱 响应式布局

## 技术栈
- ⚛️ Next.js 13
- 🎨 Tailwind CSS
- 🧩 React 18
- 💾 localStorage

## 安装步骤
```bash
npm install
npm run dev
```

## 使用方法
1. 点击"添加事件"按钮创建新事件
2. 输入事件标题、选择日期和颜色
3. 使用分类筛选栏快速查找事件
4. 长按事件卡片可删除事件
5. 通过工具栏按钮导入/导出JSON数据

## 数据管理
- 自动保存：所有更改自动保存到浏览器本地存储
- 导出数据：点击导出按钮生成JSON文件
- 导入数据：通过导入按钮选择JSON文件恢复数据

## 分类管理
- 点击"添加分类"创建新分类
- 支持动态分类筛选
- 默认分类：未分类

## 项目结构
```
├── components/        # 可重用组件
│   └── CategorySelector.js  # 分类筛选组件
├── pages/
│   ├── _app.js       # 应用入口
│   └── index.js      # 主界面
├── styles/           # 全局样式
│   └── globals.css   
└── tailwind.config.js # Tailwind配置
```

## 开发指南
```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm run start

# 启用调试模式（需要安装Chrome扩展）
DEBUG=true npm run dev

# 运行测试用例
npm test
```
