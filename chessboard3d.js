class ChessboardAnimation {
    constructor() {
        this.canvas = document.getElementById('chessboard3d');
        this.ctx = this.canvas.getContext('2d');
        this.setupDimensions();
        this.setupLighting();
        this.initializeBoard();
        this.startAnimation();
    }

    setupDimensions() {
        // 棋盘尺寸和透视参数
        this.boardWidth = 700;
        this.boardHeight = 800;
        this.boardDepth = 40;  // 棋盘厚度
        this.perspective = 1000;
        this.rotation = { x: 15, y: 0, z: 0 };
        this.camera = { x: 0, y: 0, z: 500 };
        
        // 网格参数
        this.gridSize = {
            x: this.boardWidth / 9,
            y: this.boardHeight / 10,
            z: 5  // 网格凹陷深度
        };

        // 材质参数
        this.materials = {
            wood: {
                color: '#8b4513',
                specular: 0.7,
                roughness: 0.3,
                metalness: 0.1
            },
            grid: {
                color: '#000000',
                specular: 0.2,
                roughness: 0.8,
                metalness: 0
            }
        };
    }

    setupLighting() {
        // 光源设置
        this.lights = [
            {
                position: { x: -500, y: -500, z: 1000 },
                color: '#ffffff',
                intensity: 0.8
            },
            {
                position: { x: 500, y: 500, z: 800 },
                color: '#ffeecc',
                intensity: 0.6
            },
            {
                position: { x: 0, y: 0, z: 1000 },
                color: '#ffffff',
                intensity: 0.4
            }
        ];

        // 环境光
        this.ambientLight = {
            color: '#ffffff',
            intensity: 0.2
        };
    }

    initializeBoard() {
        // 创建棋盘顶面的顶点数据
        this.boardVertices = [];
        for (let i = 0; i <= 9; i++) {
            for (let j = 0; j <= 8; j++) {
                this.boardVertices.push({
                    x: j * this.gridSize.x - this.boardWidth / 2,
                    y: i * this.gridSize.y - this.boardHeight / 2,
                    z: 0,
                    normal: { x: 0, y: 0, z: 1 }
                });
            }
        }

        // 创建网格线的凹槽数据
        this.gridLines = {
            horizontal: [],
            vertical: []
        };

        // 水平线
        for (let i = 0; i < 10; i++) {
            this.gridLines.horizontal.push({
                start: { x: -this.boardWidth/2, y: i * this.gridSize.y - this.boardHeight/2, z: -this.gridSize.z },
                end: { x: this.boardWidth/2, y: i * this.gridSize.y - this.boardHeight/2, z: -this.gridSize.z },
                width: 2
            });
        }

        // 竖直线
        for (let i = 0; i < 9; i++) {
            // 上半部分
            this.gridLines.vertical.push({
                start: { x: i * this.gridSize.x - this.boardWidth/2, y: -this.boardHeight/2, z: -this.gridSize.z },
                end: { x: i * this.gridSize.x - this.boardWidth/2, y: -this.gridSize.y, z: -this.gridSize.z },
                width: 2
            });
            
            // 下半部分
            this.gridLines.vertical.push({
                start: { x: i * this.gridSize.x - this.boardWidth/2, y: this.gridSize.y, z: -this.gridSize.z },
                end: { x: i * this.gridSize.x - this.boardWidth/2, y: this.boardHeight/2, z: -this.gridSize.z },
                width: 2
            });
        }

        // 九宫格斜线
        this.palaceLines = [
            // 上方九宫格
            {
                start: { x: 3 * this.gridSize.x - this.boardWidth/2, y: -this.boardHeight/2, z: -this.gridSize.z },
                end: { x: 5 * this.gridSize.x - this.boardWidth/2, y: -this.boardHeight/2 + 2 * this.gridSize.y, z: -this.gridSize.z }
            },
            {
                start: { x: 5 * this.gridSize.x - this.boardWidth/2, y: -this.boardHeight/2, z: -this.gridSize.z },
                end: { x: 3 * this.gridSize.x - this.boardWidth/2, y: -this.boardHeight/2 + 2 * this.gridSize.y, z: -this.gridSize.z }
            },
            // 下方九宫格
            {
                start: { x: 3 * this.gridSize.x - this.boardWidth/2, y: this.boardHeight/2 - 2 * this.gridSize.y, z: -this.gridSize.z },
                end: { x: 5 * this.gridSize.x - this.boardWidth/2, y: this.boardHeight/2, z: -this.gridSize.z }
            },
            {
                start: { x: 5 * this.gridSize.x - this.boardWidth/2, y: this.boardHeight/2 - 2 * this.gridSize.y, z: -this.gridSize.z },
                end: { x: 3 * this.gridSize.x - this.boardWidth/2, y: this.boardHeight/2, z: -this.gridSize.z }
            }
        ];
    }

    startAnimation() {
        const animate = () => {
            // 清空画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 更新旋转角度
            this.rotation.y += 0.001;
            
            // 渲染棋盘
            this.renderBoard();
            
            // 继续动画循环
            requestAnimationFrame(animate);
        };

        animate();
    }

    renderBoard() {
        // 应用透视变换
        this.ctx.save();
        this.applyPerspective();

        // 渲染棋盘底面
        this.renderBoardBase();

        // 渲染网格线
        this.renderGridLines();

        // 渲染九宫格
        this.renderPalace();

        // 渲染楚河汉界
        this.renderRiver();

        this.ctx.restore();
    }

    applyPerspective() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.rotation.z);
        this.ctx.scale(
            Math.cos(this.rotation.x),
            Math.cos(this.rotation.y)
        );
        
        // 应用3D透视效果
        const scale = this.perspective / (this.perspective - this.camera.z);
        this.ctx.scale(scale, scale);
    }

    renderBoardBase() {
        // 创建木纹效果
        const gradient = this.ctx.createLinearGradient(
            -this.boardWidth/2, -this.boardHeight/2,
            this.boardWidth/2, this.boardHeight/2
        );
        
        gradient.addColorStop(0, '#8b4513');
        gradient.addColorStop(0.3, '#a0522d');
        gradient.addColorStop(0.7, '#8b4513');
        gradient.addColorStop(1, '#6b3010');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(
            -this.boardWidth/2 - 20,
            -this.boardHeight/2 - 20,
            this.boardWidth + 40,
            this.boardHeight + 40
        );

        // 添加边框阴影效果
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowOffsetX = 10;
        this.ctx.shadowOffsetY = 10;
        
        this.ctx.strokeStyle = '#4a2410';
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(
            -this.boardWidth/2 - 20,
            -this.boardHeight/2 - 20,
            this.boardWidth + 40,
            this.boardHeight + 40
        );
    }

    renderGridLines() {
        // 绘制3D网格线
        this.ctx.lineWidth = 2;
        
        // 添加网格线的3D深度效果
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 9; j++) {
                // 绘制凹槽效果
                const x = this.offsetX + j * this.gridSize.x;
                const y = this.offsetY + i * this.gridSize.y;
                
                // 创建网格线的渐变阴影
                const gradient = this.ctx.createLinearGradient(
                    x - 2, y - 2,
                    x + 2, y + 2
                );
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
                gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x - 2, y - 2, 4, 4);
            }
        }
    }

    renderRiver() {
        // 绘制楚河汉界的3D效果
        const riverY = this.offsetY + 4 * this.gridSize.y;
        const riverHeight = this.gridSize.y;
        
        // 创建水面效果
        const riverPattern = this.ctx.createLinearGradient(
            this.offsetX,
            riverY,
            this.offsetX,
            riverY + riverHeight
        );
        riverPattern.addColorStop(0, 'rgba(135, 206, 235, 0.2)');
        riverPattern.addColorStop(0.5, 'rgba(135, 206, 235, 0.4)');
        riverPattern.addColorStop(1, 'rgba(135, 206, 235, 0.2)');
        
        this.ctx.fillStyle = riverPattern;
        this.ctx.fillRect(
            this.offsetX + this.gridSize.x,
            riverY,
            6 * this.gridSize.x,
            riverHeight
        );

        // 添加波纹动画效果
        const time = Date.now() * 0.001;
        for (let i = 0; i < 6; i++) {
            const waveY = riverY + Math.sin(time + i) * 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + (i + 1) * this.gridSize.x, waveY);
            this.ctx.lineTo(this.offsetX + (i + 2) * this.gridSize.x, waveY);
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.stroke();
        }
    }

    renderPalaceDecoration() {
        // 绘制九宫格的装饰效果
        const palacePositions = [
            { x: 3, y: 0 }, { x: 5, y: 0 },
            { x: 4, y: 1 },
            { x: 3, y: 2 }, { x: 5, y: 2 },
            { x: 3, y: 7 }, { x: 5, y: 7 },
            { x: 4, y: 8 },
            { x: 3, y: 9 }, { x: 5, y: 9 }
        ];

        palacePositions.forEach(pos => {
            const x = this.offsetX + pos.x * this.gridSize.x;
            const y = this.offsetY + pos.y * this.gridSize.y;
            
            // 绘制装饰花纹
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(
                x, y, 0,
                x, y, 5
            );
            gradient.addColorStop(0, 'rgba(218, 165, 32, 0.8)');
            gradient.addColorStop(1, 'rgba(218, 165, 32, 0.2)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    }

    renderBoardEdge() {
        // 绘制棋盘边缘的3D效果
        const edgeWidth = 20;
        const edgeHeight = 10;
        
        // 绘制右侧边缘
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetX + 8 * this.gridSize.x, this.offsetY);
        this.ctx.lineTo(this.offsetX + 8 * this.gridSize.x + edgeWidth, this.offsetY + edgeHeight);
        this.ctx.lineTo(this.offsetX + 8 * this.gridSize.x + edgeWidth, this.offsetY + 9 * this.gridSize.y + edgeHeight);
        this.ctx.lineTo(this.offsetX + 8 * this.gridSize.x, this.offsetY + 9 * this.gridSize.y);
        
        const edgeGradient = this.ctx.createLinearGradient(
            this.offsetX + 8 * this.gridSize.x, this.offsetY,
            this.offsetX + 8 * this.gridSize.x + edgeWidth, this.offsetY + edgeHeight
        );
        edgeGradient.addColorStop(0, '#8b4513');
        edgeGradient.addColorStop(1, '#4a2410');
        
        this.ctx.fillStyle = edgeGradient;
        this.ctx.fill();
        
        // 绘制底部边缘
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetX, this.offsetY + 9 * this.gridSize.y);
        this.ctx.lineTo(this.offsetX + edgeWidth, this.offsetY + 9 * this.gridSize.y + edgeHeight);
        this.ctx.lineTo(this.offsetX + 8 * this.gridSize.x + edgeWidth, this.offsetY + 9 * this.gridSize.y + edgeHeight);
        this.ctx.lineTo(this.offsetX + 8 * this.gridSize.x, this.offsetY + 9 * this.gridSize.y);
        
        this.ctx.fillStyle = edgeGradient;
        this.ctx.fill();
    }

    addLightingEffect() {
        // 添加光照效果
        const lightX = this.canvas.width / 2;
        const lightY = -200;
        const lightZ = 500;
        
        this.ctx.save();
        
        // 创建全局光照
        const lightGradient = this.ctx.createRadialGradient(
            lightX, lightY, 0,
            lightX, lightY, Math.sqrt(this.canvas.width * this.canvas.width + this.canvas.height * this.canvas.height)
        );
        lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        lightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = lightGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.restore();
    }

    // ... 继续添加其他方法
} 