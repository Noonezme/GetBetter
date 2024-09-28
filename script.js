let score = 0;
const target = document.getElementById("target");
const scoreDisplay = document.getElementById("score");
const startGameBtn = document.getElementById("start-game-btn");
const gameArea = document.getElementById("game-area");
const scoreBoard = document.getElementById("score-board");

// Function to generate a random position for the target
function randomPosition() {
    const areaWidth = gameArea.clientWidth;
    const areaHeight = gameArea.clientHeight;

    const x = Math.random() * (areaWidth - 50); // Random X position
    const y = Math.random() * (areaHeight - 50); // Random Y position

    target.style.left = `${x}px`; // Set target X position
    target.style.top = `${y}px`; // Set target Y position
}

// Function to show the target
function showTarget() {
    target.style.display = "block"; // Show the target
    randomPosition(); // Position the target randomly
}

// Function to handle target click
target.addEventListener("click", () => {
    score++; // Increase score
    scoreDisplay.textContent = score; // Update score display
    target.style.display = "none"; // Hide target
    setTimeout(showTarget, 1000); // Show target again after 1 second
});

// Start the game when the button is clicked
startGameBtn.addEventListener("click", () => {
    score = 0; // Reset score
    scoreDisplay.textContent = score; // Update score display
    gameArea.style.display = "block"; // Show the game area
    scoreBoard.style.display = "block"; // Show the score board
    showTarget(); // Start showing targets
});
