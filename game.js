var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = canvas.height - paddleHeight - 5;

var ballRadius = 8;
var x = canvas.width / 2;
var y = canvas.height - paddleHeight - ballRadius - 5;
var dx = 6;
var dy = -6;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 12;
var brickColumnCount = 11;
var brickWidth = 80;
var brickHeight = 20;
var brickPadding = 5;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, isVisible: 1 };
    }
}

var lives = 3;
var score = 0;
var gameStarted = false;
var gameWon = false;
var gameLose = false;
var bonusText = { text: "", x: 0, y: 0, alpha: 1, life: 60 };

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.isVisible == 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                if (r % 3 == 0) {
                    ctx.fillStyle = "#0095DD";
                } else {
                    ctx.fillStyle = "#6c25be";
                }
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Lives: " + lives, 80, 20);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("Score: " + score, canvas.width - 100, 20);
}

function drawStartText() {
    if (!gameStarted && !gameWon && !gameLose) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText(
            "PRESS SPACE TO START",
            canvas.width / 2,
            canvas.height / 2
        );
    }
}

function drawBonusText() {
    if (bonusText.alpha > 0) {
        bonusText.y -= 1;
        bonusText.alpha -= 0.01;
        bonusText.life--;
        ctx.globalAlpha = bonusText.alpha;
        ctx.font = "16px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText(bonusText.text, bonusText.x, bonusText.y);
        ctx.globalAlpha = 1;
    } else {
        bonusText.life = 60;
    }
}

function drawWinText() {
    if (score === brickRowCount * brickColumnCount) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN", canvas.width / 2, canvas.height / 2);
        ctx.fillText(
            "YOUR SCORE: " + score,
            canvas.width / 2,
            canvas.height / 2 + 40
        );
        ctx.fillText(
            "PRESS SPACE TO RESTART",
            canvas.width / 2,
            canvas.height / 2 + 80
        );
        gameStarted = false;
        gameWon = true;
    }
}

function drawLoseText() {
    if (lives === 0) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText("YOU LOSE", canvas.width / 2, canvas.height / 2);
        ctx.fillText(
            "YOUR SCORE: " + score,
            canvas.width / 2,
            canvas.height / 2 + 40
        );
        ctx.fillText(
            "PRESS SPACE TO RESTART",
            canvas.width / 2,
            canvas.height / 2 + 80
        );
        gameStarted = false;
        gameLose = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    drawLives();
    drawScore();
    drawBonusText();
    drawWinText();
    drawLoseText();
    drawStartText();

    if (gameStarted) {
        x += dx;
        y += dy;

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }

        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                if (lives === 0) {
                    drawLoseText();
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - paddleHeight - ballRadius - 5;
                    paddleX = (canvas.width - paddleWidth) / 2;
                    gameStarted = false;
                }
            }
        }

        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.isVisible == 1) {
                    if (
                        x > b.x &&
                        x < b.x + brickWidth &&
                        y > b.y &&
                        y < b.y + brickHeight
                    ) {
                        dy = -dy;
                        b.isVisible = 0;
                        score++;
                        bonusText = {
                            text: "+1",
                            x: b.x + brickWidth / 2,
                            y: b.y + brickHeight / 2,
                            alpha: 1,
                            life: 60
                        };
                    }
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
    }

    requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keypress", startGameHandler, false);
document.addEventListener("keypress", restartGameHandler, false);

function keyDownHandler(e) {
    if (e.key == "d" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "a" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "d" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "a" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function startGameHandler(e) {
    if (e.key === " ") {
        gameStarted = true;
    }
}

function restartGameHandler(e) {
    if (e.key === " " && (gameWon || lives === 0)) {
        document.location.reload();
    }
}

draw();
