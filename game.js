class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.startButton = document.getElementById('startButton');
        this.scoreElement = document.getElementById('score');

        // Set actual canvas dimensions
        this.canvas.width = 400;
        this.canvas.height = 400;

        // Game settings
        this.gridSize = 20;
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.gameSpeed = 100;

        // Bind event handlers
        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame() {
        // Reset game state
        this.snake = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.generateFood();

        // Clear previous game loop if exists
        if (this.gameLoop) clearInterval(this.gameLoop);

        // Start game loop
        this.gameLoop = setInterval(() => this.update(), this.gameSpeed);
        this.startButton.textContent = 'Restart Game';
    }

    update() {
        this.direction = this.nextDirection;

        // Calculate new head position
        const head = { ...this.snake[0] };
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check for collisions
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check if snake ate food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.generateFood();
        } else {
            // Remove tail if no food was eaten
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        // Wall collision
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }

        // Self collision
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    generateFood() {
        while (true) {
            this.food = {
                x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
                y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
            };
            // Make sure food doesn't spawn on snake
            if (!this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y)) {
                break;
            }
        }
    }

    handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowUp':
                if (this.direction !== 'down') this.nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') this.nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') this.nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') this.nextDirection = 'right';
                break;
        }
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );
    }
}

// Initialize game when window loads
window.onload = () => {
    new SnakeGame();
};