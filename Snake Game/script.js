seconds=0;
const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
console.log(canvas);
const ROWS = 25;
const COLS = 40;
let direction = 'ArrowRight';
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;

// Initialize score displays on load
document.querySelector('.high-score-value').textContent = highScore;
document.querySelector('.score-value').textContent = score;
let snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
];
let food = {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS)
};

function resizeCanvas(){
    const container = document.querySelector(".Game-Canvas");
    const availableWidth = container.clientWidth;
    const availableHeight = container.clientHeight;
    const cellSize = Math.floor(
        Math.min(
            availableWidth / COLS,
            availableHeight / ROWS
        )
    );
    canvas.width = cellSize * COLS;
    canvas.height = cellSize * ROWS;
    drawGrid(cellSize);
    renderSnake(snake, cellSize);
    renderFood(food, cellSize);
}

function drawGrid(cellSize){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.53)";
    ctx.lineWidth = 0.5;
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            ctx.strokeRect(
                col * cellSize,
                row * cellSize,
                cellSize,
                cellSize
            );
        }
    }
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function second_to_time(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if(hours > 0) {
        return `${hours}-${minutes.toString().padStart(2, '0')}-${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}-${remainingSeconds.toString().padStart(2, '0')}`;
}



function renderSnake(snake, cellSize){
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * cellSize,
            segment.y * cellSize,
            cellSize,
            cellSize
        );
    });
}

function renderFood(food, cellSize){
    ctx.fillStyle = 'red';
    ctx.fillRect(
        food.x * cellSize,
        food.y * cellSize,
        cellSize,
        cellSize
    );
}

function check_food_collision(head, food){
    if(head.x === food.x && head.y === food.y){
        return true;
    }
    return false;
}

function check_self_collision(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function snake_movement(direction){
    const head = snake[0];
    let newHead;
    switch(direction){
        case 'ArrowUp':
            newHead = {x: head.x, y: head.y === 0 ? ROWS - 1 : head.y - 1};
            break;
        case 'ArrowDown':
            newHead = {x: head.x, y: head.y === ROWS - 1 ? 0 : head.y + 1};
            break;
        case 'ArrowLeft':
            newHead = {x: head.x === 0 ? COLS - 1 : head.x - 1, y: head.y};
            break;
        case 'ArrowRight':
            newHead = {x: head.x === COLS - 1 ? 0 : head.x + 1, y: head.y};
            break;
    }
    if(check_self_collision(newHead)){
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            document.querySelector('.high-score-value').textContent = highScore;
        }
        snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        direction = 'ArrowRight';
        score = 0;
        seconds = 0;
        document.querySelector('.score-value').textContent = score;
        document.querySelector('.time-value').textContent = "0-00";
        resizeCanvas();
        return;
    }

    snake.unshift(newHead);

    if(check_food_collision(newHead, food)){
        score+=10;
        document.querySelector('.score-value').textContent = score;
        food = {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS)
        };
    }
    else{
        snake.pop();
    }
    resizeCanvas();
}

setInterval(() => {
    seconds++;
    const timeElement = document.querySelector('.time-value');
    timeElement.textContent = second_to_time(seconds);
}, 1000);

const mover=setInterval(() => {
    snake_movement(direction);
}, 500);

document.addEventListener('keydown', (event) => {
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if(validKeys.includes(event.key)){
        direction = event.key;
        snake_movement(direction);
    }
});


resizeCanvas();
window.addEventListener('resize',resizeCanvas);