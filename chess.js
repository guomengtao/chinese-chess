class ChineseChess {
    constructor() {
        try {
            this.canvas = document.getElementById('chessboard');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }
            this.ctx = this.canvas.getContext('2d');
            this.gridSize = 70;
            this.pieceRadius = 30;
            this.offsetX = 50;
            this.offsetY = 50;
            this.currentPlayer = 'red'; // 红方先手
            this.selected = null;
            this.pieces = this.initializePieces();
            this.version = 'simple'; // 添加版本标记
            this.moveCount = 1;
            this.setupVersionControl();
            this.soundEnabled = true;
            this.possibleMoves = [];
            this.setupSounds();
            this.setupControls();
            this.setupGameControls();
            this.updateStatusBar();
            this.moveHistory = [];
            this.moveList = document.getElementById('moveList');
            this.blinkingPiece = null;
            this.blinkingInterval = null;
            this.blinkingAlpha = 1;
            this.blinkingDirection = -1;
            this.lastMove = null;
            this.repeatedMoves = new Map(); // 用于检测长将、长捉
            this.touchedPiece = null; // 用于实现摸子走子规则
            this.gameHistory = [];
            this.aiLevel = 'easy';
            this.setupEnhancedFeatures();
            this.chess3d = null; // 用于存储3D版本实例

            // 添加事件监听
            this.canvas.addEventListener('click', (event) => this.handleClick(event));

            // 初始绘制
            this.drawBoard();
            this.drawPieces();

            // 设置重置游戏按钮的事件监听
            this.setupResetButton();
        } catch (error) {
            console.error('Error initializing chess game:', error);
        }
    }

    initializePieces() {
        const pieces = [];
        // 添加红方棋子
        pieces.push(
            { type: '车', color: 'red', x: 0, y: 9 },
            { type: '马', color: 'red', x: 1, y: 9 },
            { type: '相', color: 'red', x: 2, y: 9 },
            { type: '仕', color: 'red', x: 3, y: 9 },
            { type: '帅', color: 'red', x: 4, y: 9 },
            { type: '仕', color: 'red', x: 5, y: 9 },
            { type: '相', color: 'red', x: 6, y: 9 },
            { type: '马', color: 'red', x: 7, y: 9 },
            { type: '车', color: 'red', x: 8, y: 9 },
            { type: '炮', color: 'red', x: 1, y: 7 },
            { type: '炮', color: 'red', x: 7, y: 7 },
            { type: '兵', color: 'red', x: 0, y: 6 },
            { type: '兵', color: 'red', x: 2, y: 6 },
            { type: '兵', color: 'red', x: 4, y: 6 },
            { type: '兵', color: 'red', x: 6, y: 6 },
            { type: '兵', color: 'red', x: 8, y: 6 }
        );

        // 添加黑方棋子
        pieces.push(
            { type: '車', color: 'black', x: 0, y: 0 },
            { type: '馬', color: 'black', x: 1, y: 0 },
            { type: '象', color: 'black', x: 2, y: 0 },
            { type: '士', color: 'black', x: 3, y: 0 },
            { type: '将', color: 'black', x: 4, y: 0 },
            { type: '士', color: 'black', x: 5, y: 0 },
            { type: '象', color: 'black', x: 6, y: 0 },
            { type: '馬', color: 'black', x: 7, y: 0 },
            { type: '車', color: 'black', x: 8, y: 0 },
            { type: '砲', color: 'black', x: 1, y: 2 },
            { type: '砲', color: 'black', x: 7, y: 2 },
            { type: '卒', color: 'black', x: 0, y: 3 },
            { type: '卒', color: 'black', x: 2, y: 3 },
            { type: '卒', color: 'black', x: 4, y: 3 },
            { type: '卒', color: 'black', x: 6, y: 3 },
            { type: '卒', color: 'black', x: 8, y: 3 }
        );

        return pieces;
    }

    drawBoard() {
        if (this.version === 'traditional') {
            this.drawTraditionalBoard();
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 增加棋盘纹理
        this.ctx.fillStyle = '#ffedcc';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 添加木纹效果
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(160, 82, 45, 0.1)');
        gradient.addColorStop(0.5, 'rgba(160, 82, 45, 0.2)');
        gradient.addColorStop(1, 'rgba(160, 82, 45, 0.1)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制边框
        this.ctx.strokeStyle = '#8b4513';
        this.ctx.lineWidth = 2;

        // 绘制横线
        for (let i = 0; i < 10; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, this.offsetY + i * this.gridSize);
            this.ctx.lineTo(this.offsetX + 8 * this.gridSize, this.offsetY + i * this.gridSize);
            this.ctx.stroke();
        }

        // 绘制竖线，分上下两部分，但保留两侧竖线
        for (let i = 0; i < 9; i++) {
            // 上半部分（0-4格）
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + i * this.gridSize, this.offsetY);
            this.ctx.lineTo(this.offsetX + i * this.gridSize, this.offsetY + 4 * this.gridSize);
            this.ctx.stroke();

            // 下半部分（5-9格）
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + i * this.gridSize, this.offsetY + 5 * this.gridSize);
            this.ctx.lineTo(this.offsetX + i * this.gridSize, this.offsetY + 9 * this.gridSize);
            this.ctx.stroke();

            // 在楚河汉界区域保留最外侧的竖线
            if (i === 0 || i === 8) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.offsetX + i * this.gridSize, this.offsetY + 4 * this.gridSize);
                this.ctx.lineTo(this.offsetX + i * this.gridSize, this.offsetY + 5 * this.gridSize);
                this.ctx.stroke();
            }
        }

        // 绘制九宫格斜线
        // 红方九宫格
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetX + 3 * this.gridSize, this.offsetY + 7 * this.gridSize);
        this.ctx.lineTo(this.offsetX + 5 * this.gridSize, this.offsetY + 9 * this.gridSize);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetX + 5 * this.gridSize, this.offsetY + 7 * this.gridSize);
        this.ctx.lineTo(this.offsetX + 3 * this.gridSize, this.offsetY + 9 * this.gridSize);
        this.ctx.stroke();

        // 黑方九宫格
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetX + 3 * this.gridSize, this.offsetY);
        this.ctx.lineTo(this.offsetX + 5 * this.gridSize, this.offsetY + 2 * this.gridSize);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetX + 5 * this.gridSize, this.offsetY);
        this.ctx.lineTo(this.offsetX + 3 * this.gridSize, this.offsetY + 2 * this.gridSize);
        this.ctx.stroke();

        // 绘制楚河汉界
        // 先绘制背景长方形（不包括两侧）
        this.ctx.fillStyle = '#ffedcc';
        this.ctx.fillRect(
            this.offsetX + this.gridSize, // 从第二条竖线开始
            this.offsetY + 4 * this.gridSize, 
            6 * this.gridSize, // 只填充中间6格
            this.gridSize
        );

        // 添加木纹效果到楚河汉界区域
        const riverGradient = this.ctx.createLinearGradient(
            this.offsetX + this.gridSize,
            this.offsetY + 4 * this.gridSize,
            this.offsetX + 7 * this.gridSize,
            this.offsetY + 5 * this.gridSize
        );
        riverGradient.addColorStop(0, 'rgba(160, 82, 45, 0.1)');
        riverGradient.addColorStop(0.5, 'rgba(160, 82, 45, 0.15)');
        riverGradient.addColorStop(1, 'rgba(160, 82, 45, 0.1)');
        this.ctx.fillStyle = riverGradient;
        this.ctx.fillRect(
            this.offsetX + this.gridSize,
            this.offsetY + 4 * this.gridSize,
            6 * this.gridSize,
            this.gridSize
        );

        // 绘制楚河汉界文字
        this.ctx.font = 'bold 32px KaiTi, SimSun';
        this.ctx.fillStyle = '#000';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('楚 河', 
            this.offsetX + 2 * this.gridSize, 
            this.offsetY + 4.5 * this.gridSize
        );
        this.ctx.fillText('漢 界', 
            this.offsetX + 6 * this.gridSize, 
            this.offsetY + 4.5 * this.gridSize
        );
    }

    drawPieces() {
        this.pieces.forEach(piece => {
            const x = this.offsetX + piece.x * this.gridSize;
            const y = this.offsetY + piece.y * this.gridSize;

            // 设置透明度
            let alpha = 1;
            if (piece === this.blinkingPiece) {
                alpha = this.blinkingAlpha;
            }

            // 绘制棋子阴影
            this.ctx.beginPath();
            this.ctx.arc(x + 2, y + 2, this.pieceRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 0, 0, ${0.2 * alpha})`;
            this.ctx.fill();

            // 绘制棋子背景
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.pieceRadius, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(
                x - 5, y - 5, 2,
                x, y, this.pieceRadius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            gradient.addColorStop(1, `rgba(240, 240, 240, ${alpha})`);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            this.ctx.stroke();

            // 绘制棋子文字
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillStyle = piece.color === 'red' ? 
                `rgba(255, 0, 0, ${alpha})` : 
                `rgba(0, 0, 0, ${alpha})`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(piece.type, x, y);
        });
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const gridX = Math.round((x - this.offsetX) / this.gridSize);
        const gridY = Math.round((y - this.offsetY) / this.gridSize);
        const clickedPiece = this.pieces.find(p => p.x === gridX && p.y === gridY);

        // 如果是严格模式
        if (this.version === 'strict') {
            if (this.touchedPiece) {
                if (this.isValidMove(this.touchedPiece, gridX, gridY)) {
                    this.makeMove(this.touchedPiece, gridX, gridY);
                }
                this.touchedPiece = null;
                return;
            }

            if (clickedPiece && clickedPiece.color === this.currentPlayer) {
                this.touchedPiece = clickedPiece;
                this.selected = clickedPiece;
                this.possibleMoves = this.calculatePossibleMoves(clickedPiece);
            }
        } else {
            // 其他模式的处理逻辑
            if (this.selected) {
                if (clickedPiece && clickedPiece.color === this.currentPlayer) {
                    // 如果点击了同色的其他棋子，更新选中的棋子
                    this.playSound('select');
                    this.selected = clickedPiece;
                    this.blinkingPiece = clickedPiece;
                    this.startBlinking();
                    this.possibleMoves = this.calculatePossibleMoves(clickedPiece);
                } else {
                    // 尝试移动棋子
                    if (this.isValidMove(this.selected, gridX, gridY)) {
                        const fromX = this.selected.x;
                        const fromY = this.selected.y;
                        
                        if (clickedPiece) {
                            this.playSound('capture');
                            this.pieces = this.pieces.filter(p => p !== clickedPiece);
                        } else {
                            this.playSound('move');
                        }
                        
                        this.selected.x = gridX;
                        this.selected.y = gridY;
                        
                        // 记录移动
                        this.addMoveRecord(this.selected, fromX, fromY, gridX, gridY);
                        
                        // 切换玩家
                        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
                        if (this.currentPlayer === 'red') {
                            this.moveCount++;
                        }
                        
                        this.updateStatusBar();
                        
                        // 检查游戏是否结束
                        if (this.checkGameOver()) {
                            this.selected = null;
                            this.stopBlinking();
                            return;
                        }

                        // AI移动
                        if (this.version === 'pro' && this.currentPlayer === 'black') {
                            setTimeout(() => this.makeAIMove(), 500);
                        }
                    }
                    this.selected = null;
                    this.stopBlinking();
                }
            } else if (clickedPiece && clickedPiece.color === this.currentPlayer) {
                this.playSound('select');
                this.selected = clickedPiece;
                this.blinkingPiece = clickedPiece;
                this.startBlinking();
                this.possibleMoves = this.calculatePossibleMoves(clickedPiece);
            }
        }

        // 重绘棋盘
        this.drawBoard();
        this.drawPossibleMoves();
        this.drawPieces();

        // 如果有选中的棋子，绘制选中效果
        if (this.selected) {
            const x = this.offsetX + this.selected.x * this.gridSize;
            const y = this.offsetY + this.selected.y * this.gridSize;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.pieceRadius + 2, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.stroke();
        }
    }

    setupVersionControl() {
        const versionSelect = document.getElementById('versionSelect');
        const gameInfo = document.getElementById('gameInfo');
        
        versionSelect.addEventListener('change', () => {
            this.version = versionSelect.value;
            gameInfo.textContent = `当前版本：${this.getVersionName()}`;
            
            if (this.version === '3d') {
                // 如果选择3D版本，创建新的3D画布
                if (!document.getElementById('chessboard3d')) {
                    const canvas3d = document.createElement('canvas');
                    canvas3d.id = 'chessboard3d';
                    canvas3d.width = 700;
                    canvas3d.height = 800;
                    this.canvas.parentNode.insertBefore(canvas3d, this.canvas);
                }
            }
            
            this.updateGameFeatures();
            this.resetGame();
        });
    }

    getVersionName() {
        const versionNames = {
            'simple': '简单版',
            'standard': '标准版',
            'advanced': '高级版',
            'pro': '专业版',
            'master': '大师版',
            'traditional': '传统版',
            'strict': '严格版',
            'enhanced': '加强版',
            '3d': '3D立体版',
            'animated3d': '动画立体棋盘'
        };
        return versionNames[this.version] || '未知版本';
    }

    updateGameFeatures() {
        switch(this.version) {
            case 'simple':
                this.useFullRules = false;
                this.soundEnabled = false;
                this.showHints = false;
                break;
            case 'standard':
                this.useFullRules = true;
                this.soundEnabled = false;
                this.showHints = true;
                break;
            case 'advanced':
                this.useFullRules = true;
                this.soundEnabled = true;
                this.showHints = true;
                break;
            case 'pro':
                this.useFullRules = true;
                this.soundEnabled = true;
                this.showHints = true;
                this.enableAI = true;
                break;
            case 'master':
                this.useFullRules = true;
                this.soundEnabled = true;
                this.showHints = true;
                this.strictMode = true;
                break;
            case 'traditional':
                this.useFullRules = true;
                this.soundEnabled = true;
                this.showHints = true;
                break;
            case 'strict':
                this.useFullRules = true;
                this.soundEnabled = true;
                this.showHints = true;
                this.strictMode = true;
                break;
            case '3d':
                // 切换到3D版本
                this.canvas.style.display = 'none';
                let canvas3d = document.getElementById('chessboard3d');
                if (canvas3d) {
                    canvas3d.style.display = 'block';
                    if (!this.chess3d) {
                        this.chess3d = new ChineseChess3D();
                    }
                }
                break;
            case 'animated3d':
                // 切换到动画立体棋盘版本
                this.canvas.style.display = 'none';
                let canvas3d = document.getElementById('chessboard3d');
                if (canvas3d) {
                    canvas3d.style.display = 'block';
                    if (!this.chessboardAnimation) {
                        this.chessboardAnimation = new ChessboardAnimation();
                    }
                }
                break;
            default:
                // 切换回2D版本
                this.canvas.style.display = 'block';
                canvas3d = document.getElementById('chessboard3d');
                if (canvas3d) {
                    canvas3d.style.display = 'none';
                }
                break;
        }
        this.updateControls();
    }

    setupGameControls() {
        const resetButton = document.getElementById('resetGame');
        resetButton.addEventListener('click', () => {
            this.resetGame();
        });
    }

    updateStatusBar() {
        const currentPlayer = document.getElementById('currentPlayer');
        const moveCount = document.getElementById('moveCount');
        
        currentPlayer.textContent = `当前回合：${this.currentPlayer === 'red' ? '红方' : '黑方'}`;
        moveCount.textContent = `回合数：${this.moveCount}`;
    }

    updateControls() {
        const soundButton = document.getElementById('toggleSound');
        soundButton.style.display = this.version === 'simple' ? 'none' : 'inline-block';
        soundButton.textContent = `音效：${this.soundEnabled ? '开' : '关'}`;
    }

    handleMove(piece, targetX, targetY) {
        const targetPiece = this.pieces.find(p => p.x === targetX && p.y === targetY);
        
        if (targetPiece) {
            this.playSound('capture');
            this.pieces = this.pieces.filter(p => p !== targetPiece);
        } else {
            this.playSound('move');
        }
        
        piece.x = targetX;
        piece.y = targetY;
        
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        if (this.currentPlayer === 'red') {
            this.moveCount++;
        }
        
        this.updateStatusBar();
        
        if (this.version === 'pro' && this.currentPlayer === 'black') {
            // AI移动逻辑将在这里实现
            this.makeAIMove();
        }
    }

    makeAIMove() {
        if (this.version !== 'master') {
            // 使用简单的随机AI
            return this.makeSimpleAIMove();
        }

        // 使用智能AI
        setTimeout(() => {
            const move = this.findBestMove('black');
            if (move) {
                const { piece, targetX, targetY } = move;
                this.handleMove(piece, targetX, targetY);
            }
        }, 500);
    }

    findBestMove(color) {
        let bestScore = -Infinity;
        let bestMove = null;

        const pieces = this.pieces.filter(p => p.color === color);
        
        for (const piece of pieces) {
            for (let x = 0; x < 9; x++) {
                for (let y = 0; y < 10; y++) {
                    if (this.isValidMove(piece, x, y)) {
                        // 尝试移动
                        const originalX = piece.x;
                        const originalY = piece.y;
                        const targetPiece = this.pieces.find(p => p.x === x && p.y === y);
                        
                        piece.x = x;
                        piece.y = y;
                        if (targetPiece) {
                            this.pieces = this.pieces.filter(p => p !== targetPiece);
                        }

                        const score = this.evaluatePosition();

                        // 恢复位置
                        piece.x = originalX;
                        piece.y = originalY;
                        if (targetPiece) {
                            this.pieces.push(targetPiece);
                        }

                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = { piece, targetX: x, targetY: y };
                        }
                    }
                }
            }
        }

        return bestMove;
    }

    evaluatePosition() {
        const pieceValues = {
            '车': 100, '馬': 40, '相': 20, '仕': 20, '帅': 10000,
            '炮': 45, '兵': 10, '車': -100, '马': -40, '象': -20,
            '士': -20, '将': -10000, '砲': -45, '卒': -10
        };

        let score = 0;
        for (const piece of this.pieces) {
            score += pieceValues[piece.type] || 0;
            
            // 位置价值评估
            if (piece.type === '兵' || piece.type === '卒') {
                score += (piece.color === 'red' ? -piece.y : piece.y) * 2;
            }
        }

        return score;
    }

    setupSounds() {
        try {
            this.moveSound = document.getElementById('moveSound');
            this.captureSound = document.getElementById('captureSound');
            this.selectSound = document.getElementById('selectSound');
            this.gameOverSound = document.getElementById('gameOverSound');

            // 添加错误处理
            [this.moveSound, this.captureSound, this.selectSound, this.gameOverSound].forEach(sound => {
                if (sound) {
                    sound.addEventListener('error', (e) => {
                        console.warn(`Error loading sound: ${e.target.src}`);
                    });
                }
            });
        } catch (error) {
            console.warn('Error setting up sounds:', error);
        }
    }

    setupControls() {
        const soundButton = document.getElementById('toggleSound');
        soundButton.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            soundButton.textContent = `音效：${this.soundEnabled ? '开' : '关'}`;
        });
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            const sound = {
                'move': this.moveSound,
                'capture': this.captureSound,
                'select': this.selectSound,
                'gameOver': this.gameOverSound
            }[type];

            if (sound && sound.readyState >= 2) {
                sound.currentTime = 0;
                sound.play().catch(e => console.warn('Error playing sound:', e));
            }
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }

    calculatePossibleMoves(piece) {
        const moves = [];
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 10; y++) {
                if (this.isValidMove(piece, x, y)) {
                    moves.push({x, y});
                }
            }
        }
        return moves;
    }

    drawPossibleMoves() {
        this.possibleMoves.forEach(move => {
            const x = this.offsetX + move.x * this.gridSize;
            const y = this.offsetY + move.y * this.gridSize;
            
            // 绘制可移动位置的提示
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            this.ctx.fill();
            this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
            this.ctx.stroke();
        });
    }

    resetGame() {
        if (this.version === '3d') {
            if (this.chess3d) {
                this.chess3d.resetGame();
            }
        } else {
            // 原有的重置逻辑
            this.stopBlinking();
            this.pieces = this.initializePieces();
            this.selected = null;
            this.currentPlayer = 'red';
            this.moveCount = 1;
            this.moveHistory = [];
            this.possibleMoves = [];
            this.updateStatusBar();
            this.updateMoveList();
            this.drawBoard();
            this.drawPieces();
        }
    }

    enableFullRules() {
        // 启用完整规则时的设置
        this.useFullRules = true;
    }

    disableFullRules() {
        // 禁用完整规则时的设置
        this.useFullRules = false;
    }

    isValidMove(piece, targetX, targetY) {
        // 基本检查
        if (targetX < 0 || targetX > 8 || targetY < 0 || targetY > 9) {
            return false;
        }

        const targetPiece = this.pieces.find(p => p.x === targetX && p.y === targetY);
        if (targetPiece && targetPiece.color === piece.color) {
            return false;
        }

        // 如果是简单版本，允许任意移动
        if (this.version === 'simple') {
            return true;
        }

        // 标准版本使用完整的规则检查
        switch (piece.type) {
            case '车':
            case '車':
                return this.isValidRookMove(piece, targetX, targetY);
            case '马':
            case '馬':
                return this.isValidKnightMove(piece, targetX, targetY);
            case '相':
            case '象':
                return this.isValidBishopMove(piece, targetX, targetY);
            case '仕':
            case '士':
                return this.isValidAdvisorMove(piece, targetX, targetY);
            case '帅':
            case '将':
                return this.isValidKingMove(piece, targetX, targetY);
            case '炮':
            case '砲':
                return this.isValidCannonMove(piece, targetX, targetY);
            case '兵':
            case '卒':
                return this.isValidPawnMove(piece, targetX, targetY);
            default:
                return false;
        }
    }

    isValidRookMove(piece, targetX, targetY) {
        // 车只能直线移动
        if (piece.x !== targetX && piece.y !== targetY) {
            return false;
        }

        // 检查径上是否有其他棋子
        const minX = Math.min(piece.x, targetX);
        const maxX = Math.max(piece.x, targetX);
        const minY = Math.min(piece.y, targetY);
        const maxY = Math.max(piece.y, targetY);

        for (let i = minX + 1; i < maxX; i++) {
            if (this.pieces.some(p => p.x === i && p.y === piece.y)) {
                return false;
            }
        }

        for (let i = minY + 1; i < maxY; i++) {
            if (this.pieces.some(p => p.x === piece.x && p.y === i)) {
                return false;
            }
        }

        return true;
    }

    isValidKnightMove(piece, targetX, targetY) {
        const dx = Math.abs(targetX - piece.x);
        const dy = Math.abs(targetY - piece.y);
        
        // 马走"日"字
        if (!((dx === 1 && dy === 2) || (dx === 2 && dy === 1))) {
            return false;
        }

        // 检查马脚
        const footX = piece.x + (targetX - piece.x) / 2;
        const footY = piece.y + (targetY - piece.y) / 2;
        
        if (dx === 2) {
            return !this.pieces.some(p => p.x === footX && p.y === piece.y);
        } else {
            return !this.pieces.some(p => p.x === piece.x && p.y === footY);
        }
    }

    isValidCannonMove(piece, targetX, targetY) {
        // 炮只能直线移动
        if (piece.x !== targetX && piece.y !== targetY) {
            return false;
        }

        let piecesInPath = 0;
        const minX = Math.min(piece.x, targetX);
        const maxX = Math.max(piece.x, targetX);
        const minY = Math.min(piece.y, targetY);
        const maxY = Math.max(piece.y, targetY);

        // 计算路径上的棋子数
        for (let i = minX + 1; i < maxX; i++) {
            if (this.pieces.some(p => p.x === i && p.y === piece.y)) {
                piecesInPath++;
            }
        }

        for (let i = minY + 1; i < maxY; i++) {
            if (this.pieces.some(p => p.x === piece.x && p.y === i)) {
                piecesInPath++;
            }
        }

        const targetPiece = this.pieces.find(p => p.x === targetX && p.y === targetY);
        
        // 炮的移动规则：不吃子时不能翻山，吃子时必须翻一个子
        if (targetPiece) {
            return piecesInPath === 1;
        } else {
            return piecesInPath === 0;
        }
    }

    isValidPawnMove(piece, targetX, targetY) {
        const dx = Math.abs(targetX - piece.x);
        const dy = targetY - piece.y;

        if (piece.color === 'red') {
            // 红方兵
            if (piece.y > 4) {
                // 未过河，只能向前
                return dx === 0 && dy === -1;
            } else {
                // 过河后，可以左右或向前
                return (dx === 1 && dy === 0) || (dx === 0 && dy === -1);
            }
        } else {
            // 黑方卒
            if (piece.y < 5) {
                // 未过河，只能向前
                return dx === 0 && dy === 1;
            } else {
                // 过河后，可以左右或向前
                return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
            }
        }
    }

    isValidKingMove(piece, targetX, targetY) {
        const dx = Math.abs(targetX - piece.x);
        const dy = Math.abs(targetY - piece.y);

        // 将帅只能在九宫格内移动
        if (piece.color === 'red') {
            if (targetY < 7 || targetX < 3 || targetX > 5) {
                return false;
            }
        } else {
            if (targetY > 2 || targetX < 3 || targetX > 5) {
                return false;
            }
        }

        // 将帅只能上下左右移动一格
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    }

    isValidAdvisorMove(piece, targetX, targetY) {
        const dx = Math.abs(targetX - piece.x);
        const dy = Math.abs(targetY - piece.y);

        // 仕/士只能在九宫格内斜着走
        if (piece.color === 'red') {
            if (targetY < 7 || targetX < 3 || targetX > 5) {
                return false;
            }
        } else {
            if (targetY > 2 || targetX < 3 || targetX > 5) {
                return false;
            }
        }

        // 仕/士只能斜着走一格
        return dx === 1 && dy === 1;
    }

    isValidBishopMove(piece, targetX, targetY) {
        const dx = Math.abs(targetX - piece.x);
        const dy = Math.abs(targetY - piece.y);

        // 相/象不能过河
        if (piece.color === 'red' && targetY < 5) {
            return false;
        }
        if (piece.color === 'black' && targetY > 4) {
            return false;
        }

        // 相/象走田字
        if (dx !== 2 || dy !== 2) {
            return false;
        }

        // 查象心
        const centerX = piece.x + (targetX - piece.x) / 2;
        const centerY = piece.y + (targetY - piece.y) / 2;
        return !this.pieces.some(p => p.x === centerX && p.y === centerY);
    }

    // 添加走子记录
    addMoveRecord(piece, fromX, fromY, toX, toY) {
        const record = this.generateMoveText(piece, fromX, fromY, toX, toY);
        this.moveHistory.push(record);
        this.updateMoveList();
    }

    // 生成走子记录文本
    generateMoveText(piece, fromX, fromY, toX, toY) {
        const pieceNames = {
            '车': '车', '馬': '马', '相': '相', '仕': '仕', '帅': '帅',
            '炮': '炮', '兵': '兵', '車': '车', '马': '马', '象': '象',
            '士': '士', '将': '将', '砲': '炮', '卒': '卒'
        };

        const numbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const pieceName = pieceNames[piece.type];
        const color = piece.color === 'red' ? '红' : '黑';
        
        let text = `${color}${pieceName}`;
        
        if (piece.color === 'red') {
            text += `${numbers[fromX]}`;
            if (toY < fromY) {
                text += `进${numbers[fromY - toY]}`;
            } else if (toY > fromY) {
                text += `退${numbers[toY - fromY]}`;
            } else {
                text += `平${numbers[toX]}`;
            }
        } else {
            text += `${numbers[8-fromX]}`;
            if (toY > fromY) {
                text += `进${numbers[toY - fromY]}`;
            } else if (toY < fromY) {
                text += `退${numbers[fromY - toY]}`;
            } else {
                text += `平${numbers[8-toX]}`;
            }
        }

        return text;
    }

    // 更新走子记录显示
    updateMoveList() {
        this.moveList.innerHTML = this.moveHistory.map((move, index) => 
            `<div class="move-item">${index + 1}. ${move}</div>`
        ).join('');
        this.moveList.scrollTop = this.moveList.scrollHeight;
    }

    checkGameOver() {
        const redKing = this.pieces.find(p => p.type === '帅');
        const blackKing = this.pieces.find(p => p.type === '将');

        if (!redKing) {
            this.showGameOver('游戏结束', '红方帅被吃，黑方获胜！');
            return true;
        }
        if (!blackKing) {
            this.showGameOver('游戏结束', '黑方将被吃，红方获胜！');
            return true;
        }

        // 检是否被将军
        if (this.isCheck(this.currentPlayer)) {
            if (this.isCheckmate(this.currentPlayer)) {
                this.showGameOver(
                    '将军认输', 
                    `${this.currentPlayer === 'red' ? '红方' : '黑方'}被将军，无法脱困！\n` +
                    `${this.currentPlayer === 'red' ? '黑方' : '红方'}获胜！`
                );
                return true;
            }
        }

        return false;
    }

    showGameOver(title, message) {
        const modal = document.getElementById('gameOverModal');
        const messageElement = document.getElementById('gameOverMessage');
        messageElement.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
        modal.style.display = 'block';
        this.playSound('gameOver');
        this.stopBlinking(); // 停止所有闪烁效果
    }

    isCheck(color) {
        const king = this.pieces.find(p => p.type === (color === 'red' ? '帅' : '将'));
        return this.pieces.some(p => 
            p.color !== color && this.isValidMove(p, king.x, king.y)
        );
    }

    isCheckmate(color) {
        const pieces = this.pieces.filter(p => p.color === color);
        return !pieces.some(piece => {
            for (let x = 0; x < 9; x++) {
                for (let y = 0; y < 10; y++) {
                    if (this.isValidMove(piece, x, y)) {
                        // 尝试移动
                        const originalX = piece.x;
                        const originalY = piece.y;
                        const targetPiece = this.pieces.find(p => p.x === x && p.y === y);
                        
                        piece.x = x;
                        piece.y = y;
                        if (targetPiece) {
                            this.pieces = this.pieces.filter(p => p !== targetPiece);
                        }

                        const stillInCheck = this.isCheck(color);

                        // 恢复位置
                        piece.x = originalX;
                        piece.y = originalY;
                        if (targetPiece) {
                            this.pieces.push(targetPiece);
                        }

                        if (!stillInCheck) {
                            return true;
                        }
                    }
                }
            }
            return false;
        });
    }

    loadTraditionalBoardImage() {
        this.boardImage = new Image();
        this.boardImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='; // 这里放一个1x1的透明图片作为默认值
        
        // 加载实际的棋盘图片
        const realBoardImage = new Image();
        realBoardImage.onload = () => {
            this.boardImage = realBoardImage;
            if (this.version === 'traditional') {
                this.drawBoard();
                this.drawPieces();
            }
        };
        realBoardImage.src = 'https://raw.githubusercontent.com/your-username/chinese-chess/main/images/traditional-board.png'; // 这里需要替换为实际的图片URL
    }

    drawTraditionalBoard() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制木纹背景
        this.ctx.fillStyle = '#deb887';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 如果图片已加载，绘制棋盘图片
        if (this.boardImage.complete) {
            this.ctx.drawImage(this.boardImage, 0, 0, this.canvas.width, this.canvas.height);
        }

        // 绘制格子线条
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;

        // 绘制横线
        for (let i = 0; i < 10; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, this.offsetY + i * this.gridSize);
            this.ctx.lineTo(this.offsetX + 8 * this.gridSize, this.offsetY + i * this.gridSize);
            this.ctx.stroke();
        }

        // 绘制竖线
        for (let i = 0; i < 9; i++) {
            // 上半部分
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + i * this.gridSize, this.offsetY);
            this.ctx.lineTo(this.offsetX + i * this.gridSize, this.offsetY + 4 * this.gridSize);
            this.ctx.stroke();

            // 下半部分
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + i * this.gridSize, this.offsetY + 5 * this.gridSize);
            this.ctx.lineTo(this.offsetX + i * this.gridSize, this.offsetY + 9 * this.gridSize);
            this.ctx.stroke();
        }

        // 绘制九宫格斜线
        this.ctx.beginPath();
        // 上方九宫格
        this.ctx.moveTo(this.offsetX + 3 * this.gridSize, this.offsetY);
        this.ctx.lineTo(this.offsetX + 5 * this.gridSize, this.offsetY + 2 * this.gridSize);
        this.ctx.moveTo(this.offsetX + 5 * this.gridSize, this.offsetY);
        this.ctx.lineTo(this.offsetX + 3 * this.gridSize, this.offsetY + 2 * this.gridSize);
        
        // 下方九宫格
        this.ctx.moveTo(this.offsetX + 3 * this.gridSize, this.offsetY + 7 * this.gridSize);
        this.ctx.lineTo(this.offsetX + 5 * this.gridSize, this.offsetY + 9 * this.gridSize);
        this.ctx.moveTo(this.offsetX + 5 * this.gridSize, this.offsetY + 7 * this.gridSize);
        this.ctx.lineTo(this.offsetX + 3 * this.gridSize, this.offsetY + 9 * this.gridSize);
        this.ctx.stroke();

        // 绘制楚河汉界
        this.ctx.font = 'bold 32px KaiTi, SimSun';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText('楚 河', this.offsetX + 1.5 * this.gridSize, this.offsetY + 4.7 * this.gridSize);
        this.ctx.fillText('漢 界', this.offsetX + 5.5 * this.gridSize, this.offsetY + 4.7 * this.gridSize);

        // 绘制兵卒位置标记
        this.drawPositionMarks();
    }

    drawPositionMarks() {
        const markSize = 10;
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;

        // 绘制位置标记的函数
        const drawMark = (x, y) => {
            // 左上
            this.ctx.beginPath();
            this.ctx.moveTo(x - markSize, y);
            this.ctx.lineTo(x - markSize, y - markSize);
            this.ctx.lineTo(x, y - markSize);
            this.ctx.stroke();

            // 右上
            this.ctx.beginPath();
            this.ctx.moveTo(x + markSize, y);
            this.ctx.lineTo(x + markSize, y - markSize);
            this.ctx.lineTo(x, y - markSize);
            this.ctx.stroke();

            // 左下
            this.ctx.beginPath();
            this.ctx.moveTo(x - markSize, y);
            this.ctx.lineTo(x - markSize, y + markSize);
            this.ctx.lineTo(x, y + markSize);
            this.ctx.stroke();

            // 右下
            this.ctx.beginPath();
            this.ctx.moveTo(x + markSize, y);
            this.ctx.lineTo(x + markSize, y + markSize);
            this.ctx.lineTo(x, y + markSize);
            this.ctx.stroke();
        };

        // 绘制炮位置
        [1, 7].forEach(x => {
            [2, 7].forEach(y => {
                const posX = this.offsetX + x * this.gridSize;
                const posY = this.offsetY + y * this.gridSize;
                drawMark(posX, posY);
            });
        });

        // 绘制兵卒位置
        [0, 2, 4, 6, 8].forEach(x => {
            [3, 6].forEach(y => {
                const posX = this.offsetX + x * this.gridSize;
                const posY = this.offsetY + y * this.gridSize;
                drawMark(posX, posY);
            });
        });
    }

    startBlinking() {
        if (this.blinkingInterval) {
            clearInterval(this.blinkingInterval);
        }
        this.blinkingInterval = setInterval(() => {
            this.blinkingAlpha += this.blinkingDirection * 0.1;
            if (this.blinkingAlpha <= 0.3) {
                this.blinkingDirection = 1;
            } else if (this.blinkingAlpha >= 1) {
                this.blinkingDirection = -1;
            }
            this.drawBoard();
            this.drawPossibleMoves();
            this.drawPieces();
        }, 50);
    }

    stopBlinking() {
        if (this.blinkingInterval) {
            clearInterval(this.blinkingInterval);
            this.blinkingInterval = null;
        }
        this.blinkingPiece = null;
        this.blinkingAlpha = 1;
    }

    makeMove(piece, targetX, targetY) {
        const originalX = piece.x;
        const originalY = piece.y;
        const targetPiece = this.pieces.find(p => p.x === targetX && p.y === targetY);

        // 记录移动前的状态
        const moveRecord = {
            piece: piece,
            fromX: originalX,
            fromY: originalY,
            toX: targetX,
            toY: targetY,
            capturedPiece: targetPiece
        };

        // 执行移动
        if (targetPiece) {
            this.pieces = this.pieces.filter(p => p !== targetPiece);
            this.playSound('capture');
        } else {
            this.playSound('move');
        }

        piece.x = targetX;
        piece.y = targetY;

        // 检查是否违反规则
        if (this.isIllegalMove(moveRecord)) {
            // 恢复移动前的状态
            piece.x = originalX;
            piece.y = originalY;
            if (targetPiece) {
                this.pieces.push(targetPiece);
            }
            return false;
        }

        // 记录移动
        this.moveHistory.push(moveRecord);
        this.lastMove = moveRecord;
        this.updateRepeatedMoves(moveRecord);

        // 更新游戏状态
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        this.selected = null;
        this.possibleMoves = [];

        // 检查游戏��束条件
        this.checkGameOver();

        return true;
    }

    isIllegalMove(moveRecord) {
        // 检查长将
        if (this.isLongJiang(moveRecord)) {
            this.showWarning('禁止长将！');
            return true;
        }

        // 检查长捉
        if (this.isLongZhuo(moveRecord)) {
            this.showWarning('禁止长捉！');
            return true;
        }

        // 检查将帅对面
        if (this.isKingsDirectlyFacing()) {
            this.showWarning('将帅不能直接对面！');
            return true;
        }

        return false;
    }

    isLongJiang(moveRecord) {
        // 检查最近6步是否存在相同的将军局面
        const recentMoves = this.moveHistory.slice(-6);
        let jiangCount = 0;
        
        for (const move of recentMoves) {
            if (this.isCheck(this.getOppositeColor(move.piece.color))) {
                jiangCount++;
            }
        }

        return jiangCount >= 3;
    }

    isLongZhuo(moveRecord) {
        // 检查最近6步是否存在相同的捉子局面
        const key = this.getBoardStateKey();
        const count = this.repeatedMoves.get(key) || 0;
        return count >= 3;
    }

    isKingsDirectlyFacing() {
        const redKing = this.pieces.find(p => p.type === '帅');
        const blackKing = this.pieces.find(p => p.type === '将');

        if (redKing && blackKing && redKing.x === blackKing.x) {
            // 检查两个将之间是否有其他棋子
            const minY = Math.min(redKing.y, blackKing.y);
            const maxY = Math.max(redKing.y, blackKing.y);
            
            for (let y = minY + 1; y < maxY; y++) {
                if (this.pieces.some(p => p.x === redKing.x && p.y === y)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    showWarning(message) {
        // 显示警告信息
        const modal = document.getElementById('gameOverModal');
        const messageElement = document.getElementById('gameOverMessage');
        messageElement.innerHTML = `<h3>警告</h3><p>${message}</p>`;
        modal.style.display = 'block';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 2000);
    }

    getBoardStateKey() {
        // 生成当前棋盘状态的唯一键
        return this.pieces.map(p => `${p.type}${p.color}${p.x}${p.y}`).sort().join('|');
    }

    updateRepeatedMoves(moveRecord) {
        const key = this.getBoardStateKey();
        this.repeatedMoves.set(key, (this.repeatedMoves.get(key) || 0) + 1);
    }

    setupEnhancedFeatures() {
        if (this.version === 'enhanced') {
            this.setupAIControls();
            this.setupGameControls();
            this.setupTutorial();
            this.loadSavedGames();
        }
    }

    setupAIControls() {
        const aiSelect = document.getElementById('aiLevel');
        aiSelect.addEventListener('change', (e) => {
            this.aiLevel = e.target.value;
            this.updateAIBehavior();
        });
    }

    updateAIBehavior() {
        switch(this.aiLevel) {
            case 'easy':
                this.aiSearchDepth = 1;
                break;
            case 'medium':
                this.aiSearchDepth = 2;
                break;
            case 'hard':
                this.aiSearchDepth = 3;
                break;
            case 'expert':
                this.aiSearchDepth = 4;
                break;
        }
    }

    // 存档功能
    saveGame() {
        const gameState = {
            pieces: this.pieces,
            currentPlayer: this.currentPlayer,
            moveHistory: this.moveHistory,
            version: this.version,
            timestamp: new Date().toISOString()
        };
        
        const saves = JSON.parse(localStorage.getItem('chessGames') || '[]');
        saves.push(gameState);
        localStorage.setItem('chessGames', JSON.stringify(saves));
        
        this.showMessage('游戏已保存');
    }

    // 加载存档
    loadGame(saveData) {
        this.pieces = saveData.pieces;
        this.currentPlayer = saveData.currentPlayer;
        this.moveHistory = saveData.moveHistory;
        this.version = saveData.version;
        
        this.drawBoard();
        this.drawPieces();
        this.updateMoveList();
    }

    // 悔棋功能
    undoMove() {
        if (this.moveHistory.length === 0) return;
        
        const lastMove = this.moveHistory.pop();
        const piece = lastMove.piece;
        
        // 恢复位置
        piece.x = lastMove.fromX;
        piece.y = lastMove.fromY;
        
        // 恢复被吃的棋子
        if (lastMove.capturedPiece) {
            this.pieces.push(lastMove.capturedPiece);
        }
        
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        this.drawBoard();
        this.drawPieces();
        this.updateMoveList();
    }

    // 教程系统
    setupTutorial() {
        const tutorials = {
            basic: {
                title: '基础规则',
                content: '象棋基本规则说明...'
            },
            pieces: {
                title: '棋子走法',
                content: '详细的子走法说明...'
            },
            strategy: {
                title: '基本战术',
                content: '象棋战术入门...'
            }
        };

        const tutorialContent = document.querySelector('.tutorial-content');
        Object.entries(tutorials).forEach(([key, tutorial]) => {
            const section = document.createElement('div');
            section.innerHTML = `
                <h3>${tutorial.title}</h3>
                <p>${tutorial.content}</p>
            `;
            tutorialContent.appendChild(section);
        });
    }

    // 增强的 AI 系统
    makeEnhancedAIMove() {
        const move = this.findBestMoveWithDepth(this.currentPlayer, this.aiSearchDepth);
        if (move) {
            this.makeMove(move.piece, move.targetX, move.targetY);
        }
    }

    findBestMoveWithDepth(color, depth) {
        if (depth === 0) {
            return this.evaluatePosition();
        }

        let bestScore = color === 'black' ? -Infinity : Infinity;
        let bestMove = null;

        const pieces = this.pieces.filter(p => p.color === color);
        
        for (const piece of pieces) {
            const moves = this.calculatePossibleMoves(piece);
            for (const move of moves) {
                // 尝试移动
                const originalState = this.saveBoardState();
                this.makeMove(piece, move.x, move.y);
                
                // 递归评估
                const score = this.findBestMoveWithDepth(
                    color === 'red' ? 'black' : 'red',
                    depth - 1
                );

                // 恢复状态
                this.restoreBoardState(originalState);

                // 更新最佳移动
                if (color === 'black' && score > bestScore) {
                    bestScore = score;
                    bestMove = { piece, targetX: move.x, targetY: move.y };
                } else if (color === 'red' && score < bestScore) {
                    bestScore = score;
                    bestMove = { piece, targetX: move.x, targetY: move.y };
                }
            }
        }

        return bestMove;
    }

    // 增强的局面评估
    evaluateEnhancedPosition() {
        let score = this.evaluateBasicPosition();
        
        // 加入位置价值评估
        score += this.evaluatePositionalValue();
        
        // 加入机动性评估
        score += this.evaluateMobility();
        
        // 加入制力评估
        score += this.evaluateControl();
        
        return score;
    }

    evaluatePositionalValue() {
        // 实现位置价值评估
        return 0;
    }

    evaluateMobility() {
        // 实现���动性评估
        return 0;
    }

    evaluateControl() {
        // 实现控制力评估
        return 0;
    }

    setupResetButton() {
        // 主界面的重新开始按钮
        const resetButton = document.getElementById('resetGame');
        resetButton.addEventListener('click', () => this.resetGame());

        // 游戏结束弹窗中的重新开始按钮
        const restartButton = document.getElementById('restartButton');
        restartButton.addEventListener('click', () => {
            this.resetGame();
            document.getElementById('gameOverModal').style.display = 'none';
        });
    }
}

// 初始化游戏
window.onload = () => {
    new ChineseChess();
}; 