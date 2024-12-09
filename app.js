const board = document.querySelector('#board');
const squaresNumber = 110;
const startGameButton = document.getElementById('start-game');
const gameForm = document.getElementById('game-form');
const scoresElement = document.getElementById('scores');
const timerElement = document.getElementById('timer');
const gameResultsTable = document.getElementById('game-results');

let difficulty;
let gameInterval;
let score = 0;
let activeSquares = 0;
let maxActiveSquares = 20;
let timeMultiplier = 1;

scoresElement.style.display = 'none';
timerElement.style.display = 'none';

function createBoard() {
  for (let i = 0; i < squaresNumber; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.id = `square-${i}`;
    square.addEventListener('click', () => handleSquareClick(square));
    board.appendChild(square);
  }
}

function generateRandomColor() {
  if (activeSquares >= maxActiveSquares) {
    endGame();
    return;
  }
  const randomSquareId = `square-${Math.floor(Math.random() * squaresNumber)}`;
  const randomSquare = document.getElementById(randomSquareId);
  if (!randomSquare.classList.contains('active')) {
    randomSquare.style.backgroundColor = getRandomColor();
    randomSquare.classList.add('active');
    activeSquares++;
  } else {
    generateRandomColor();
  }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function handleSquareClick(square) {
  if (square.classList.contains('active')) {
    square.classList.remove('active');
    square.style.backgroundColor = '';
    score++;
    activeSquares--;
    updateScore();
  }
}

function updateScore() {
  scoresElement.textContent = `Score: ${score * timeMultiplier}`;
}

function startGame() {
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  scoresElement.style.display = 'block';
  timerElement.style.display = 'block';

  scoresElement.textContent = 'Score: 0';
  timerElement.textContent = '00:00';

  score = 0;
  activeSquares = 0;
  updateScore();
  difficulty = document.querySelector('#difficulty-select').value;
  const time = document.querySelector('#time-select').value;
  let seconds = parseInt(time);
  let intervalTime = 1000;

  if (difficulty === 'medium') {
    intervalTime = 1000 / 1.5; 
    maxActiveSquares = 30;
    timeMultiplier = 2;
  } else if (difficulty === 'hard') {
    intervalTime = 1000 / 2; 
    maxActiveSquares = 40;
    timeMultiplier = 3;
  } else {
    timeMultiplier = 1;
  }

  const startTime = Date.now();
  gameInterval = setInterval(() => {
    const elapsedTime = (Date.now() - startTime) / 1000;
    const remainingTime = Math.floor(seconds - elapsedTime);
    if (remainingTime <= 0) {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      endGame(minutes, seconds);
      return;
    }
    generateRandomColor();
    updateTimer(remainingTime);
  }, intervalTime);

  board.querySelectorAll('.square').forEach(square => {
    square.classList.remove('active');
    square.style.backgroundColor = '';
  });
  updateTimer(seconds);
  gameResultsTable.style.display = 'none';
}

function endGame(minutes, seconds) {
  clearInterval(gameInterval);
  const time = document.querySelector('#time-select').value;
  const selectedTime = `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;
  const finalScore = score * timeMultiplier;
  alert(`Game Over! Your score: ${finalScore} (time: ${selectedTime})`);
  gameForm.style.display = 'block';
  const gameResult = {
    date: new Date().toLocaleString(),
    time: selectedTime,
    score: finalScore,
    difficulty: difficulty
  };
}



function updateTimer(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  timerElement.textContent = `${minutes}:${remainingSeconds}`;
}

startGameButton.addEventListener('click', function (e) {
  e.preventDefault();
  startGame();
  gameForm.style.display = 'none';
  scoresElement.style.display = 'block';
});

document.getElementById('game-form').addEventListener('submit', function (e) {
  e.preventDefault();
  startGame();
});

createBoard();