const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
let emojiPairs = [...emojis, ...emojis];
let first = null;
let second = null;
let lock = false;
let matched = 0;
let level = 1;
let coins = 0;
let timer = 0;
let timerInterval;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function saveProgress() {
  localStorage.setItem("puzzleName", document.getElementById("playerName").textContent);
  localStorage.setItem("puzzleAvatar", document.getElementById("avatar").src);
  localStorage.setItem("puzzleLevel", level);
  localStorage.setItem("puzzleCoins", coins);
  localStorage.setItem("puzzleTime", timer);
}

function loadProgress() {
  const savedName = localStorage.getItem("puzzleName");
  const savedAvatar = localStorage.getItem("puzzleAvatar");
  const savedLevel = localStorage.getItem("puzzleLevel");
  const savedCoins = localStorage.getItem("puzzleCoins");
  const savedTime = localStorage.getItem("puzzleTime");

  if (savedName) document.getElementById("playerName").textContent = savedName;
  if (savedAvatar) document.getElementById("avatar").src = savedAvatar;
  if (savedLevel) level = parseInt(savedLevel);
  if (savedCoins) coins = parseInt(savedCoins);
  if (savedTime) timer = parseInt(savedTime);
}

function startGame() {
  document.getElementById("playerLevel").textContent = `Level ${level}`;
  document.getElementById("playerCoin").textContent = `💰 ${coins}`;
  document.getElementById("grid").innerHTML = "";
  const shuffled = shuffle([...emojiPairs]);
  shuffled.forEach((emoji, index) => {
    const div = document.createElement("div");
    div.className = "emoji";
    div.textContent = "❓";
    div.dataset.emoji = emoji;
    div.dataset.index = index;
    div.onclick = handleClick;
    document.getElementById("grid").appendChild(div);
  });
  startTimer();
}

function handleClick(e) {
  if (lock) return;
  const el = e.target;
  if (el.textContent !== "❓") return;

  el.textContent = el.dataset.emoji;
  if (!first) {
    first = el;
  } else if (!second && el !== first) {
    second = el;
    lock = true;
    setTimeout(() => {
      if (first.dataset.emoji === second.dataset.emoji) {
        matched++;
        first.style.visibility = "hidden";
        second.style.visibility = "hidden";
        coins += 10;
        saveProgress();
        if (matched === emojiPairs.length / 2) {
          level++;
          matched = 0;
          stopTimer();
          saveProgress();
          setTimeout(startGame, 1000);
        }
      } else {
        first.textContent = "❓";
        second.textContent = "❓";
      }
      first = null;
      second = null;
      lock = false;
      document.getElementById("playerCoin").textContent = `💰 ${coins}`;
    }, 600);
  }
}

function startTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timer++;
    updateTimerDisplay();
    saveProgress();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
  const seconds = String(timer % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `⏱️ ${minutes}:${seconds}`;
}

// Avatar upload
document.getElementById("avatarInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById("avatar").src = event.target.result;
      saveProgress();
    };
    reader.readAsDataURL(file);
  }
});

// Nama editable dan simpan otomatis
document.getElementById("playerName").addEventListener("input", saveProgress);

window.onload = () => {
  loadProgress();
  startGame();
};