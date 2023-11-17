// game constants
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 300;
const DINO_SIZE = 100;
const OBSTACLE_SIZE = 40;
const GAME_SPEED = 5;
const DINO_JUMP = 120;
const JUMP_SPEED = 8;
const GRAVITY = 5;
const DINO_Y = 190;

// load images 
const Layer1Image = loadImage("Images/Ground.png");
const Layer2Image = loadImage("Images/Layer1.png");
const Layer3Image = loadImage("Images/Layer2.png");
const Layer4Image = loadImage("Images/Layer3.png");
const dinoImage = loadImage("Images/Dino.png");
const obstacleImage = loadImage("Images/Obstacle.png");

//game variables
let gameSpeed = GAME_SPEED;
let jump = false;
let fall = false;
let dinoY = DINO_Y;
let gameOver = true;
let score = 0;
let displayedText = "'Space' to jump!";

class GameObject {
    constructor(width, height, image) {
        this.width = width;
        this.height = height;
        this.image = image;
    }

    draw() {
        context.drawImage(this.image, this.x, this.y);
    }
}

class Environment extends GameObject {
    constructor(x, y, width, height, image) {
        super(width, height, image);
        this.x = x;
        this.y = y;
    }

    update(factor) {
        this.x -= gameSpeed * factor;
        if (this.x <= -CANVAS_WIDTH) {
            this.x = 0;
        }
    }

    draw() {
        context.drawImage(this.image, this.x, this.y);
        context.drawImage(this.image, this.x + CANVAS_WIDTH, this.y);
    }
}

class Dinosaur extends GameObject {
    constructor (size, image) {
        super(size, size, image);
        this.x = 20;
        this.y = dinoY;
    }

    jump() {
        if (fall) {
            this.y += GRAVITY;
            if (this.y > dinoY) {
                fall = false;
                jump = false;
            }
        } else {
            this.y -= JUMP_SPEED;
            if (this.y < dinoY - DINO_JUMP) {
                fall = true;
            }
        }
    }

    colides(object) {
        return this.x + 20 < object.x + object.width && this.x + this.width - 20 > object.x && this.y + this.height > object.y;
    }

    reset() {
        this.x = 20;
        this.y = DINO_Y;
    }
}

class Obstacle extends GameObject {
    constructor (size, image) {
        super(size, size, image);
        this.x = Math.round(Math.random() * 500 + CANVAS_WIDTH + OBSTACLE_SIZE);
        this.y = CANVAS_HEIGHT - OBSTACLE_SIZE - 5;
    }

    update() {
        this.x -= gameSpeed;
        if (this.x < -OBSTACLE_SIZE) {
            this.reset();
        }
    }

    reset() {
        this.x = Math.round(Math.random() * 500 + CANVAS_WIDTH + OBSTACLE_SIZE);
    }
}

let layer1 = new Environment(0, CANVAS_HEIGHT - 48, CANVAS_WIDTH, 48, Layer1Image);
let layer2 = new Environment(0, CANVAS_HEIGHT - 120, CANVAS_WIDTH, 100, Layer2Image);
let layer3 = new Environment(0, CANVAS_HEIGHT - 130, CANVAS_WIDTH, 120, Layer3Image);
let layer4 = new Environment(0, 30, CANVAS_WIDTH, 120, Layer4Image);
let dino = new Dinosaur(DINO_SIZE, dinoImage);
let obstacle = new Obstacle(OBSTACLE_SIZE, obstacleImage);

function loadImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

function drawSpalshScreen() {
    context.fillStyle = "#176e3e";
    context.beginPath();
    context.roundRect(100, 50, 300 , 150, [10]);
    context.stroke();
    context.fill();
    context.fillStyle = "#faa300";
    context.font = "24px Arial";
    context.fillText("Dinosaur runner", 160, 90);
    context.fillText(displayedText, 160, 130);
    context.fillText("Press 'S' to start the game!", 110, 170);
}

function drawBackgroundColor() {
    context.fillStyle = "#83c9e4";
    context.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fill();
}

function drawEnvironment() {
    layer4.draw();
    layer4.update(0.2);
    layer3.draw();
    layer3.update(0.6);
    layer2.draw();
    layer2.update(0.8);
    layer1.draw();
    layer1.update(1);
}

function drawScore() {
    context.fillStyle = "#faa300";
    context.font = "18px Arial";
    context.fillText("Score: " + score, 10, 20);
}

function drawGameState() {
    dino.draw();
    if (jump) {
        dino.jump();
    }
    obstacle.draw();
    obstacle.update();
    drawScore();
}

function resetGame() {
    gameOver = true;
    jump = false;
    fall = false;
    obstacle.reset();
    dino.reset();
    displayedText = "Score: " + score + " points.";
    score = 0;
}

function drawGame() { 
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawBackgroundColor();
    drawEnvironment();
    if (gameOver) {
        drawSpalshScreen();
    } else {
        if (dino.colides(obstacle)) {
            resetGame();
        }
        drawGameState();
    }
    requestAnimationFrame(drawGame);
}

addEventListener ('keydown', function(e) {
    if (e.code === 'Space') {
        jump = true;
    }
    if (e.code === 'KeyS') {
        gameOver = false;
    }
})

setInterval(() => {
    ++score;
}, 100);

drawGame();