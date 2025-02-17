const gameContainer = document.querySelector('.game-container');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const rect = gameContainer.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    car.x = canvas.width / 2 - car.width / 2;
    car.y = canvas.height - 70;
}

const car = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    emoji: '🚗',
    speed: 5
};

let obstacles = [];

function drawTrack() {
    ctx.fillStyle = '#888';
    ctx.fillRect(canvas.width * 0.3, 0, canvas.width * 0.4, canvas.height);
}

function drawCar() {
    ctx.font = `${car.width}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(car.emoji, car.x + car.width / 2, car.y + car.height / 2);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrack();
    drawCar();
    drawObstacles();

    obstacles.forEach(obstacle => {
        obstacle.y += obstacle.speed;
    });

    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);

    if (Math.random() < 0.02) {
        const obstacle = {
            x: canvas.width * 0.3 + Math.random() * (canvas.width * 0.4 - 50),
            y: 0,
            width: 50,
            height: 30,
            speed: 3
        };
        obstacles.push(obstacle);
    }

    obstacles.forEach(obstacle => {
        if (car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y) {
            alert('¡Choque!');
            document.location.reload();
        }
    });

    requestAnimationFrame(update);
}

function moveCar(event) {
    switch (event.key) {
        case 'ArrowLeft':
            car.x -= car.speed;
            break;
        case 'ArrowRight':
            car.x += car.speed;
            break;
    }

    if (car.x < canvas.width * 0.3) car.x = canvas.width * 0.3;
    if (car.x + car.width > canvas.width * 0.7) car.x = canvas.width * 0.7 - car.width;
}

window.addEventListener('resize', resizeCanvas);
document.addEventListener('keydown', moveCar);
resizeCanvas();
update();
