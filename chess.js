class ChineseChess {
    constructor() {
        this.canvas = document.getElementById('chessboard');
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

        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.drawBoard();
        this.drawPieces();
        this.loadTraditionalBoardImage();
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

        // 绘制横线和竖线
        for (let i = 0; i < 10; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, this.offsetY + i * this.gridSize);
            this.ctx.lineTo(this.offsetX + 8 * this.gridSize, this.offsetY + i * this.gridSize);
            this.ctx.stroke();
        }

        for (let i = 0; i < 9; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + i * this.gridSize, this.offsetY);
            this.ctx.lineTo(this.offsetX + i * this.gridSize, this.offsetY + 9 * this.gridSize);
            this.ctx.stroke();
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
        this.ctx.fillStyle = '#ffedcc';
        this.ctx.fillRect(
            this.offsetX, 
            this.offsetY + 4 * this.gridSize, 
            8 * this.gridSize, 
            this.gridSize
        );
        
        // 重新绘制中间的竖线
        for (let i = 0; i < 9; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + i * this.gridSize, this.offsetY + 4 * this.gridSize);
            this.ctx.lineTo(this.offsetX + i * this.gridSize, this.offsetY + 5 * this.gridSize);
            this.ctx.stroke();
        }

        this.ctx.font = '30px Arial';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText('楚 河', this.offsetX + 1.5 * this.gridSize, this.offsetY + 4.7 * this.gridSize);
        this.ctx.fillText('漢 界', this.offsetX + 5.5 * this.gridSize, this.offsetY + 4.7 * this.gridSize);
    }

    drawPieces() {
        this.pieces.forEach(piece => {
            const x = this.offsetX + piece.x * this.gridSize;
            const y = this.offsetY + piece.y * this.gridSize;

            // 绘制棋子阴影
            this.ctx.beginPath();
            this.ctx.arc(x + 2, y + 2, this.pieceRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.fill();

            // 绘制棋子背景
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.pieceRadius, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(
                x - 5, y - 5, 2,
                x, y, this.pieceRadius
            );
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(1, '#f0f0f0');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            this.ctx.strokeStyle = '#000';
            this.ctx.stroke();

            // 绘制棋子文字
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillStyle = piece.color;
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

        if (this.selected) {
            if (clickedPiece && clickedPiece.color === this.currentPlayer) {
                this.playSound('select');
                this.selected = clickedPiece;
                this.possibleMoves = this.calculatePossibleMoves(clickedPiece);
            } else {
                if (this.isValidMove(this.selected, gridX, gridY)) {
                    if (clickedPiece) {
                        this.playSound('capture');
                        this.pieces = this.pieces.filter(p => p !== clickedPiece);
                    } else {
                        this.playSound('move');
                    }
                    
                    this.selected.x = gridX;
                    this.selected.y = gridY;
                    this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
                }
                this.selected = null;
                this.possibleMoves = [];
            }
        } else if (clickedPiece && clickedPiece.color === this.currentPlayer) {
            this.playSound('select');
            this.selected = clickedPiece;
            this.possibleMoves = this.calculatePossibleMoves(clickedPiece);
        }

        this.drawBoard();
        this.drawPossibleMoves();
        this.drawPieces();

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
            this.updateGameFeatures();
            this.resetGame();
        });
    }

    getVersionName() {
        const versionNames = {
            'simple': '简单版',
            'standard': '标准版',
            'advanced': '高级版',
            'pro': '专业版'
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
        this.moveSound = document.getElementById('moveSound');
        this.captureSound = document.getElementById('captureSound');
        this.selectSound = document.getElementById('selectSound');
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
        
        switch(type) {
            case 'move':
                this.moveSound.currentTime = 0;
                this.moveSound.play();
                break;
            case 'capture':
                this.captureSound.currentTime = 0;
                this.captureSound.play();
                break;
            case 'select':
                this.selectSound.currentTime = 0;
                this.selectSound.play();
                break;
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
        this.pieces = this.initializePieces();
        this.selected = null;
        this.currentPlayer = 'red';
        this.drawBoard();
        this.drawPieces();
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
                // 过���后，可以左右或向���
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

        // 检查象心
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
            this.showGameOver('黑方胜利！');
            return true;
        }
        if (!blackKing) {
            this.showGameOver('红方胜利！');
            return true;
        }

        // 检查是否被将军
        if (this.isCheck(this.currentPlayer)) {
            if (this.isCheckmate(this.currentPlayer)) {
                this.showGameOver(`${this.currentPlayer === 'red' ? '黑' : '红'}方胜利！`);
                return true;
            }
        }

        return false;
    }

    showGameOver(message) {
        const modal = document.getElementById('gameOverModal');
        const messageElement = document.getElementById('gameOverMessage');
        messageElement.textContent = message;
        modal.style.display = 'block';
        this.playSound('gameOver');
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
}

// 初始化游戏
window.onload = () => {
    new ChineseChess();
}; 