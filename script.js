const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let roses = [];
let petals = [];
let particles = [];
let time = 0;

// Роза с анимацией роста
class Rose {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 0;
        this.maxSize = 30 + Math.random() * 20;
        this.growthSpeed = 0.5;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${Math.random() * 20 + 340}, 80%, 60%)`; // Оттенки розового
        for (let i = 0; i < 15; i++) {
            let angle = i * Math.PI / 7;
            let radius = this.size * Math.sin(angle);
            let roseX = this.x + radius * Math.cos(angle);
            let roseY = this.y + radius * Math.sin(angle);
            ctx.arc(roseX, roseY, this.size / 5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.closePath();
    }

    update() {
        if (this.size < this.maxSize) {
            this.size += this.growthSpeed;
        }
    }
}

// Лепесток с вращением
class Petal {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 15 + 5;
        this.speed = Math.random() * 3 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.fillStyle = '#ff80ab';
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update() {
        this.y += this.speed;
        this.angle += this.spin;
        if (this.y > canvas.height + 20) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }
    }
}

// Светящиеся частицы
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.life = 100;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.life / 100})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2;
    }
}

// Инициализация
for (let i = 0; i < 5; i++) {
    roses.push(new Rose(canvas.width / 2 + (Math.random() - 0.5) * 200, canvas.height / 2 + (Math.random() - 0.5) * 100));
}
for (let i = 0; i < 30; i++) {
    petals.push(new Petal());
}

// Анимация текста буква за буквой
const fullMessage = "С 8 марта, [имя подруги]! Ты моя весна!";
let currentMessage = "";
let charIndex = 0;

function typeMessage() {
    if (charIndex < fullMessage.length) {
        currentMessage += fullMessage[charIndex];
        message.textContent = currentMessage;
        charIndex++;
        setTimeout(typeMessage, 100);
    }
}

// Основная анимация
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time++;

    // Рисуем и обновляем розы
    roses.forEach(rose => {
        rose.update();
        rose.draw();
        if (time % 20 === 0 && Math.random() > 0.7) {
            particles.push(new Particle(rose.x, rose.y));
        }
    });

    // Рисуем и обновляем лепестки
    petals.forEach(petal => {
        petal.update();
        petal.draw();
    });

    // Рисуем и обновляем частицы
    particles = particles.filter(p => p.life > 0);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

// Показываем сообщение через 5 секунд
setTimeout(() => {
    message.style.opacity = 1;
    typeMessage();
}, 5000);

animate();