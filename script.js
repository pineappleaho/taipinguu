const words = [
  "sushi", "maguro", "ebi", "salmon", "tamago", "ika", "unagi", "toro", "kani", "hamachi",
  "wasabi", "nori", "miso", "soy", "udon", "tempura", "ramen", "takoyaki", "yaki", "fugu"
];

const game = document.getElementById("game");
const input = document.getElementById("wordInput");
const scoreEl = document.getElementById("score");
const lifeEl = document.getElementById("life");
const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const difficultyBtns = document.querySelectorAll(".difficultyBtn");

let score = 0;
let life = 3;
let enemies = [];
let spawnInterval;
let enemySpeed = 1500; // 初期速度（Easy）

// スタート画面表示・非表示
function showStartScreen() {
  startScreen.style.display = "flex";
  game.style.display = "none";
  gameOverEl.style.display = "none";
}

function startGame(difficulty) {
  startScreen.style.display = "none";
  game.style.display = "block";
  
  switch (difficulty) {
    case "easy":
      enemySpeed = 2000; // Easy
      break;
    case "normal":
      enemySpeed = 1500; // Normal
      break;
    case "difficult":
      enemySpeed = 1000; // Difficult
      break;
    case "impossible":
      enemySpeed = 500;  // Impossible
      break;
  }

  spawnInterval = setInterval(spawnEnemy, enemySpeed);
}

function spawnEnemy() {
  const word = words[Math.floor(Math.random() * words.length)];
  const enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.textContent = word;

  const angle = Math.random() * 2 * Math.PI;
  const radius = 400;
  const x = window.innerWidth / 2 + Math.cos(angle) * radius;
  const y = window.innerHeight / 2 + Math.sin(angle) * radius;

  enemy.style.left = `${x}px`;
  enemy.style.top = `${y}px`;

  const duration = 8 - Math.min(score / 10, 5);
  enemy.style.animationDuration = `${duration}s`;

  game.appendChild(enemy);

  enemies.push({ element: enemy, word: word, hit: false });

  setTimeout(() => {
    if (!enemy.removed && !enemy.hit) {
      life--;
      updateLife();
      game.removeChild(enemy);
    }
  }, duration * 1000);
}

function updateScore() {
  scoreEl.textContent = score;
}

function updateLife() {
  lifeEl.textContent = life;
  if (life <= 0) {
    endGame();
  }
}

function endGame() {
  input.disabled = true;
  gameOverEl.style.display = "flex";
  finalScoreEl.textContent = score;
  clearInterval(spawnInterval);
}

function restartGame() {
  location.reload();  // ページをリロードしてゲームを最初から
}

input.addEventListener("input", () => {
  const value = normalize(input.value.trim());
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (!enemy.hit && normalize(enemy.word) === value) {
      enemy.hit = true;
      enemy.element.removed = true;
      game.removeChild(enemy.element);
      input.value = "";
      score++;
      updateScore();
      break;
    }
  }
});

restartBtn.addEventListener("click", restartGame);

// スタート画面で難易度選択
difficultyBtns.forEach(button => {
  button.addEventListener("click", () => {
    const difficulty = button.getAttribute("data-difficulty");
    startGame(difficulty);
  });
});

// 入力を正規化（ユーザー入力の柔軟な対応）
function normalize(str) {
  return str
    .replace(/ti/g, "chi")  // "ti" -> "chi"
    .replace(/si/g, "shi")  // "si" -> "shi"
    .replace(/tu/g, "tsu"); // "tu" -> "tsu"
}

// 初期起動
showStartScreen();
		