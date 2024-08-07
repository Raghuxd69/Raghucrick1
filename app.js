import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Firebase setup
import { app, database } from '../firebase-config.js';

// DOM elements
const roomCodeInput = document.getElementById('room-code');
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const gameArea = document.getElementById('gameArea');
const timerDiv = document.getElementById('timer');
const player1Div = document.getElementById('player1');
const player2Div = document.getElementById('player2');
const resultDiv = document.getElementById('result');
const runButtons = document.querySelectorAll('.runButton');

// Game variables
let currentPlayer = "Player 1";
let player1Score = 0;
let player2Score = 0;
let roomCode = '';
let gameStarted = false;

// Create Room
createRoomBtn.addEventListener('click', async () => {
    try {
        roomCode = generateRoomCode();
        const roomRef = ref(database, `rooms/${roomCode}`);

        await set(roomRef, {
            player1: null,
            player2: null,
            started: false
        });

        roomCodeInput.value = roomCode;
        alert(`Room created with code: ${roomCode}`);
    } catch (error) {
        console.error('Error creating room:', error);
        alert('Error creating room. Please try again.');
    }
});

// Join Room
joinRoomBtn.addEventListener('click', async () => {
    roomCode = roomCodeInput.value;
    const roomRef = ref(database, `rooms/${roomCode}`);

    try {
        const snapshot = await get(roomRef);
        if (snapshot.exists()) {
            const roomData = snapshot.val();
            if (!roomData.started) {
                const playerKey = roomData.player1 === null ? 'player1' : 'player2';
                await set(ref(database, `rooms/${roomCode}/${playerKey}`), 'active');
                gameArea.style.display = 'block';
                setupGame();
            } else {
                alert('Room is already started.');
            }
        } else {
            alert('Invalid room code.');
        }
    } catch (error) {
        console.error('Error joining room:', error);
        alert('Error joining room. Please try again.');
    }
});

// Setup game
function setupGame() {
    if (!gameStarted) {
        let countdown = 3;
        const countdownInterval = setInterval(() => {
            timerDiv.textContent = countdown;
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                timerDiv.textContent = "Go!";
                setTimeout(() => {
                    startGame();
                }, 1000);
            }
        }, 1000); // Update every second
    }
}

// Start game
function startGame() {
    gameStarted = true;
    resultDiv.textContent = `${currentPlayer}, it's your turn!`;
    runButtons.forEach(button => {
        button.addEventListener('click', () => {
            playRound(parseInt(button.dataset.run));
        });
    });
}

// Play round
function playRound(playerChoice) {
    const delivery = Math.floor(Math.random() * 6) + 1;

    if (playerChoice === delivery) {
        resultDiv.textContent = `${currentPlayer} is out!`;
        currentPlayer = currentPlayer === "Player 1" ? "Player 2" : "Player 1";
        // Disable buttons or end game logic here
    } else {
        if (currentPlayer === "Player 1") {
            player1Score += playerChoice;
            player1Div.textContent = `Player 1: ${player1Score}`;
        } else {
            player2Score += playerChoice;
            player2Div.textContent = `Player 2: ${player2Score}`;
        }
        resultDiv.textContent = `${currentPlayer} scored ${playerChoice} runs!`;
    }

    updateScores(player1Score, player2Score);
}

// Update scores in Firebase
function updateScores(player1Score, player2Score) {
    const roomRef = ref(database, `rooms/${roomCode}`);
    set(roomRef, {
        player1Score: player1Score,
        player2Score: player2Score
    }).catch(error => {
        console.error('Error updating scores:', error);
    });
}

// Generate a random room code
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}
