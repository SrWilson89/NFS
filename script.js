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
        speed: 5
    };

    let obstacles = [];
    let gameOver = false;

    // Velocidad base de los obstáculos
    const obstacleBaseSpeed = 2; // Velocidad base constante
    const obstacleSpeedVariation = 1; // Variación de velocidad

    // Frecuencia de generación de obstáculos
    const obstacleSpawnRate = 0.01; // Frecuencia de generación

    // Dibujar la pista
    function drawTrack() {
        ctx.fillStyle = '#888';
        ctx.fillRect(canvas.width * 0.3, 0, canvas.width * 0.4, canvas.height);
    }

    // Dibujar el coche
    function drawCar() {
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

    // Verificar colisiones
    function checkCollision() {
        obstacles.forEach(obstacle => {
            if (car.x < obstacle.x + obstacle.width &&
                car.x + car.width > obstacle.x &&
                car.y < obstacle.y + obstacle.height &&
                car.y + car.height > obstacle.y) {
                gameOver = true;
                alert('¡Choque!');
                resetGame();
            }
        });
    }

    // Reiniciar el juego
    function resetGame() {
        obstacles = [];
        car.x = canvas.width / 2 - car.width / 2;
        car.y = canvas.height - 70;
        gameOver = false;

        // Reiniciar el bucle de actualización
        update();
    }

    // Actualizar el juego
    function update() {
        if (gameOver) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTrack();
        drawCar();
        drawObstacles();

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
                speed: obstacleBaseSpeed + Math.random() * obstacleSpeedVariation // Velocidad aleatoria
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
        if (gameOver) return;

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