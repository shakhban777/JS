let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

let x = canvas.width / 2;
let y = canvas.height - 30;

let speed = 2;
let dx = speed;
let dy = -speed;

const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
   bricks[c] = [];
   for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = {
         x: 0,
         y: 0,
         status: true
      }
   }
}

let score = 0;
let lives = 3;

function drawLives() {
   ctx.font = '16px Arial';
   ctx.fillStyle = '#0095DD';
   ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

function drawScore() {
   ctx.font = '16px Arial';
   ctx.fillStyle = '#0095DD';
   ctx.fillText('Score: ' + score, 8, 20);
}

function collisionDetection() {
   for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
         let b = bricks[c][r];
         if (b.status) {
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
               dy = -dy;
               b.status = false;
               score += 2;
               if (score === brickColumnCount * brickRowCount * 2) {
                  alert('YOU WIN, CONGRATULATIONS! YOUR SCORE: ' + score);
                  document.location.reload();
               }
            }
         }
      }
   }
}

function drawBricks() {
   for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
         if (bricks[c][r].status) {
            let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            let brickY = (r * (brickHeight + brickHeight)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = '#0095DD';
            ctx.fill();
            ctx.closePath();
         }
      }
   }
}

function drawBall() {
   ctx.beginPath();
   ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
   ctx.fillStyle = '#0095DD';
   ctx.fill();
   ctx.closePath();
}

function moveBall() {
   if (y + dy < ballRadius) {
      dy = -dy;
   } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
         dy = -dy;
      } else {
         lives--;
         if (!lives) {
            alert('GAME OVER! YOUR SCORE: ' + score);
            document.location.reload();
         } else {
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = speed;
            dy = -speed;
            paddleX = (canvas.width - paddleWidth) / 2;
         }
      }
   }

   if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
   }
}

function drawPaddle() {
   ctx.beginPath();
   ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
   ctx.fillStyle = '#0095DD';
   ctx.fill();
   ctx.closePath();
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
   if (e.key === 'ArrowRight') {
      rightPressed = true;
   } else if (e.key === 'ArrowLeft') {
      leftPressed = true;
   }
}

function keyUpHandler(e) {
   if (e.key === 'ArrowRight') {
      rightPressed = false;
   } else if (e.key === 'ArrowLeft') {
      leftPressed = false;
   }
}

function mouseMoveHandler(e) {
   let relativeX = e.clientX - canvas.offsetLeft;
   if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
   }
}

function movePaddle() {
   if (leftPressed && paddleX > 0) {
      paddleX -= 7;
   } else if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7
   }
}

function draw() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   drawBricks();
   drawBall();
   drawPaddle();
   drawScore();
   drawLives();
   collisionDetection();
   moveBall();
   movePaddle();
   x += dx;
   y += dy;
   requestAnimationFrame(draw);
}

draw();