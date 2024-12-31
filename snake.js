const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gridSize = 10;
let tileCountX, tileCountY;
let speed = 200; // 默认速度
let fastSpeed = 100; // 加速速度

function resizeCanvas() {
    const controlsHeight = document.querySelector('.controls').offsetHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - controlsHeight - 40;
    tileCountX = Math.floor(canvas.width / gridSize);
    tileCountY = Math.floor(canvas.height / gridSize);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let snake = [{ x: 10, y: 10 }];
let snakeSet = new Set(['10,10']);
let food = { x: 15, y: 15 };
let direction = { x: 1, y: 0 };
let score = 0;
let gameOver = false;

/**
 * 绘制游戏画面，包括蛇和食物。
 * 清除画布后，遍历蛇的每一节身体并绘制为绿色矩形，
 * 然后在指定位置绘制红色矩形表示食物。
 * @param {CanvasRenderingContext2D} ctx - 画布上下文对象
 * @param {Array<Object>} snake - 包含蛇身体坐标的数组
 * @param {Object} food - 包含食物坐标的对象
 * @param {number} gridSize - 每个格子的大小
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制边界
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    snake.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// ...existing code...
function update() {
    if (gameOver) return;

    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // 检查蛇是否撞到自己或墙壁
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY || snakeSet.has(`${head.x},${head.y}`)) {
        gameOver = true;
        return;
    }

    // 检查蛇是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score++;
        do {
            food = {
                x: Math.floor(Math.random() * (tileCountX - 2)) + 1,
                y: Math.floor(Math.random() * (tileCountY - 2)) + 1
            };
        } while (snakeSet.has(`${food.x},${food.y}`));
        snake.push({}); // 增加蛇的长度
    } else {
        const tail = snake.pop();
        snakeSet.delete(`${tail.x},${tail.y}`);
    }

    snake.unshift(head);
    snakeSet.add(`${head.x},${head.y}`);
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, speed); // 使用当前速度
    }
}

canvas.addEventListener('click', () => {
    if (gameOver) {
        snake = [{ x: 10, y: 10 }];
        snakeSet = new Set(['10,10']);
        direction = { x: 1, y: 0 };
        score = 0;
        gameOver = false;
        speed = 200; // 重置速度
        gameLoop();
    }
});

function setDirection(newDirection) {
    if (direction.x === 0 && newDirection.x !== 0) {
        direction = newDirection;
    } else if (direction.y === 0 && newDirection.y !== 0) {
        direction = newDirection;
    }
}

document.getElementById('up').addEventListener('mousedown', () => setDirection({ x: 0, y: -1 }));
document.getElementById('down').addEventListener('mousedown', () => setDirection({ x: 0, y: 1 }));
document.getElementById('left').addEventListener('mousedown', () => setDirection({ x: -1, y: 0 }));
document.getElementById('right').addEventListener('mousedown', () => setDirection({ x: 1, y: 0 }));

document.getElementById('speed-up').addEventListener('click', () => {
    speed = Math.max(10, speed - 10); // 最小速度为10ms
});
document.getElementById('speed-down').addEventListener('click', () => {
    speed += 10;
});

document.getElementById('revive').addEventListener('click', () => {
    if (gameOver && score > 4) {
        const initialLength = snake.length;
        snake = Array.from({ length: initialLength }, (_, i) => ({ x: 10 - i, y: 10 }));
        snakeSet = new Set(snake.map(segment => `${segment.x},${segment.y}`));
        direction = { x: 1, y: 0 };
        score = 0;
        gameOver = false;
        gameLoop();
    }
});

gameLoop();
