const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 600;
canvas.height = 600;

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;
let score;
let level;
let speed = 100; 
let game;
let isPaused = false;

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function() {
    // Draw the head of the snake as a circle
    ctx.fillStyle = "#32CD32"; 
    ctx.strokeStyle = "#000000"; 
    ctx.lineWidth = 3; 
    ctx.beginPath();
    ctx.arc(this.x + scale / 2, this.y + scale / 2, scale / 2, 0, 2 * Math.PI);
    ctx.fill(); // Fill the circle
    ctx.stroke();   
    // Draw the rest of the snake as rectangles (the body)
    ctx.fillStyle = "#32CD32";
    ctx.strokeStyle = "#000000"; 
    ctx.lineWidth = 6;
    for (let i = 0; i < this.tail.length; i++) {
        // Draw outline
        ctx.strokeRect(this.tail[i].x, this.tail[i].y, scale, scale);
        // Draw filled rectangle
        ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }

};



    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        if (this.total >= 1) {
            this.tail[this.total - 1] = { x: this.x, y: this.y };
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        this.checkCollision();
    };

    this.changeDirection = function(direction) {
        switch (direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            fruit.pickLocation();
            return true;
        }
        return false;
    };

    this.checkCollision = function() {
        // Check collision with the borders
        if ((this.x >= canvas.width || this.y >= canvas.height || this.x < 0 || this.y < 0)) {
            this.gameOver();
        }

            for (let i = 0; i < this.tail.length; i++) {
                if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                    this.gameOver();
                }
            }
        };

    this.gameOver = function() {
        clearInterval(game);
        alert("Game Over. Score: " + this.total + ". Press OK to restart.");
        document.location.reload();
    };
}

function Fruit() {
    this.pickLocation = function() {
        let validLocation = false;
        while (!validLocation) {
        this.x = (Math.floor(Math.random() * columns)) * scale;
        this.y = (Math.floor(Math.random() * rows)) * scale;

        let isOnSnake = false;
        if (this.x === snake.x && this.y === snake.y){
            isOnSnake = true;
        } else {
            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x === snake.tail[i].x && this.y === snake.tail[i].y) {
                    isOnSnake = true; // Fruit is on the snake's body
                    break;
        }
    }
}
if (!isOnSnake) {
    validLocation = true;
}}};

    this.draw = function() {
        ctx.fillStyle = "#4cafab";
        ctx.fillRect(this.x, this.y, scale, scale);
        ctx.strokeStyle = "#000000"; // Black color
        ctx.lineWidth = 3; // Adjust the width of the outline as needed
        ctx.strokeRect(this.x, this.y, scale, scale);
    };
}

function updateGame() {
    
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();

        if (snake.eat(fruit)) {
            score++;
            updateScore();
            if (score % 10 === 0) {
                level++;
                speed *= 0.9;
                updateLevel();
                clearInterval(game);
                game = setInterval(updateGame, speed);
            }
        }
    }
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(game); // Stop the game loop
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game Paused", canvas.width / 2, canvas.height / 2);
    } else {
        game = setInterval(updateGame, speed); // Resume the game loop
    }
}

function updateScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
    updateHighScore(score);
}

function updateLevel() {
    document.getElementById('level').innerText = 'Level: ' + level;
}

(function setup() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();
    score = 0;
    level = 1;
    document.getElementById('score').innerText = 'Score: ' + score;
    document.getElementById('level').innerText = 'Level: ' + level;
    game = setInterval(updateGame, speed);
}());

window.addEventListener('keydown', e => {
    if (e.key === 'p' || e.key === 'P') {
        togglePause();
    } else {
        const direction = e.key.replace('Arrow', '');
        snake.changeDirection(direction);
    }
});

document.getElementById('pauseButton').addEventListener('click', function() {
    togglePause();
});

// Function to retrieve high score from local storage
function getHighScore() {
    return localStorage.getItem('highScore') || 0;
}

// Function to set high score in local storage
function setHighScore(score) {
    localStorage.setItem('highScore', score);
}

// Function to update high score
function updateHighScore(score) {
    const highScore = getHighScore();
    if (score > highScore) {
        setHighScore(score);
        document.getElementById('highScore').textContent = score;
    }
}

// Initialize high score
let highScore = getHighScore();
document.getElementById('highScore').textContent = highScore;

// Function to reset high score
function resetHighScore() {
    localStorage.removeItem('highScore'); // Remove high score from local storage
    document.getElementById('highScore').textContent = '0'; // Update displayed high score
}

// Add event listener to the reset button
document.getElementById('resetButton').addEventListener('click', function() {
    resetHighScore(); // Call resetHighScore() when the button is clicked
});

// Function to increase level
function increaseLevel() {
    level++;
    updateLevel(); // Update displayed level
}

// Function to decrease level
function decreaseLevel() {
    if (level > 1) {
        level--;
        updateLevel(); // Update displayed level
    }
}

// Function to increase speed
function increaseSpeed() {
    speed -= 10; // Decrease speed by 10 milliseconds
    clearInterval(game); // Clear the current game loop
    game = setInterval(updateGame, speed); // Start a new game loop with the updated speed
}

// Function to decrease speed
function decreaseSpeed() {
    speed += 10; // Increase speed by 10 milliseconds
    clearInterval(game); // Clear the current game loop
    game = setInterval(updateGame, speed); // Start a new game loop with the updated speed
}

// Add event listeners to the increase speed button
document.getElementById('increaseSpeedButton').addEventListener('click', function() {
    increaseSpeed(); // Call increaseSpeed() when the button is clicked
});

// Add event listeners to the decrease speed button
document.getElementById('decreaseSpeedButton').addEventListener('click', function() {
    decreaseSpeed(); // Call decreaseSpeed() when the button is clicked
});





