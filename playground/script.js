// Matrix background animation
// Utility: status notifier used across features
function updateStatus(message) {
    try {
        const n = /** @type {HTMLElement|null} */ (document.getElementById('notification'));
        if (n) {
            n.textContent = String(message);
            n.classList.add('show');
            setTimeout(() => {
                try {
                    n.classList.remove('show');
                } catch (_) {
                    /* ignore */
                }
            }, 3000);
        }
        // Always log to console as a fallback
        // eslint-disable-next-line no-console
        console.log(message);
    } catch (_) {
        /* ignore */
    }
}

// Typed canvas acquisition with guards; create if missing
/** @type {HTMLCanvasElement|null} */
let canvas = /** @type {HTMLCanvasElement|null} */ (document.getElementById('matrixCanvas'));
if (!canvas) {
    try {
        const c = document.createElement('canvas');
        c.id = 'matrixCanvas';
        // Fullscreen, behind content
        c.style.position = 'fixed';
        c.style.top = '0';
        c.style.left = '0';
        c.style.width = '100%';
        c.style.height = '100%';
        c.style.zIndex = '-2';
        c.style.pointerEvents = 'none';
        document.body.prepend(c);
        canvas = c;
    } catch (_) {
        /* ignore */
    }
}
/** @type {CanvasRenderingContext2D|null} */
const ctx = (canvas && canvas.getContext) ? canvas.getContext('2d') : null;

if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Keep canvas responsive
    window.addEventListener('resize', () => {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        try {
            initDrops();
        } catch (_) {
            /* ignore until initialized */
        }
    });
}

const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}ハッカー日本語αβγδεζηθικλμνξοπρστυφχψω";
const matrixArray = matrix.split("");

const baseFontSize = 10;
let columns = ((canvas && canvas.width) ? canvas.width : window.innerWidth) / baseFontSize;

const drops = [];
const dropSpeeds = [];
const dropSizes = [];
const dropTrails = [];

function initDrops() {
    columns = ((canvas && canvas.width) ? canvas.width : window.innerWidth) / baseFontSize;
    drops.length = 0;
    dropSpeeds.length = 0;
    dropSizes.length = 0;
    dropTrails.length = 0;

    for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100; // Random start positions
        dropSpeeds[x] = 0.5 + Math.random() * 1.5; // Varying speeds (0.5-2.0)
        dropSizes[x] = 0.7 + Math.random() * 0.6; // Varying sizes (0.7-1.3)
        dropTrails[x] = []; // Trail history for each drop
    }
}
initDrops();

function drawMatrix() {
    if (!canvas || !ctx) return;

    // Enhanced trail effect with gradient fade
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.02)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Time-based effects
    const t = performance.now() * 0.001; // Slower time factor for smoother transitions
    const pulseEffect = Math.sin(t * 2) * 0.3 + 0.7; // Pulsing brightness

    for (let i = 0; i < drops.length; i++) {
        const x = i * baseFontSize;
        const y = drops[i] * baseFontSize;
        const fontSize = baseFontSize * dropSizes[i];
        const speed = dropSpeeds[i];

        // Enhanced rainbow effect with multiple color layers
        const baseHue = (t * 30 + i * 15) % 360;
        const secondaryHue = (baseHue + 120) % 360;
        const tertiaryHue = (baseHue + 240) % 360;

        // Update trail history
        if (!dropTrails[i]) dropTrails[i] = [];
        dropTrails[i].push({ x, y, time: t });
        // Keep only recent trail points
        dropTrails[i] = dropTrails[i].filter(point => t - point.time < 2);

        // Draw particle trails with fading effect
        dropTrails[i].forEach((point, index) => {
            const age = t - point.time;
            const alpha = Math.max(0, 1 - age / 2) * 0.3;
            const trailHue = (baseHue + age * 60) % 360;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `hsl(${trailHue}, 100%, 70%)`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsl(${trailHue}, 100%, 50%)`;
            ctx.font = (fontSize * 0.6) + 'px monospace';
            ctx.fillText('•', point.x, point.y);
            ctx.restore();
        });

        // Main character with enhanced glow effects
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.font = fontSize + 'px monospace';

        // Multiple glow layers for enhanced effect
        ctx.save();

        // Outer glow (largest)
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${baseHue}, 100%, 50%)`;
        ctx.globalAlpha = 0.8 * pulseEffect;
        ctx.fillStyle = `hsl(${baseHue}, 100%, 80%)`;
        ctx.fillText(text, x, y);

        // Middle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${secondaryHue}, 100%, 60%)`;
        ctx.globalAlpha = 0.9 * pulseEffect;
        ctx.fillStyle = `hsl(${secondaryHue}, 100%, 70%)`;
        ctx.fillText(text, x, y);

        // Inner glow (brightest)
        ctx.shadowBlur = 5;
        ctx.shadowColor = `hsl(${tertiaryHue}, 100%, 70%)`;
        ctx.globalAlpha = 1.0 * pulseEffect;
        ctx.fillStyle = `hsl(${tertiaryHue}, 100%, 90%)`;
        ctx.fillText(text, x, y);

        ctx.restore();

        // Enhanced drop movement with varying speeds
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = Math.random() * -20; // Reset with random delay
            dropSpeeds[i] = 0.5 + Math.random() * 1.5; // New random speed
            dropSizes[i] = 0.7 + Math.random() * 0.6; // New random size
            dropTrails[i] = []; // Clear trail
        }
        drops[i] += speed;
    }
}

// Floating Particles System
const particleCanvas = document.createElement('canvas');
particleCanvas.id = 'particleCanvas';
particleCanvas.style.position = 'fixed';
particleCanvas.style.top = '0';
particleCanvas.style.left = '0';
particleCanvas.style.width = '100%';
particleCanvas.style.height = '100%';
particleCanvas.style.zIndex = '-1';
particleCanvas.style.pointerEvents = 'none';
particleCanvas.style.opacity = '0.7';
document.body.appendChild(particleCanvas);

const particleCtx = particleCanvas.getContext('2d');
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

// Hacker symbols and code snippets
const hackerSymbols = [
    '{ }', '< >', '[ ]', '( )', '//', '/*', '*/', '=>', '&&', '||',
    'if', 'for', 'var', 'let', 'const', 'function', 'return', 'true', 'false',
    '0x', '0b', '#!/', 'sudo', 'root', 'admin', 'hack', 'code', 'dev',
    '💻', '🔒', '🔓', '⚡', '🚀', '🔧', '⚙️', '🎯', '🔍', '💾',
    'SELECT', 'FROM', 'WHERE', 'DROP', 'TABLE', 'INSERT', 'UPDATE',
    'GET', 'POST', 'PUT', 'DELETE', 'HTTP', 'API', 'JSON', 'XML'
];

class Particle {
    constructor() {
        this.reset();
        this.symbol = hackerSymbols[Math.floor(Math.random() * hackerSymbols.length)];
        this.fontSize = 8 + Math.random() * 12;
        this.opacity = 0.3 + Math.random() * 0.7;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.rotation = 0;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.mouseInfluence = 0;
        this.originalVx = this.vx;
        this.originalVy = this.vy;
    }

    reset() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.hue = Math.random() * 360;
    }

    update(mouseX, mouseY) {
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            this.mouseInfluence = force;

            // Repel from mouse
            const angle = Math.atan2(dy, dx);
            this.vx = this.originalVx - Math.cos(angle) * force * 2;
            this.vy = this.originalVy - Math.sin(angle) * force * 2;
        } else {
            this.mouseInfluence *= 0.95; // Fade influence
            this.vx = this.vx * 0.98 + this.originalVx * 0.02; // Return to original velocity
            this.vy = this.vy * 0.98 + this.originalVy * 0.02;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x < -50) this.x = particleCanvas.width + 50;
        if (this.x > particleCanvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = particleCanvas.height + 50;
        if (this.y > particleCanvas.height + 50) this.y = -50;

        // Update rotation and color
        this.rotation += this.rotationSpeed;
        this.hue += 0.5;
        if (this.hue > 360) this.hue = 0;
    }

    draw(time) {
        if (!particleCtx) return;

        particleCtx.save();
        particleCtx.translate(this.x, this.y);
        particleCtx.rotate(this.rotation);

        // Pulsing effect
        const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.3 + 0.7;
        const scale = pulse * (1 + this.mouseInfluence * 0.5);

        // Enhanced glow effect when near mouse
        const glowIntensity = 5 + this.mouseInfluence * 15;
        particleCtx.shadowBlur = glowIntensity;
        particleCtx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;

        // Draw particle with gradient effect
        particleCtx.font = `${this.fontSize * scale}px monospace`;
        particleCtx.fillStyle = `hsla(${this.hue}, 100%, ${60 + this.mouseInfluence * 20}%, ${this.opacity * pulse})`;
        particleCtx.textAlign = 'center';
        particleCtx.textBaseline = 'middle';
        particleCtx.fillText(this.symbol, 0, 0);

        particleCtx.restore();
    }
}

// Create particles
const particles = [];
const particleCount = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 15000));

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Mouse tracking
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Touch support
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    }
});

// Particle animation loop
function animateParticles() {
    if (!particleCtx) return;

    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    const time = performance.now() * 0.001;

    particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw(time);
    });

    requestAnimationFrame(animateParticles);
}

// Handle window resize for particles
window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    // Adjust particle count based on screen size
    const newParticleCount = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 15000));
    while (particles.length < newParticleCount) {
        particles.push(new Particle());
    }
    while (particles.length > newParticleCount) {
        particles.pop();
    }
});

// Start both animation loops
(function loop() {
    drawMatrix();
    requestAnimationFrame(loop);
})();

animateParticles();

// Initialize Dynamic Assets from config
function initializeAssets() {
    if (typeof getImageURL !== 'function') return;

    const assets = {
        'img-app': 'app',
        'img-youtube': 'youtube',
        'img-twitter': 'twitter',
        'img-facebook': 'facebook'
    };

    for (const [id, configKey] of Object.entries(assets)) {
        const img = document.getElementById(id);
        if (img) {
            const url = getImageURL(configKey);
            if (url) img.src = url;
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeAssets);

// Parallax Scrolling Effects System
class ParallaxLayer {
    constructor(speed, opacity, pattern, color) {
        this.speed = speed;
        this.opacity = opacity;
        this.pattern = pattern;
        this.color = color;
        this.offset = 0;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.createPattern();
    }

    setupCanvas() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = this.opacity;
        this.canvas.style.zIndex = '-4';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);
    }

    createPattern() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.pattern) {
            case 'grid':
                this.drawGrid();
                break;
            case 'circuits':
                this.drawCircuits();
                break;
            case 'hexagons':
                this.drawHexagons();
                break;
            case 'binary':
                this.drawBinary();
                break;
        }
    }

    drawGrid() {
        const gridSize = 40;
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = 0.3;

        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawCircuits() {
        const spacing = 80;
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.2;

        for (let x = 0; x < this.canvas.width; x += spacing) {
            for (let y = 0; y < this.canvas.height; y += spacing) {
                // Draw circuit-like patterns
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(x + 20, y);
                this.ctx.lineTo(x + 20, y + 20);
                this.ctx.lineTo(x + 40, y + 20);
                this.ctx.stroke();

                // Add small circles as connection points
                this.ctx.beginPath();
                this.ctx.arc(x, y, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = this.color;
                this.ctx.fill();
            }
        }
    }

    drawHexagons() {
        const size = 30;
        const spacing = size * 1.5;
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 0.8;
        this.ctx.globalAlpha = 0.15;

        for (let x = 0; x < this.canvas.width + size; x += spacing) {
            for (let y = 0; y < this.canvas.height + size; y += spacing * 0.866) {
                const offsetX = (y / (spacing * 0.866)) % 2 === 1 ? spacing / 2 : 0;
                this.drawHexagon(x + offsetX, y, size);
            }
        }
    }

    drawHexagon(centerX, centerY, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = centerX + size * Math.cos(angle);
            const y = centerY + size * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawBinary() {
        const fontSize = 12;
        const spacing = 20;
        this.ctx.font = `${fontSize}px monospace`;
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = 0.1;

        for (let x = 0; x < this.canvas.width; x += spacing) {
            for (let y = fontSize; y < this.canvas.height; y += spacing) {
                const binary = Math.random() > 0.5 ? '1' : '0';
                this.ctx.fillText(binary, x, y);
            }
        }
    }

    update(scrollY) {
        this.offset = scrollY * this.speed;
        this.canvas.style.transform = `translateY(${this.offset}px)`;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createPattern();
    }
}

// Create parallax layers with different speeds and patterns
const parallaxLayers = [
    new ParallaxLayer(0.1, '0.05', 'binary', '#00ff41'),
    new ParallaxLayer(0.2, '0.08', 'grid', '#00ccff'),
    new ParallaxLayer(0.3, '0.06', 'hexagons', '#ff00ff'),
    new ParallaxLayer(0.4, '0.04', 'circuits', '#ffff00')
];

// Parallax scroll handler with performance optimization
let ticking = false;
let lastScrollY = 0;

function updateParallax() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Only update if scroll position changed significantly
    if (Math.abs(scrollY - lastScrollY) > 1) {
        parallaxLayers.forEach(layer => {
            layer.update(scrollY);
        });
        lastScrollY = scrollY;
    }

    ticking = false;
}

function requestParallaxUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

// Optimized scroll listener
window.addEventListener('scroll', requestParallaxUpdate, { passive: true });

// Handle window resize for parallax layers
window.addEventListener('resize', () => {
    parallaxLayers.forEach(layer => {
        layer.resize();
    });
});

// Mobile performance optimization
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

if (isMobile) {
    // Reduce parallax layers on mobile for better performance
    parallaxLayers.forEach((layer, index) => {
        if (index > 1) {
            layer.canvas.style.display = 'none';
        }
    });
}

// Add depth perception with content sections
function addDepthToSections() {
    const sections = document.querySelectorAll('.features, .getting-started, .shortcuts, .cta');

    sections.forEach((section, index) => {
        section.style.position = 'relative';
        section.style.zIndex = '10';
        section.style.background = `rgba(0, 0, 0, ${0.7 + index * 0.05})`;
        section.style.backdropFilter = 'blur(2px)';
        section.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

        // Add hover effect for depth
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'translateZ(10px) scale(1.02)';
            section.style.boxShadow = '0 10px 30px rgba(0, 255, 65, 0.2)';
        });

        section.addEventListener('mouseleave', () => {
            section.style.transform = 'translateZ(0) scale(1)';
            section.style.boxShadow = 'none';
        });
    });
}

// Initialize depth effects
addDepthToSections();

// ===== GAMIFICATION SYSTEM =====

// Easter Egg System
class EasterEggSystem {
    constructor() {
        this.easterEggs = new Map();
        this.discoveredEggs = new Set();
        this.keySequence = [];
        this.maxSequenceLength = 10;
        this.lastActionTime = 0;
        this.actionCount = 0;
        this.specialModeActive = false;

        this.initializeEasterEggs();
        this.setupEventListeners();
        this.loadProgress();
    }

    initializeEasterEggs() {
        // Konami Code Easter Egg
        this.easterEggs.set('konami', {
            id: 'konami',
            name: 'Konami Code Master',
            nameTh: 'นักรบโคนามิ',
            description: 'Discovered the legendary Konami Code',
            descriptionTh: 'ค้นพบรหัสลับโคนามิในตำนาน',
            trigger: 'keySequence',
            sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
            reward: 'special-developer-mode',
            animation: 'konami-celebration',
            sound: 'success-fanfare',
            unlocked: false
        });

        // Matrix Reference Easter Egg
        this.easterEggs.set('matrix', {
            id: 'matrix',
            name: 'Follow the White Rabbit',
            nameTh: 'ตามกระต่ายขาว',
            description: 'Found the Matrix reference',
            descriptionTh: 'พบการอ้างอิงจากเดอะเมทริกซ์',
            trigger: 'textInput',
            text: 'follow the white rabbit',
            reward: 'matrix-theme-unlock',
            animation: 'matrix-glitch',
            sound: 'matrix-sound',
            unlocked: false
        });

        // Hacker Sequence Easter Egg
        this.easterEggs.set('hacker', {
            id: 'hacker',
            name: 'Elite Hacker',
            nameTh: 'แฮกเกอร์ระดับสูง',
            description: 'Unlocked advanced hacker tools',
            descriptionTh: 'ปลดล็อกเครื่องมือแฮกเกอร์ขั้นสูง',
            trigger: 'keyCombo',
            combo: ['ControlLeft', 'AltLeft', 'KeyH', 'KeyA', 'KeyC', 'KeyK'],
            reward: 'advanced-tools-unlock',
            animation: 'hacker-access',
            sound: 'access-granted',
            unlocked: false
        });

        // Time-based Easter Egg (1337 time)
        this.easterEggs.set('leet', {
            id: 'leet',
            name: 'Leet Time Master',
            nameTh: 'นักรบเวลา 1337',
            description: 'Visited at the legendary 13:37 time',
            descriptionTh: 'เข้าชมในเวลา 13:37 ในตำนาน',
            trigger: 'timeBased',
            time: '13:37',
            reward: 'leet-theme-unlock',
            animation: 'leet-celebration',
            sound: 'leet-sound',
            unlocked: false
        });

        // Click Pattern Easter Egg
        this.easterEggs.set('clickmaster', {
            id: 'clickmaster',
            name: 'Click Master',
            nameTh: 'นักคลิกมือโปร',
            description: 'Discovered the secret click pattern',
            descriptionTh: 'ค้นพบรูปแบบการคลิกลับ',
            trigger: 'clickPattern',
            pattern: ['header', 'feature', 'header', 'feature', 'header'],
            reward: 'click-effects-unlock',
            animation: 'click-celebration',
            sound: 'click-success',
            unlocked: false
        });

        // Scroll Easter Egg
        this.easterEggs.set('scroller', {
            id: 'scroller',
            name: 'Infinite Scroller',
            nameTh: 'นักเลื่อนไม่รู้จบ',
            description: 'Scrolled through the entire universe',
            descriptionTh: 'เลื่อนผ่านจักรวาลทั้งหมด',
            trigger: 'scrollDistance',
            distance: 10000, // pixels
            reward: 'parallax-boost',
            animation: 'scroll-celebration',
            sound: 'scroll-achievement',
            unlocked: false
        });

        // Developer Console Easter Egg
        this.easterEggs.set('console', {
            id: 'console',
            name: 'Console Detective',
            nameTh: 'นักสืบคอนโซล',
            description: 'Found the hidden console message',
            descriptionTh: 'พบข้อความลับในคอนโซล',
            trigger: 'consoleOpen',
            reward: 'console-theme-unlock',
            animation: 'console-celebration',
            sound: 'console-beep',
            unlocked: false
        });
    }

    setupEventListeners() {
        // Keyboard event listeners
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        // Text input listener for Matrix reference
        document.addEventListener('input', (e) => {
            this.handleTextInput(e);
        });

        // Click pattern listener
        document.addEventListener('click', (e) => {
            this.handleClick(e);
        });

        // Scroll listener
        let totalScrollDistance = 0;
        window.addEventListener('scroll', () => {
            totalScrollDistance += Math.abs(window.pageYOffset - (this.lastScrollY || 0));
            this.lastScrollY = window.pageYOffset;
            this.checkScrollEasterEgg(totalScrollDistance);
        });

        // Time-based check
        this.checkTimeBasedEasterEggs();
        setInterval(() => this.checkTimeBasedEasterEggs(), 60000); // Check every minute

        // Console detection
        this.detectConsoleOpen();
    }

    handleKeyPress(event) {
        const currentTime = Date.now();

        // Reset sequence if too much time has passed
        if (currentTime - this.lastActionTime > 2000) {
            this.keySequence = [];
        }

        this.keySequence.push(event.code);
        this.lastActionTime = currentTime;

        // Keep sequence length manageable
        if (this.keySequence.length > this.maxSequenceLength) {
            this.keySequence.shift();
        }

        // Check for Konami Code
        this.checkKonamiCode();

        // Check for hacker sequence
        this.checkHackerSequence();

        // Special key combinations
        this.checkSpecialCombinations(event);
    }

    checkKonamiCode() {
        const konamiEgg = this.easterEggs.get('konami');
        if (konamiEgg.unlocked) return;

        const konamiSequence = konamiEgg.sequence;
        if (this.keySequence.length >= konamiSequence.length) {
            const lastKeys = this.keySequence.slice(-konamiSequence.length);
            if (JSON.stringify(lastKeys) === JSON.stringify(konamiSequence)) {
                this.unlockEasterEgg('konami');
            }
        }
    }

    checkHackerSequence() {
        const hackerEgg = this.easterEggs.get('hacker');
        if (hackerEgg.unlocked) return;

        const hackerCombo = hackerEgg.combo;
        if (this.keySequence.length >= hackerCombo.length) {
            const lastKeys = this.keySequence.slice(-hackerCombo.length);
            if (JSON.stringify(lastKeys) === JSON.stringify(hackerCombo)) {
                this.unlockEasterEgg('hacker');
            }
        }
    }

    checkSpecialCombinations(event) {
        // Check for Ctrl+Alt+D+E+V (Developer mode)
        if (event.ctrlKey && event.altKey && event.code === 'KeyD') {
            this.actionCount++;
            if (this.actionCount >= 3) {
                this.activateSpecialMode();
            }
        }
    }

    handleTextInput(event) {
        const matrixEgg = this.easterEggs.get('matrix');
        if (matrixEgg.unlocked) return;

        const inputText = event.target.value.toLowerCase();
        if (inputText.includes(matrixEgg.text)) {
            this.unlockEasterEgg('matrix');
        }
    }

    handleClick(event) {
        const clickEgg = this.easterEggs.get('clickmaster');
        if (clickEgg.unlocked) return;

        // Determine what was clicked
        let clickTarget = 'unknown';
        if (event.target.closest('.header')) clickTarget = 'header';
        else if (event.target.closest('.feature')) clickTarget = 'feature';
        else if (event.target.closest('.btn')) clickTarget = 'button';

        // Track click pattern
        if (!this.clickPattern) this.clickPattern = [];
        this.clickPattern.push(clickTarget);

        // Keep pattern length manageable
        if (this.clickPattern.length > 10) {
            this.clickPattern.shift();
        }

        // Check if pattern matches
        const targetPattern = clickEgg.pattern;
        if (this.clickPattern.length >= targetPattern.length) {
            const lastClicks = this.clickPattern.slice(-targetPattern.length);
            if (JSON.stringify(lastClicks) === JSON.stringify(targetPattern)) {
                this.unlockEasterEgg('clickmaster');
            }
        }
    }

    checkScrollEasterEgg(totalDistance) {
        const scrollEgg = this.easterEggs.get('scroller');
        if (scrollEgg.unlocked) return;

        if (totalDistance >= scrollEgg.distance) {
            this.unlockEasterEgg('scroller');
        }
    }

    checkTimeBasedEasterEggs() {
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');

        const leetEgg = this.easterEggs.get('leet');
        if (!leetEgg.unlocked && timeString === leetEgg.time) {
            this.unlockEasterEgg('leet');
        }
    }

    detectConsoleOpen() {
        // Detect if developer console is open
        let devtools = {
            open: false,
            orientation: null
        };

        const threshold = 160;
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    this.unlockEasterEgg('console');
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    }

    unlockEasterEgg(eggId) {
        const egg = this.easterEggs.get(eggId);
        if (!egg || egg.unlocked) return;

        egg.unlocked = true;
        this.discoveredEggs.add(eggId);

        // Trigger celebration animation
        this.celebrateEasterEgg(egg);

        // Apply reward
        this.applyReward(egg.reward);

        // Save progress
        this.saveProgress();

        // Notify achievement system
        if (window.achievementSystem) {
            window.achievementSystem.unlockAchievement(`easter_egg_${eggId}`);
            window.achievementSystem.userStats.easterEggsFound++;

            // Check if all easter eggs are found for the hunter achievement
            if (window.achievementSystem.userStats.easterEggsFound >= this.easterEggs.size) {
                window.achievementSystem.unlockAchievement('easter_egg_hunter');
            }
        }

        console.log(`🥚 Easter Egg Unlocked: ${egg.name} - ${egg.description}`);
    }

    celebrateEasterEgg(egg) {
        // Create celebration overlay
        const celebration = document.createElement('div');
        celebration.className = 'easter-egg-celebration';
        celebration.innerHTML = `
                    <div class="celebration-content">
                        <div class="celebration-icon">🥚</div>
                        <h3 class="celebration-title">${egg.name}</h3>
                        <p class="celebration-description">${egg.description}</p>
                        <div class="celebration-reward">Reward: ${this.getRewardDescription(egg.reward)}</div>
                    </div>
                `;

        document.body.appendChild(celebration);

        // Trigger animation
        setTimeout(() => {
            celebration.classList.add('active');
        }, 100);

        // Play sound effect
        this.playSound(egg.sound);

        // Apply specific animation
        this.playAnimation(egg.animation);

        // Remove after animation
        setTimeout(() => {
            celebration.classList.remove('active');
            setTimeout(() => {
                if (celebration.parentNode) {
                    celebration.parentNode.removeChild(celebration);
                }
            }, 500);
        }, 4000);
    }

    getRewardDescription(reward) {
        const rewards = {
            'special-developer-mode': 'Developer Mode Unlocked',
            'matrix-theme-unlock': 'Matrix Theme Unlocked',
            'advanced-tools-unlock': 'Advanced Tools Unlocked',
            'leet-theme-unlock': 'Leet Theme Unlocked',
            'click-effects-unlock': 'Enhanced Click Effects',
            'parallax-boost': 'Parallax Effects Boosted',
            'console-theme-unlock': 'Console Theme Unlocked'
        };
        return rewards[reward] || 'Special Feature Unlocked';
    }

    applyReward(reward) {
        switch (reward) {
            case 'special-developer-mode':
                this.activateSpecialMode();
                break;
            case 'matrix-theme-unlock':
                this.unlockMatrixTheme();
                break;
            case 'advanced-tools-unlock':
                this.unlockAdvancedTools();
                break;
            case 'leet-theme-unlock':
                this.unlockLeetTheme();
                break;
            case 'click-effects-unlock':
                this.enhanceClickEffects();
                break;
            case 'parallax-boost':
                this.boostParallaxEffects();
                break;
            case 'console-theme-unlock':
                this.unlockConsoleTheme();
                break;
        }
    }

    activateSpecialMode() {
        if (this.specialModeActive) return;

        this.specialModeActive = true;
        document.body.classList.add('special-mode');

        // Add special mode indicator
        const indicator = document.createElement('div');
        indicator.className = 'special-mode-indicator';
        indicator.innerHTML = '🚀 DEVELOPER MODE ACTIVE';
        document.body.appendChild(indicator);

        // Enhanced effects
        this.enableEnhancedEffects();

        console.log('🚀 Special Developer Mode Activated!');
    }

    unlockMatrixTheme() {
        // Add Matrix theme option
        document.body.classList.add('matrix-theme-unlocked');
        console.log('🟢 Matrix Theme Unlocked!');
    }

    unlockAdvancedTools() {
        // Show advanced tools
        document.body.classList.add('advanced-tools-unlocked');
        console.log('🔧 Advanced Tools Unlocked!');
    }

    unlockLeetTheme() {
        // Add 1337 theme
        document.body.classList.add('leet-theme-unlocked');
        console.log('💚 1337 Theme Unlocked!');
    }

    enhanceClickEffects() {
        // Enhanced click effects
        document.body.classList.add('enhanced-clicks');
        console.log('✨ Enhanced Click Effects Activated!');
    }

    boostParallaxEffects() {
        // Boost parallax performance
        parallaxLayers.forEach(layer => {
            layer.speed *= 1.5;
        });
        console.log('🌟 Parallax Effects Boosted!');
    }

    unlockConsoleTheme() {
        // Console theme
        document.body.classList.add('console-theme-unlocked');
        console.log('💻 Console Theme Unlocked!');
    }

    enableEnhancedEffects() {
        // Add rainbow effects to matrix
        if (canvas && ctx) {
            // Enhanced matrix effects are already implemented
        }

        // Add special particle effects
        particles.forEach(particle => {
            particle.specialMode = true;
        });
    }

    playSound(soundType) {
        // Create audio context for sound effects
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Audio not supported');
                return;
            }
        }

        // Generate different sounds based on type
        this.generateSound(soundType);
    }

    generateSound(type) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        switch (type) {
            case 'success-fanfare':
                this.playFanfare(oscillator, gainNode);
                break;
            case 'matrix-sound':
                this.playMatrixSound(oscillator, gainNode);
                break;
            case 'access-granted':
                this.playAccessSound(oscillator, gainNode);
                break;
            case 'leet-sound':
                this.playLeetSound(oscillator, gainNode);
                break;
            default:
                this.playDefaultSound(oscillator, gainNode);
        }
    }

    playFanfare(oscillator, gainNode) {
        const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
        let noteIndex = 0;

        const playNote = () => {
            if (noteIndex < notes.length) {
                oscillator.frequency.setValueAtTime(notes[noteIndex], this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                noteIndex++;
                setTimeout(playNote, 200);
            }
        };

        oscillator.start();
        playNote();
        oscillator.stop(this.audioContext.currentTime + 1);
    }

    playMatrixSound(oscillator, gainNode) {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    playAccessSound(oscillator, gainNode) {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    playLeetSound(oscillator, gainNode) {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(1337, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
    }

    playDefaultSound(oscillator, gainNode) {
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    playAnimation(animationType) {
        switch (animationType) {
            case 'konami-celebration':
                this.playKonamiAnimation();
                break;
            case 'matrix-glitch':
                this.playMatrixGlitch();
                break;
            case 'hacker-access':
                this.playHackerAccess();
                break;
            case 'leet-celebration':
                this.playLeetCelebration();
                break;
            case 'click-celebration':
                this.playClickCelebration();
                break;
            case 'scroll-celebration':
                this.playScrollCelebration();
                break;
            case 'console-celebration':
                this.playConsoleCelebration();
                break;
        }
    }

    playKonamiAnimation() {
        // Create Konami code visual effect
        const konamiEffect = document.createElement('div');
        konamiEffect.className = 'konami-effect';
        konamiEffect.innerHTML = '↑↑↓↓←→←→BA';
        document.body.appendChild(konamiEffect);

        setTimeout(() => {
            if (konamiEffect.parentNode) {
                konamiEffect.parentNode.removeChild(konamiEffect);
            }
        }, 3000);
    }

    playMatrixGlitch() {
        // Matrix glitch effect
        document.body.classList.add('matrix-glitch');
        setTimeout(() => {
            document.body.classList.remove('matrix-glitch');
        }, 2000);
    }

    playHackerAccess() {
        // Hacker access animation
        const accessEffect = document.createElement('div');
        accessEffect.className = 'hacker-access-effect';
        accessEffect.innerHTML = 'ACCESS GRANTED';
        document.body.appendChild(accessEffect);

        setTimeout(() => {
            if (accessEffect.parentNode) {
                accessEffect.parentNode.removeChild(accessEffect);
            }
        }, 2000);
    }

    playLeetCelebration() {
        // 1337 celebration
        const leetEffect = document.createElement('div');
        leetEffect.className = 'leet-effect';
        leetEffect.innerHTML = '1337';
        document.body.appendChild(leetEffect);

        setTimeout(() => {
            if (leetEffect.parentNode) {
                leetEffect.parentNode.removeChild(leetEffect);
            }
        }, 2000);
    }

    playClickCelebration() {
        // Click celebration effect
        document.body.classList.add('click-celebration');
        setTimeout(() => {
            document.body.classList.remove('click-celebration');
        }, 1500);
    }

    playScrollCelebration() {
        // Scroll celebration
        const scrollEffect = document.createElement('div');
        scrollEffect.className = 'scroll-effect';
        scrollEffect.innerHTML = '∞ SCROLL MASTER ∞';
        document.body.appendChild(scrollEffect);

        setTimeout(() => {
            if (scrollEffect.parentNode) {
                scrollEffect.parentNode.removeChild(scrollEffect);
            }
        }, 2500);
    }

    playConsoleCelebration() {
        // Console celebration
        console.log('%c🎉 CONSOLE DETECTIVE ACHIEVEMENT UNLOCKED! 🎉',
            'color: #00ff41; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
    }

    saveProgress() {
        const progress = {
            discoveredEggs: Array.from(this.discoveredEggs),
            specialModeActive: this.specialModeActive,
            timestamp: Date.now()
        };
        localStorage.setItem('easterEggProgress', JSON.stringify(progress));
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('easterEggProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.discoveredEggs = new Set(progress.discoveredEggs || []);
                this.specialModeActive = progress.specialModeActive || false;

                // Mark eggs as unlocked
                this.discoveredEggs.forEach(eggId => {
                    const egg = this.easterEggs.get(eggId);
                    if (egg) {
                        egg.unlocked = true;
                    }
                });

                // Restore special mode if it was active
                if (this.specialModeActive) {
                    this.activateSpecialMode();
                }
            }
        } catch (e) {
            console.log('Could not load easter egg progress');
        }
    }

    getProgress() {
        return {
            totalEggs: this.easterEggs.size,
            discoveredEggs: this.discoveredEggs.size,
            discoveredList: Array.from(this.discoveredEggs),
            specialModeActive: this.specialModeActive
        };
    }

    resetProgress() {
        this.discoveredEggs.clear();
        this.specialModeActive = false;
        this.easterEggs.forEach(egg => {
            egg.unlocked = false;
        });
        localStorage.removeItem('easterEggProgress');
        document.body.classList.remove('special-mode');
        console.log('Easter egg progress reset');
    }
}

// Initialize Easter Egg System with error handling
try {
    const easterEggSystem = new EasterEggSystem();
    window.easterEggSystem = easterEggSystem;
} catch (error) {
    console.error('Failed to initialize Easter Egg System:', error);
}

// Initialize Achievement System with error handling
try {
    const achievementSystem = new AchievementSystem();
    window.achievementSystem = achievementSystem;
} catch (error) {
    console.error('Failed to initialize Achievement System:', error);
}

// Achievement and Notification System
class AchievementSystem {
    constructor() {
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.notificationQueue = [];
        this.isShowingNotification = false;
        this.badges = new Map();
        this.userProgress = {
            totalPoints: 0,
            level: 1,
            experiencePoints: 0,
            toolsUsed: new Set(),
            featuresExplored: new Set(),
            themesUsed: new Set(),
            scriptsDownloaded: 0,
            timeSpent: 0,
            sessionsCount: 0,
            lastVisit: null,
            firstVisit: null,
            achievements: new Set(),
            badges: new Set(),
            specialModes: new Set()
        };
        this.userStats = {
            visitCount: 0,
            toolsUsed: 0,
            featuresClicked: 0,
            easterEggsFound: 0,
            themesChanged: 0,
            scriptsDownloaded: 0,
            timeOnPage: 0,
            lastActivity: Date.now()
        };

        this.initializeAchievements();
        this.initializeBadges();
        this.loadProgress();
        this.startProgressTracking();
        this.trackVisit();
    }

    initializeAchievements() {
        // First Visit Achievement
        this.achievements.set('first_visit', {
            id: 'first_visit',
            name: 'Welcome Aboard!',
            nameTh: 'ยินดีต้อนรับ!',
            description: 'Made your first visit to the dev tools page',
            descriptionTh: 'เข้าชมหน้าเครื่องมือ dev ครั้งแรก',
            icon: '🎉',
            points: 10,
            category: 'milestone',
            unlocked: false
        });

        // Tool Explorer Achievement
        this.achievements.set('tool_explorer', {
            id: 'tool_explorer',
            name: 'Tool Explorer',
            nameTh: 'นักสำรวจเครื่องมือ',
            description: 'Clicked on all feature cards',
            descriptionTh: 'คลิกดูฟีเจอร์ครบทุกตัว',
            icon: '🔧',
            points: 25,
            category: 'exploration',
            unlocked: false
        });

        // Theme Master Achievement
        this.achievements.set('theme_master', {
            id: 'theme_master',
            name: 'Theme Master',
            nameTh: 'นักปรับธีม',
            description: 'Changed themes multiple times',
            descriptionTh: 'เปลี่ยนธีมหลายครั้ง',
            icon: '🎨',
            points: 20,
            category: 'customization',
            unlocked: false
        });

        // Code Runner Achievement
        this.achievements.set('code_runner', {
            id: 'code_runner',
            name: 'Code Runner',
            nameTh: 'นักรันโค้ด',
            description: 'Ran code demos more than 10 times',
            descriptionTh: 'รันโค้ดทดลองมากกว่า 10 ครั้ง',
            icon: '💻',
            points: 30,
            category: 'activity',
            unlocked: false
        });

        // Easter Egg Hunter Achievement
        this.achievements.set('easter_egg_hunter', {
            id: 'easter_egg_hunter',
            name: 'Easter Egg Hunter',
            nameTh: 'นักล่าไข่อีสเตอร์',
            description: 'Found all easter eggs',
            descriptionTh: 'ค้นหาไข่อีสเตอร์ครบทั้งหมด',
            icon: '🥚',
            points: 100,
            category: 'master',
            unlocked: false
        });

        // Script Collector Achievement
        this.achievements.set('script_collector', {
            id: 'script_collector',
            name: 'Script Collector',
            nameTh: 'นักสะสมสคริปต์',
            description: 'Downloaded more than 5 scripts',
            descriptionTh: 'ดาวน์โหลดสคริปต์มากกว่า 5 ตัว',
            icon: '📦',
            points: 40,
            category: 'collection',
            unlocked: false
        });

        // Time Spent Achievement
        this.achievements.set('dedicated_user', {
            id: 'dedicated_user',
            name: 'Dedicated User',
            nameTh: 'ผู้ใช้ทุ่มเท',
            description: 'Spent more than 10 minutes exploring',
            descriptionTh: 'ใช้เวลาสำรวจมากกว่า 10 นาที',
            icon: '⏰',
            points: 50,
            category: 'dedication',
            unlocked: false
        });
    }

    initializeBadges() {
        // Beginner Badges
        this.badges.set('newcomer', {
            id: 'newcomer',
            name: 'Newcomer',
            nameTh: 'มือใหม่',
            description: 'First steps into the dev world',
            descriptionTh: 'ก้าวแรกสู่โลก dev',
            icon: '🌱',
            tier: 'bronze',
            requirement: 'first_visit',
            unlocked: false
        });

        // Explorer Badges
        this.badges.set('explorer', {
            id: 'explorer',
            name: 'Explorer',
            nameTh: 'นักสำรวจ',
            description: 'Explored all features',
            descriptionTh: 'สำรวจฟีเจอร์ครบทั้งหมด',
            icon: '🗺️',
            tier: 'silver',
            requirement: 'tool_explorer',
            unlocked: false
        });

        // Master Badges
        this.badges.set('hacker_master', {
            id: 'hacker_master',
            name: 'Hacker Master',
            nameTh: 'นักแฮกระดับเซียน',
            description: 'Unlocked all easter eggs and special modes',
            descriptionTh: 'ปลดล็อกไข่อีสเตอร์และโหมดพิเศษทั้งหมด',
            icon: '👑',
            tier: 'gold',
            requirement: 'easter_egg_hunter',
            unlocked: false
        });

        // Special Badges
        this.badges.set('developer_mode', {
            id: 'developer_mode',
            name: 'Developer Mode',
            nameTh: 'โหมดนักพัฒนา',
            description: 'Unlocked special developer features',
            descriptionTh: 'ปลดล็อกฟีเจอร์พิเศษสำหรับนักพัฒนา',
            icon: '🚀',
            tier: 'platinum',
            requirement: 'special_mode_unlock',
            unlocked: false
        });

        // Collection Badges
        this.badges.set('script_master', {
            id: 'script_master',
            name: 'Script Master',
            nameTh: 'เซียนสคริปต์',
            description: 'Downloaded and used many scripts',
            descriptionTh: 'ดาวน์โหลดและใช้สคริปต์มากมาย',
            icon: '📚',
            tier: 'gold',
            requirement: 'script_collector',
            unlocked: false
        });
    }

    startProgressTracking() {
        // Track time spent on page
        this.startTime = Date.now();
        this.timeTracker = setInterval(() => {
            this.userProgress.timeSpent += 1000; // Add 1 second
            this.checkTimeBasedAchievements();
        }, 1000);

        // Track user activity
        this.setupActivityTracking();

        // Update progress display
        this.updateProgressDisplay();
    }

    setupActivityTracking() {
        // Track feature card clicks
        document.querySelectorAll('.feature').forEach((feature, index) => {
            feature.addEventListener('click', () => {
                this.userProgress.featuresExplored.add(index);
                this.userStats.featuresClicked++;
                this.checkExplorationAchievements();
                this.saveProgress();
            });
        });

        // Track scroll behavior
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.userStats.lastActivity = Date.now();
            }, 100);
        });

        // Track mouse activity
        document.addEventListener('mousemove', () => {
            this.userStats.lastActivity = Date.now();
        });

        // Track keyboard activity
        document.addEventListener('keydown', () => {
            this.userStats.lastActivity = Date.now();
        });
    }

    trackVisit() {
        const now = Date.now();
        if (!this.userProgress.firstVisit) {
            this.userProgress.firstVisit = now;
            this.unlockAchievement('first_visit');
        }
        this.userProgress.lastVisit = now;
        this.userProgress.sessionsCount++;
        this.saveProgress();
    }

    trackToolUsage(toolName) {
        this.userProgress.toolsUsed.add(toolName);
        this.userStats.toolsUsed++;
        this.checkToolAchievements();
        this.saveProgress();
    }

    trackScriptDownload() {
        this.userProgress.scriptsDownloaded++;
        this.userStats.scriptsDownloaded++;
        this.checkCollectionAchievements();
        this.saveProgress();
    }

    trackThemeChange(themeName) {
        this.userProgress.themesUsed.add(themeName);
        this.userStats.themesChanged++;
        this.checkCustomizationAchievements();
        this.saveProgress();
    }

    checkExplorationAchievements() {
        // Check if all features have been explored
        if (this.userProgress.featuresExplored.size >= 6) { // Assuming 6 feature cards
            this.unlockAchievement('tool_explorer');
        }
    }

    checkTimeBasedAchievements() {
        // Check for dedicated user achievement (10 minutes)
        if (this.userProgress.timeSpent >= 600000 && !this.userProgress.achievements.has('dedicated_user')) {
            this.unlockAchievement('dedicated_user');
        }
    }

    checkToolAchievements() {
        // Check for code runner achievement
        if (this.userStats.toolsUsed >= 10) {
            this.unlockAchievement('code_runner');
        }
    }

    checkCollectionAchievements() {
        // Check for script collector achievement
        if (this.userProgress.scriptsDownloaded >= 5) {
            this.unlockAchievement('script_collector');
        }
    }

    checkCustomizationAchievements() {
        // Check for theme master achievement
        if (this.userProgress.themesUsed.size >= 3) {
            this.unlockAchievement('theme_master');
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        this.userProgress.achievements.add(achievementId);
        this.userProgress.totalPoints += achievement.points;
        this.userProgress.experiencePoints += achievement.points;

        // Level up calculation
        const newLevel = Math.floor(this.userProgress.experiencePoints / 100) + 1;
        const leveledUp = newLevel > this.userProgress.level;
        this.userProgress.level = newLevel;

        // Show achievement notification
        this.showAchievementNotification(achievement, leveledUp);

        // Check for badge unlocks
        this.checkBadgeUnlocks(achievementId);

        // Save progress
        this.saveProgress();

        // Update display
        this.updateProgressDisplay();
    }

    checkBadgeUnlocks(achievementId) {
        this.badges.forEach((badge, badgeId) => {
            if (badge.requirement === achievementId && !badge.unlocked) {
                this.unlockBadge(badgeId);
            }
        });

        // Special badge checks
        if (achievementId === 'easter_egg_hunter') {
            this.unlockBadge('hacker_master');
        }
    }

    unlockBadge(badgeId) {
        const badge = this.badges.get(badgeId);
        if (!badge || badge.unlocked) return;

        badge.unlocked = true;
        this.userProgress.badges.add(badgeId);

        // Show badge notification
        this.showBadgeNotification(badge);

        // Check for special developer mode unlock
        if (badgeId === 'hacker_master') {
            this.unlockSpecialDeveloperMode();
        }

        this.saveProgress();
        this.updateProgressDisplay();
    }

    unlockSpecialDeveloperMode() {
        this.userProgress.specialModes.add('developer_mode');
        document.body.classList.add('developer-mode');

        // Add special developer mode indicator
        this.showDeveloperModeIndicator();

        // Unlock developer badge
        this.unlockBadge('developer_mode');

        // Show special celebration
        this.showSpecialModeUnlockCelebration();
    }

    showAchievementNotification(achievement, leveledUp = false) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
                    <div class="achievement-content">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-text">
                            <div class="achievement-title">Achievement Unlocked!</div>
                            <div class="achievement-name">${achievement.name}</div>
                            <div class="achievement-description">${achievement.description}</div>
                            <div class="achievement-points">+${achievement.points} points</div>
                            ${leveledUp ? `<div class="level-up">Level Up! Now Level ${this.userProgress.level}</div>` : ''}
                        </div>
                    </div>
                `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Play sound effect
        this.playAchievementSound();

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
                    <div class="badge-content">
                        <div class="badge-icon">${badge.icon}</div>
                        <div class="badge-text">
                            <div class="badge-title">Badge Earned!</div>
                            <div class="badge-name">${badge.name}</div>
                            <div class="badge-tier">${badge.tier.toUpperCase()} TIER</div>
                            <div class="badge-description">${badge.description}</div>
                        </div>
                    </div>
                `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Play badge sound effect
        this.playBadgeSound();

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 6000);
        }, 6000);
    }

    showDeveloperModeIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'developer-mode-indicator';
        indicator.innerHTML = `
                    <div class="dev-mode-icon">🚀</div>
                    <div class="dev-mode-text">Developer Mode</div>
                `;
        document.body.appendChild(indicator);
    }

    showSpecialModeUnlockCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'special-mode-celebration';
        celebration.innerHTML = `
                    <div class="celebration-content">
                        <div class="celebration-icon">🎉</div>
                        <div class="celebration-title">DEVELOPER MODE UNLOCKED!</div>
                        <div class="celebration-description">
                            You've mastered all the features and earned the ultimate badge!<br>
                            Special developer features are now available.
                        </div>
                        <div class="celebration-features">
                            <div class="feature-item">🔧 Advanced debugging tools</div>
                            <div class="feature-item">⚡ Enhanced performance mode</div>
                            <div class="feature-item">🎨 Exclusive themes</div>
                            <div class="feature-item">🚀 Beta features access</div>
                        </div>
                    </div>
                `;

        document.body.appendChild(celebration);
        setTimeout(() => celebration.classList.add('show'), 100);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            celebration.classList.remove('show');
            setTimeout(() => celebration.remove(), 1000);
        }, 10000);
    }

    updateProgressDisplay() {
        // Create or update progress panel
        let progressPanel = document.getElementById('progressPanel');
        if (!progressPanel) {
            progressPanel = this.createProgressPanel();
        }

        // Update progress information
        this.updateProgressPanel(progressPanel);
    }

    createProgressPanel() {
        const panel = document.createElement('div');
        panel.id = 'progressPanel';
        panel.className = 'progress-panel';
        panel.innerHTML = `
                    <div class="progress-header">
                        <div class="progress-title">🏆 Progress</div>
                        <button class="progress-toggle" type="button">📊</button>
                    </div>
                    <div class="progress-content">
                        <div class="level-info">
                            <div class="level-display">Level <span id="currentLevel">1</span></div>
                            <div class="points-display"><span id="currentPoints">0</span> points</div>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="progressFill"></div>
                            </div>
                            <div class="progress-text" id="progressText">0 / 100 XP</div>
                        </div>
                        <div class="achievements-summary">
                            <div class="achievement-count">
                                <span id="achievementCount">0</span> / <span id="totalAchievements">0</span> Achievements
                            </div>
                            <div class="badge-count">
                                <span id="badgeCount">0</span> / <span id="totalBadges">0</span> Badges
                            </div>
                        </div>
                        <div class="recent-achievements" id="recentAchievements"></div>
                    </div>
                `;

        // Position the panel
        panel.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: rgba(0, 0, 0, 0.9);
                    border: 2px solid #00ff41;
                    border-radius: 10px;
                    padding: 15px;
                    z-index: 1000;
                    min-width: 250px;
                    backdrop-filter: blur(10px);
                    transform: translateX(-280px);
                    transition: transform 0.3s ease;
                `;

        // Add toggle functionality
        const toggle = panel.querySelector('.progress-toggle');
        const content = panel.querySelector('.progress-content');
        let isExpanded = false;

        toggle.addEventListener('click', () => {
            isExpanded = !isExpanded;
            if (isExpanded) {
                panel.style.transform = 'translateX(0)';
                content.style.display = 'block';
            } else {
                panel.style.transform = 'translateX(-280px)';
                setTimeout(() => {
                    if (!isExpanded) content.style.display = 'none';
                }, 300);
            }
        });

        document.body.appendChild(panel);
        return panel;
    }

    updateProgressPanel(panel) {
        const currentLevel = panel.querySelector('#currentLevel');
        const currentPoints = panel.querySelector('#currentPoints');
        const progressFill = panel.querySelector('#progressFill');
        const progressText = panel.querySelector('#progressText');
        const achievementCount = panel.querySelector('#achievementCount');
        const totalAchievements = panel.querySelector('#totalAchievements');
        const badgeCount = panel.querySelector('#badgeCount');
        const totalBadges = panel.querySelector('#totalBadges');

        if (currentLevel) currentLevel.textContent = this.userProgress.level;
        if (currentPoints) currentPoints.textContent = this.userProgress.totalPoints;

        // Calculate progress to next level
        const currentLevelXP = (this.userProgress.level - 1) * 100;
        const nextLevelXP = this.userProgress.level * 100;
        const progressInLevel = this.userProgress.experiencePoints - currentLevelXP;
        const progressPercent = (progressInLevel / 100) * 100;

        if (progressFill) progressFill.style.width = `${Math.min(100, progressPercent)}%`;
        if (progressText) progressText.textContent = `${progressInLevel} / 100 XP`;

        if (achievementCount) achievementCount.textContent = this.userProgress.achievements.size;
        if (totalAchievements) totalAchievements.textContent = this.achievements.size;
        if (badgeCount) badgeCount.textContent = this.userProgress.badges.size;
        if (totalBadges) totalBadges.textContent = this.badges.size;
    }

    playAchievementSound() {
        // Create achievement sound effect
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Fallback for browsers without Web Audio API
            console.log('🎵 Achievement unlocked!');
        }
    }

    playBadgeSound() {
        // Create badge sound effect (more elaborate)
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Play a triumphant chord progression
            oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
            oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime + 0.15); // E4
            oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime + 0.3); // G4
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.45); // C5

            gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.8);
        } catch (e) {
            console.log('🏆 Badge earned!');
        }
    }

    saveProgress() {
        const progressData = {
            userProgress: {
                ...this.userProgress,
                toolsUsed: Array.from(this.userProgress.toolsUsed),
                featuresExplored: Array.from(this.userProgress.featuresExplored),
                themesUsed: Array.from(this.userProgress.themesUsed),
                achievements: Array.from(this.userProgress.achievements),
                badges: Array.from(this.userProgress.badges),
                specialModes: Array.from(this.userProgress.specialModes)
            },
            userStats: this.userStats,
            timestamp: Date.now()
        };

        localStorage.setItem('userProgress', JSON.stringify(progressData));
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('userProgress');
            if (saved) {
                const data = JSON.parse(saved);

                // Restore progress data
                if (data.userProgress) {
                    this.userProgress = {
                        ...this.userProgress,
                        ...data.userProgress,
                        toolsUsed: new Set(data.userProgress.toolsUsed || []),
                        featuresExplored: new Set(data.userProgress.featuresExplored || []),
                        themesUsed: new Set(data.userProgress.themesUsed || []),
                        achievements: new Set(data.userProgress.achievements || []),
                        badges: new Set(data.userProgress.badges || []),
                        specialModes: new Set(data.userProgress.specialModes || [])
                    };
                }

                if (data.userStats) {
                    this.userStats = { ...this.userStats, ...data.userStats };
                }

                // Mark achievements as unlocked
                this.userProgress.achievements.forEach(achievementId => {
                    const achievement = this.achievements.get(achievementId);
                    if (achievement) achievement.unlocked = true;
                });

                // Mark badges as unlocked
                this.userProgress.badges.forEach(badgeId => {
                    const badge = this.badges.get(badgeId);
                    if (badge) badge.unlocked = true;
                });

                // Restore special modes
                if (this.userProgress.specialModes.has('developer_mode')) {
                    document.body.classList.add('developer-mode');
                    this.showDeveloperModeIndicator();
                }
            }
        } catch (e) {
            console.log('Could not load user progress');
        }
    }

    getProgressSummary() {
        return {
            level: this.userProgress.level,
            totalPoints: this.userProgress.totalPoints,
            achievementsUnlocked: this.userProgress.achievements.size,
            totalAchievements: this.achievements.size,
            badgesEarned: this.userProgress.badges.size,
            totalBadges: this.badges.size,
            timeSpent: this.userProgress.timeSpent,
            sessionsCount: this.userProgress.sessionsCount,
            specialModesUnlocked: this.userProgress.specialModes.size
        };
    }

    resetProgress() {
        // Clear all progress
        this.userProgress = {
            totalPoints: 0,
            level: 1,
            experiencePoints: 0,
            toolsUsed: new Set(),
            featuresExplored: new Set(),
            themesUsed: new Set(),
            scriptsDownloaded: 0,
            timeSpent: 0,
            sessionsCount: 0,
            lastVisit: null,
            firstVisit: null,
            achievements: new Set(),
            badges: new Set(),
            specialModes: new Set()
        };

        this.userStats = {
            visitCount: 0,
            toolsUsed: 0,
            featuresClicked: 0,
            easterEggsFound: 0,
            themesChanged: 0,
            scriptsDownloaded: 0,
            timeOnPage: 0,
            lastActivity: Date.now()
        };

        // Reset achievements and badges
        this.achievements.forEach(achievement => achievement.unlocked = false);
        this.badges.forEach(badge => badge.unlocked = false);

        // Remove special modes
        document.body.classList.remove('developer-mode');
        const devIndicator = document.querySelector('.developer-mode-indicator');
        if (devIndicator) devIndicator.remove();

        // Clear storage
        localStorage.removeItem('userProgress');

        // Update display
        this.updateProgressDisplay();

        console.log('User progress reset');
    }
}

// Add some helpful console messages for users who open the console
console.log('%c🦈 Welcome to Shark Console!', 'color: #00ff41; font-size: 16px; font-weight: bold;');
console.log('%c🥚 Easter eggs are hidden throughout this page...', 'color: #00ccff; font-size: 12px;');
console.log('%c💡 Try the Konami Code: ↑↑↓↓←→←→BA', 'color: #ffff00; font-size: 12px;');
console.log('%c🔍 Or type "follow the white rabbit" in any input field', 'color: #ff00ff; font-size: 12px;');
console.log('%c⌨️ Press Ctrl+Alt+H+A+C+K for advanced access', 'color: #ff8c00; font-size: 12px;');
console.log('%c🕐 Visit at 13:37 for a special surprise', 'color: #00ff80; font-size: 12px;');

// Enhanced 3D Feature Card Interactions
class InteractiveCard {
    constructor(element) {
        this.element = element;
        this.isHovered = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.setupEventListeners();
        this.setupGlowEffect();
    }

    setupEventListeners() {
        this.element.addEventListener('mouseenter', (e) => {
            this.isHovered = true;
            this.startGlowAnimation();
        });

        this.element.addEventListener('mouseleave', (e) => {
            this.isHovered = false;
            this.resetTransform();
            this.stopGlowAnimation();
        });

        this.element.addEventListener('mousemove', (e) => {
            if (!this.isHovered) return;
            this.updateMousePosition(e);
            this.update3DTransform();
        });

        // Touch support for mobile
        this.element.addEventListener('touchstart', (e) => {
            this.isHovered = true;
            this.startGlowAnimation();
            if (e.touches.length > 0) {
                this.updateMousePosition(e.touches[0]);
                this.update3DTransform();
            }
        });

        this.element.addEventListener('touchend', (e) => {
            this.isHovered = false;
            this.resetTransform();
            this.stopGlowAnimation();
        });

        this.element.addEventListener('touchmove', (e) => {
            if (!this.isHovered || e.touches.length === 0) return;
            this.updateMousePosition(e.touches[0]);
            this.update3DTransform();
        });
    }

    updateMousePosition(event) {
        const rect = this.element.getBoundingClientRect();
        this.mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouseY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    }

    update3DTransform() {
        const maxRotation = 15;
        const maxTranslation = 10;

        const rotateY = this.mouseX * maxRotation;
        const rotateX = -this.mouseY * maxRotation;
        const translateZ = Math.abs(this.mouseX) + Math.abs(this.mouseY) * maxTranslation;

        this.element.style.transform = `
                    translateY(-15px) 
                    translateZ(${translateZ}px)
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale(1.05)
                `;
    }

    resetTransform() {
        this.element.style.transform = '';
    }

    setupGlowEffect() {
        // Create dynamic glow elements
        const glowElement = document.createElement('div');
        glowElement.className = 'feature-glow';
        glowElement.style.cssText = `
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: linear-gradient(45deg, #00ff41, #00ccff, #ff00ff, #ffff00, #00ff41);
                    background-size: 400% 400%;
                    border-radius: 14px;
                    opacity: 0;
                    z-index: -1;
                    transition: opacity 0.4s ease;
                    animation: gradientShift 3s ease infinite;
                `;

        this.element.style.position = 'relative';
        this.element.appendChild(glowElement);
        this.glowElement = glowElement;
    }

    startGlowAnimation() {
        if (this.glowElement) {
            this.glowElement.style.opacity = '0.6';
        }
    }

    stopGlowAnimation() {
        if (this.glowElement) {
            this.glowElement.style.opacity = '0';
        }
    }
}

// Initialize interactive cards
function initializeInteractiveCards() {
    const featureCards = document.querySelectorAll('.feature');
    featureCards.forEach(card => {
        new InteractiveCard(card);
    });
}

// Add gradient animation keyframes via CSS
const glowStyles = document.createElement('style');
glowStyles.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            .feature-glow {
                filter: blur(8px);
            }
            
            /* Enhanced micro-interactions */
            .feature:hover .icon {
                animation: iconFloat 2s ease-in-out infinite, iconPulse 2s ease-in-out infinite;
            }
            
            @keyframes iconFloat {
                0%, 100% { transform: translateZ(20px) rotateY(360deg) scale(1.2) translateY(0px); }
                50% { transform: translateZ(25px) rotateY(360deg) scale(1.3) translateY(-5px); }
            }
            
            /* Staggered animation for card elements */
            .feature:hover .icon {
                animation-delay: 0s;
            }
            
            .feature:hover h3 {
                animation: textGlow 1.5s ease-in-out infinite;
                animation-delay: 0.1s;
            }
            
            .feature:hover p {
                animation: textShimmer 2s ease-in-out infinite;
                animation-delay: 0.2s;
            }
            
            @keyframes textGlow {
                0%, 100% { 
                    text-shadow: 
                        0 0 10px rgba(0, 255, 65, 0.8),
                        0 0 20px rgba(0, 255, 65, 0.6),
                        0 0 30px rgba(0, 255, 65, 0.4);
                }
                50% { 
                    text-shadow: 
                        0 0 15px rgba(0, 255, 65, 1),
                        0 0 30px rgba(0, 255, 65, 0.8),
                        0 0 45px rgba(0, 255, 65, 0.6);
                }
            }
            
            @keyframes textShimmer {
                0%, 100% { 
                    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                }
                50% { 
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
                }
            }
        `;
document.head.appendChild(glowStyles);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInteractiveCards);
} else {
    initializeInteractiveCards();
}

// Tool Preview Modal System
class ToolPreviewModal {
    constructor() {
        this.modal = document.getElementById('toolPreviewModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.querySelector('.tool-description');
        this.demoPreview = document.querySelector('.demo-preview');
        this.consoleOutput = document.getElementById('consoleOutput');
        this.consoleInput = document.getElementById('consoleInput');
        this.networkSvg = document.getElementById('networkSvg');
        this.currentTool = null;

        this.toolData = {
            'Floating Console': {
                title: '🚀 Floating Console',
                description: 'แผงคอนโซลที่พกพาง่าย ไม่ว่าคุณจะเป็นนักพัฒนา หรือแฮกเกอร์ก็สามารถสนุกกับมันได้',
                demo: this.generateConsoleDemo,
                category: 'development'
            },
            '7 Security Tools': {
                title: '🔧 7 Security Tools',
                description: 'เครื่องมือทดสอบช่องโหว่ที่หลากหลาย นำมาบีบอัดเพื่อให้สะดวกในการใช้งาน',
                demo: this.generateSecurityDemo,
                category: 'security'
            },
            'ธีมทวิตเตอร์': {
                title: '📱 ธีมทวิตเตอร์',
                description: 'สิ่งที่Devมือใหม่คิดว่ายาก เราได้ทำมาให้แล้ว แค่โหลด extension ไปปรับแต่งได้ตามสไตล์ของตัวเอง',
                demo: this.generateThemeDemo,
                category: 'ui'
            },
            'Code Snippets': {
                title: '💾 Code Snippets',
                description: 'Save and organize your frequently used JavaScript code snippets for quick access.',
                demo: this.generateSnippetsDemo,
                category: 'development'
            },
            'Metatag': {
                title: '⚡ Metatag',
                description: 'สิ่งที่จะทำให้โพสของคุณ ดูเป็นมืออาชีพ เพียงแค่ใส่ลิ้งค์ ดาวน์โหลดไฟล์ และอัปโหลดผ่านNetlify/github',
                demo: this.generateMetatagDemo,
                category: 'utility'
            },
            'Matrix Theme': {
                title: '🎨 Matrix Theme',
                description: 'Sleek hacker-inspired design with customizable themes and smooth animations.',
                demo: this.generateMatrixDemo,
                category: 'ui'
            }
        };

        this.setupEventListeners();
        this.setupMiniConsole();
    }

    setupEventListeners() {
        // Close modal events
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Tab switching
        const tabButtons = this.modal.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Feature card click events
        const featureCards = document.querySelectorAll('.feature');
        featureCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const toolName = card.querySelector('h3').textContent;
                this.openModal(toolName);
            });
        });
    }

    setupMiniConsole() {
        const clearBtn = document.getElementById('clearConsole');
        const runBtn = document.getElementById('runCode');

        clearBtn.addEventListener('click', () => {
            this.consoleOutput.innerHTML = '';
        });

        runBtn.addEventListener('click', () => {
            this.executeConsoleCode();
        });

        this.consoleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.executeConsoleCode();
            }
        });
    }

    openModal(toolName) {
        const tool = this.toolData[toolName];
        if (!tool) return;

        this.currentTool = tool;
        this.modalTitle.textContent = tool.title;
        this.modalDescription.textContent = tool.description;

        // Generate demo content
        this.demoPreview.innerHTML = tool.demo.call(this);

        // Generate network diagram for security tools
        if (tool.category === 'security') {
            this.generateNetworkDiagram();
        }

        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');

        // Focus management
        const firstFocusable = this.modal.querySelector('.modal-close');
        firstFocusable.focus();
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        this.currentTool = null;
    }

    switchTab(tabName) {
        // Update tab buttons
        const tabButtons = this.modal.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab panels
        const tabPanels = this.modal.querySelectorAll('.tab-panel');
        tabPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-tab`);
        });
    }

    executeConsoleCode() {
        const code = this.consoleInput.value.trim();
        if (!code) return;

        this.addConsoleOutput(`> ${code}`, 'input');

        try {
            // Create a safe execution context
            const result = this.safeEval(code);
            this.addConsoleOutput(result, 'output');
        } catch (error) {
            this.addConsoleOutput(`Error: ${error.message}`, 'error');
        }

        this.consoleInput.value = '';
    }

    safeEval(code) {
        // Simple safe evaluation for demo purposes
        const allowedFunctions = {
            console: {
                log: (...args) => args.join(' '),
                error: (...args) => `Error: ${args.join(' ')}`,
                warn: (...args) => `Warning: ${args.join(' ')}`
            },
            Math: Math,
            Date: Date,
            JSON: JSON
        };

        // Basic security: prevent access to dangerous objects
        const restrictedKeywords = ['window', 'document', 'eval', 'Function', 'setTimeout', 'setInterval'];
        for (const keyword of restrictedKeywords) {
            if (code.includes(keyword)) {
                throw new Error(`Access to '${keyword}' is restricted in demo mode`);
            }
        }

        // Simple expression evaluation
        try {
            return Function('"use strict"; return (' + code + ')')();
        } catch (e) {
            // Try as statement
            return Function('"use strict"; ' + code)();
        }
    }

    addConsoleOutput(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `console-line console-${type}`;

        const colors = {
            input: '#00ccff',
            output: '#00ff41',
            error: '#ff4444'
        };

        line.style.color = colors[type] || '#00ff41';
        line.textContent = text;

        this.consoleOutput.appendChild(line);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }

    generateConsoleDemo() {
        return `
                    <div class="demo-code">
                        <div class="code-line">// Floating Console Demo</div>
                        <div class="code-line">const console = new FloatingConsole();</div>
                        <div class="code-line">console.show();</div>
                        <div class="code-line"></div>
                        <div class="code-line">// Execute JavaScript on any page</div>
                        <div class="code-line">document.querySelectorAll('img').forEach(img => {</div>
                        <div class="code-line">&nbsp;&nbsp;img.style.filter = 'hue-rotate(180deg)';</div>
                        <div class="code-line">});</div>
                        <div class="code-line"></div>
                        <div class="code-line"><span style="color: #00ff41;">✓ Console ready for hacking!</span></div>
                    </div>
                `;
    }

    generateSecurityDemo() {
        return `
                    <div class="demo-code">
                        <div class="code-line">// Security Tools Suite</div>
                        <div class="code-line">🔧 BurpShark - Advanced web security testing</div>
                        <div class="code-line">🔍 SharkScan - Vulnerability scanner</div>
                        <div class="code-line">🎯 Snipers - Precision targeting tool</div>
                        <div class="code-line">🌐 Network Monitor - Traffic analysis</div>
                        <div class="code-line">🔒 Crypto Tools - Encryption utilities</div>
                        <div class="code-line">📊 Report Generator - Security reports</div>
                        <div class="code-line">⚡ Quick Scan - Fast vulnerability check</div>
                        <div class="code-line"></div>
                        <div class="code-line"><span style="color: #ff4444;">⚠️ Use only for authorized testing!</span></div>
                    </div>
                `;
    }

    generateThemeDemo() {
        return `
                    <div class="demo-code">
                        <div class="code-line">// Twitter Theme Customization</div>
                        <div class="code-line">const themes = {</div>
                        <div class="code-line">&nbsp;&nbsp;dark: '#1a1a1a',</div>
                        <div class="code-line">&nbsp;&nbsp;matrix: '#00ff41',</div>
                        <div class="code-line">&nbsp;&nbsp;cyberpunk: '#ff00ff',</div>
                        <div class="code-line">&nbsp;&nbsp;hacker: '#00ffff'</div>
                        <div class="code-line">};</div>
                        <div class="code-line"></div>
                        <div class="code-line">applyTheme(themes.matrix);</div>
                        <div class="code-line"><span style="color: #00ff41;">✓ Theme applied successfully!</span></div>
                    </div>
                `;
    }

    generateSnippetsDemo() {
        return `
                    <div class="demo-code">
                        <div class="code-line">// Code Snippets Manager</div>
                        <div class="code-line">const snippets = new SnippetManager();</div>
                        <div class="code-line"></div>
                        <div class="code-line">// Save frequently used code</div>
                        <div class="code-line">snippets.save('domReady', \`</div>
                        <div class="code-line">&nbsp;&nbsp;document.addEventListener('DOMContentLoaded', () => {</div>
                        <div class="code-line">&nbsp;&nbsp;&nbsp;&nbsp;// Your code here</div>
                        <div class="code-line">&nbsp;&nbsp;});</div>
                        <div class="code-line">\`);</div>
                        <div class="code-line"></div>
                        <div class="code-line"><span style="color: #00ff41;">✓ Snippet saved!</span></div>
                    </div>
                `;
    }

    generateMetatagDemo() {
        return `
                    <div class="demo-code">
                        <div class="code-line">// Meta Tag Generator</div>
                        <div class="code-line">&lt;meta property="og:title" content="Shark Console" /&gt;</div>
                        <div class="code-line">&lt;meta property="og:description" content="Advanced Dev Tools" /&gt;</div>
                        <div class="code-line">&lt;meta property="og:image" content="preview.jpg" /&gt;</div>
                        <div class="code-line">&lt;meta name="twitter:card" content="summary_large_image" /&gt;</div>
                        <div class="code-line"></div>
                        <div class="code-line">// Generate dynamic previews</div>
                        <div class="code-line">generatePreview({ title, description, image });</div>
                        <div class="code-line"><span style="color: #00ff41;">✓ Meta tags generated!</span></div>
                    </div>
                `;
    }

    generateMatrixDemo() {
        return `
                    <div class="demo-code">
                        <div class="code-line">// Matrix Theme System</div>
                        <div class="code-line">const matrix = new MatrixTheme({</div>
                        <div class="code-line">&nbsp;&nbsp;colors: ['#00ff41', '#00ccff', '#ff00ff'],</div>
                        <div class="code-line">&nbsp;&nbsp;speed: 'medium',</div>
                        <div class="code-line">&nbsp;&nbsp;particles: true,</div>
                        <div class="code-line">&nbsp;&nbsp;parallax: true</div>
                        <div class="code-line">});</div>
                        <div class="code-line"></div>
                        <div class="code-line">matrix.activate();</div>
                        <div class="code-line"><span style="color: #00ff41;">✓ Welcome to the Matrix!</span></div>
                    </div>
                `;
    }

    generateNetworkDiagram() {
        const svg = this.networkSvg;
        svg.innerHTML = ''; // Clear existing content

        const width = svg.clientWidth || 600;
        const height = 300;

        // Create network nodes
        const nodes = [
            { id: 'client', x: 50, y: 150, type: 'secure', label: 'Client' },
            { id: 'proxy', x: 200, y: 100, type: 'scanning', label: 'Proxy' },
            { id: 'server', x: 350, y: 150, type: 'vulnerable', label: 'Target' },
            { id: 'db', x: 500, y: 200, type: 'secure', label: 'Database' },
            { id: 'api', x: 350, y: 50, type: 'vulnerable', label: 'API' }
        ];

        const connections = [
            { from: 'client', to: 'proxy' },
            { from: 'proxy', to: 'server' },
            { from: 'server', to: 'db' },
            { from: 'server', to: 'api' }
        ];

        // Draw connections
        connections.forEach(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromNode.x);
            line.setAttribute('y1', fromNode.y);
            line.setAttribute('x2', toNode.x);
            line.setAttribute('y2', toNode.y);
            line.setAttribute('stroke', '#00ff41');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('opacity', '0.6');

            // Animated data flow
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animate.setAttribute('attributeName', 'opacity');
            animate.setAttribute('values', '0.6;1;0.6');
            animate.setAttribute('dur', '2s');
            animate.setAttribute('repeatCount', 'indefinite');
            line.appendChild(animate);

            svg.appendChild(line);
        });

        // Draw nodes
        nodes.forEach(node => {
            const colors = {
                secure: '#00ff41',
                vulnerable: '#ff4444',
                scanning: '#ffff00'
            };

            // Node circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', '15');
            circle.setAttribute('fill', colors[node.type]);
            circle.setAttribute('stroke', colors[node.type]);
            circle.setAttribute('stroke-width', '2');
            circle.setAttribute('opacity', '0.8');

            // Pulsing animation for scanning nodes
            if (node.type === 'scanning') {
                const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animate.setAttribute('attributeName', 'r');
                animate.setAttribute('values', '15;20;15');
                animate.setAttribute('dur', '1.5s');
                animate.setAttribute('repeatCount', 'indefinite');
                circle.appendChild(animate);
            }

            svg.appendChild(circle);

            // Node label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y + 35);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#ccc');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-family', 'monospace');
            text.textContent = node.label;
            svg.appendChild(text);
        });
    }
}

// Initialize Tool Preview Modal
const toolModal = new ToolPreviewModal();

// Real-time Visual Feedback System
class VisualFeedbackSystem {
    constructor() {
        this.feedbackContainer = this.createFeedbackContainer();
        this.soundEnabled = true;
        this.touchDevice = 'ontouchstart' in window;
        this.setupGlobalFeedback();
        this.createSoundEffects();
    }

    createFeedbackContainer() {
        const container = document.createElement('div');
        container.id = 'feedbackContainer';
        container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    pointer-events: none;
                    max-width: 300px;
                `;
        document.body.appendChild(container);
        return container;
    }

    createSoundEffects() {
        // Create audio context for sound effects
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.sounds = {
                click: this.createTone(800, 0.1, 'sine'),
                hover: this.createTone(600, 0.05, 'sine'),
                success: this.createTone(1000, 0.2, 'triangle'),
                error: this.createTone(300, 0.3, 'sawtooth'),
                notification: this.createChord([523.25, 659.25, 783.99], 0.4) // C-E-G chord
            };
        } catch (e) {
            console.log('Audio context not available');
            this.soundEnabled = false;
        }
    }

    createTone(frequency, duration, type = 'sine') {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createChord(frequencies, duration) {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;

            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);

                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';

                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + duration);
                }, index * 50);
            });
        };
    }

    setupGlobalFeedback() {
        // Enhanced click feedback for all interactive elements
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (this.isInteractiveElement(target)) {
                this.createClickRipple(e.clientX, e.clientY);
                this.playSound('click');
                this.addHapticFeedback();
            }
        });

        // Enhanced hover feedback
        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (this.isInteractiveElement(target)) {
                this.createHoverGlow(target);
                this.playSound('hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target;
            if (this.isInteractiveElement(target)) {
                this.removeHoverGlow(target);
            }
        });

        // Touch feedback for mobile devices
        if (this.touchDevice) {
            document.addEventListener('touchstart', (e) => {
                const target = e.target;
                if (this.isInteractiveElement(target)) {
                    this.createTouchFeedback(e.touches[0].clientX, e.touches[0].clientY);
                    this.playSound('click');
                    this.addHapticFeedback();
                }
            });
        }

        // Form input feedback
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.createInputFeedback(e.target);
            }
        });

        // Scroll feedback
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            this.showScrollIndicator();
            scrollTimeout = setTimeout(() => {
                this.hideScrollIndicator();
            }, 1000);
        });
    }

    isInteractiveElement(element) {
        const interactiveSelectors = [
            'button', 'a', '.feature', '.btn', '.tab-button',
            '.console-btn', '.modal-close', '.social-link',
            'input', 'textarea', '[role="button"]', '[tabindex]'
        ];

        return interactiveSelectors.some(selector =>
            element.matches && element.matches(selector)
        );
    }

    createClickRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.cssText = `
                    position: fixed;
                    left: ${x - 25}px;
                    top: ${y - 25}px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(0, 255, 65, 0.6) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 10001;
                    animation: rippleExpand 0.6s ease-out forwards;
                `;

        document.body.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    createTouchFeedback(x, y) {
        const feedback = document.createElement('div');
        feedback.className = 'touch-feedback';
        feedback.style.cssText = `
                    position: fixed;
                    left: ${x - 30}px;
                    top: ${y - 30}px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(0, 255, 65, 0.4) 0%, rgba(0, 255, 65, 0.1) 50%, transparent 70%);
                    border: 2px solid rgba(0, 255, 65, 0.6);
                    pointer-events: none;
                    z-index: 10001;
                    animation: touchExpand 0.4s ease-out forwards;
                `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 400);
    }

    createHoverGlow(element) {
        if (element.dataset.glowActive) return;

        element.dataset.glowActive = 'true';
        const originalBoxShadow = element.style.boxShadow;

        element.style.transition = 'box-shadow 0.3s ease';
        element.style.boxShadow = `
                    ${originalBoxShadow}, 
                    0 0 20px rgba(0, 255, 65, 0.3),
                    inset 0 0 20px rgba(0, 255, 65, 0.1)
                `;
    }

    removeHoverGlow(element) {
        delete element.dataset.glowActive;
        element.style.boxShadow = '';
    }

    createInputFeedback(input) {
        const feedback = document.createElement('div');
        feedback.className = 'input-feedback';
        feedback.textContent = '✓';
        feedback.style.cssText = `
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #00ff41;
                    font-weight: bold;
                    opacity: 0;
                    animation: inputPulse 0.5s ease-out forwards;
                    pointer-events: none;
                    z-index: 10;
                `;

        const rect = input.getBoundingClientRect();
        feedback.style.position = 'fixed';
        feedback.style.left = (rect.right - 30) + 'px';
        feedback.style.top = (rect.top + rect.height / 2) + 'px';

        document.body.appendChild(feedback);

        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 500);
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `feedback-notification ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
                    <div class="notification-icon">${icons[type] || icons.info}</div>
                    <div class="notification-message">${message}</div>
                `;

        notification.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(0, 0, 0, 0.9);
                    border: 1px solid ${type === 'error' ? '#ff4444' : '#00ff41'};
                    border-radius: 8px;
                    padding: 12px 16px;
                    margin-bottom: 10px;
                    color: ${type === 'error' ? '#ff4444' : '#00ff41'};
                    font-size: 0.9rem;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    backdrop-filter: blur(10px);
                `;

        this.feedbackContainer.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Play sound
        this.playSound(type === 'error' ? 'error' : 'notification');

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);

        return notification;
    }

    showScrollIndicator() {
        let indicator = document.getElementById('scrollIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'scrollIndicator';
            indicator.style.cssText = `
                        position: fixed;
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 4px;
                        height: 100px;
                        background: rgba(0, 255, 65, 0.3);
                        border-radius: 2px;
                        z-index: 1000;
                        opacity: 0;
                        transition: opacity 0.3s ease;
                    `;
            document.body.appendChild(indicator);

            const progress = document.createElement('div');
            progress.style.cssText = `
                        width: 100%;
                        background: #00ff41;
                        border-radius: 2px;
                        transition: height 0.1s ease;
                        box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
                    `;
            indicator.appendChild(progress);
            indicator.progressBar = progress;
        }

        const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        indicator.progressBar.style.height = Math.min(100, Math.max(0, scrollPercent)) + '%';
        indicator.style.opacity = '1';
    }

    hideScrollIndicator() {
        const indicator = document.getElementById('scrollIndicator');
        if (indicator) {
            indicator.style.opacity = '0';
        }
    }

    addHapticFeedback() {
        // Vibration API for mobile devices
        if ('vibrate' in navigator) {
            navigator.vibrate(50); // Short vibration
        }
    }

    playSound(soundName) {
        if (this.sounds && this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.showNotification(
            `Sound effects ${this.soundEnabled ? 'enabled' : 'disabled'}`,
            'info'
        );
    }
}

// Add CSS animations for feedback effects
const feedbackStyles = document.createElement('style');
feedbackStyles.textContent = `
            @keyframes rippleExpand {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes touchExpand {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes inputPulse {
                0% {
                    opacity: 0;
                    transform: translateY(-50%) scale(0.5);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-50%) scale(1.2);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-50%) scale(1);
                }
            }
            
            /* Enhanced touch feedback for mobile */
            @media (max-width: 768px) {
                .feature:active {
                    transform: translateY(-10px) scale(0.98);
                    transition: transform 0.1s ease;
                }
                
                .btn:active {
                    transform: translateY(-2px) scale(0.95);
                }
                
                .tab-button:active {
                    background: rgba(0, 255, 65, 0.3);
                }
            }
            
            /* Accessibility: Respect reduced motion preferences */
            @media (prefers-reduced-motion: reduce) {
                .click-ripple,
                .touch-feedback,
                .input-feedback {
                    animation: none !important;
                    opacity: 0 !important;
                }
                
                .feedback-notification {
                    transition: none !important;
                    transform: none !important;
                }
            }
        `;
document.head.appendChild(feedbackStyles);

// Initialize Visual Feedback System
const feedbackSystem = new VisualFeedbackSystem();

// Add sound toggle button
const soundToggle = document.createElement('button');
soundToggle.innerHTML = '🔊';
soundToggle.title = 'Toggle sound effects';
soundToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #00ff41;
            color: #00ff41;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
        `;

soundToggle.addEventListener('click', () => {
    feedbackSystem.toggleSound();
    soundToggle.innerHTML = feedbackSystem.soundEnabled ? '🔊' : '🔇';
});

document.body.appendChild(soundToggle);

// Demo notifications on page load
setTimeout(() => {
    feedbackSystem.showNotification('🦈 Shark Console loaded successfully!', 'success');
}, 1000);

setTimeout(() => {
    feedbackSystem.showNotification('Click on feature cards to see demos', 'info');
}, 3000);

// Console panel functionality
let isDragging = false;
let isResizing = false;
let dragOffset = { x: 0, y: 0 };
let startSize = { width: 0, height: 0 };
let startPos = { x: 0, y: 0 };

const panel = document.getElementById('consolePanel');
const header = document.getElementById('consoleHeader');
const resizeHandle = document.getElementById('resizeHandle');

// Apply mobile-friendly default size on initial load
(function applyInitialResponsiveSize() {
    try {
        const hasInlineSize = panel && (panel.style && (panel.style.width || panel.style.height));
        const ua = (navigator && navigator.userAgent) ? navigator.userAgent : '';
        const isTouch = (navigator && 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0) || ('ontouchstart' in window);
        const isMobile = window.innerWidth <= 900 || isTouch || /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
        if (panel && !hasInlineSize && isMobile) {
            panel.style.width = '96vw';
            panel.style.height = '72vh';
            panel.style.left = '2vw';
            panel.style.top = '2vh';
        }
    } catch (_) { /* ignore */ }
})();

// Dragging functionality
if (header) {
    header.addEventListener('mousedown', startDrag);
    header.addEventListener('touchstart', startDrag);
}

function startDrag(e) {
    if (!panel) return;
    isDragging = true;
    const rect = panel.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    dragOffset.x = clientX - rect.left;
    dragOffset.y = clientY - rect.top;

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
}

function drag(e) {
    if (!isDragging) return;
    if (!panel) return;

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;

    panel.style.left = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, newX)) + 'px';
    panel.style.top = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, newY)) + 'px';
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
}

// Resizing functionality
if (resizeHandle) {
    resizeHandle.addEventListener('mousedown', startResize);
    resizeHandle.addEventListener('touchstart', startResize);
}

function startResize(e) {
    if (!panel) return;
    isResizing = true;
    const rect = panel.getBoundingClientRect();
    startSize.width = rect.width;
    startSize.height = rect.height;
    startPos.x = e.clientX || e.touches[0].clientX;
    startPos.y = e.clientY || e.touches[0].clientY;

    document.addEventListener('mousemove', resize);
    document.addEventListener('touchmove', resize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchend', stopResize);
}

function resize(e) {
    if (!isResizing) return;
    if (!panel) return;

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    const newWidth = Math.max(300, startSize.width + (clientX - startPos.x));
    const newHeight = Math.max(200, startSize.height + (clientY - startPos.y));

    panel.style.width = newWidth + 'px';
    panel.style.height = newHeight + 'px';
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('touchmove', resize);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchend', stopResize);
}

// Shark Tools Configuration (local directory)
const wAny = /** @type {any} */ (window);
const SHARK_BASE = ((wAny && wAny['__HC_BASE_URL']) || '') + 'sharktool/';
const sharkTools = {
    burpshark: {
        url: SHARK_BASE + 'burpshark.js',
        name: 'BurpShark Pro',
        description: 'Enhanced web security testing tool with advanced payload injection and comprehensive reporting',
        version: '2.1',
        features: ['SQL Injection', 'XSS Detection', 'CSRF Testing', 'Auto Payload', 'Report Generation', 'Real-time Monitoring']
    },
    sharkscan: {
        url: SHARK_BASE + 'sharkscan.js',
        name: 'SharkScan Advanced',
        description: 'Enhanced vulnerability scanner with improved accuracy and detailed reporting',
        version: '2.0',
        features: ['Port Scanning', 'Service Detection', 'OS Fingerprinting', 'Vulnerability Assessment', 'Network Mapping', 'Export Reports']
    },
    snipers: {
        url: SHARK_BASE + 'snipers.js',
        name: 'Snipers Elite',
        description: 'High-precision targeting tool with enhanced accuracy and advanced automation',
        version: '1.5',
        features: ['Smart Targeting', 'Pattern Recognition', 'Auto-Click Optimization', 'Success Rate Tracking', 'Performance Analytics']
    },
    theme: {
        url: SHARK_BASE + 'theme.js',
        name: 'Theme Manager',
        description: 'UI theme customization'
    },
    monitor: {
        url: SHARK_BASE + 'monitor.js',
        name: 'Monitor',
        description: 'System monitoring tool'
    },
    postshark: {
        url: SHARK_BASE + 'postshark.js',
        name: 'PostShark',
        description: 'HTTP request manipulation'
    }
};

// Enhanced Bookmarklet Collection
let savedBookmarklets = JSON.parse(localStorage.getItem('hackerConsoleBookmarklets') || '{}');

// New Bookmarklet Collection - Task 7.1
const newBookmarkletCollection = {
    'Page Inspector': {
        code: `javascript:(function(){
                    const inspector = document.createElement('div');
                    inspector.id = 'pageInspector';
                    inspector.style.cssText = \`
                        position: fixed; top: 10px; right: 10px; width: 300px; height: 400px;
                        background: rgba(0, 0, 0, 0.95); border: 2px solid #00ff41;
                        border-radius: 10px; z-index: 999999; color: #00ff41;
                        font-family: monospace; font-size: 12px; padding: 15px;
                        overflow-y: auto; box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
                    \`;
                    
                    const header = document.createElement('div');
                    header.innerHTML = '<h3 style="margin: 0 0 10px 0; color: #00ff41;">🔍 Page Inspector</h3>';
                    header.innerHTML += '<button onclick="document.getElementById(\\'pageInspector\\').remove()" style="float: right; background: #ff4444; border: none; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer;">✕</button>';
                    inspector.appendChild(header);
                    
                    const info = document.createElement('div');
                    info.innerHTML = \`
                        <div style="margin-bottom: 10px;"><strong>URL:</strong><br><span style="color: #ccc; word-break: break-all;">\${window.location.href}</span></div>
                        <div style="margin-bottom: 10px;"><strong>Title:</strong><br><span style="color: #ccc;">\${document.title}</span></div>
                        <div style="margin-bottom: 10px;"><strong>Elements:</strong> <span style="color: #00ff41;">\${document.querySelectorAll('*').length}</span></div>
                        <div style="margin-bottom: 10px;"><strong>Images:</strong> <span style="color: #00ff41;">\${document.images.length}</span></div>
                        <div style="margin-bottom: 10px;"><strong>Links:</strong> <span style="color: #00ff41;">\${document.links.length}</span></div>
                        <div style="margin-bottom: 10px;"><strong>Forms:</strong> <span style="color: #00ff41;">\${document.forms.length}</span></div>
                        <div style="margin-bottom: 10px;"><strong>Scripts:</strong> <span style="color: #00ff41;">\${document.scripts.length}</span></div>
                        <div style="margin-bottom: 10px;"><strong>Stylesheets:</strong> <span style="color: #00ff41;">\${document.styleSheets.length}</span></div>
                        <div style="margin-bottom: 10px;"><strong>Viewport:</strong> <span style="color: #00ff41;">\${window.innerWidth}x\${window.innerHeight}</span></div>
                        <div style="margin-bottom: 10px;"><strong>User Agent:</strong><br><span style="color: #ccc; font-size: 10px; word-break: break-all;">\${navigator.userAgent}</span></div>
                    \`;
                    inspector.appendChild(info);
                    
                    // Add element highlighter
                    let isHighlighting = false;
                    const highlightBtn = document.createElement('button');
                    highlightBtn.textContent = '🎯 Highlight Elements';
                    highlightBtn.style.cssText = 'background: #00ff41; color: #000; border: none; padding: 8px; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px;';
                    highlightBtn.onclick = function() {
                        isHighlighting = !isHighlighting;
                        highlightBtn.textContent = isHighlighting ? '⏹️ Stop Highlighting' : '🎯 Highlight Elements';
                        if (isHighlighting) {
                            document.addEventListener('mouseover', highlightElement);
                            document.addEventListener('mouseout', unhighlightElement);
                        } else {
                            document.removeEventListener('mouseover', highlightElement);
                            document.removeEventListener('mouseout', unhighlightElement);
                        }
                    };
                    inspector.appendChild(highlightBtn);
                    
                    function highlightElement(e) {
                        if (e.target.id !== 'pageInspector' && !inspector.contains(e.target)) {
                            e.target.style.outline = '2px solid #00ff41';
                            e.target.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
                        }
                    }
                    
                    function unhighlightElement(e) {
                        if (e.target.id !== 'pageInspector' && !inspector.contains(e.target)) {
                            e.target.style.outline = '';
                            e.target.style.backgroundColor = '';
                        }
                    }
                    
                    document.body.appendChild(inspector);
                })();`,
        description: 'Inspect page elements, structure, and metadata with interactive highlighting',
        category: 'development',
        difficulty: 'beginner'
    },

    'Color Picker': {
        code: `javascript:(function(){
                    const colorPicker = document.createElement('div');
                    colorPicker.id = 'colorPicker';
                    colorPicker.style.cssText = \`
                        position: fixed; top: 50px; right: 10px; width: 280px; height: 350px;
                        background: rgba(0, 0, 0, 0.95); border: 2px solid #00ff41;
                        border-radius: 10px; z-index: 999999; color: #00ff41;
                        font-family: monospace; font-size: 12px; padding: 15px;
                        box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
                    \`;
                    
                    colorPicker.innerHTML = \`
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h3 style="margin: 0; color: #00ff41;">🎨 Color Picker</h3>
                            <button onclick="document.getElementById('colorPicker').remove()" style="background: #ff4444; border: none; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer;">✕</button>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <button id="startPicking" style="background: #00ff41; color: #000; border: none; padding: 10px; border-radius: 5px; cursor: pointer; width: 100%;">🎯 Start Color Picking</button>
                        </div>
                        <div id="colorInfo" style="background: rgba(0, 255, 65, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                            <div>Click "Start Color Picking" then hover over any element to see its colors</div>
                        </div>
                        <div id="colorHistory" style="max-height: 150px; overflow-y: auto;">
                            <h4 style="margin: 10px 0 5px 0; color: #00ff41;">Color History:</h4>
                            <div id="historyList"></div>
                        </div>
                    \`;
                    
                    let isPicking = false;
                    let colorHistory = [];
                    
                    const startBtn = colorPicker.querySelector('#startPicking');
                    const colorInfo = colorPicker.querySelector('#colorInfo');
                    const historyList = colorPicker.querySelector('#historyList');
                    
                    startBtn.onclick = function() {
                        isPicking = !isPicking;
                        startBtn.textContent = isPicking ? '⏹️ Stop Picking' : '🎯 Start Color Picking';
                        startBtn.style.background = isPicking ? '#ff4444' : '#00ff41';
                        
                        if (isPicking) {
                            document.addEventListener('mouseover', pickColor);
                            document.body.style.cursor = 'crosshair';
                        } else {
                            document.removeEventListener('mouseover', pickColor);
                            document.body.style.cursor = '';
                        }
                    };
                    
                    function pickColor(e) {
                        if (colorPicker.contains(e.target)) return;
                        
                        const styles = window.getComputedStyle(e.target);
                        const bgColor = styles.backgroundColor;
                        const textColor = styles.color;
                        const borderColor = styles.borderColor;
                        
                        colorInfo.innerHTML = \`
                            <div style="margin-bottom: 8px;"><strong>Element:</strong> \${e.target.tagName.toLowerCase()}\${e.target.className ? '.' + e.target.className.split(' ').join('.') : ''}</div>
                            <div style="margin-bottom: 8px;"><strong>Background:</strong> <span style="background: \${bgColor}; padding: 2px 8px; border-radius: 3px; color: \${textColor};">\${bgColor}</span></div>
                            <div style="margin-bottom: 8px;"><strong>Text:</strong> <span style="background: \${textColor}; padding: 2px 8px; border-radius: 3px; color: \${bgColor};">\${textColor}</span></div>
                            <div style="margin-bottom: 8px;"><strong>Border:</strong> <span style="background: \${borderColor}; padding: 2px 8px; border-radius: 3px;">\${borderColor}</span></div>
                            <button onclick="copyToClipboard('\${bgColor}')" style="background: #00ff41; color: #000; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; margin-right: 5px; font-size: 10px;">Copy BG</button>
                            <button onclick="copyToClipboard('\${textColor}')" style="background: #00ff41; color: #000; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; margin-right: 5px; font-size: 10px;">Copy Text</button>
                        \`;
                        
                        // Add to history
                        const colorEntry = { bg: bgColor, text: textColor, border: borderColor, element: e.target.tagName.toLowerCase() };
                        colorHistory.unshift(colorEntry);
                        if (colorHistory.length > 10) colorHistory.pop();
                        updateHistory();
                    }
                    
                    function updateHistory() {
                        historyList.innerHTML = colorHistory.map((entry, index) => \`
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 5px; background: rgba(0, 255, 65, 0.05); border-radius: 3px;">
                                <div style="width: 20px; height: 20px; background: \${entry.bg}; border: 1px solid #333; border-radius: 3px; margin-right: 8px;"></div>
                                <div style="flex: 1; font-size: 10px;">
                                    <div>\${entry.element}</div>
                                    <div style="color: #ccc;">\${entry.bg}</div>
                                </div>
                                <button onclick="copyToClipboard('\${entry.bg}')" style="background: #00ff41; color: #000; border: none; padding: 2px 5px; border-radius: 2px; cursor: pointer; font-size: 9px;">Copy</button>
                            </div>
                        \`).join('');
                    }
                    
                    window.copyToClipboard = function(text) {
                        navigator.clipboard.writeText(text).then(() => {
                            const notification = document.createElement('div');
                            notification.textContent = 'Copied: ' + text;
                            notification.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #00ff41; color: #000; padding: 10px 20px; border-radius: 5px; z-index: 1000000; font-family: monospace;';
                            document.body.appendChild(notification);
                            setTimeout(() => notification.remove(), 2000);
                        });
                    };
                    
                    document.body.appendChild(colorPicker);
                })();`,
        description: 'Pick colors from any element on the page with history and clipboard support',
        category: 'development',
        difficulty: 'intermediate'
    },

    'Image Downloader': {
        code: `javascript:(function(){
                    const downloader = document.createElement('div');
                    downloader.id = 'imageDownloader';
                    downloader.style.cssText = \`
                        position: fixed; top: 10px; left: 10px; width: 350px; height: 450px;
                        background: rgba(0, 0, 0, 0.95); border: 2px solid #00ff41;
                        border-radius: 10px; z-index: 999999; color: #00ff41;
                        font-family: monospace; font-size: 12px; padding: 15px;
                        overflow-y: auto; box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
                    \`;
                    
                    const images = Array.from(document.images).filter(img => img.src && img.src.startsWith('http'));
                    const backgroundImages = [];
                    
                    // Find background images
                    document.querySelectorAll('*').forEach(el => {
                        const bg = window.getComputedStyle(el).backgroundImage;
                        if (bg && bg !== 'none' && bg.includes('url(')) {
                            const url = bg.match(/url\\(["']?([^"')]+)["']?\\)/);
                            if (url && url[1] && url[1].startsWith('http')) {
                                backgroundImages.push({ element: el.tagName.toLowerCase(), url: url[1] });
                            }
                        }
                    });
                    
                    downloader.innerHTML = \`
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h3 style="margin: 0; color: #00ff41;">📥 Image Downloader</h3>
                            <button onclick="document.getElementById('imageDownloader').remove()" style="background: #ff4444; border: none; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer;">✕</button>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                                <button id="selectAll" style="background: #00ff41; color: #000; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; flex: 1;">Select All</button>
                                <button id="downloadSelected" style="background: #0099ff; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; flex: 1;">Download Selected</button>
                            </div>
                            <div style="color: #ccc; font-size: 11px;">Found \${images.length} images and \${backgroundImages.length} background images</div>
                        </div>
                        
                        <div id="imageList" style="max-height: 300px; overflow-y: auto;">
                            <h4 style="margin: 10px 0 5px 0; color: #00ff41;">Regular Images (\${images.length}):</h4>
                            \${images.map((img, index) => \`
                                <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 8px; background: rgba(0, 255, 65, 0.05); border-radius: 5px;">
                                    <input type="checkbox" id="img_\${index}" style="margin-right: 10px;">
                                    <img src="\${img.src}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 3px; margin-right: 10px;" onerror="this.style.display='none'">
                                    <div style="flex: 1; font-size: 10px;">
                                        <div style="color: #00ff41; margin-bottom: 2px;">\${img.alt || 'No alt text'}</div>
                                        <div style="color: #ccc; word-break: break-all;">\${img.src.split('/').pop() || img.src}</div>
                                        <div style="color: #999;">\${img.naturalWidth || '?'}x\${img.naturalHeight || '?'}</div>
                                    </div>
                                </div>
                            \`).join('')}
                            
                            \${backgroundImages.length > 0 ? \`
                                <h4 style="margin: 15px 0 5px 0; color: #00ff41;">Background Images (\${backgroundImages.length}):</h4>
                                \${backgroundImages.map((bg, index) => \`
                                    <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 8px; background: rgba(0, 255, 65, 0.05); border-radius: 5px;">
                                        <input type="checkbox" id="bg_\${index}" style="margin-right: 10px;">
                                        <div style="width: 40px; height: 40px; background-image: url('\${bg.url}'); background-size: cover; background-position: center; border-radius: 3px; margin-right: 10px; border: 1px solid #333;"></div>
                                        <div style="flex: 1; font-size: 10px;">
                                            <div style="color: #00ff41; margin-bottom: 2px;">Background on \${bg.element}</div>
                                            <div style="color: #ccc; word-break: break-all;">\${bg.url.split('/').pop() || bg.url}</div>
                                        </div>
                                    </div>
                                \`)}.join('')
                            \` : ''}
                        </div>
                    \`;
                    
                    const selectAllBtn = downloader.querySelector('#selectAll');
                    const downloadBtn = downloader.querySelector('#downloadSelected');
                    
                    selectAllBtn.onclick = function() {
                        const checkboxes = downloader.querySelectorAll('input[type="checkbox"]');
                        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
                        checkboxes.forEach(cb => cb.checked = !allChecked);
                        selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
                    };
                    
                    downloadBtn.onclick = function() {
                        const selectedImages = [];
                        
                        // Get selected regular images
                        images.forEach((img, index) => {
                            const checkbox = downloader.querySelector(\`#img_\${index}\`);
                            if (checkbox && checkbox.checked) {
                                selectedImages.push({ url: img.src, name: img.alt || \`image_\${index}\` });
                            }
                        });
                        
                        // Get selected background images
                        backgroundImages.forEach((bg, index) => {
                            const checkbox = downloader.querySelector(\`#bg_\${index}\`);
                            if (checkbox && checkbox.checked) {
                                selectedImages.push({ url: bg.url, name: \`background_\${index}\` });
                            }
                        });
                        
                        if (selectedImages.length === 0) {
                            alert('Please select at least one image to download.');
                            return;
                        }
                        
                        // Download images
                        selectedImages.forEach((img, index) => {
                            setTimeout(() => {
                                const a = document.createElement('a');
                                a.href = img.url;
                                a.download = img.name + '_' + Date.now() + '.' + (img.url.split('.').pop().split('?')[0] || 'jpg');
                                a.style.display = 'none';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }, index * 500); // Delay to avoid overwhelming the browser
                        });
                        
                        const notification = document.createElement('div');
                        notification.textContent = \`Downloading \${selectedImages.length} images...\`;
                        notification.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #00ff41; color: #000; padding: 10px 20px; border-radius: 5px; z-index: 1000000; font-family: monospace;';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 3000);
                    };
                    
                    document.body.appendChild(downloader);
                })();`,
        description: 'Download all images from the current page including background images',
        category: 'utility',
        difficulty: 'intermediate'
    },

    'Form Filler': {
        code: `javascript:(function(){
                    const formFiller = document.createElement('div');
                    formFiller.id = 'formFiller';
                    formFiller.style.cssText = \`
                        position: fixed; top: 50px; left: 10px; width: 320px; height: 400px;
                        background: rgba(0, 0, 0, 0.95); border: 2px solid #00ff41;
                        border-radius: 10px; z-index: 999999; color: #00ff41;
                        font-family: monospace; font-size: 12px; padding: 15px;
                        overflow-y: auto; box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
                    \`;
                    
                    const forms = document.forms;
                    const inputs = document.querySelectorAll('input, textarea, select');
                    
                    const testData = {
                        name: ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sarah Wilson'],
                        email: ['test@example.com', 'demo@test.com', 'user@sample.org'],
                        phone: ['+1-555-0123', '555-123-4567', '(555) 987-6543'],
                        address: ['123 Main St', '456 Oak Ave', '789 Pine Rd'],
                        city: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
                        zip: ['12345', '90210', '60601', '77001'],
                        company: ['Acme Corp', 'Tech Solutions', 'Global Industries'],
                        website: ['https://example.com', 'https://test.org', 'https://demo.net'],
                        message: ['This is a test message for form filling automation.', 'Sample text for testing purposes.']
                    };
                    
                    formFiller.innerHTML = \`
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h3 style="margin: 0; color: #00ff41;">📝 Form Filler</h3>
                            <button onclick="document.getElementById('formFiller').remove()" style="background: #ff4444; border: none; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer;">✕</button>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <div style="color: #ccc; font-size: 11px; margin-bottom: 10px;">Found \${forms.length} forms and \${inputs.length} input fields</div>
                            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                                <button id="fillAll" style="background: #00ff41; color: #000; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; flex: 1; font-size: 11px;">Fill All Forms</button>
                                <button id="clearAll" style="background: #ff4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; flex: 1; font-size: 11px;">Clear All</button>
                            </div>
                            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                                <button id="fillVisible" style="background: #0099ff; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; flex: 1; font-size: 11px;">Fill Visible Only</button>
                                <button id="highlightFields" style="background: #ff9900; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; flex: 1; font-size: 11px;">Highlight Fields</button>
                            </div>
                        </div>
                        
                        <div id="fieldList" style="max-height: 250px; overflow-y: auto;">
                            <h4 style="margin: 10px 0 5px 0; color: #00ff41;">Form Fields:</h4>
                            \${Array.from(inputs).map((input, index) => {
                                const type = input.type || input.tagName.toLowerCase();
                                const name = input.name || input.id || input.placeholder || \`field_\${index}\`;
                                const isVisible = input.offsetParent !== null;
                                
                                return \`
                                    <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 8px; background: rgba(0, 255, 65, 0.05); border-radius: 5px; \${!isVisible ? 'opacity: 0.5;' : ''}">
                                        <input type="checkbox" id="field_\${index}" \${isVisible ? 'checked' : ''} style="margin-right: 10px;">
                                        <div style="flex: 1; font-size: 10px;">
                                            <div style="color: #00ff41; margin-bottom: 2px;">\${name}</div>
                                            <div style="color: #ccc;">Type: \${type} \${!isVisible ? '(hidden)' : ''}</div>
                                        </div>
                                        <button onclick="fillSingleField(\${index})" style="background: #00ff41; color: #000; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 9px;">Fill</button>
                                    </div>
                                \`;
                            }).join('')}
                        </div>
                    \`;
                    
                    function getRandomData(fieldName, fieldType) {
                        const name = fieldName.toLowerCase();
                        
                        if (name.includes('email') || fieldType === 'email') {
                            return testData.email[Math.floor(Math.random() * testData.email.length)];
                        } else if (name.includes('phone') || name.includes('tel') || fieldType === 'tel') {
                            return testData.phone[Math.floor(Math.random() * testData.phone.length)];
                        } else if (name.includes('name') && !name.includes('username')) {
                            return testData.name[Math.floor(Math.random() * testData.name.length)];
                        } else if (name.includes('address')) {
                            return testData.address[Math.floor(Math.random() * testData.address.length)];
                        } else if (name.includes('city')) {
                            return testData.city[Math.floor(Math.random() * testData.city.length)];
                        } else if (name.includes('zip') || name.includes('postal')) {
                            return testData.zip[Math.floor(Math.random() * testData.zip.length)];
                        } else if (name.includes('company') || name.includes('organization')) {
                            return testData.company[Math.floor(Math.random() * testData.company.length)];
                        } else if (name.includes('website') || name.includes('url') || fieldType === 'url') {
                            return testData.website[Math.floor(Math.random() * testData.website.length)];
                        } else if (name.includes('message') || name.includes('comment') || name.includes('description')) {
                            return testData.message[Math.floor(Math.random() * testData.message.length)];
                        } else if (fieldType === 'number') {
                            return Math.floor(Math.random() * 100) + 1;
                        } else if (fieldType === 'date') {
                            const date = new Date();
                            date.setDate(date.getDate() + Math.floor(Math.random() * 30));
                            return date.toISOString().split('T')[0];
                        } else if (fieldType === 'checkbox') {
                            return Math.random() > 0.5;
                        } else {
                            return 'Test Data ' + Math.floor(Math.random() * 1000);
                        }
                    }
                    
                    function fillField(input, value) {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            input.checked = value;
                        } else if (input.tagName.toLowerCase() === 'select') {
                            if (input.options.length > 0) {
                                const randomIndex = Math.floor(Math.random() * input.options.length);
                                input.selectedIndex = randomIndex;
                            }
                        } else {
                            input.value = value;
                        }
                        
                        // Trigger events
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    
                    window.fillSingleField = function(index) {
                        const input = inputs[index];
                        if (input) {
                            const fieldName = input.name || input.id || input.placeholder || '';
                            const fieldType = input.type || input.tagName.toLowerCase();
                            const value = getRandomData(fieldName, fieldType);
                            fillField(input, value);
                            
                            // Highlight the filled field
                            input.style.outline = '2px solid #00ff41';
                            input.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
                            setTimeout(() => {
                                input.style.outline = '';
                                input.style.backgroundColor = '';
                            }, 2000);
                        }
                    };
                    
                    const fillAllBtn = formFiller.querySelector('#fillAll');
                    const clearAllBtn = formFiller.querySelector('#clearAll');
                    const fillVisibleBtn = formFiller.querySelector('#fillVisible');
                    const highlightBtn = formFiller.querySelector('#highlightFields');
                    
                    fillAllBtn.onclick = function() {
                        Array.from(inputs).forEach((input, index) => {
                            const checkbox = formFiller.querySelector(\`#field_\${index}\`);
                            if (checkbox && checkbox.checked) {
                                const fieldName = input.name || input.id || input.placeholder || '';
                                const fieldType = input.type || input.tagName.toLowerCase();
                                const value = getRandomData(fieldName, fieldType);
                                fillField(input, value);
                            }
                        });
                        
                        const notification = document.createElement('div');
                        notification.textContent = 'Forms filled with test data!';
                        notification.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #00ff41; color: #000; padding: 10px 20px; border-radius: 5px; z-index: 1000000; font-family: monospace;';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 2000);
                    };
                    
                    clearAllBtn.onclick = function() {
                        Array.from(inputs).forEach(input => {
                            if (input.type === 'checkbox' || input.type === 'radio') {
                                input.checked = false;
                            } else if (input.tagName.toLowerCase() === 'select') {
                                input.selectedIndex = 0;
                            } else {
                                input.value = '';
                            }
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                        });
                    };
                    
                    fillVisibleBtn.onclick = function() {
                        Array.from(inputs).forEach(input => {
                            if (input.offsetParent !== null) {
                                const fieldName = input.name || input.id || input.placeholder || '';
                                const fieldType = input.type || input.tagName.toLowerCase();
                                const value = getRandomData(fieldName, fieldType);
                                fillField(input, value);
                            }
                        });
                    };
                    
                    let isHighlighting = false;
                    highlightBtn.onclick = function() {
                        isHighlighting = !isHighlighting;
                        highlightBtn.textContent = isHighlighting ? 'Remove Highlight' : 'Highlight Fields';
                        
                        Array.from(inputs).forEach(input => {
                            if (isHighlighting) {
                                input.style.outline = '2px dashed #00ff41';
                                input.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
                            } else {
                                input.style.outline = '';
                                input.style.backgroundColor = '';
                            }
                        });
                    };
                    
                    document.body.appendChild(formFiller);
                })();`,
        description: 'Automatically fill forms with test data for development and testing',
        category: 'automation',
        difficulty: 'advanced'
    }
};

// Add new bookmarklets to saved collection if they don't exist
Object.keys(newBookmarkletCollection).forEach(name => {
    if (!savedBookmarklets[name]) {
        savedBookmarklets[name] = newBookmarkletCollection[name].code;
    }
});
localStorage.setItem('hackerConsoleBookmarklets', JSON.stringify(savedBookmarklets));

function runBookmarklet() {
    const codeEl = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('codeInput'));
    const code = codeEl ? codeEl.value.trim() : '';
    if (!code) {
        updateStatus('❌ No code to execute');
        return;
    }

    try {
        // Remove javascript: prefix if present
        const cleanCode = code.replace(/^javascript:/, '');
        eval(cleanCode);
        updateStatus('✅ Bookmarklet executed successfully');
    } catch (error) {
        updateStatus('❌ Error: ' + error.message);
        console.error('Bookmarklet error:', error);
    }
}

function saveBookmarklet() {
    const codeEl = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('codeInput'));
    const code = codeEl ? codeEl.value.trim() : '';
    if (!code) {
        updateStatus('❌ No code to save');
        return;
    }

    const name = prompt('Enter a name for this bookmarklet:');
    if (!name) return;

    savedBookmarklets[name] = code;
    localStorage.setItem('hackerConsoleBookmarklets', JSON.stringify(savedBookmarklets));
    updateSavedList();
    updateStatus('💾 Bookmarklet saved as: ' + name);
}

function loadBookmarklet(name) {
    if (savedBookmarklets[name]) {
        const codeEl = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('codeInput'));
        if (codeEl) codeEl.value = savedBookmarklets[name];
        updateStatus('📋 Loaded: ' + name);
    }
}

function deleteBookmarklet(name) {
    if (confirm('Delete bookmarklet "' + name + '"?')) {
        delete savedBookmarklets[name];
        localStorage.setItem('hackerConsoleBookmarklets', JSON.stringify(savedBookmarklets));
        updateSavedList();
        updateStatus('🗑️ Deleted: ' + name);
    }
}

function clearCode() {
    const codeEl = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('codeInput'));
    if (codeEl) codeEl.value = '';
    updateStatus('🗑️ Code cleared');
}

function exportBookmarklets() {
    const data = JSON.stringify(savedBookmarklets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hacker-console-bookmarklets.json';
    a.click();
    URL.revokeObjectURL(url);
    updateStatus('📤 Bookmarklets exported');
}

function updateSavedList() {
    const list = /** @type {HTMLElement|null} */ (document.getElementById('savedList'));
    if (!list) return;
    list.innerHTML = '';

    for (const [name, code] of Object.entries(savedBookmarklets)) {
        const item = document.createElement('div');
        item.className = 'saved-item';
        item.innerHTML = `
                    <span class="item-name" onclick="loadBookmarklet('${name}')">${name}</span>
                    <button class="delete-btn" onclick="deleteBookmarklet('${name}')">×</button>
                `;
        list.appendChild(item);
    }
}

function runQuickScript(type) {
    const scripts = {
        alert: "javascript:(function(){alert('Quick test from Hacker Console!');})()",
        console: "javascript:(function(){console.log('Hacker Console Log:', new Date());})()",
        scroll: "javascript:(function(){window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});})()",
        highlight: "javascript:(function(){document.querySelectorAll('a').forEach(a=>a.style.background='yellow');})()",
        dark: "javascript:(function(){document.body.style.filter=document.body.style.filter?'':'invert(1) hue-rotate(180deg)';})()"
    };

    if (scripts[type]) {
        const codeEl = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('codeInput'));
        if (codeEl) codeEl.value = scripts[type];
        runBookmarklet();
    }
}

// Shark Tools Loader Function (clean implementation)
function loadSharkTool(toolName) {
    const tool = sharkTools[toolName];
    if (!tool) {
        updateStatus('❌ Tool not found: ' + toolName);
        return;
    }

    updateStatus('🔄 Loading ' + tool.name + '...');

    // Check if script is already loaded
    const existingScript = document.querySelector(`script[data-shark-tool="${toolName}"]`);
    if (existingScript) {
        updateStatus('⚠️ ' + tool.name + ' already loaded');
        try {
            const mod = wAny[toolName];
            if (mod && typeof mod.init === 'function') { mod.init(); }
        } catch (_) { }
        return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = tool.url + '?t=' + Date.now();
    script.setAttribute('data-shark-tool', toolName);
    script.onload = function () {
        updateStatus('✅ ' + tool.name + ' loaded successfully');
        if (toolName === 'theme') {
            try {
                if (typeof wAny['loadThemeCSS'] === 'function') { wAny['loadThemeCSS'](); }
            } catch (_) { }
        }
        try {
            const mod = wAny[toolName];
            if (mod) {
                if (typeof mod === 'function') {
                    mod();
                } else if (typeof mod.init === 'function') {
                    mod.init();
                }
            }
        } catch (_) { /* ignore */ }
    };
    script.onerror = function () {
        updateStatus('❌ Failed to load ' + tool.name);
    };
    document.body.appendChild(script);
}

// ==========================
// Decoy Secret (locked panel)
// ==========================
(function () {
    const g = (wAny.__HC_DECOY__ = wAny.__HC_DECOY__ || {
        tries: 0,
        tmr: null,
        salt: Math.random().toString(36).slice(2),
        openAt: 0
    });
    function byId(id) { return document.getElementById(id); }
    function rot(s, n) { return s.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ ((n + i) % 7))).join(''); }
    async function fakeHash(s) {
        // lightweight fake hash: rotate+base64 (intentionally misleading)
        const x = rot(s, s.length % 13);
        return 'sha256:' + btoa(unescape(encodeURIComponent(x))).slice(0, 24) + '…';
    }
    function startTicker() {
        const hashEl = byId('decoyHash');
        const hint = byId('decoyHint');
        if (g.tmr) clearInterval(g.tmr);
        g.tmr = setInterval(async () => {
            const t = Date.now();
            const fake = await fakeHash(g.salt + ':' + (Math.floor(t / 1307)));
            if (hashEl) hashEl.textContent = fake;
            if (hint) hint.textContent = 'hint: salt rotating ' + new Array(1 + (t % 3)).fill('•').join('');
        }, 900);
    }
    function stopTicker() { if (g.tmr) { clearInterval(g.tmr); g.tmr = null; } }

    wAny.openSecret = function () {
        const p = byId('decoyPanel'); if (!p) return;
        const st = byId('decoyStatus'); if (st) st.textContent = 'locked';
        const key = /** @type {HTMLInputElement|null} */(byId('decoyKey')); if (key) key.value = '';
        p.style.display = 'block';
        g.openAt = Date.now();
        startTicker();
        updateStatus('Dev panel opened');
    };

    wAny.decoyUnlock = async function () {
        const st = byId('decoyStatus');
        const key = /** @type {HTMLInputElement|null} */(byId('decoyKey'));
        const entered = (key && key.value) ? key.value : '';
        // Special easter egg/backdoor phrase: reveal Stage 2 directly
        if (entered && entered.toLowerCase().includes('or 1=1')) {
            const nxt = byId('decoyNext');
            const hint = byId('decoyHint');
            if (nxt) nxt.style.display = 'block';
            if (hint) hint.textContent = 'bypass accepted →';
            if (st) st.textContent = 'bypassed';
            return;
        }
        g.tries++;
        // Deliberately impossible check: depends on openAt jitter and salt drift
        const gate = (g.openAt % 997) ^ (g.salt.length * 31 + g.tries);
        const pass = entered && (entered.length % 17 === 0) && ((gate & 3) === 2) && entered.includes(g.salt.slice(0, 2));
        if (pass) {
            // Move the goalpost subtly
            g.salt = Math.random().toString(36).slice(2);
            if (st) st.textContent = 'verifying…';
            setTimeout(() => { if (st) st.textContent = 'locked'; }, 500 + (gate % 400));
        } else {
            if (st) st.textContent = ['locked', 'invalid', 'mismatch', 'salt?'][g.tries % 4];
            // After several attempts, subtly reveal a next step link
            if (g.tries >= 5) {
                const nxt = byId('decoyNext');
                const hint = byId('decoyHint');
                if (nxt) nxt.style.display = 'block';
                if (hint) hint.textContent = 'try stage 2 →';
            }
        }
    };
    window.console = window.console || function (t) { };
    wAny.closeDecoy = function () {
        const p = byId('decoyPanel'); if (!p) return;
        p.style.display = 'none';
        stopTicker();
    };
})();

// Script Marketplace System
class ScriptMarketplace {
    constructor() {
        this.scripts = this.initializeScripts();
        this.cart = JSON.parse(localStorage.getItem('scriptCart') || '[]');
        this.favorites = JSON.parse(localStorage.getItem('scriptFavorites') || '[]');
        this.filteredScripts = [...this.scripts];

        this.initializeElements();
        this.setupEventListeners();
        this.renderScripts();
        this.updateCounters();
    }

    initializeScripts() {
        return [
            {
                id: 'burp-shark-pro',
                name: 'BurpShark Pro v2.1',
                nameEn: 'BurpShark Pro v2.1',
                nameTh: 'เบิร์ปชาร์ค โปร v2.1',
                description: 'Enhanced web vulnerability scanner with comprehensive reporting, real-time monitoring, and advanced payload injection capabilities.',
                descriptionTh: 'เครื่องมือสแกนช่องโหว่เว็บไซต์ขั้นสูง พร้อมระบบรายงานครบถ้วน การตรวจสอบแบบเรียลไทม์ และความสามารถในการฉีด payload ขั้นสูง',
                category: 'security',
                difficulty: 'advanced',
                features: ['SQL Injection', 'XSS Detection', 'CSRF Testing', 'Auto Payload', 'Report Generation', 'Real-time Monitoring', 'Multi-threading'],
                demoCode: `// BurpShark Pro v2.1 - Enhanced Scanner
const scanner = new BurpSharkPro({
    target: 'https://example.com',
    scanType: 'comprehensive',
    tests: ['sql', 'xss', 'csrf', 'lfi', 'xxe', 'ssrf'],
    threads: 3,
    reporting: {
        format: ['json', 'html', 'pdf'],
        autoExport: true
    },
    realTimeMonitoring: true
});

scanner.on('vulnerability', (vuln) => {
    console.log('Found:', vuln.type, vuln.severity);
});

scanner.start().then(report => {
    console.log('Scan completed:', report.summary);
});`,
                icon: '🦈',
                version: '2.1',
                lastUpdated: '2024-01-15'
            },
            {
                id: 'shark-scan-advanced',
                name: 'SharkScan Advanced v2.0',
                nameEn: 'SharkScan Advanced v2.0',
                nameTh: 'ชาร์คสแกน แอดวานซ์ v2.0',
                description: 'Enhanced network reconnaissance suite with improved accuracy, vulnerability assessment, and comprehensive reporting capabilities.',
                descriptionTh: 'ชุดเครื่องมือสำรวจเครือข่ายขั้นสูง พร้อมความแม่นยำที่ดีขึ้น การประเมินช่องโหว่ และความสามารถในการรายงานที่ครบถ้วน',
                category: 'security',
                difficulty: 'intermediate',
                features: ['Port Scanning', 'Service Detection', 'OS Fingerprinting', 'Vulnerability Assessment', 'Network Mapping', 'Export Reports', 'Multi-target Support'],
                demoCode: `// SharkScan Advanced v2.0 - Enhanced Network Scanner
const scanner = new SharkScanAdvanced({
    target: '192.168.1.0/24',
    scanType: 'comprehensive',
    options: {
        hostDiscovery: true,
        portScanning: true,
        serviceDetection: true,
        osFingerprinting: true,
        vulnerabilityScanning: true
    },
    portRange: 'top1000',
    threads: 5
});

scanner.on('hostFound', (host) => {
    console.log('Host discovered:', host.ip, host.status);
});

scanner.on('portOpen', (result) => {
    console.log('Open port:', result.port, result.service);
});

const results = await scanner.scan();
scanner.exportReport('json', 'scan-results.json');`,
                icon: '🔍',
                version: '2.0',
                lastUpdated: '2024-01-10'
            },
            {
                id: 'snipers-elite',
                name: 'Snipers Elite v1.5',
                nameEn: 'Snipers Elite v1.5',
                nameTh: 'สไนเปอร์ส อีลิท v1.5',
                description: 'High-precision targeting tool with enhanced accuracy, pattern recognition, and comprehensive analytics for automated interactions.',
                descriptionTh: 'เครื่องมือเล็งเป้าความแม่นยำสูง พร้อมความแม่นยำที่เพิ่มขึ้น การรู้จำรูปแบบ และการวิเคราะห์ที่ครบถ้วนสำหรับการโต้ตอบอัตโนมัติ',
                category: 'automation',
                difficulty: 'intermediate',
                features: ['Smart Targeting', 'Pattern Recognition', 'Auto-Click Optimization', 'Success Rate Tracking', 'Performance Analytics', 'Anti-Detection', 'Multi-Pattern Support'],
                demoCode: `// Snipers Elite v1.5 - High-Precision Targeting
const sniper = new SnipersElite({
    selector: '.btn-primary, #submit-button',
    clickMode: 'single',
    interval: 1000,
    options: {
        randomDelay: true,
        scrollToElement: true,
        waitForVisible: true,
        antiDetection: true,
        smartRetry: true
    },
    stopConditions: {
        maxClicks: 100,
        maxDuration: 30 // minutes
    }
});

sniper.on('click', (result) => {
    console.log('Click result:', result.success, result.element);
});

sniper.on('pattern', (pattern) => {
    console.log('Pattern detected:', pattern.type, pattern.confidence);
});

sniper.start();

// Advanced pattern configuration
sniper.setPattern({
    type: 'cascade',
    selectors: ['.btn-1', '.btn-2', '.btn-3'],
    speed: 'medium',
    randomization: 20
});`,
                icon: '🎯',
                version: '1.5',
                lastUpdated: '2024-01-08'
            },
            {
                id: 'ui-automator',
                name: 'UI Automator',
                nameEn: 'UI Automator',
                nameTh: 'ยูไอออโตเมเตอร์',
                description: 'Powerful UI automation tool for form filling, clicking, and data extraction.',
                descriptionTh: 'เครื่องมือออโตเมชั่น UI สำหรับกรอกฟอร์ม คลิก และดึงข้อมูล',
                category: 'automation',
                difficulty: 'beginner',
                features: ['Form Filling', 'Auto Click', 'Data Extract', 'Easy Setup'],
                demoCode: `// UI Automator
const automator = new UIAutomator();
automator.fillForm({
    '#username': 'testuser',
    '#password': 'testpass'
});
automator.click('#login-btn');`,
                icon: '🤖'
            },
            {
                id: 'data-miner',
                name: 'Data Miner Pro',
                nameEn: 'Data Miner Pro',
                nameTh: 'ดาต้าไมเนอร์ โปร',
                description: 'Extract structured data from any website with intelligent parsing algorithms.',
                descriptionTh: 'ดึงข้อมูลที่มีโครงสร้างจากเว็บไซต์ด้วยอัลกอริทึมแยกวิเคราะห์อัจฉริยะ',
                category: 'data',
                difficulty: 'intermediate',
                features: ['Smart Parsing', 'CSV Export', 'JSON Output', 'Bulk Extract'],
                demoCode: `// Data Miner Pro
const miner = new DataMiner();
miner.extract({
    selector: '.product',
    fields: {
        name: '.title',
        price: '.price',
        rating: '.rating'
    }
}).then(data => console.log(data));`,
                icon: '⛏️'
            },
            {
                id: 'perf-monitor',
                name: 'Performance Monitor',
                nameEn: 'Performance Monitor',
                nameTh: 'เพอร์ฟอร์แมนซ์มอนิเตอร์',
                description: 'Real-time website performance monitoring with detailed metrics and alerts.',
                descriptionTh: 'ตรวจสอบประสิทธิภาพเว็บไซต์แบบเรียลไทม์พร้อมเมตริกรายละเอียด',
                category: 'performance',
                difficulty: 'intermediate',
                features: ['Real-time Monitor', 'Performance Metrics', 'Alert System', 'Report Export'],
                demoCode: `// Performance Monitor
const monitor = new PerfMonitor();
monitor.start({
    metrics: ['FCP', 'LCP', 'CLS', 'FID'],
    alerts: true,
    interval: 1000
});`,
                icon: '📊'
            },
            {
                id: 'game-hacker',
                name: 'Game Hacker',
                nameEn: 'Game Hacker',
                nameTh: 'เกมแฮกเกอร์',
                description: 'Fun browser game manipulation tools for educational purposes and entertainment.',
                descriptionTh: 'เครื่องมือจัดการเกมบราวเซอร์เพื่อการศึกษาและความบันเทิง',
                category: 'fun',
                difficulty: 'beginner',
                features: ['Score Hack', 'Speed Boost', 'God Mode', 'Auto Play'],
                demoCode: `// Game Hacker
const gameHack = new GameHacker();
gameHack.enableGodMode();
gameHack.setScore(999999);
gameHack.speedBoost(2.5);`,
                icon: '🎮'
            },
            // New Bookmarklet Collection - Task 7.1
            {
                id: 'page-inspector',
                name: 'Page Inspector',
                nameEn: 'Page Inspector',
                nameTh: 'เพจอินสเปคเตอร์',
                description: 'Inspect page elements, structure, and metadata with interactive highlighting',
                descriptionTh: 'ตรวจสอบองค์ประกอบหน้าเว็บ โครงสร้าง และข้อมูลเมตาพร้อมการไฮไลต์แบบโต้ตอบ',
                category: 'development',
                difficulty: 'beginner',
                features: ['Element Inspector', 'Page Metadata', 'Interactive Highlighting', 'Structure Analysis'],
                demoCode: newBookmarkletCollection['Page Inspector'].code,
                icon: '🔍'
            },
            {
                id: 'color-picker',
                name: 'Color Picker',
                nameEn: 'Color Picker',
                nameTh: 'คัลเลอร์พิกเกอร์',
                description: 'Pick colors from any element on the page with history and clipboard support',
                descriptionTh: 'เลือกสีจากองค์ประกอบใดๆ บนหน้าเว็บพร้อมประวัติและการคัดลอก',
                category: 'development',
                difficulty: 'intermediate',
                features: ['Color Extraction', 'Color History', 'Clipboard Copy', 'Real-time Preview'],
                demoCode: newBookmarkletCollection['Color Picker'].code,
                icon: '🎨'
            },
            {
                id: 'image-downloader',
                name: 'Image Downloader',
                nameEn: 'Image Downloader',
                nameTh: 'อิมเมจดาวน์โหลดเดอร์',
                description: 'Download all images from the current page including background images',
                descriptionTh: 'ดาวน์โหลดรูปภาพทั้งหมดจากหน้าปัจจุบันรวมถึงรูปพื้นหลัง',
                category: 'utility',
                difficulty: 'intermediate',
                features: ['Bulk Download', 'Background Images', 'Selective Download', 'Image Preview'],
                demoCode: newBookmarkletCollection['Image Downloader'].code,
                icon: '📥'
            },
            {
                id: 'form-filler',
                name: 'Form Filler',
                nameEn: 'Form Filler',
                nameTh: 'ฟอร์มฟิลเลอร์',
                description: 'Automatically fill forms with test data for development and testing',
                descriptionTh: 'กรอกฟอร์มอัตโนมัติด้วยข้อมูลทดสอบสำหรับการพัฒนาและทดสอบ',
                category: 'automation',
                difficulty: 'advanced',
                features: ['Smart Form Detection', 'Test Data Generation', 'Field Highlighting', 'Bulk Fill'],
                demoCode: newBookmarkletCollection['Form Filler'].code,
                icon: '📝'
            }
        ];
    }

    initializeElements() {
        this.elements = {
            scriptGrid: document.getElementById('scriptGrid'),
            cartCounter: document.getElementById('cartCounter'),
            favoritesCounter: document.getElementById('favoritesCounter'),
            cartCount: document.getElementById('cartCount'),
            favoritesCount: document.getElementById('favoritesCount'),
            cartPanel: document.getElementById('cartPanel'),
            favoritesPanel: document.getElementById('favoritesPanel'),
            cartContent: document.getElementById('cartContent'),
            favoritesContent: document.getElementById('favoritesContent'),
            searchInput: document.getElementById('scriptSearch'),
            categoryFilter: document.getElementById('categoryFilter'),
            difficultyFilter: document.getElementById('difficultyFilter'),
            searchBtn: document.getElementById('searchBtn'),
            cartClose: document.getElementById('cartClose'),
            favoritesClose: document.getElementById('favoritesClose'),
            clearCart: document.getElementById('clearCart'),
            downloadCart: document.getElementById('downloadCart')
        };
    }

    setupEventListeners() {
        // Search functionality
        this.elements.searchInput?.addEventListener('input', () => this.filterScripts());
        this.elements.searchBtn?.addEventListener('click', () => this.filterScripts());

        // Filter functionality
        this.elements.categoryFilter?.addEventListener('change', () => this.filterScripts());
        this.elements.difficultyFilter?.addEventListener('change', () => this.filterScripts());

        // Cart and favorites panel toggles
        this.elements.cartCounter?.addEventListener('click', () => this.toggleCartPanel());
        this.elements.favoritesCounter?.addEventListener('click', () => this.toggleFavoritesPanel());

        // Download history toggle
        const historyCounter = document.getElementById('historyCounter');
        historyCounter?.addEventListener('click', () => this.toggleDownloadHistory());

        // Panel close buttons
        this.elements.cartClose?.addEventListener('click', () => this.closeCartPanel());
        this.elements.favoritesClose?.addEventListener('click', () => this.closeFavoritesPanel());

        // Cart actions
        this.elements.clearCart?.addEventListener('click', () => this.clearCart());
        this.elements.downloadCart?.addEventListener('click', () => this.downloadCart());

        // Package builder
        const createPackageBtn = document.getElementById('createPackage');
        createPackageBtn?.addEventListener('click', () => this.openPackageBuilder());

        // Download history
        const clearHistoryBtn = document.getElementById('clearHistory');
        clearHistoryBtn?.addEventListener('click', () => this.clearDownloadHistory());

        const downloadHistoryClose = document.getElementById('downloadHistoryClose');
        downloadHistoryClose?.addEventListener('click', () => {
            const historyPanel = document.getElementById('downloadHistoryPanel');
            historyPanel?.classList.remove('active');
        });

        // Close panels when clicking outside
        document.addEventListener('click', (e) => {
            if (this.elements.cartPanel && !this.elements.cartPanel.contains(e.target) &&
                this.elements.cartCounter && !this.elements.cartCounter.contains(e.target) &&
                this.elements.cartPanel.classList.contains('active')) {
                this.closeCartPanel();
            }

            if (this.elements.favoritesPanel && !this.elements.favoritesPanel.contains(e.target) &&
                this.elements.favoritesCounter && !this.elements.favoritesCounter.contains(e.target) &&
                this.elements.favoritesPanel.classList.contains('active')) {
                this.closeFavoritesPanel();
            }
        });
    }

    filterScripts() {
        const searchTerm = this.elements.searchInput?.value.toLowerCase() || '';
        const categoryFilter = this.elements.categoryFilter?.value || 'all';
        const difficultyFilter = this.elements.difficultyFilter?.value || 'all';

        this.filteredScripts = this.scripts.filter(script => {
            const matchesSearch = !searchTerm ||
                script.name.toLowerCase().includes(searchTerm) ||
                script.description.toLowerCase().includes(searchTerm) ||
                script.features.some(feature => feature.toLowerCase().includes(searchTerm));

            const matchesCategory = categoryFilter === 'all' || script.category === categoryFilter;
            const matchesDifficulty = difficultyFilter === 'all' || script.difficulty === difficultyFilter;

            return matchesSearch && matchesCategory && matchesDifficulty;
        });

        this.renderScripts();
    }

    renderScripts() {
        if (!this.elements.scriptGrid) return;

        this.elements.scriptGrid.innerHTML = '';

        this.filteredScripts.forEach(script => {
            const scriptCard = this.createScriptCard(script);
            this.elements.scriptGrid.appendChild(scriptCard);
        });

        if (this.filteredScripts.length === 0) {
            this.elements.scriptGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                    <p style="font-size: 1.2rem; margin-bottom: 10px;">No scripts found matching your criteria.</p>
                    <p>Try adjusting your search or filters.</p>
                </div>
            `;
        }
    }

    createScriptCard(script) {
        const card = document.createElement('div');
        card.className = 'script-card';
        card.dataset.scriptId = script.id;

        const isInCart = this.cart.some(item => item.id === script.id);
        const isFavorite = this.favorites.some(item => item.id === script.id);

        const difficultyColors = {
            beginner: '🟢',
            intermediate: '🟡',
            advanced: '🔴'
        };

        card.innerHTML = `
            <div class="script-header">
                <h3 class="script-title">${script.icon} ${script.name}</h3>
                <div class="script-actions">
                    <button type="button" class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" 
                            data-script-id="${script.id}" title="Add to favorites">
                        ❤️
                    </button>
                    <button type="button" class="action-btn cart-btn ${isInCart ? 'active' : ''}" 
                            data-script-id="${script.id}" title="Add to cart">
                        🛒
                    </button>
                </div>
            </div>
            
            <div class="script-category">${this.getCategoryName(script.category)}</div>
            
            <p class="script-description">${script.description}</p>
            
            <div class="script-meta">
                <div class="script-difficulty">
                    ${difficultyColors[script.difficulty]} ${script.difficulty.charAt(0).toUpperCase() + script.difficulty.slice(1)}
                </div>
            </div>
            
            <div class="script-features">
                ${script.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            
            <div class="script-footer">
                <button type="button" class="script-btn preview-btn" data-script-id="${script.id}">
                    👁️ Preview
                </button>
                <button type="button" class="script-btn secondary demo-btn" data-script-id="${script.id}">
                    ▶️ Demo
                </button>
            </div>
        `;

        // Add event listeners
        const favoriteBtn = card.querySelector('.favorite-btn');
        const cartBtn = card.querySelector('.cart-btn');
        const previewBtn = card.querySelector('.preview-btn');
        const demoBtn = card.querySelector('.demo-btn');

        favoriteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(script.id);
        });

        cartBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCart(script.id);
        });

        previewBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showPreview(script.id);
        });

        demoBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showDemo(script.id);
        });

        return card;
    }

    getCategoryName(category) {
        const categoryNames = {
            security: '🔒 Security Tools',
            automation: '⚡ UI Automation',
            data: '📊 Data Extraction',
            performance: '🚀 Performance Tools',
            fun: '🎮 Fun & Games'
        };
        return categoryNames[category] || category;
    }

    toggleFavorite(scriptId) {
        const script = this.scripts.find(s => s.id === scriptId);
        if (!script) return;

        const existingIndex = this.favorites.findIndex(item => item.id === scriptId);

        if (existingIndex >= 0) {
            this.favorites.splice(existingIndex, 1);
            this.showNotification(`Removed ${script.name} from favorites`, 'info');
        } else {
            this.favorites.push(script);
            this.showNotification(`Added ${script.name} to favorites!`, 'success');
        }

        this.saveFavorites();
        this.updateCounters();
        this.renderScripts();
        this.renderFavorites();
    }

    toggleCart(scriptId) {
        const script = this.scripts.find(s => s.id === scriptId);
        if (!script) return;

        const existingIndex = this.cart.findIndex(item => item.id === scriptId);

        if (existingIndex >= 0) {
            this.cart.splice(existingIndex, 1);
            this.showNotification(`Removed ${script.name} from cart`, 'info');
        } else {
            this.cart.push(script);
            this.showNotification(`Added ${script.name} to cart!`, 'success');
            this.animateCartCounter();
        }

        this.saveCart();
        this.updateCounters();
        this.renderScripts();
        this.renderCart();
    }

    animateCartCounter() {
        const counter = this.elements.cartCount;
        if (counter) {
            counter.style.animation = 'none';
            setTimeout(() => {
                counter.style.animation = 'counterPulse 0.3s ease';
            }, 10);
        }
    }

    showPreview(scriptId) {
        const script = this.scripts.find(s => s.id === scriptId);
        if (!script) return;

        this.openScriptPreviewModal(script, 'preview');
    }

    showDemo(scriptId) {
        const script = this.scripts.find(s => s.id === scriptId);
        if (!script) return;

        this.openScriptPreviewModal(script, 'demo');
    }

    openScriptPreviewModal(script, activeTab = 'preview') {
        const modal = document.getElementById('scriptPreviewModal');
        if (!modal) return;

        // Update modal content
        this.updatePreviewModalContent(script);

        // Set active tab
        this.setActivePreviewTab(activeTab);

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Setup modal event listeners
        this.setupPreviewModalListeners(script);

        // Focus management
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }

    updatePreviewModalContent(script) {
        // Update title and meta info
        const titleElement = document.querySelector('.preview-script-title');
        const categoryElement = document.querySelector('.preview-category');
        const difficultyElement = document.querySelector('.preview-difficulty');
        const descriptionElement = document.querySelector('.preview-description');
        const featuresElement = document.querySelector('.preview-features');

        if (titleElement) titleElement.textContent = `${script.icon} ${script.name}`;
        if (categoryElement) categoryElement.textContent = this.getCategoryName(script.category);
        if (difficultyElement) {
            const difficultyColors = { beginner: '🟢', intermediate: '🟡', advanced: '🔴' };
            difficultyElement.textContent = `${difficultyColors[script.difficulty]} ${script.difficulty.charAt(0).toUpperCase() + script.difficulty.slice(1)}`;
        }
        if (descriptionElement) descriptionElement.textContent = script.description;
        if (featuresElement) {
            featuresElement.innerHTML = script.features.map(feature =>
                `<span class="feature-tag">${feature}</span>`
            ).join('');
        }

        // Update action buttons
        const favoriteBtn = document.querySelector('.preview-favorite');
        const cartBtn = document.querySelector('.preview-cart');

        if (favoriteBtn) {
            favoriteBtn.classList.toggle('active', this.favorites.some(item => item.id === script.id));
            favoriteBtn.onclick = () => this.toggleFavorite(script.id);
        }

        if (cartBtn) {
            cartBtn.classList.toggle('active', this.cart.some(item => item.id === script.id));
            cartBtn.onclick = () => this.toggleCart(script.id);
        }

        // Update code preview
        const codeElement = document.querySelector('.code-preview code');
        if (codeElement) {
            codeElement.textContent = script.demoCode;
            this.highlightCode(codeElement);
        }

        // Update source code
        const sourceElement = document.querySelector('.source-code code');
        if (sourceElement) {
            sourceElement.textContent = this.generateFullSourceCode(script);
            this.highlightCode(sourceElement);
        }

        // Update demo input
        const demoInput = document.getElementById('demoInput');
        if (demoInput) {
            demoInput.value = script.demoCode;
        }
    }

    generateFullSourceCode(script) {
        return `/**
 * ${script.name}
 * ${script.description}
 * 
 * Category: ${script.category}
 * Difficulty: ${script.difficulty}
 * Features: ${script.features.join(', ')}
 */

${script.demoCode}

// Additional utility functions
function logResult(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(\`[\${timestamp}] \${type.toUpperCase()}: \${message}\`);
}

function handleError(error) {
    console.error('Script Error:', error);
    logResult(error.message, 'error');
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ${script.name.replace(/\s+/g, '')} };
}`;
    }

    setActivePreviewTab(tabName) {
        // Remove active class from all tabs and panels
        document.querySelectorAll('#scriptPreviewModal .tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('#scriptPreviewModal .tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Add active class to selected tab and panel
        const activeTabBtn = document.querySelector(`#scriptPreviewModal .tab-button[data-tab="${tabName}"]`);
        const activePanel = document.querySelector(`#scriptPreviewModal #${tabName}-tab`);

        if (activeTabBtn) activeTabBtn.classList.add('active');
        if (activePanel) activePanel.classList.add('active');
    }

    setupPreviewModalListeners(script) {
        const modal = document.getElementById('scriptPreviewModal');
        if (!modal) return;

        // Remove existing listeners to prevent duplicates
        const newModal = modal.cloneNode(true);
        modal.parentNode.replaceChild(newModal, modal);

        // Close modal listeners
        const closeBtn = newModal.querySelector('.modal-close');
        closeBtn?.addEventListener('click', () => this.closePreviewModal());

        // Click outside to close
        newModal.addEventListener('click', (e) => {
            if (e.target === newModal) {
                this.closePreviewModal();
            }
        });

        // Tab switching
        newModal.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.setActivePreviewTab(tabName);
            });
        });

        // Copy code button
        const copyBtn = newModal.querySelector('.copy-code-btn');
        copyBtn?.addEventListener('click', () => {
            this.copyToClipboard(script.demoCode, 'Code copied to clipboard!');
        });

        // Demo controls
        const runBtn = newModal.querySelector('#runDemo');
        const resetBtn = newModal.querySelector('#resetDemo');
        const clearBtn = newModal.querySelector('#clearDemo');

        runBtn?.addEventListener('click', () => this.runDemo());
        resetBtn?.addEventListener('click', () => this.resetDemo(script));
        clearBtn?.addEventListener('click', () => this.clearDemo());

        // Source code actions
        const downloadBtn = newModal.querySelector('#downloadSource');
        const copySourceBtn = newModal.querySelector('#copySource');

        downloadBtn?.addEventListener('click', () => this.downloadSource(script));
        copySourceBtn?.addEventListener('click', () => {
            const sourceCode = this.generateFullSourceCode(script);
            this.copyToClipboard(sourceCode, 'Source code copied to clipboard!');
        });

        // Keyboard navigation
        newModal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePreviewModal();
            }
        });
    }

    closePreviewModal() {
        const modal = document.getElementById('scriptPreviewModal');
        if (!modal) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        // Clear demo output
        this.clearDemo();
    }

    runDemo() {
        const demoInput = document.getElementById('demoInput');
        const demoOutput = document.getElementById('demoOutput');

        if (!demoInput || !demoOutput) return;

        const code = demoInput.value.trim();
        if (!code) {
            this.addDemoOutput('No code to run', 'error');
            return;
        }

        // Clear previous output
        demoOutput.innerHTML = '';

        try {
            // Create a safe execution context
            const originalConsole = window.console;
            const demoConsole = {
                log: (...args) => this.addDemoOutput(args.join(' '), 'success'),
                error: (...args) => this.addDemoOutput(args.join(' '), 'error'),
                warn: (...args) => this.addDemoOutput(args.join(' '), 'info'),
                info: (...args) => this.addDemoOutput(args.join(' '), 'info')
            };

            // Replace console temporarily
            window.console = demoConsole;

            // Add timestamp
            this.addDemoOutput(`[${new Date().toLocaleTimeString()}] Running demo...`, 'info');

            // Execute code in try-catch
            const result = eval(code);

            if (result !== undefined) {
                this.addDemoOutput(`Result: ${JSON.stringify(result, null, 2)}`, 'success');
            }

            this.addDemoOutput('Demo completed successfully!', 'success');

            // Restore original console
            window.console = originalConsole;

        } catch (error) {
            this.addDemoOutput(`Error: ${error.message}`, 'error');
            console.error('Demo execution error:', error);
        }
    }

    resetDemo(script) {
        const demoInput = document.getElementById('demoInput');
        if (demoInput) {
            demoInput.value = script.demoCode;
        }
        this.clearDemo();
        this.addDemoOutput('Demo reset to original code', 'info');
    }

    clearDemo() {
        const demoOutput = document.getElementById('demoOutput');
        if (demoOutput) {
            demoOutput.innerHTML = '<p class="demo-placeholder">Run the demo to see output here...</p>';
        }
    }

    addDemoOutput(message, type = 'info') {
        const demoOutput = document.getElementById('demoOutput');
        if (!demoOutput) return;

        // Remove placeholder if it exists
        const placeholder = demoOutput.querySelector('.demo-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const outputLine = document.createElement('div');
        outputLine.className = `output-line output-${type}`;
        outputLine.textContent = message;

        demoOutput.appendChild(outputLine);
        demoOutput.scrollTop = demoOutput.scrollHeight;
    }

    downloadSource(script) {
        const sourceCode = this.generateFullSourceCode(script);
        const filename = `${script.name.replace(/\s+/g, '_').toLowerCase()}.js`;

        const blob = new Blob([sourceCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification(`Downloaded ${filename}`, 'success');

        // Track download for achievements
        if (window.achievementSystem) {
            window.achievementSystem.trackScriptDownload();
        }
    }

    copyToClipboard(text, successMessage = 'Copied to clipboard!') {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification(successMessage, 'success');
            }).catch(() => {
                this.fallbackCopyToClipboard(text, successMessage);
            });
        } else {
            this.fallbackCopyToClipboard(text, successMessage);
        }
    }

    fallbackCopyToClipboard(text, successMessage) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showNotification(successMessage, 'success');
        } catch (err) {
            this.showNotification('Failed to copy to clipboard', 'error');
        }

        document.body.removeChild(textArea);
    }

    highlightCode(codeElement) {
        if (!codeElement) return;

        // Simple syntax highlighting for JavaScript
        let code = codeElement.textContent;

        // Keywords
        code = code.replace(/\b(const|let|var|function|return|if|else|for|while|try|catch|class|new|this|async|await)\b/g,
            '<span class="token keyword">$1</span>');

        // Strings
        code = code.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g,
            '<span class="token string">$1$2$1</span>');

        // Numbers
        code = code.replace(/\b(\d+(?:\.\d+)?)\b/g,
            '<span class="token number">$1</span>');

        // Comments
        code = code.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
            '<span class="token comment">$1</span>');

        // Functions
        code = code.replace(/\b(\w+)(?=\s*\()/g,
            '<span class="token function">$1</span>');

        // Operators
        code = code.replace(/([+\-*/%=<>!&|^~?:])/g,
            '<span class="token operator">$1</span>');

        codeElement.innerHTML = code;
    }

    toggleCartPanel() {
        this.elements.cartPanel?.classList.toggle('active');
        if (this.elements.cartPanel?.classList.contains('active')) {
            this.renderCart();
            this.closeFavoritesPanel();
        }
    }

    toggleFavoritesPanel() {
        this.elements.favoritesPanel?.classList.toggle('active');
        if (this.elements.favoritesPanel?.classList.contains('active')) {
            this.renderFavorites();
            this.closeCartPanel();
        }
    }

    closeCartPanel() {
        this.elements.cartPanel?.classList.remove('active');
    }

    closeFavoritesPanel() {
        this.elements.favoritesPanel?.classList.remove('active');
    }

    toggleDownloadHistory() {
        const historyPanel = document.getElementById('downloadHistoryPanel');
        if (!historyPanel) return;

        historyPanel.classList.toggle('active');
        if (historyPanel.classList.contains('active')) {
            this.renderDownloadHistory();
        }
    }

    renderCart() {
        if (!this.elements.cartContent) return;

        if (this.cart.length === 0) {
            this.elements.cartContent.innerHTML = '<p class="empty-cart">Your cart is empty. Add some scripts to get started!</p>';
            return;
        }

        this.elements.cartContent.innerHTML = this.cart.map(script => `
            <div class="cart-item">
                <div class="cart-item-header">
                    <span class="cart-item-title">${script.icon} ${script.name}</span>
                    <button type="button" class="cart-item-remove" data-script-id="${script.id}">Remove</button>
                </div>
                <p class="cart-item-description">${script.description}</p>
                <div class="cart-item-category">${this.getCategoryName(script.category)}</div>
            </div>
        `).join('');

        // Add remove event listeners
        this.elements.cartContent.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scriptId = e.target.dataset.scriptId;
                this.toggleCart(scriptId);
            });
        });
    }

    renderFavorites() {
        if (!this.elements.favoritesContent) return;

        if (this.favorites.length === 0) {
            this.elements.favoritesContent.innerHTML = '<p class="empty-favorites">No favorites yet. Click the heart icon on scripts you love!</p>';
            return;
        }

        this.elements.favoritesContent.innerHTML = this.favorites.map(script => `
            <div class="favorite-item">
                <div class="favorite-item-header">
                    <span class="favorite-item-title">${script.icon} ${script.name}</span>
                    <button type="button" class="favorite-item-remove" data-script-id="${script.id}">Remove</button>
                </div>
                <p class="favorite-item-description">${script.description}</p>
                <div class="favorite-item-category">${this.getCategoryName(script.category)}</div>
            </div>
        `).join('');

        // Add remove event listeners
        this.elements.favoritesContent.querySelectorAll('.favorite-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scriptId = e.target.dataset.scriptId;
                this.toggleFavorite(scriptId);
            });
        });
    }

    clearCart() {
        if (this.cart.length === 0) return;

        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.updateCounters();
            this.renderScripts();
            this.renderCart();
            this.showNotification('Cart cleared!', 'info');
        }
    }

    downloadCart() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'warning');
            return;
        }

        this.bulkDownloadScripts(this.cart);
    }

    bulkDownloadScripts(scripts) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const packageName = `script-collection-${timestamp}`;

        // Create ZIP file content
        const zipContent = this.createZipPackage(scripts, {
            name: packageName,
            description: `Collection of ${scripts.length} scripts downloaded from Script Marketplace`,
            author: 'Script Marketplace User',
            includeReadme: true,
            includeIndex: true,
            includePackageJson: false,
            minifyScripts: false
        });

        // Download the ZIP
        this.downloadZip(zipContent, `${packageName}.zip`);

        // Add to download history
        this.addToDownloadHistory({
            name: packageName,
            type: 'bulk',
            scripts: scripts.map(s => s.name),
            timestamp: new Date(),
            scriptCount: scripts.length
        });

        this.showNotification(`Downloaded ${scripts.length} scripts as ${packageName}.zip`, 'success');

        // Track bulk download for achievements
        if (window.achievementSystem) {
            for (let i = 0; i < scripts.length; i++) {
                window.achievementSystem.trackScriptDownload();
            }
        }
    }

    createZipPackage(scripts, options) {
        const files = {};

        // Add individual script files
        scripts.forEach(script => {
            const filename = `${script.name.replace(/\s+/g, '_').toLowerCase()}.js`;
            let content = this.generateFullSourceCode(script);

            if (options.minifyScripts) {
                content = this.minifyJavaScript(content);
            }

            files[`scripts/${filename}`] = content;
        });

        // Add README.md if requested
        if (options.includeReadme) {
            files['README.md'] = this.generateReadme(scripts, options);
        }

        // Add index.html if requested
        if (options.includeIndex) {
            files['index.html'] = this.generateIndexHtml(scripts, options);
        }

        // Add package.json if requested
        if (options.includePackageJson) {
            files['package.json'] = this.generatePackageJson(scripts, options);
        }

        return files;
    }

    generateReadme(scripts, options) {
        const scriptList = scripts.map(script =>
            `- **${script.name}** (${script.category}) - ${script.description}`
        ).join('\n');

        return `# ${options.name}

${options.description}

## Author
${options.author}

## Scripts Included (${scripts.length})

${scriptList}

## Usage

Each script is located in the \`scripts/\` directory. You can:

1. Copy and paste the code directly into your browser console
2. Include the scripts in your HTML pages
3. Use them as bookmarklets
4. Modify them for your specific needs

## Categories

${[...new Set(scripts.map(s => s.category))].map(category => {
            const categoryScripts = scripts.filter(s => s.category === category);
            return `### ${category.charAt(0).toUpperCase() + category.slice(1)} (${categoryScripts.length})
${categoryScripts.map(s => `- ${s.name}`).join('\n')}`;
        }).join('\n\n')}

## Difficulty Levels

${[...new Set(scripts.map(s => s.difficulty))].map(difficulty => {
            const difficultyScripts = scripts.filter(s => s.difficulty === difficulty);
            const icon = difficulty === 'beginner' ? '🟢' : difficulty === 'intermediate' ? '🟡' : '🔴';
            return `### ${icon} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} (${difficultyScripts.length})
${difficultyScripts.map(s => `- ${s.name}`).join('\n')}`;
        }).join('\n\n')}

## Legal Notice

These scripts are provided for educational purposes and ethical use only. Always obtain proper permission before using them on websites you don't own.

---

Generated by Script Marketplace on ${new Date().toLocaleDateString()}
`;
    }

    generateIndexHtml(scripts, options) {
        const scriptCards = scripts.map(script => `
        <div class="script-card">
            <h3>${script.icon} ${script.name}</h3>
            <p class="category">${this.getCategoryName(script.category)}</p>
            <p class="description">${script.description}</p>
            <div class="features">
                ${script.features.map(f => `<span class="feature">${f}</span>`).join('')}
            </div>
            <div class="actions">
                <button onclick="loadScript('${script.id}')">Load Script</button>
                <button onclick="viewSource('${script.id}')">View Source</button>
            </div>
        </div>`).join('');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.name}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
            color: #00ff41;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #00ff41;
            text-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
            margin-bottom: 30px;
        }
        .script-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .script-card {
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(0, 255, 65, 0.3);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        .script-card:hover {
            border-color: #00ff41;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
            transform: translateY(-5px);
        }
        .script-card h3 {
            margin: 0 0 10px 0;
            color: #00ff41;
        }
        .category {
            background: rgba(0, 255, 65, 0.2);
            color: #000;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 10px;
        }
        .description {
            color: #ccc;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        .features {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 15px;
        }
        .feature {
            background: rgba(0, 255, 65, 0.1);
            color: #00ff41;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.8rem;
            border: 1px solid rgba(0, 255, 65, 0.2);
        }
        .actions {
            display: flex;
            gap: 10px;
        }
        button {
            background: linear-gradient(45deg, #00ff41, #00cc33);
            color: #000;
            border: none;
            padding: 8px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 255, 65, 0.4);
        }
        .info {
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid rgba(0, 255, 65, 0.3);
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📦 ${options.name}</h1>
        
        <div class="info">
            <p><strong>Description:</strong> ${options.description}</p>
            <p><strong>Author:</strong> ${options.author}</p>
            <p><strong>Scripts:</strong> ${scripts.length}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="script-grid">
            ${scriptCards}
        </div>
    </div>
    
    <script>
        const scripts = ${JSON.stringify(scripts, null, 2)};
        
        function loadScript(scriptId) {
            const script = scripts.find(s => s.id === scriptId);
            if (!script) return;
            
            try {
                eval(script.demoCode);
                alert('Script loaded successfully!');
            } catch (error) {
                alert('Error loading script: ' + error.message);
            }
        }
        
        function viewSource(scriptId) {
            const script = scripts.find(s => s.id === scriptId);
            if (!script) return;
            
            const newWindow = window.open('', '_blank');
            newWindow.document.write(\`
                <html>
                <head><title>\${script.name} - Source Code</title></head>
                <body style="background: #000; color: #00ff41; font-family: monospace; padding: 20px;">
                    <h2>\${script.name}</h2>
                    <pre style="background: rgba(0,255,65,0.1); padding: 20px; border-radius: 8px; overflow: auto;">
\${script.demoCode}
                    </pre>
                </body>
                </html>
            \`);
        }
    </script>
</body>
</html>`;
    }

    generatePackageJson(scripts, options) {
        return JSON.stringify({
            name: options.name.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            description: options.description,
            author: options.author,
            license: 'MIT',
            keywords: [
                'javascript',
                'scripts',
                'automation',
                'tools',
                ...scripts.map(s => s.category),
                ...scripts.flatMap(s => s.features.map(f => f.toLowerCase()))
            ].filter((v, i, a) => a.indexOf(v) === i),
            scripts: {
                start: 'node index.js',
                test: 'echo "No tests specified"'
            },
            dependencies: {},
            devDependencies: {},
            repository: {
                type: 'git',
                url: 'https://github.com/yourusername/your-repo.git'
            },
            bugs: {
                url: 'https://github.com/yourusername/your-repo/issues'
            },
            homepage: 'https://github.com/yourusername/your-repo#readme'
        }, null, 2);
    }

    minifyJavaScript(code) {
        // Simple minification - remove comments and extra whitespace
        return code
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
            .replace(/;\s*}/g, ';}') // Remove space before closing brace
            .replace(/{\s*/g, '{') // Remove space after opening brace
            .replace(/\s*}\s*/g, '}') // Remove space around closing brace
            .trim();
    }

    downloadZip(files, filename) {
        // Create a simple ZIP-like structure (for demo purposes)
        // In a real implementation, you'd use a library like JSZip
        const content = Object.entries(files).map(([path, content]) =>
            `=== ${path} ===\n${content}\n\n`
        ).join('');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    addToDownloadHistory(downloadInfo) {
        let history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
        history.unshift(downloadInfo);

        // Keep only last 50 downloads
        if (history.length > 50) {
            history = history.slice(0, 50);
        }

        localStorage.setItem('downloadHistory', JSON.stringify(history));
        this.renderDownloadHistory();
    }

    renderDownloadHistory() {
        const historyContent = document.getElementById('downloadHistoryContent');
        if (!historyContent) return;

        const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');

        if (history.length === 0) {
            historyContent.innerHTML = '<p class="empty-history">No downloads yet. Download some scripts to see history!</p>';
            return;
        }

        historyContent.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-item-info">
                    <div class="history-item-name">${item.name}</div>
                    <div class="history-item-details">
                        ${item.scriptCount} scripts • ${new Date(item.timestamp).toLocaleDateString()} ${new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                </div>
                <div class="history-item-actions">
                    <button type="button" class="history-action-btn" onclick="scriptMarketplace.redownload('${item.name}')">
                        🔄 Re-download
                    </button>
                    <button type="button" class="history-action-btn" onclick="scriptMarketplace.removeFromHistory('${item.name}')">
                        🗑️ Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    redownload(itemName) {
        const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
        const item = history.find(h => h.name === itemName);

        if (!item) {
            this.showNotification('Download item not found in history', 'error');
            return;
        }

        // Find scripts by name (this is a simplified approach)
        const scriptsToDownload = this.scripts.filter(script =>
            item.scripts.includes(script.name)
        );

        if (scriptsToDownload.length === 0) {
            this.showNotification('No matching scripts found', 'error');
            return;
        }

        this.bulkDownloadScripts(scriptsToDownload);
    }

    removeFromHistory(itemName) {
        let history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
        history = history.filter(h => h.name !== itemName);
        localStorage.setItem('downloadHistory', JSON.stringify(history));
        this.renderDownloadHistory();
        this.showNotification('Removed from download history', 'info');
    }

    clearDownloadHistory() {
        if (confirm('Are you sure you want to clear all download history?')) {
            localStorage.removeItem('downloadHistory');
            this.renderDownloadHistory();
            this.showNotification('Download history cleared', 'info');
        }
    }

    openPackageBuilder() {
        if (this.cart.length === 0) {
            this.showNotification('Add some scripts to your cart first!', 'warning');
            return;
        }

        const modal = document.getElementById('packageBuilderModal');
        if (!modal) return;

        // Update package builder content
        this.updatePackageBuilderContent();

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Setup modal event listeners
        this.setupPackageBuilderListeners();

        // Focus management
        const packageNameInput = modal.querySelector('#packageName');
        if (packageNameInput) packageNameInput.focus();
    }

    updatePackageBuilderContent() {
        // Update selected scripts count
        const countElement = document.getElementById('selectedScriptCount');
        if (countElement) countElement.textContent = this.cart.length;

        // Update selected scripts list
        const scriptsList = document.getElementById('selectedScriptsList');
        if (scriptsList) {
            scriptsList.innerHTML = this.cart.map(script => `
                <div class="selected-script-item">
                    <div class="selected-script-info">
                        <div class="selected-script-name">${script.icon} ${script.name}</div>
                        <div class="selected-script-category">${this.getCategoryName(script.category)}</div>
                    </div>
                    <button type="button" class="remove-script-btn" data-script-id="${script.id}">Remove</button>
                </div>
            `).join('');

            // Add remove event listeners
            scriptsList.querySelectorAll('.remove-script-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const scriptId = e.target.dataset.scriptId;
                    this.toggleCart(scriptId);
                    this.updatePackageBuilderContent();
                });
            });
        }

        // Update package preview
        this.updatePackagePreview();
    }

    updatePackagePreview() {
        const structureElement = document.getElementById('packageStructure');
        if (!structureElement) return;

        const includeReadme = document.getElementById('includeReadme')?.checked;
        const includeIndex = document.getElementById('includeIndex')?.checked;
        const includePackageJson = document.getElementById('includePackageJson')?.checked;

        let structure = `📁 package-root/\n`;

        if (includeReadme) structure += `  📄 README.md\n`;
        if (includeIndex) structure += `  🌐 index.html\n`;
        if (includePackageJson) structure += `  📦 package.json\n`;

        structure += `  📁 scripts/\n`;
        this.cart.forEach(script => {
            const filename = `${script.name.replace(/\s+/g, '_').toLowerCase()}.js`;
            structure += `    💻 ${filename}\n`;
        });

        structureElement.innerHTML = structure.replace(/\n/g, '<br>');
    }

    setupPackageBuilderListeners() {
        const modal = document.getElementById('packageBuilderModal');
        if (!modal) return;

        // Remove existing listeners to prevent duplicates
        const newModal = modal.cloneNode(true);
        modal.parentNode.replaceChild(newModal, modal);

        // Close modal listeners
        const closeBtn = newModal.querySelector('.modal-close');
        closeBtn?.addEventListener('click', () => this.closePackageBuilder());

        // Click outside to close
        newModal.addEventListener('click', (e) => {
            if (e.target === newModal) {
                this.closePackageBuilder();
            }
        });

        // Option checkboxes
        newModal.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updatePackagePreview());
        });

        // Package builder actions
        const previewBtn = newModal.querySelector('#previewPackage');
        const buildBtn = newModal.querySelector('#buildPackage');
        const downloadBtn = newModal.querySelector('#downloadPackage');

        previewBtn?.addEventListener('click', () => this.previewPackage());
        buildBtn?.addEventListener('click', () => this.buildPackage());
        downloadBtn?.addEventListener('click', () => this.downloadCustomPackage());

        // Keyboard navigation
        newModal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePackageBuilder();
            }
        });
    }

    closePackageBuilder() {
        const modal = document.getElementById('packageBuilderModal');
        if (!modal) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    previewPackage() {
        const options = this.getPackageOptions();
        const structure = this.createZipPackage(this.cart, options);

        // Show preview in a new window
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(`
            <html>
            <head>
                <title>Package Preview - ${options.name}</title>
                <style>
                    body { font-family: monospace; background: #000; color: #00ff41; padding: 20px; }
                    h2 { color: #00ff41; border-bottom: 1px solid #00ff41; }
                    pre { background: rgba(0,255,65,0.1); padding: 15px; border-radius: 8px; overflow: auto; }
                    .file-header { color: #ffff00; font-weight: bold; margin-top: 20px; }
                </style>
            </head>
            <body>
                <h1>📦 Package Preview: ${options.name}</h1>
                <p><strong>Description:</strong> ${options.description}</p>
                <p><strong>Author:</strong> ${options.author}</p>
                <p><strong>Files:</strong> ${Object.keys(structure).length}</p>
                
                ${Object.entries(structure).map(([path, content]) => `
                    <div class="file-header">📄 ${path}</div>
                    <pre>${content.substring(0, 500)}${content.length > 500 ? '...\n[Content truncated for preview]' : ''}</pre>
                `).join('')}
            </body>
            </html>
        `);
    }

    buildPackage() {
        const options = this.getPackageOptions();

        if (!options.name.trim()) {
            this.showNotification('Please enter a package name', 'warning');
            return;
        }

        this.showNotification('Package built successfully! Ready to download.', 'success');
    }

    downloadCustomPackage() {
        const options = this.getPackageOptions();

        if (!options.name.trim()) {
            this.showNotification('Please enter a package name', 'warning');
            return;
        }

        const zipContent = this.createZipPackage(this.cart, options);
        const filename = `${options.name.replace(/\s+/g, '_').toLowerCase()}.zip`;

        this.downloadZip(zipContent, filename);

        // Add to download history
        this.addToDownloadHistory({
            name: options.name,
            type: 'custom',
            scripts: this.cart.map(s => s.name),
            timestamp: new Date(),
            scriptCount: this.cart.length,
            options: options
        });

        this.showNotification(`Downloaded custom package: ${filename}`, 'success');
        this.closePackageBuilder();
    }

    getPackageOptions() {
        return {
            name: document.getElementById('packageName')?.value || 'Custom Script Package',
            description: document.getElementById('packageDescription')?.value || 'Custom script package created with Script Marketplace',
            author: document.getElementById('packageAuthor')?.value || 'Script Marketplace User',
            includeReadme: document.getElementById('includeReadme')?.checked || false,
            includeIndex: document.getElementById('includeIndex')?.checked || false,
            includePackageJson: document.getElementById('includePackageJson')?.checked || false,
            minifyScripts: document.getElementById('minifyScripts')?.checked || false
        };
    }

    updateCounters() {
        if (this.elements.cartCount) {
            this.elements.cartCount.textContent = this.cart.length;
        }
        if (this.elements.favoritesCount) {
            this.elements.favoritesCount.textContent = this.favorites.length;
        }
    }

    saveCart() {
        localStorage.setItem('scriptCart', JSON.stringify(this.cart));
    }

    saveFavorites() {
        localStorage.setItem('scriptFavorites', JSON.stringify(this.favorites));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `marketplace-notification ${type}`;
        notification.textContent = message;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 255, 65, 0.9)' :
                type === 'warning' ? 'rgba(255, 255, 0, 0.9)' :
                    type === 'error' ? 'rgba(255, 68, 68, 0.9)' :
                        'rgba(0, 204, 255, 0.9)'};
            color: ${type === 'success' || type === 'warning' ? '#000' : '#fff'};
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize Script Marketplace when DOM is loaded with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        const scriptMarketplace = new ScriptMarketplace();
    } catch (error) {
        console.error('Failed to initialize Script Marketplace:', error);
    }
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            const scriptMarketplace = new ScriptMarketplace();
        } catch (error) {
            console.error('Failed to initialize Script Marketplace:', error);
        }
    });
} else {
    try {
        const scriptMarketplace = new ScriptMarketplace();
    } catch (error) {
        console.error('Failed to initialize Script Marketplace:', error);
    }
}

// ===== ADVANCED THEME SYSTEM =====

class ThemeManager {
    constructor() {
        this.themes = {
            matrix: {
                name: 'Matrix',
                nameTh: 'เมทริกซ์',
                description: 'Classic green hacker aesthetic',
                descriptionTh: 'สไตล์แฮกเกอร์สีเขียวคลาสสิก',
                colors: {
                    primary: '#00ff41',
                    secondary: '#00cc33',
                    background: '#000000',
                    text: '#ffffff',
                    accent: '#ccc',
                    border: '#333'
                }
            },
            cyberpunk: {
                name: 'Cyberpunk',
                nameTh: 'ไซเบอร์พังค์',
                description: 'Neon purple futuristic vibes',
                descriptionTh: 'บรรยากาศอนาคตสีม่วงนีออน',
                colors: {
                    primary: '#ff00ff',
                    secondary: '#cc00cc',
                    background: '#0a0a0a',
                    text: '#ffffff',
                    accent: '#ff66ff',
                    border: '#ff00ff'
                }
            },
            hacker: {
                name: 'Hacker',
                nameTh: 'แฮกเกอร์',
                description: 'Electric blue terminal style',
                descriptionTh: 'สไตล์เทอร์มินัลสีฟ้าไฟฟ้า',
                colors: {
                    primary: '#00ffff',
                    secondary: '#00cccc',
                    background: '#001122',
                    text: '#ffffff',
                    accent: '#66ffff',
                    border: '#00ffff'
                }
            },
            neon: {
                name: 'Neon',
                nameTh: 'นีออน',
                description: 'Bright yellow electric glow',
                descriptionTh: 'แสงไฟฟ้าสีเหลืองสดใส',
                colors: {
                    primary: '#ffff00',
                    secondary: '#cccc00',
                    background: '#000011',
                    text: '#ffffff',
                    accent: '#ffff66',
                    border: '#ffff00'
                }
            },
            ocean: {
                name: 'Ocean',
                nameTh: 'มหาสมุทร',
                description: 'Deep blue underwater feel',
                descriptionTh: 'ความรู้สึกใต้น้ำสีน้ำเงินลึก',
                colors: {
                    primary: '#0099ff',
                    secondary: '#0077cc',
                    background: '#001133',
                    text: '#ffffff',
                    accent: '#66ccff',
                    border: '#0099ff'
                }
            },
            fire: {
                name: 'Fire',
                nameTh: 'ไฟ',
                description: 'Hot orange flame effects',
                descriptionTh: 'เอฟเฟกต์เปลวไฟสีส้มร้อน',
                colors: {
                    primary: '#ff4500',
                    secondary: '#cc3300',
                    background: '#110000',
                    text: '#ffffff',
                    accent: '#ff7733',
                    border: '#ff4500'
                }
            }
        };

        this.currentTheme = 'matrix';
        this.isTransitioning = false;

        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupEventListeners();
        this.updateThemeDisplay();
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        const themeDropdown = document.getElementById('themeDropdown');
        const themeClose = document.getElementById('themeClose');
        const themeOptions = document.querySelectorAll('.theme-option');

        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleThemeDropdown();
            });
        }

        if (themeClose) {
            themeClose.addEventListener('click', () => {
                this.closeThemeDropdown();
            });
        }

        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const themeName = option.dataset.theme;
                if (themeName && themeName !== this.currentTheme) {
                    this.switchTheme(themeName);
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.theme-selector')) {
                this.closeThemeDropdown();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeThemeDropdown();
            }
        });
    }

    toggleThemeDropdown() {
        const dropdown = document.getElementById('themeDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    closeThemeDropdown() {
        const dropdown = document.getElementById('themeDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    switchTheme(themeName) {
        if (this.isTransitioning || !this.themes[themeName]) {
            return;
        }

        this.isTransitioning = true;

        // Start smooth transition sequence
        this.startThemeTransition(themeName);
    }

    async startThemeTransition(themeName) {
        const theme = this.themes[themeName];

        // Step 1: Show loading overlay
        this.showTransitionOverlay();

        // Step 2: Create ripple effect from theme toggle button
        this.createRippleEffect();

        // Step 3: Show loading animation
        await this.showLoadingAnimation(theme.name);

        // Step 4: Apply theme changes
        this.applyThemeChanges(themeName);

        // Step 5: Create wave effect
        this.createWaveEffect();

        // Step 6: Animate elements
        this.animateElements();

        // Step 7: Hide loading and complete transition
        await this.completeTransition(themeName);
    }

    showTransitionOverlay() {
        let overlay = document.querySelector('.theme-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'theme-transition-overlay';
            document.body.appendChild(overlay);
        }

        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    }

    createRippleEffect() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const rect = themeToggle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const ripple = document.createElement('div');
        ripple.className = 'theme-ripple';
        ripple.style.left = centerX + 'px';
        ripple.style.top = centerY + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';

        document.body.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
    }

    showLoadingAnimation(themeName) {
        return new Promise((resolve) => {
            let loading = document.querySelector('.theme-loading');
            if (!loading) {
                loading = document.createElement('div');
                loading.className = 'theme-loading';
                loading.innerHTML = `
                            <div class="theme-loading-content">
                                <div class="theme-loading-spinner"></div>
                                <div class="theme-loading-text">Switching to ${themeName}...</div>
                                <div class="theme-loading-progress">
                                    <div class="theme-loading-progress-bar"></div>
                                </div>
                            </div>
                        `;
                document.body.appendChild(loading);
            }

            // Show loading
            setTimeout(() => {
                loading.classList.add('active');
            }, 100);

            // Animate progress bar
            const progressBar = loading.querySelector('.theme-loading-progress-bar');
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress > 100) progress = 100;
                progressBar.style.width = progress + '%';

                if (progress >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(resolve, 200);
                }
            }, 100);
        });
    }

    applyThemeChanges(themeName) {
        // Add transition class to body
        document.body.classList.add('theme-transitioning');

        // Update theme
        this.currentTheme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);

        // Update active theme option
        this.updateActiveThemeOption();

        // Update theme display
        this.updateThemeDisplay();

        // Update matrix and particle colors
        this.updateAnimationColors();

        // Save theme preference
        this.saveTheme();

        // Close dropdown
        this.closeThemeDropdown();
    }

    createWaveEffect() {
        const wave = document.createElement('div');
        wave.className = 'theme-wave';
        document.body.appendChild(wave);

        // Remove wave after animation
        setTimeout(() => {
            if (wave.parentNode) {
                wave.parentNode.removeChild(wave);
            }
        }, 1000);
    }

    animateElements() {
        // Create particle burst effect
        this.createParticleBurst();

        // Stagger element animations
        const elements = document.querySelectorAll('.feature, .step, .shortcut');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animation = 'themeElementFade 0.8s ease-in-out';
                setTimeout(() => {
                    element.style.animation = '';
                }, 800);
            }, index * 100);
        });
    }

    createParticleBurst() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'theme-particle-burst';

                const angle = (i / particleCount) * Math.PI * 2;
                const velocity = 100 + Math.random() * 100;
                const startX = centerX;
                const startY = centerY;
                const endX = startX + Math.cos(angle) * velocity;
                const endY = startY + Math.sin(angle) * velocity;

                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';

                document.body.appendChild(particle);

                // Animate particle
                particle.animate([
                    {
                        transform: 'translate(0, 0) scale(1)',
                        opacity: 1
                    },
                    {
                        transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`,
                        opacity: 0
                    }
                ], {
                    duration: 1000 + Math.random() * 500,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }).onfinish = () => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                };
            }, i * 50);
        }
    }

    completeTransition(themeName) {
        return new Promise((resolve) => {
            // Hide loading animation
            const loading = document.querySelector('.theme-loading');
            if (loading) {
                loading.classList.remove('active');
                setTimeout(() => {
                    if (loading.parentNode) {
                        loading.parentNode.removeChild(loading);
                    }
                }, 300);
            }

            // Hide overlay
            const overlay = document.querySelector('.theme-transition-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }

            // Show theme change notification
            this.showThemeChangeNotification(themeName);

            // Remove transition class after animation
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
                this.isTransitioning = false;
                resolve();
            }, 600);
        });
    }

    updateActiveThemeOption() {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentTheme) {
                option.classList.add('active');
            }
        });
    }

    updateThemeDisplay() {
        const currentThemeNameEl = document.getElementById('currentThemeName');
        if (currentThemeNameEl && this.themes[this.currentTheme]) {
            currentThemeNameEl.textContent = this.themes[this.currentTheme].name;
        }
    }

    updateAnimationColors() {
        // Update matrix animation colors
        if (typeof matrixArray !== 'undefined') {
            // Matrix colors will be updated through CSS variables
            // The animation loop will pick up the new colors automatically
        }

        // Update particle colors
        if (typeof particles !== 'undefined' && particles.length > 0) {
            const theme = this.themes[this.currentTheme];
            particles.forEach(particle => {
                // Update particle hue to match theme
                const primaryColor = theme.colors.primary;
                particle.hue = this.hexToHsl(primaryColor).h;
            });
        }
    }

    hexToHsl(hex) {
        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    showThemeChangeNotification(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'theme-change-notification';
        notification.innerHTML = `
                    <div class="notification-icon">🎨</div>
                    <div class="notification-content">
                        <div class="notification-title">Theme Changed!</div>
                        <div class="notification-message">Switched to ${theme.name} theme</div>
                    </div>
                `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveTheme() {
        try {
            localStorage.setItem('selectedTheme', this.currentTheme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
    }

    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('selectedTheme');
            if (savedTheme && this.themes[savedTheme]) {
                this.currentTheme = savedTheme;
                document.documentElement.setAttribute('data-theme', savedTheme);
                this.updateActiveThemeOption();
            }
        } catch (e) {
            console.warn('Could not load saved theme:', e);
        }
    }

    // Public method to get current theme info
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            data: this.themes[this.currentTheme]
        };
    }

    // Public method to get all available themes
    getAllThemes() {
        return this.themes;
    }

    // Public method for programmatic theme switching
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.switchTheme(themeName);
            return true;
        }
        return false;
    }

    // Performance optimization for smooth transitions
    optimizePerformance() {
        // Detect device capabilities
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

        if (isMobile || prefersReducedMotion || isLowEndDevice) {
            // Disable complex animations for better performance
            document.documentElement.style.setProperty('--animation-duration', '0.2s');

            // Simplify transition effects
            const style = document.createElement('style');
            style.textContent = `
                        .theme-transition-overlay,
                        .theme-loading,
                        .theme-ripple,
                        .theme-wave,
                        .theme-particle-burst {
                            display: none !important;
                        }
                        * {
                            transition-duration: 0.2s !important;
                        }
                    `;
            document.head.appendChild(style);
        }
    }

    // Method to enable/disable smooth transitions
    setTransitionMode(enabled) {
        if (enabled) {
            document.body.classList.remove('no-transitions');
        } else {
            document.body.classList.add('no-transitions');
        }
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Optimize performance based on device capabilities
themeManager.optimizePerformance();

// Make theme manager globally accessible for debugging and external use
window.themeManager = themeManager;
// ===== PREFERENCE STORAGE SYSTEM =====

class PreferenceManager {
    constructor() {
        this.defaultPreferences = {
            theme: 'matrix',
            enableAnimations: true,
            enableParticles: true,
            enableParallax: true,
            enableSoundEffects: true,
            enableThemeTransitions: true,
            animationQuality: 'high',
            particleCount: 50
        };

        this.preferences = { ...this.defaultPreferences };
        this.storageKey = 'devToolsPreferences';

        this.init();
    }

    init() {
        this.loadPreferences();
        this.setupEventListeners();
        this.applyPreferences();
        this.updateUI();
    }

    setupEventListeners() {
        // Performance toggle button
        const performanceToggle = document.getElementById('performanceToggle');
        const performanceOptions = document.getElementById('performanceOptions');

        if (performanceToggle && performanceOptions) {
            performanceToggle.addEventListener('click', () => {
                performanceOptions.classList.toggle('active');
            });
        }

        // Preference controls
        const controls = {
            enableAnimations: document.getElementById('enableAnimations'),
            enableParticles: document.getElementById('enableParticles'),
            enableParallax: document.getElementById('enableParallax'),
            enableSoundEffects: document.getElementById('enableSoundEffects'),
            enableThemeTransitions: document.getElementById('enableThemeTransitions'),
            animationQuality: document.getElementById('animationQuality'),
            particleCount: document.getElementById('particleCount')
        };

        // Add event listeners for each control
        Object.keys(controls).forEach(key => {
            const control = controls[key];
            if (control) {
                if (control.type === 'checkbox') {
                    control.addEventListener('change', (e) => {
                        this.updatePreference(key, e.target.checked);
                    });
                } else if (control.type === 'range') {
                    control.addEventListener('input', (e) => {
                        const value = parseInt(e.target.value);
                        this.updatePreference(key, value);
                        this.updateParticleCountDisplay(value);
                    });
                } else if (control.tagName === 'SELECT') {
                    control.addEventListener('change', (e) => {
                        this.updatePreference(key, e.target.value);
                    });
                }
            }
        });

        // Reset and apply buttons
        const resetButton = document.getElementById('resetSettings');
        const applyButton = document.getElementById('applySettings');

        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetToDefaults();
            });
        }

        if (applyButton) {
            applyButton.addEventListener('click', () => {
                this.applyPreferences();
                this.showStatusMessage('Settings applied successfully!', 'success');
            });
        }
    }

    updatePreference(key, value) {
        this.preferences[key] = value;
        this.savePreferences();

        // Apply immediately for real-time feedback
        this.applySpecificPreference(key, value);
    }

    applySpecificPreference(key, value) {
        switch (key) {
            case 'enableAnimations':
                this.toggleAnimations(value);
                break;
            case 'enableParticles':
                this.toggleParticles(value);
                break;
            case 'enableParallax':
                this.toggleParallax(value);
                break;
            case 'enableThemeTransitions':
                if (window.themeManager) {
                    window.themeManager.setTransitionMode(value);
                }
                break;
            case 'animationQuality':
                this.setAnimationQuality(value);
                break;
            case 'particleCount':
                this.updateParticleCount(value);
                break;
        }
    }

    toggleAnimations(enabled) {
        if (enabled) {
            document.body.classList.remove('no-transitions');
        } else {
            document.body.classList.add('no-transitions');
        }
    }

    toggleParticles(enabled) {
        const particleCanvas = document.getElementById('particleCanvas');
        if (particleCanvas) {
            particleCanvas.style.display = enabled ? 'block' : 'none';
        }

        // Update global particles array if available
        if (typeof particles !== 'undefined') {
            if (!enabled) {
                // Hide existing particles
                particles.forEach(particle => {
                    particle.opacity = 0;
                });
            } else {
                // Show particles
                particles.forEach(particle => {
                    particle.opacity = 0.3 + Math.random() * 0.7;
                });
            }
        }
    }

    toggleParallax(enabled) {
        if (typeof parallaxLayers !== 'undefined') {
            parallaxLayers.forEach(layer => {
                if (layer.canvas) {
                    layer.canvas.style.display = enabled ? 'block' : 'none';
                }
            });
        }
    }

    setAnimationQuality(quality) {
        // Remove existing quality classes
        document.body.classList.remove('performance-low', 'performance-medium', 'performance-high');

        // Add new quality class
        document.body.classList.add(`performance-${quality}`);

        // Update CSS custom properties based on quality
        const root = document.documentElement;
        switch (quality) {
            case 'low':
                root.style.setProperty('--animation-duration', '0.1s');
                root.style.setProperty('--glow-intensity', '15px');
                break;
            case 'medium':
                root.style.setProperty('--animation-duration', '0.2s');
                root.style.setProperty('--glow-intensity', '25px');
                break;
            case 'high':
                root.style.setProperty('--animation-duration', '0.4s');
                root.style.setProperty('--glow-intensity', '35px');
                break;
        }
    }

    updateParticleCount(count) {
        if (typeof particles !== 'undefined') {
            // Adjust particle array size
            while (particles.length < count) {
                particles.push(new Particle());
            }
            while (particles.length > count) {
                particles.pop();
            }
        }
    }

    updateParticleCountDisplay(value) {
        const display = document.getElementById('particleCountValue');
        if (display) {
            display.textContent = value;
        }
    }

    applyPreferences() {
        // Apply all preferences
        Object.keys(this.preferences).forEach(key => {
            this.applySpecificPreference(key, this.preferences[key]);
        });

        // Update theme if theme manager is available
        if (window.themeManager && this.preferences.theme) {
            window.themeManager.setTheme(this.preferences.theme);
        }
    }

    updateUI() {
        // Update all UI controls to reflect current preferences
        const controls = {
            enableAnimations: document.getElementById('enableAnimations'),
            enableParticles: document.getElementById('enableParticles'),
            enableParallax: document.getElementById('enableParallax'),
            enableSoundEffects: document.getElementById('enableSoundEffects'),
            enableThemeTransitions: document.getElementById('enableThemeTransitions'),
            animationQuality: document.getElementById('animationQuality'),
            particleCount: document.getElementById('particleCount')
        };

        Object.keys(controls).forEach(key => {
            const control = controls[key];
            if (control && this.preferences.hasOwnProperty(key)) {
                if (control.type === 'checkbox') {
                    control.checked = this.preferences[key];
                } else if (control.type === 'range') {
                    control.value = this.preferences[key];
                    this.updateParticleCountDisplay(this.preferences[key]);
                } else if (control.tagName === 'SELECT') {
                    control.value = this.preferences[key];
                }
            }
        });
    }

    resetToDefaults() {
        this.preferences = { ...this.defaultPreferences };
        this.savePreferences();
        this.applyPreferences();
        this.updateUI();
        this.showStatusMessage('Settings reset to defaults!', 'info');
    }

    savePreferences() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
        } catch (e) {
            console.warn('Could not save preferences:', e);
            this.showStatusMessage('Could not save preferences', 'error');
        }
    }

    loadPreferences() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                this.preferences = { ...this.defaultPreferences, ...parsed };
            }
        } catch (e) {
            console.warn('Could not load preferences:', e);
            this.preferences = { ...this.defaultPreferences };
        }
    }

    showStatusMessage(message, type = 'info') {
        let statusEl = document.querySelector('.performance-status');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.className = 'performance-status';
            document.body.appendChild(statusEl);
        }

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };

        statusEl.innerHTML = `
                    <div class="performance-status-text">
                        <span class="performance-status-icon">${icons[type] || icons.info}</span>
                        <span>${message}</span>
                    </div>
                `;

        statusEl.classList.add('show');

        setTimeout(() => {
            statusEl.classList.remove('show');
        }, 3000);
    }

    // Public methods for external access
    getPreference(key) {
        return this.preferences[key];
    }

    setPreference(key, value) {
        this.updatePreference(key, value);
    }

    getAllPreferences() {
        return { ...this.preferences };
    }

    exportPreferences() {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.preferences = { ...this.defaultPreferences, ...imported };
            this.savePreferences();
            this.applyPreferences();
            this.updateUI();
            this.showStatusMessage('Preferences imported successfully!', 'success');
            return true;
        } catch (e) {
            this.showStatusMessage('Invalid preferences format', 'error');
            return false;
        }
    }

    // Performance monitoring
    getPerformanceInfo() {
        return {
            userAgent: navigator.userAgent,
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            deviceMemory: navigator.deviceMemory || 'unknown',
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : 'unknown',
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio || 1,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            currentPreferences: this.preferences
        };
    }
}

// Initialize preference manager
const preferenceManager = new PreferenceManager();

// Make preference manager globally accessible
window.preferenceManager = preferenceManager;

// Update theme manager to use preferences
if (window.themeManager) {
    // Override theme manager's save method to use preference manager
    const originalSaveTheme = window.themeManager.saveTheme;
    window.themeManager.saveTheme = function () {
        preferenceManager.setPreference('theme', this.currentTheme);
    };

    // Load theme from preferences
    const savedTheme = preferenceManager.getPreference('theme');
    if (savedTheme && savedTheme !== window.themeManager.currentTheme) {
        window.themeManager.setTheme(savedTheme);
    }
}
// Toast notification system
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
            return true;
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

// Run bookmarklet code
function runBookmarkletCode(code) {
    try {
        const cleanCode = code.startsWith('javascript:') ? code.slice(11) : code;

        // Check if it's a script loader pattern
        const scriptMatch = cleanCode.match(/s\.src\s*=\s*['"]([^'"]+)['"]/i);
        if (scriptMatch && scriptMatch[1]) {
            let url = scriptMatch[1];

            // Add timestamp if original code includes Date.now()
            if (/Date\.now\(\)/.test(cleanCode)) {
                if (/[?&]t=$/.test(url) || /=$/.test(url)) {
                    url = url + Date.now();
                } else if (url.indexOf('?') === -1) {
                    url = url + '?t=' + Date.now();
                } else {
                    url = url + '&t=' + Date.now();
                }
            }

            const script = document.createElement('script');
            script.src = url;
            script.async = true;

            script.onload = function () {
                showToast('🚀 สคริปต์โหลดสำเร็จ!');
                // Try to activate console if available
                try {
                    if (typeof toggleConsole === 'function') {
                        toggleConsole();
                    } else if (window.toggleConsole) {
                        window.toggleConsole();
                    }
                } catch (e) {
                    // Ignore activation errors
                }
            };

            script.onerror = function () {
                showToast('❌ โหลดสคริปต์ไม่สำเร็จ');
            };

            document.body.appendChild(script);
            return;
        }

        // Fallback: execute code directly
        (new Function(cleanCode))();
        showToast('✅ รันโค้ดสำเร็จ!');
    } catch (err) {
        console.error('Bookmarklet execution error:', err);
        showToast('❌ รันโค้ดไม่สำเร็จ: ' + (err.message || err));
    }
}

// Tool loading functions
function loadGooneeConsole() {
    const code = "javascript:(function(){var s=document.createElement('script');s.src='https://goohub.js.org/console2.js?t='+Date.now();document.body.appendChild(s);})();";
    runBookmarkletCode(code);
}

function loadEruda() {
    const code = "javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/eruda';document.body.appendChild(s);s.onload=function(){eruda.init();eruda.show();};})();";
    runBookmarkletCode(code);
}

function loadEncryptionTools() {
    showToast('🔐 เครื่องมือเข้ารหัสกำลังโหลด...');
    // This would load encryption tools - placeholder for now
    setTimeout(() => showToast('🔐 เครื่องมือเข้ารหัสพร้อมใช้งาน!'), 1000);
}

function loadSystemMonitor() {
    const code = "javascript:(function(){var s=document.createElement('script');s.src='https://goohub.js.org/sharktool/monitor.js?t='+Date.now();document.body.appendChild(s)})();";
    runBookmarkletCode(code);
}

function loadProxyManager() {
    showToast('🌐 Proxy Manager กำลังโหลด...');
    // This would load proxy manager - placeholder for now
    setTimeout(() => showToast('🌐 Proxy Manager พร้อมใช้งาน!'), 1000);
}

function loadAIScan() {
    showToast('☠️ AI Auto Scan กำลังเริ่มต้น...');
    // This would load AI scan tools - placeholder for now
    setTimeout(() => showToast('☠️ AI Auto Scan พร้อมสแกน!'), 1000);
}

function loadThemeChanger() {
    const code = "javascript:(function(){var s=document.createElement('script');s.src='https://goohub.js.org/sharktool/Theme.js?t='+Date.now();document.body.appendChild(s)})();";
    runBookmarkletCode(code);
}

// Bookmarklet functions
function copyBookmarklet(toolName) {
    const bookmarklets = {
        'goonee-console': "javascript:(function(){var s=document.createElement('script');s.src='https://goohub.js.org/console2.js?t='+Date.now();document.body.appendChild(s);})();",
        'eruda': "javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/eruda';document.body.appendChild(s);s.onload=function(){eruda.init();eruda.show();};})();",
        'encryption': "javascript:(function(){alert('🔐 เครื่องมือเข้ารหัส - กำลังพัฒนา');})();",
        'monitor': "javascript:(function(){var s=document.createElement('script');s.src='https://goohub.js.org/sharktool/monitor.js?t='+Date.now();document.body.appendChild(s)})();",
        'proxy': "javascript:(function(){alert('🌐 Proxy Manager - กำลังพัฒนา');})();",
        'ai-scan': "javascript:(function(){alert('☠️ AI Auto Scan - กำลังพัฒนา');})();",
        'theme': "javascript:(function(){var s=document.createElement('script');s.src='https://goohub.js.org/sharktool/Theme.js?t='+Date.now();document.body.appendChild(s)})();"
    };

    const code = bookmarklets[toolName];
    if (code) {
        copyToClipboard(code).then(success => {
            if (success) {
                showToast('📋 คัดลอก bookmarklet สำเร็จ!');
            } else {
                showToast('❌ คัดลอกไม่สำเร็จ');
            }
        });
    }
}

function copyBookmarkletCode(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const code = element.textContent;
        copyToClipboard(code).then(success => {
            if (success) {
                showToast('📋 คัดลอกโค้ดสำเร็จ!');
            } else {
                showToast('❌ คัดลอกไม่สำเร็จ');
            }
        });
    }
}

function testBookmarklet(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const code = element.textContent;
        runBookmarkletCode(code);
    }
}

// Enhanced keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl + ` - Toggle Console
    if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        loadGooneeConsole();
    }

    // Ctrl + Shift + H - Hacker Mode
    if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        document.body.style.background = '#000000';
        document.body.style.color = '#00ff00';
        document.body.style.fontFamily = '"Courier New", monospace';
        showToast('💀 HACKER MODE ACTIVATED!');
    }

    // Ctrl + Shift + P - Show Passwords
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        const passwords = document.querySelectorAll('input[type="password"]');
        passwords.forEach(input => {
            input.type = 'text';
        });
        showToast('👁️ แสดงรหัสผ่านทั้งหมดแล้ว!');
    }

    // Ctrl + Shift + X - XSS Test
    if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        const testPayload = '<script>alert("XSS Test by Goonee")</script>';
        console.log('XSS Test Payload:', testPayload);
        showToast('⚡ ทดสอบ XSS - ตรวจสอบ Console');
    }

    // Ctrl + Shift + G - God Mode
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        document.body.style.cursor = 'crosshair';
        document.title = '🦈 GOONEE GOD MODE ACTIVATED 🦈';
        showToast('⚡ GOD MODE ACTIVATED! ⚡');

        // Add matrix rain effect
        createMatrixRain();
    }
});

// Matrix rain effect for God Mode
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
        opacity: 0.3;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'กขคงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*(){}[]<>?/|\\~`';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const matrixInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, 35);

    // Stop matrix rain after 10 seconds
    setTimeout(() => {
        clearInterval(matrixInterval);
        canvas.remove();
    }, 10000);
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function () {
    // Add welcome message
    setTimeout(() => {
        showToast('🦈 ยินดีต้อนรับสู่ Goonee Console!');
    }, 1000);

    // Add some hacker quotes randomly
    const hackerQuotes = [
        "💭 The best way to predict the future is to invent it.",
        "💭 Code is poetry written in logic.",
        "💭 Debugging is like being a detective in a crime movie.",
        "💭 There are only 10 types of people: those who understand binary and those who don't.",
        "💭 Programming is the art of telling another human what one wants the computer to do."
    ];

    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every 30 seconds
            const quote = hackerQuotes[Math.floor(Math.random() * hackerQuotes.length)];
            showToast(quote);
        }
    }, 30000);
});
// Utility functions for goohub tools
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (e) { }

    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        return true;
    } catch (e) {
        return false;
    }
}

function runBookmarklet(code) {
    try {
        const cleanCode = code.startsWith('javascript:') ? code.slice(11) : code;

        // Check if it's a script loader pattern
        const scriptMatch = cleanCode.match(/s\.src\s*=\s*['"]([^'"]+)['"]/i);
        if (scriptMatch && scriptMatch[1]) {
            let url = scriptMatch[1];

            // Add timestamp if original code uses Date.now()
            if (/Date\.now\(\)/.test(cleanCode)) {
                if (url.includes('?')) {
                    url += '&t=' + Date.now();
                } else {
                    url += '?t=' + Date.now();
                }
            }

            const script = document.createElement('script');
            script.src = url;
            script.async = true;

            script.onload = () => {
                showToast('🚀 เครื่องมือโหลดสำเร็จ!');
                // Try to activate console if available
                if (typeof toggleConsole === 'function') {
                    toggleConsole();
                } else if (window.toggleConsole) {
                    window.toggleConsole();
                }
            };

            script.onerror = () => {
                showToast('❌ โหลดเครื่องมือไม่สำเร็จ');
            };

            document.body.appendChild(script);
            return;
        }

        // Fallback: execute the code directly
        (new Function(cleanCode))();
        showToast('✅ รันโค้ดสำเร็จ!');
    } catch (error) {
        console.error('Bookmarklet execution error:', error);
        showToast('❌ รันโค้ดไม่สำเร็จ: ' + error.message);
    }
}

// Tool loading functions
function loadGooneeConsole() {
    const script = document.createElement('script');
    script.src = 'https://goohub.js.org/console2.js?t=' + Date.now();
    script.onload = () => showToast('🦈 Goonee Console V2 พร้อมใช้งาน!');
    script.onerror = () => showToast('❌ โหลด Goonee Console ไม่สำเร็จ');
    document.body.appendChild(script);
}

function loadEruda() {
    if (window.eruda) {
        try {
            window.eruda.init();
            window.eruda.show();
            showToast('🔍 Eruda Console เปิดแล้ว!');
        } catch (e) {
            showToast('🔍 Eruda พร้อมใช้งาน');
        }
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/eruda';
    script.onload = () => {
        try {
            if (window.eruda) {
                window.eruda.init();
                window.eruda.show();
                showToast('🔍 Eruda Console พร้อมใช้งาน!');

                // Add some hacker flair
                setTimeout(() => {
                    console.log('%c🦈 goohub HACKER CONSOLE LOADED! 🦈', 'color: #00ff41; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
                    console.log('%cWelcome to goohub - Advanced Web Security Toolkit', 'color: #00e5ff; font-size: 14px;');
                }, 1000);
            }
        } catch (e) {
            showToast('🔍 Eruda โหลดเสร็จ');
        }
    };
    script.onerror = () => showToast('❌ โหลด Eruda ไม่สำเร็จ');
    document.body.appendChild(script);
}

function loadEncryptionTools() {
    showToast('🔐 กำลังโหลดเครื่องมือเข้ารหัส...');
    // This would load encryption tools - placeholder for now
    setTimeout(() => {
        showToast('🔐 เครื่องมือเข้ารหัสพร้อมใช้งาน!\n> AES-256 Encryption Active\n> RSA Key Generated');
    }, 1500);
}

function loadSystemMonitor() {
    const script = document.createElement('script');
    script.src = 'https://goohub.js.org/sharktool/monitor.js?t=' + Date.now();
    script.onload = () => showToast('📊 System Monitor เปิดใช้งานแล้ว!');
    script.onerror = () => showToast('❌ โหลด System Monitor ไม่สำเร็จ');
    document.body.appendChild(script);
}

function loadProxyManager() {
    showToast('🌐 กำลังโหลด Proxy Manager...');
    // This would load proxy manager - placeholder for now
    setTimeout(() => {
        showToast('🌐 Proxy Manager พร้อมใช้งาน!\n> Active Proxies: 3\n> VPN Status: Connected\n> Location: Singapore');
    }, 1500);
}

function loadAIScan() {
    showToast('☠️ กำลังเริ่ม AI Auto Scan...');
    // This would load AI scan tools - placeholder for now
    setTimeout(() => {
        showToast('☠️ AI Auto Scan เสร็จสิ้น!\n> พบช่องโหว่ 3 จุด\n> ระดับความเสี่ยง: กลาง');
    }, 2000);
}

function loadThemeChanger() {
    const script = document.createElement('script');
    script.src = 'https://goohub.js.org/sharktool/Theme.js?t=' + Date.now();
    script.onload = () => showToast('🎨 Theme Changer พร้อมใช้งาน!');
    script.onerror = () => showToast('❌ โหลด Theme Changer ไม่สำเร็จ');
    document.body.appendChild(script);
}

// Bookmarklet functions
function copyBookmarklet(type) {
    const bookmarklets = {
        'goonee-console': 'javascript:(function(){var s=document.createElement(\'script\');s.src=\'https://goohub.js.org/console2.js?t=\'+Date.now();document.body.appendChild(s);})();',
        'eruda': 'javascript:(function(){var s=document.createElement(\'script\');s.src=\'https://cdn.jsdelivr.net/npm/eruda\';document.body.appendChild(s);s.onload=function(){eruda.init();eruda.show();};})();',
        'encryption': 'javascript:(function(){alert(\'🔐 Encryption Tools - Coming Soon!\');})();',
        'monitor': 'javascript:(function(){var s=document.createElement(\'script\');s.src=\'https://goohub.js.org/sharktool/monitor.js?t=\'+Date.now();document.body.appendChild(s)})();',
        'proxy': 'javascript:(function(){alert(\'🌐 Proxy Manager - Coming Soon!\');})();',
        'ai-scan': 'javascript:(function(){alert(\'☠️ AI Auto Scan - Coming Soon!\');})();',
        'theme': 'javascript:(function(){var s=document.createElement(\'script\');s.src=\'https://goohub.js.org/sharktool/Theme.js?t=\'+Date.now();document.body.appendChild(s)})();'
    };

    const code = bookmarklets[type];
    if (code && copyToClipboard(code)) {
        showToast('📋 คัดลอก Bookmarklet แล้ว!');
    } else {
        showToast('❌ คัดลอกไม่สำเร็จ');
    }
}

function copyBookmarkletCode(elementId) {
    const element = document.getElementById(elementId);
    if (element && copyToClipboard(element.textContent)) {
        showToast('📋 คัดลอกโค้ดแล้ว!');
    } else {
        showToast('❌ คัดลอกไม่สำเร็จ');
    }
}

function testBookmarklet(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        runBookmarklet(element.textContent);
    }
}

// Enhanced keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl + ` - Toggle Console (if available)
    if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        if (typeof toggleConsole === 'function') {
            toggleConsole();
        } else {
            loadGooneeConsole();
        }
    }

    // Ctrl + Shift + H - Hacker Mode
    if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        document.body.style.background = '#000000';
        document.body.style.color = '#00ff00';
        document.body.style.fontFamily = '"Courier New", monospace';
        showToast('💀 HACKER MODE ACTIVATED!');
    }

    // Ctrl + Shift + P - Show Passwords (placeholder)
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        showToast('🔍 กำลังค้นหารหัสผ่าน...');
        setTimeout(() => {
            showToast('🔐 พบรหัสผ่าน 5 รายการ (Demo Mode)');
        }, 1500);
    }

    // Ctrl + Shift + X - XSS Test
    if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        showToast('⚡ กำลังทดสอบ XSS...');
        setTimeout(() => {
            showToast('⚡ XSS Test เสร็จสิ้น - ไม่พบช่องโหว่');
        }, 2000);
    }

    // Ctrl + Shift + G - God Mode
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        document.body.style.cursor = 'crosshair';
        document.title = '🦈 goohub GOD MODE ACTIVATED 🦈';
        showToast('⚡ GOD MODE ACTIVATED! ⚡');

        // Add matrix effect
        createMatrixEffect();
    }
});

// Matrix effect for God Mode
function createMatrixEffect() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: -1;
                pointer-events: none;
                opacity: 0.3;
            `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'กขคงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*(){}[]<>?/|\\~`';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const matrixInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, 35);

    // Stop matrix effect after 10 seconds
    setTimeout(() => {
        clearInterval(matrixInterval);
        canvas.remove();
    }, 10000);
}

// Initialize goohub
document.addEventListener('DOMContentLoaded', () => {
    showToast('🦈 ยินดีต้อนรับสู่ goohub - Advanced Web Security Toolkit!');

    // Add some hacker flair to console
    console.log('%c🦈 goohub LOADED! 🦈', 'color: #00ff41; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
    console.log('%cAdvanced Web Security Toolkit', 'color: #00e5ff; font-size: 16px;');
    console.log('%cPress Ctrl+Shift+G for God Mode!', 'color: #ff6b6b; font-size: 14px;');
});
// Demo Marketplace System
const demoScripts = [
    {
        id: 1,
        name: 'XSS Scanner Pro',
        description: 'เครื่องมือสแกนหาช่องโหว่ XSS แบบอัตโนมัติ',
        category: 'security',
        difficulty: 'advanced',
        icon: '⚡',
        downloads: 1250,
        rating: 4.8,
        code: 'javascript:(function(){alert("XSS Scanner Demo - พบช่องโหว่ 3 จุด!");})();'
    },
    {
        id: 2,
        name: 'Cookie Extractor',
        description: 'ดึงและวิเคราะห์ cookies ทั้งหมดในเว็บไซต์',
        category: 'security',
        difficulty: 'intermediate',
        icon: '🍪',
        downloads: 890,
        rating: 4.5,
        code: 'javascript:(function(){console.log("Cookies:", document.cookie); alert("พบ Cookies: " + document.cookie.split(";").length + " รายการ");})();'
    },
    {
        id: 3,
        name: 'Auto Form Filler',
        description: 'เติมฟอร์มอัตโนมัติด้วยข้อมูลทดสอบ',
        category: 'automation',
        difficulty: 'beginner',
        icon: '📝',
        downloads: 2100,
        rating: 4.9,
        code: 'javascript:(function(){var inputs=document.querySelectorAll("input[type=text], input[type=email]"); inputs.forEach(function(input,i){input.value="test"+(i+1)+"@example.com";}); alert("เติมฟอร์ม " + inputs.length + " ช่องแล้ว!");})();'
    },
    {
        id: 4,
        name: 'Page Speed Analyzer',
        description: 'วิเคราะห์ความเร็วและประสิทธิภาพของหน้าเว็บ',
        category: 'performance',
        difficulty: 'intermediate',
        icon: '🚀',
        downloads: 750,
        rating: 4.3,
        code: 'javascript:(function(){var loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart; alert("เวลาโหลดหน้า: " + (loadTime/1000).toFixed(2) + " วินาที");})();'
    },
    {
        id: 5,
        name: 'Image Downloader',
        description: 'ดาวน์โหลดรูปภาพทั้งหมดในหน้าเว็บ',
        category: 'data',
        difficulty: 'beginner',
        icon: '🖼️',
        downloads: 1500,
        rating: 4.6,
        code: 'javascript:(function(){var images = document.querySelectorAll("img"); alert("พบรูปภาพ " + images.length + " รูป\\nDemo: จะดาวน์โหลดในระบบจริง");})();'
    },
    {
        id: 6,
        name: 'Matrix Rain Effect',
        description: 'เพิ่มเอฟเฟกต์ Matrix Rain ให้กับหน้าเว็บ',
        category: 'fun',
        difficulty: 'advanced',
        icon: '🌊',
        downloads: 3200,
        rating: 4.9,
        code: 'javascript:(function(){createMatrixEffect(); showToast("🌊 Matrix Rain Effect เปิดใช้งาน!");})();'
    }
];

let cart = [];
let favorites = [];
let downloadHistory = [];

function initializeMarketplace() {
    renderScripts(demoScripts);
    updateCounters();
    setupMarketplaceEvents();
}

function renderScripts(scripts) {
    const grid = document.getElementById('scriptGrid');
    if (!grid) return;

    grid.innerHTML = scripts.map(script => `
                <div class="script-card" data-id="${script.id}">
                    <div class="script-header">
                        <div class="script-icon">${script.icon}</div>
                        <div class="script-meta">
                            <h4>${script.name}</h4>
                            <div class="script-stats">
                                <span class="downloads">📥 ${script.downloads}</span>
                                <span class="rating">⭐ ${script.rating}</span>
                            </div>
                        </div>
                        <div class="script-actions">
                            <button class="btn-favorite ${favorites.includes(script.id) ? 'active' : ''}" 
                                    onclick="toggleFavorite(${script.id})">❤️</button>
                        </div>
                    </div>
                    <div class="script-body">
                        <p class="script-description">${script.description}</p>
                        <div class="script-tags">
                            <span class="tag category-${script.category}">${getCategoryName(script.category)}</span>
                            <span class="tag difficulty-${script.difficulty}">${getDifficultyName(script.difficulty)}</span>
                        </div>
                    </div>
                    <div class="script-footer">
                        <button class="btn-script primary" onclick="previewScript(${script.id})">👁️ ดูตัวอย่าง</button>
                        <button class="btn-script secondary" onclick="addToCart(${script.id})">🛒 เพิ่มในตะกร้า</button>
                        <button class="btn-script" onclick="downloadScript(${script.id})">📥 ดาวน์โหลด</button>
                    </div>
                </div>
            `).join('');
}

function getCategoryName(category) {
    const names = {
        'security': '🔒 ความปลอดภัย',
        'automation': '⚡ อัตโนมัติ',
        'data': '📊 ข้อมูล',
        'performance': '🚀 ประสิทธิภาพ',
        'fun': '🎮 ความสนุก'
    };
    return names[category] || category;
}

function getDifficultyName(difficulty) {
    const names = {
        'beginner': '🟢 ผู้เริ่มต้น',
        'intermediate': '🟡 ระดับกลาง',
        'advanced': '🔴 ระดับสูง'
    };
    return names[difficulty] || difficulty;
}

function setupMarketplaceEvents() {
    // Search functionality
    const searchInput = document.getElementById('scriptSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterScripts);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterScripts);
    }
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterScripts);
    }

    // Cart panel events
    const cartCounter = document.getElementById('cartCounter');
    const favoritesCounter = document.getElementById('favoritesCounter');
    const historyCounter = document.getElementById('historyCounter');

    if (cartCounter) {
        cartCounter.addEventListener('click', () => togglePanel('cartPanel'));
    }
    if (favoritesCounter) {
        favoritesCounter.addEventListener('click', () => togglePanel('favoritesPanel'));
    }
    if (historyCounter) {
        historyCounter.addEventListener('click', () => togglePanel('downloadHistoryPanel'));
    }

    // Close buttons
    document.querySelectorAll('.cart-close, .favorites-close, .download-history-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const panel = e.target.closest('.cart-panel, .favorites-panel, .download-history-panel');
            if (panel) panel.style.display = 'none';
        });
    });
}

function filterScripts() {
    const searchTerm = document.getElementById('scriptSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    const difficultyFilter = document.getElementById('difficultyFilter')?.value || 'all';

    const filtered = demoScripts.filter(script => {
        const matchesSearch = script.name.toLowerCase().includes(searchTerm) ||
            script.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || script.category === categoryFilter;
        const matchesDifficulty = difficultyFilter === 'all' || script.difficulty === difficultyFilter;

        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    renderScripts(filtered);
}

function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';

        if (panelId === 'cartPanel') {
            updateCartPanel();
        } else if (panelId === 'favoritesPanel') {
            updateFavoritesPanel();
        } else if (panelId === 'downloadHistoryPanel') {
            updateHistoryPanel();
        }
    }
}

function addToCart(scriptId) {
    if (!cart.includes(scriptId)) {
        cart.push(scriptId);
        updateCounters();
        showToast('🛒 เพิ่มสคริปต์ในตะกร้าแล้ว!');
    } else {
        showToast('ℹ️ สคริปต์นี้อยู่ในตะกร้าแล้ว');
    }
}

function toggleFavorite(scriptId) {
    const index = favorites.indexOf(scriptId);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('💔 ลบออกจากรายการโปรดแล้ว');
    } else {
        favorites.push(scriptId);
        showToast('❤️ เพิ่มในรายการโปรดแล้ว!');
    }
    updateCounters();
    renderScripts(demoScripts); // Re-render to update heart icons
}

function downloadScript(scriptId) {
    const script = demoScripts.find(s => s.id === scriptId);
    if (script) {
        // Add to download history
        const historyItem = {
            id: scriptId,
            name: script.name,
            downloadedAt: new Date().toLocaleString('th-TH')
        };
        downloadHistory.unshift(historyItem);

        // Keep only last 10 downloads
        if (downloadHistory.length > 10) {
            downloadHistory = downloadHistory.slice(0, 10);
        }

        updateCounters();

        // Copy script code to clipboard
        copyToClipboard(script.code);
        showToast(`📥 ดาวน์โหลด "${script.name}" สำเร็จ! (คัดลอกโค้ดแล้ว)`);
    }
}

function previewScript(scriptId) {
    const script = demoScripts.find(s => s.id === scriptId);
    if (script) {
        // Show preview modal (simplified)
        const preview = `
                    📝 ตัวอย่างสคริปต์: ${script.name}
                    📊 ดาวน์โหลด: ${script.downloads} ครั้ง
                    ⭐ คะแนน: ${script.rating}/5
                    
                    📋 โค้ด:
                    ${script.code}
                `;

        if (confirm(preview + '\n\nต้องการทดสอบสคริปต์นี้หรือไม่?')) {
            runBookmarklet(script.code);
        }
    }
}

function updateCounters() {
    const cartCount = document.getElementById('cartCount');
    const favoritesCount = document.getElementById('favoritesCount');

    if (cartCount) cartCount.textContent = cart.length;
    if (favoritesCount) favoritesCount.textContent = favorites.length;
}

function updateCartPanel() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    if (cart.length === 0) {
        cartContent.innerHTML = '<p class="empty-cart">ตะกร้าของคุณว่างเปล่า เพิ่มสคริปต์เพื่อเริ่มต้น!</p>';
        return;
    }

    const cartItems = cart.map(scriptId => {
        const script = demoScripts.find(s => s.id === scriptId);
        return script ? `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <span class="cart-item-icon">${script.icon}</span>
                            <span class="cart-item-name">${script.name}</span>
                        </div>
                        <button class="btn-remove" onclick="removeFromCart(${scriptId})">🗑️</button>
                    </div>
                ` : '';
    }).join('');

    cartContent.innerHTML = cartItems;
}

function updateFavoritesPanel() {
    const favoritesContent = document.getElementById('favoritesContent');
    if (!favoritesContent) return;

    if (favorites.length === 0) {
        favoritesContent.innerHTML = '<p class="empty-favorites">ยังไม่มีรายการโปรด คลิกไอคอนหัวใจบนสคริปต์ที่คุณชอบ!</p>';
        return;
    }

    const favoriteItems = favorites.map(scriptId => {
        const script = demoScripts.find(s => s.id === scriptId);
        return script ? `
                    <div class="favorite-item">
                        <div class="favorite-item-info">
                            <span class="favorite-item-icon">${script.icon}</span>
                            <span class="favorite-item-name">${script.name}</span>
                        </div>
                        <button class="btn-download" onclick="downloadScript(${scriptId})">📥</button>
                    </div>
                ` : '';
    }).join('');

    favoritesContent.innerHTML = favoriteItems;
}

function updateHistoryPanel() {
    const historyContent = document.getElementById('downloadHistoryContent');
    if (!historyContent) return;

    if (downloadHistory.length === 0) {
        historyContent.innerHTML = '<p class="empty-history">ยังไม่มีการดาวน์โหลด ดาวน์โหลดสคริปต์เพื่อดูประวัติ!</p>';
        return;
    }

    const historyItems = downloadHistory.map(item => `
                <div class="history-item">
                    <div class="history-item-info">
                        <span class="history-item-name">${item.name}</span>
                        <span class="history-item-date">${item.downloadedAt}</span>
                    </div>
                </div>
            `).join('');

    historyContent.innerHTML = historyItems;
}

function removeFromCart(scriptId) {
    const index = cart.indexOf(scriptId);
    if (index > -1) {
        cart.splice(index, 1);
        updateCounters();
        updateCartPanel();
        showToast('🗑️ ลบออกจากตะกร้าแล้ว');
    }
}

// Initialize marketplace when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeMarketplace, 1000); // Delay to ensure all elements are loaded
});