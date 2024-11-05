# 中国象棋 / Chinese Chess

一个基于 HTML5 Canvas 的中国象棋游戏实现，支持多种游戏模式、3D效果和AI对战。

[在线试玩](https://guomengtao.github.io/chinese-chess)

![游戏截图](screenshots/gameplay.png)

### 游戏截图

## 功能特性

- 🎮 丰富的游戏模式
  - 简单版：适合初学者，自由走子
  - 标准版：完整的象棋规则
  - 高级版：带音效和提示
  - 专业版：支持AI对战
  - 大师版：增强AI算法
  - 传统版：经典木纹棋盘
  - 严格版：完整规则校验
  - 3D立体版：酷炫特效
  - 动画立体版：真实立体感
  - 加强版：完整功能集合

- 🎯 游戏功能
  - 完整的中国象棋规则实现
  - 走子提示系统
  - 实时棋谱记录
  - 胜负判定
  - 音效系统
  - 3D立体效果
  - 动画特效

- 🎨 视觉效果
  - 3D棋盘渲染
  - 立体棋子效果
  - 动态光影
  - 移动动画
  - 特效系统
  - 水波纹效果

- 🤖 AI系统
  - 基础AI：随机走子
  - 高级AI：评估局势
  - 专家AI：深度搜索
  - 支持多个难度级别

- 💻 技术特性
  - HTML5 Canvas 2D/3D渲染
  - 纯原生JavaScript实现
  - 响应式设计
  - 无需安装，即开即玩
  - 支持所有现代浏览器

## 版本说明

### 简单版
- 适合初学者
- 自由走子，无规则限制
- 基础界面

### 标准版
- 完整的象棋规则
- 走子提示
- 基本音效

### 3D立体版
- 3D棋盘效果
- 立体棋子
- 动态光影
- 特效动画

### 动画立体版
- 真实立体感
- 流畅动画
- 粒子特效
- 水波纹效果
- 高级光影

### 加强版
- 所有功能集合
- AI对战
- 完整规则
- 存档功能
- 教程系统

## 技术实现

### 3D渲染
- Canvas 2D上下文模拟3D效果
- 透视投影
- 光影系统
- 动画系统

### 特效系统
- 粒子效果
- 光晕效果
- 水波纹动画
- 选中高亮

### 性能优化
- 帧率控制
- 渲染优化
- 内存管理
- 动画性能

## 最新更新

- 新增3D立体版本
- 新增动画立体版本
- 优化渲染性能
- 改进AI系统
- 添加更多特效

## 快速开始

### 在线试玩

访问 [https://guomengtao.github.io/chinese-chess](https://guomengtao.github.io/chinese-chess)

### 本地运行

1. 克隆仓库
```bash
git clone https://github.com/guomengtao/chinese-chess.git
```

2. 进入项目目录
```bash
cd chinese-chess
```

3. 使用浏览器打开 index.html 即可开始游戏

## 游戏规则

### 基本规则
- 红方先手
- 点击棋子选中，再点击目标位置移动
- 绿色圆点表示可移动位置
- 吃掉对方将/帅获胜

### 棋子走法
- 车：直线移动
- 马：走"日"字
- 炮：直线移动，吃子需跳过一个棋子
- 相/象：走"田"字，不能过河
- 仕/士：斜走一格，限九宫格内
- 帅/将：上下左右一格，限九宫格内
- 兵/卒：向前一格，过河后可左右

## 开发相关

### 项目结构
```
chinese-chess/
├── index.html          # 主页面
├── style.css           # 样式文件
├── chess.js            # 游戏逻辑
├── sounds/             # 音效文件
├── screenshots/        # 截图
└── docs/              # 文档
```

### 技术栈
- HTML5 Canvas
- 原生 JavaScript
- CSS3

### 本地开发
1. Fork 本仓库
2. 克隆到本地
3. 修改代码
4. 提交 Pull Request

## 贡献指南

欢迎贡献代码，请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

## 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新历史

## 待办事项

- [ ] 增加更多AI难度级别
- [ ] 添加对局保存/加载功能
- [ ] 实现对战回放功能
- [ ] 添加在线对战功能
- [ ] 优化移动端体验

## 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 致谢

- 感谢 [lichess.org](https://lichess.org) 提供的音效资源
- 感谢所有贡献者的支持

## 联系方式

- 作者：Guo Mengtao
- 项目主页：[https://github.com/guomengtao/chinese-chess](https://github.com/guomengtao/chinese-chess)

## 赞助支持

如果您觉得这个项目对您有帮助，欢迎赞助支持后续开发：

- 微信/支付宝：[二维码图片]
- GitHub Sponsors
- PayPal

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=guomengtao/chinese-chess&type=Date)](https://star-history.com/#guomengtao/chinese-chess&Date)