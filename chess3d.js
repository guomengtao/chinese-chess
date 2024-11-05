class ChineseChess3D {
    constructor() {
        this.canvas = document.getElementById('chessboard3d');
        if (!this.canvas) {
            console.error('3D canvas not found');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        // 初始化基本参数
        this.offsetX = 50;
        this.offsetY = 50;
        this.currentPlayer = 'red';
        this.gridSize = { x: 70, y: 70, z: 10 };
        this.pieceRadius = 30;
        
        // 初始化3D环境
        this.init3DEnvironment();
        this.setupSounds();
        this.setupEventListeners();
        
        // 初始化棋子
        this.pieces3D = this.initializePieces3D();
        
        // 立即开始渲染
        this.startRenderLoop();
    }

    init3DEnvironment() {
        console.log('Initializing 3D environment...');
        try {
            this.perspective = 800;
            this.boardRotation = { x: 20, y: 0, z: 0 };
            this.animations = new Map();
            
            // 3D棋盘参数
            this.boardSize = { width: 700, height: 800, depth: 30 };
            
            // 动画相关
            this.animationFrameId = null;
            this.lastTime = 0;
            this.selectedPiece = null;
            this.threatenedPieces = [];
            this.isCheck = false;
            
            console.log('3D environment initialized successfully');
        } catch (error) {
            console.error('Error initializing 3D environment:', error);
        }
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (event) => this.handleClick(event));
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const gridX = Math.round((x - this.offsetX) / this.gridSize.x);
        const gridY = Math.round((y - this.offsetY) / this.gridSize.y);

        console.log('Click at grid:', gridX, gridY);
        
        const clickedPiece = this.pieces3D.find(p => p.x === gridX && p.y === gridY);
        if (clickedPiece) {
            console.log('Clicked piece:', clickedPiece);
            this.selectedPiece = clickedPiece;
        }
    }

    startRenderLoop() {
        const animate = () => {
            this.drawBoard();
            this.drawPieces();
            this.animationFrameId = requestAnimationFrame(animate);
        };
        animate();
    }

    resetGame() {
        this.pieces3D = this.initializePieces3D();
        this.selectedPiece = null;
        this.currentPlayer = 'red';
        this.drawBoard();
        this.drawPieces();
    }

    drawBoard() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制棋盘背景
        this.ctx.fillStyle = '#ffedcc';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 添加3D效果的边框
        this.ctx.strokeStyle = '#8b4513';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(
            this.offsetX - 10, 
            this.offsetY - 10, 
            this.gridSize.x * 8 + 20, 
            this.gridSize.y * 9 + 20
        );

        // 绘制横线
        for (let i = 0; i < 10; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, this.offsetY + i * this.gridSize.y);
            this.ctx.lineTo(this.offsetX + 8 * this.gridSize.x, this.offsetY + i * this.gridSize.y);
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // 添加3D效果的阴影
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, this.offsetY + i * this.gridSize.y + 2);
            this.ctx.lineTo(this.offsetX + 8 * this.gridSize.x, this.offsetY + i * this.gridSize.y + 2);
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.stroke();
        }

        // 绘制竖线，分上下两部分
        for (let i = 0; i < 9; i++) {
            // 上半部分
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + i * this.gridSize.x, this.offsetY);
            this.ctx.lineTo(this.offsetX + i * this.gridSize.x, this.offsetY + 4 * this.gridSize.y);
            this.ctx.strokeStyle = '#000';
            this.ctx.stroke();

            // 下半部分
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + i * this.gridSize.x, this.offsetY + 5 * this.gridSize.y);
            this.ctx.lineTo(this.offsetX + i * this.gridSize.x, this.offsetY + 9 * this.gridSize.y);
            this.ctx.stroke();

            // 在楚河汉界区域保留两侧竖线
            if (i === 0 || i === 8) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.offsetX + i * this.gridSize.x, this.offsetY + 4 * this.gridSize.y);
                this.ctx.lineTo(this.offsetX + i * this.gridSize.x, this.offsetY + 5 * this.gridSize.y);
                this.ctx.stroke();
            }
        }

        // 绘制楚河汉界
        this.ctx.fillStyle = '#ffedcc';
        this.ctx.fillRect(
            this.offsetX + this.gridSize.x,
            this.offsetY + 4 * this.gridSize.y,
            6 * this.gridSize.x,
            this.gridSize.y
        );

        // 添加3D效果的文字
        this.ctx.font = 'bold 32px KaiTi, SimSun';
        this.ctx.fillStyle = '#000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // 文字阴影
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        this.ctx.fillText('楚 河', 
            this.offsetX + 2 * this.gridSize.x, 
            this.offsetY + 4.5 * this.gridSize.y
        );
        this.ctx.fillText('漢 界', 
            this.offsetX + 6 * this.gridSize.x, 
            this.offsetY + 4.5 * this.gridSize.y
        );

        // 清除阴影效果
        this.ctx.shadowColor = 'transparent';

        // 绘制九宫格
        this.drawPalace();
    }

    drawPalace() {
        // 绘制九宫格斜线
        this.ctx.beginPath();
        
        // 上方九宫格
        this.ctx.moveTo(this.offsetX + 3 * this.gridSize.x, this.offsetY);
        this.ctx.lineTo(this.offsetX + 5 * this.gridSize.x, this.offsetY + 2 * this.gridSize.y);
        this.ctx.moveTo(this.offsetX + 5 * this.gridSize.x, this.offsetY);
        this.ctx.lineTo(this.offsetX + 3 * this.gridSize.x, this.offsetY + 2 * this.gridSize.y);
        
        // 下方九宫格
        this.ctx.moveTo(this.offsetX + 3 * this.gridSize.x, this.offsetY + 7 * this.gridSize.y);
        this.ctx.lineTo(this.offsetX + 5 * this.gridSize.x, this.offsetY + 9 * this.gridSize.y);
        this.ctx.moveTo(this.offsetX + 5 * this.gridSize.x, this.offsetY + 7 * this.gridSize.y);
        this.ctx.lineTo(this.offsetX + 3 * this.gridSize.x, this.offsetY + 9 * this.gridSize.y);
        
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();
    }

    initializePieces3D() {
        const pieces = [];
        // 添加红方棋子
        [
            { type: '车', pos: [0, 9] }, { type: '马', pos: [1, 9] },
            { type: '相', pos: [2, 9] }, { type: '仕', pos: [3, 9] },
            { type: '帅', pos: [4, 9] }, { type: '仕', pos: [5, 9] },
            { type: '相', pos: [6, 9] }, { type: '马', pos: [7, 9] },
            { type: '车', pos: [8, 9] },
            { type: '炮', pos: [1, 7] }, { type: '炮', pos: [7, 7] },
            { type: '兵', pos: [0, 6] }, { type: '兵', pos: [2, 6] },
            { type: '兵', pos: [4, 6] }, { type: '兵', pos: [6, 6] },
            { type: '兵', pos: [8, 6] }
        ].forEach(({ type, pos }) => {
            pieces.push({
                type,
                color: 'red',
                x: pos[0],
                y: pos[1],
                z: 0,
                rotation: { x: 0, y: 0, z: 0 },
                scale: 1,
                height: 20,
                selected: false,
                threatened: false,
                animation: null
            });
        });

        // 添加黑方棋子
        [
            { type: '車', pos: [0, 0] }, { type: '馬', pos: [1, 0] },
            { type: '象', pos: [2, 0] }, { type: '士', pos: [3, 0] },
            { type: '将', pos: [4, 0] }, { type: '士', pos: [5, 0] },
            { type: '象', pos: [6, 0] }, { type: '馬', pos: [7, 0] },
            { type: '車', pos: [8, 0] },
            { type: '砲', pos: [1, 2] }, { type: '砲', pos: [7, 2] },
            { type: '卒', pos: [0, 3] }, { type: '卒', pos: [2, 3] },
            { type: '卒', pos: [4, 3] }, { type: '卒', pos: [6, 3] },
            { type: '卒', pos: [8, 3] }
        ].forEach(({ type, pos }) => {
            pieces.push({
                type,
                color: 'black',
                x: pos[0],
                y: pos[1],
                z: 0,
                rotation: { x: 0, y: 0, z: 0 },
                scale: 1,
                height: 20,
                selected: false,
                threatened: false,
                animation: null
            });
        });

        console.log('Initialized 3D pieces:', pieces); // 调试输出
        return pieces;
    }

    drawPieces() {
        if (!this.pieces3D) {
            console.error('Pieces not initialized');
            return;
        }

        this.pieces3D.forEach(piece => {
            const x = this.offsetX + piece.x * this.gridSize.x;
            const y = this.offsetY + piece.y * this.gridSize.y;

            // 绘制棋子阴影
            this.ctx.beginPath();
            this.ctx.arc(x + 2, y + 2, this.pieceRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fill();

            // 绘制棋子本体
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.pieceRadius, 0, Math.PI * 2);
            
            // 创建3D效果的渐变
            const gradient = this.ctx.createRadialGradient(
                x - this.pieceRadius * 0.3,
                y - this.pieceRadius * 0.3,
                0,
                x,
                y,
                this.pieceRadius
            );

            if (piece.color === 'red') {
                gradient.addColorStop(0, '#ff9999');
                gradient.addColorStop(0.5, '#ff3333');
                gradient.addColorStop(1, '#cc0000');
            } else {
                gradient.addColorStop(0, '#666666');
                gradient.addColorStop(0.5, '#333333');
                gradient.addColorStop(1, '#000000');
            }

            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            this.ctx.strokeStyle = piece.color === 'red' ? '#ffcccc' : '#666666';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // 绘制棋子文字
            this.ctx.font = 'bold 28px KaiTi, SimSun';
            this.ctx.fillStyle = piece.color === 'red' ? '#ffeeee' : '#ffffff';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(piece.type, x, y);

            // 如果是选中状态，添加高亮效果
            if (piece === this.selectedPiece) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, this.pieceRadius + 3, 0, Math.PI * 2);
                this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }
        });
    }
}