const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const player = {
  x: 50,
  y: 220,
  width: 40,
  height: 50,
  color: 'green',
  speed: 4,
  dy: 0,
  gravity: 0.8,
  jumpPower: -15,
  onGround: false
};

const coin = {
  x: 200,
  y: 230,
  radius: 10,
  color: 'gold'
};

let score = 0;

const keys = {
  left: false,
  right: false
};

function drawPlayer() {
  ctx.fillStyle = player.color;

  // Corpo (retângulo)
  ctx.fillRect(player.x, player.y + 10, player.width, player.height - 10);

  // Cabeça (círculo)
  ctx.beginPath();
  ctx.arc(player.x + player.width + 5, player.y + 15, 10, 0, Math.PI * 2);
  ctx.fill();

  // Cauda (triângulo)
  ctx.beginPath();
  ctx.moveTo(player.x, player.y + 30);
  ctx.lineTo(player.x - 15, player.y + 20);
  ctx.lineTo(player.x, player.y + 40);
  ctx.fill();

  // Patas (dois retângulos pequenos)
  ctx.fillRect(player.x + 5, player.y + player.height - 5, 8, 10);
  ctx.fillRect(player.x + player.width - 15, player.y + player.height - 5, 8, 10);
}

function drawCoin() {
  ctx.fillStyle = coin.color;
  ctx.beginPath();
  ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function movePlayer() {
  // movimento horizontal
  if (keys.left) {
    player.x -= player.speed;
    if (player.x < 0) player.x = 0;
  }
  if (keys.right) {
    player.x += player.speed;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  }

  // gravidade e pulo
  player.dy += player.gravity;
  player.y += player.dy;

  // chão
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }
}

function checkCollision() {
  const distX = player.x + player.width / 2 - coin.x;
  const distY = player.y + player.height / 2 - coin.y;
  const distance = Math.sqrt(distX * distX + distY * distY);

  if (distance < coin.radius + Math.min(player.width, player.height) / 2) {
    score++;
    scoreEl.textContent = 'Pontos: ' + score;
    moveCoin();
  }
}

function moveCoin() {
  coin.x = Math.random() * (canvas.width - coin.radius * 2) + coin.radius;
  coin.y = Math.random() * (canvas.height - coin.radius * 2 - 30) + coin.radius + 30;
}

function gameLoop() {
  clear();
  movePlayer();
  drawPlayer();
  drawCoin();
  checkCollision();

  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') keys.left = true;
  if (e.code === 'ArrowRight') keys.right = true;
  if (e.code === 'Space' && player.onGround) {
    player.dy = player.jumpPower;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') keys.left = false;
  if (e.code === 'ArrowRight') keys.right = false;
});

gameLoop();
