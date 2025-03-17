// Código JavaScript
const gameContainer = document.querySelector('.game-container');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');

// Ajustar el tamaño del canvas al tamaño del contenedor
function resizeCanvas() {
    const rect = gameContainer.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Posicionar el coche en el centro inferior
    car.x = canvas.width / 2 - car.width / 2;
    car.y = canvas.height - 70;
}

// Definir el coche
const car = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    emoji: '🚗',
    speed: 10  // Aumentado de 5 a 10 para un movimiento más rápido
};

let obstacles = [];
let gameOver = false;
let gameWon = false;
let score = 0;
let frameCount = 0;
let lives = 3; // Número de vidas iniciales
let isBlinking = false; // Estado de parpadeo para mostrar invulnerabilidad
let blinkCount = 0; // Contador para controlar el parpadeo
let invulnerable = false; // Estado de invulnerabilidad después de perder una vida

// Puntaje objetivo para la victoria
const victoryScore = 1000;

// Velocidad base de los obstáculos
const obstacleBaseSpeed = 3; // Ligeramente aumentado para mantener el desafío
const obstacleSpeedVariation = 1.5; // Ligero aumento en la variación

// Frecuencia de generación de obstáculos
const obstacleSpawnRate = 0.01; // Frecuencia de generación

// Dibujar la pista
function drawTrack() {
    ctx.fillStyle = '#888';
    ctx.fillRect(canvas.width * 0.3, 0, canvas.width * 0.4, canvas.height);
}

// Dibujar el coche
function drawCar() {
    if (invulnerable) {
        blinkCount++;
        // Hacer parpadear el coche cada 10 frames
        if (blinkCount % 10 < 5) {
            return; // No dibujar el coche en estos frames
        }
        // Terminar el estado de invulnerabilidad después de 60 frames (aproximadamente 1 segundo)
        if (blinkCount >= 60) {
            invulnerable = false;
            blinkCount = 0;
        }
    }

    ctx.font = `${car.width}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(car.emoji, car.x + car.width / 2, car.y + car.height / 2);
}

// Dibujar los obstáculos
function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Dibujar la puntuación y vidas
function drawHUD() {
    // Dibujar puntuación
    ctx.fillStyle = '#000';
    ctx.font = "20px Arial";
    ctx.textAlign = 'left';
    ctx.fillText(`Puntuación: ${score}/${victoryScore}`, 10, 30);
    
    // Dibujar vidas
    ctx.textAlign = 'right';
    ctx.fillText(`Vidas: ${'❤️'.repeat(lives)}`, canvas.width - 10, 30);
}

// Mostrar mensaje de victoria
function showVictoryMessage() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFD700'; // Color dorado
    ctx.font = "40px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡VICTORIA!', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.fillStyle = '#FFF';
    ctx.font = "24px Arial";
    ctx.fillText(`Has alcanzado ${score} puntos`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Presiona "Reiniciar Juego" para jugar de nuevo', canvas.width / 2, canvas.height / 2 + 50);
}

// Mostrar mensaje de Game Over
function showGameOverMessage() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FF0000'; // Color rojo
    ctx.font = "40px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.fillStyle = '#FFF';
    ctx.font = "24px Arial";
    ctx.fillText(`Puntuación final: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Presiona "Reiniciar Juego" para intentarlo de nuevo', canvas.width / 2, canvas.height / 2 + 50);
}

// Verificar colisiones
function checkCollision() {
    if (invulnerable) return; // No verificar colisiones durante la invulnerabilidad
    
    obstacles.forEach(obstacle => {
        if (car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y) {
            
            lives--; // Reducir una vida
            
            if (lives <= 0) {
                // Si no quedan vidas, es Game Over
                gameOver = true;
                showGameOverMessage();
            } else {
                // Si quedan vidas, el jugador es temporalmente invulnerable
                invulnerable = true;
                blinkCount = 0;
                
                // Reposicionar el coche para continuar
                car.x = canvas.width / 2 - car.width / 2;
            }
        }
    });
}

// Verificar victoria
function checkVictory() {
    if (score >= victoryScore && !gameWon) {
        gameWon = true;
        showVictoryMessage();
    }
}

// Actualizar la puntuación
function updateScore() {
    // No actualizar si el juego está ganado o terminado
    if (gameWon || gameOver) return;
    
    // Incrementar la puntuación cada 10 frames
    frameCount++;
    if (frameCount % 10 === 0) {
        score += 1;
    }
    
    // Bonus por cada obstáculo superado
    obstacles.forEach((obstacle, index) => {
        if (obstacle.y > car.y + car.height && !obstacle.passed) {
            score += 5;
            obstacles[index].passed = true;
        }
    });
    
    // Verificar victoria
    checkVictory();
}

// Reiniciar el juego
function resetGame() {
    obstacles = [];
    car.x = canvas.width / 2 - car.width / 2;
    car.y = canvas.height - 70;
    gameOver = false;
    gameWon = false;
    score = 0;
    frameCount = 0;
    lives = 3; // Restablecer vidas
    invulnerable = false;
    blinkCount = 0;

    // Reiniciar el bucle de actualización
    update();
}

// Actualizar el juego
function update() {
    if (gameOver) {
        showGameOverMessage();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawCar();
    drawObstacles();
    drawHUD();
    updateScore();
    
    // Si el juego está ganado, mostrar mensaje de victoria y detener la actualización
    if (gameWon) {
        showVictoryMessage();
        return;
    }

    // Mover los obstáculos hacia abajo
    obstacles.forEach(obstacle => {
        obstacle.y += obstacle.speed;
    });

    // Eliminar obstáculos que salen de la pantalla
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);

    // Generar nuevos obstáculos
    if (Math.random() < obstacleSpawnRate) {
        const obstacle = {
            x: canvas.width * 0.3 + Math.random() * (canvas.width * 0.4 - 50),
            y: 0,
            width: 50,
            height: 30,
            speed: obstacleBaseSpeed + Math.random() * obstacleSpeedVariation, // Velocidad aleatoria
            passed: false
        };
        obstacles.push(obstacle);
    }

    // Verificar colisiones
    checkCollision();

    // Continuar el bucle de actualización
    requestAnimationFrame(update);
}

// Mover el coche con las teclas
function moveCar(event) {
    if (gameOver || gameWon) return;

    switch (event.key) {
        case 'ArrowLeft':
            car.x -= car.speed;
            break;
        case 'ArrowRight':
            car.x += car.speed;
            break;
    }

    // Limitar el movimiento del coche dentro de la pista
    if (car.x < canvas.width * 0.3) car.x = canvas.width * 0.3;
    if (car.x + car.width > canvas.width * 0.7) car.x = canvas.width * 0.7 - car.width;
}

// Eventos
window.addEventListener('resize', resizeCanvas);
document.addEventListener('keydown', moveCar);
resetButton.addEventListener('click', resetGame);

// Iniciar el juego
resizeCanvas();
update();