# 中国象棋 / Chinese Chess

一个基于 HTML5 Canvas 的中国象棋游戏实现，支持多种游戏模式和AI对战。

[在线试玩](https://your-username.github.io/chinese-chess)

![游戏截图](screenshots/gameplay.png)

## 功能特性

- 🎮 多种游戏模式
  - 简单版：适合初学者，自由走子
  - 标准版：完整的象棋规则
  - 高级版：带音效和提示
  - 专业版：支持AI对战
  - 大师版：增强AI算法
  - 传统版：经典木纹棋盘

- 🎯 游戏功能
  - 完整的中国象棋规则实现
  - 走子提示系统
  - 实时棋谱记录
  - 胜负判定
  - 音效系统

- 🤖 AI系统
  - 基础AI：随机走子
  - 高级AI：评估局势
  - 支持不同难度级别

- 💻 技术特性
  - 纯原生JavaScript实现
  - 响应式设计
  - 无需安装，即开即玩
  - 支持所有现代浏览器

## 快速开始

### 在线试玩

访问 [https://your-username.github.io/chinese-chess](https://your-username.github.io/chinese-chess)

### 本地运行

1. 克隆仓库
```bash
git clone https://github.com/your-username/chinese-chess.git
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

- 作者：[Your Name]
- 邮箱：[your.email@example.com]
- 项目主页：[https://github.com/your-username/chinese-chess](https://github.com/your-username/chinese-chess)

## 赞助支持

如果您觉得这个项目对您有帮助，欢迎赞助支持后续开发：

- 微信/支付宝：[二维码图片]
- GitHub Sponsors
- PayPal

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/chinese-chess&type=Date)](https://star-history.com/#your-username/chinese-chess&Date)