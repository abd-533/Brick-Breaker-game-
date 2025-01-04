// script.js

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Paddle properties
const paddle = {
  width: 100,
  height: 10,
  x: canvas.width / 2 - 50,
  y: canvas.height - 30,
  dx: 7,
  color: "#00f",
};

// Ball properties
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  dx: 4,
  dy: -4,
  color: "#f00",
};

// Bricks properties
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 80;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 35;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, visible: true };
  }
}

// Game state
let score = 0;
let lives = 3;

// Draw paddle
function drawPaddle() {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

// Draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].visible) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.fillStyle = "#0f0";
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

// Draw score
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(`Score: ${score}`, 20, 20);
}

// Draw lives
function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 20);
}

// Move paddle
function movePaddle() {
  if (paddle.movingLeft && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
  if (paddle.movingRight && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.dx;
  }
}

// Move ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (left/right)
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }

  // Wall collision (top)
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y
  ) {
    ball.dy *= -1;
  }

  // Brick collision
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.visible) {
        if (
          ball.x > brick.x &&
          ball.x < brick.x + brickWidth &&
          ball.y > brick.y &&
          ball.y < brick.y + brickHeight
        ) {
          ball.dy *= -1;
          brick.visible = false;
          score += 10;

          // Win condition
          if (score === brickRowCount * brickColumnCount * 10) {
            alert("You Win!");
            document.location.reload();
          }
        }
      }
    }
  }

  // Bottom wall collision (lose life)
  if (ball.y + ball.radius > canvas.height) {
    lives--;
    if (lives === 0) {
      alert("Game Over!");
      document.location.reload();
    } else {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = 4;
      ball.dy = -4;
    }
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawBricks();
  drawScore();
  drawLives();
}

// Update game
function update() {
  movePaddle();
  moveBall();
  draw();

  requestAnimationFrame(update);
}

// Event listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") paddle.movingLeft = true;
  if (e.key === "ArrowRight") paddle.movingRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") paddle.movingLeft = false;
  if (e.key === "ArrowRight") paddle.movingRight = false;
});

// Start the game
update();