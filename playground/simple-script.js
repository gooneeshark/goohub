// Simple Script - เฉพาะฟีเจอร์หลักที่จำเป็น
console.log('🦈 Loading Shark Console...');

// Matrix background animation
function initMatrixBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-2';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 35);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Theme system
function initThemeSystem() {
    const themes = {
        matrix: { primary: '#00ff41', bg: '#000000' },
        cyberpunk: { primary: '#ff00ff', bg: '#0a0a0a' },
        hacker: { primary: '#00ffff', bg: '#001122' },
        neon: { primary: '#ffff00', bg: '#000011' },
        ocean: { primary: '#0099ff', bg: '#001133' },
        fire: { primary: '#ff4500', bg: '#110000' }
    };

    let currentTheme = 'matrix';

    function setTheme(themeName) {
        if (!themes[themeName]) return;
        
        currentTheme = themeName;
        const theme = themes[themeName];
        
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--bg-color', theme.bg);
        document.documentElement.setAttribute('data-theme', themeName);
        
        // Update theme name display
        const themeNameEl = document.getElementById('currentThemeName');
        if (themeNameEl) {
            themeNameEl.textContent = themeName.charAt(0).toUpperCase() + themeName.slice(1);
        }
        
        localStorage.setItem('selectedTheme', themeName);
        console.log(`🎨 Theme changed to: ${themeName}`);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && themes[savedTheme]) {
        setTheme(savedTheme);
    }

    // Theme selector events
    document.addEventListener('click', (e) => {
        // Toggle theme dropdown
        if (e.target.closest('#themeToggle')) {
            const dropdown = document.getElementById('themeDropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        }

        // Close theme dropdown
        if (e.target.closest('#themeClose')) {
            const dropdown = document.getElementById('themeDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }

        // Select theme
        if (e.target.closest('.theme-option')) {
            const option = e.target.closest('.theme-option');
            const themeName = option.getAttribute('data-theme');
            
            // Update active state
            document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            setTheme(themeName);
            
            // Close dropdown
            const dropdown = document.getElementById('themeDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-selector')) {
            const dropdown = document.getElementById('themeDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
    });
}

// Simple notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color, #00ff41);
        color: #000;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: bold;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Shark Console...');
    
    initMatrixBackground();
    initThemeSystem();
    
    showNotification('🦈 Shark Console loaded successfully!', 'success');
    
    console.log('✅ Shark Console ready!');
});

// Make functions globally available
window.showNotification = showNotification;
window.SharkConsole = {
    version: '2.0.0',
    initialized: true
}

// Hide unwanted elements that were leaking into the simplified page.
function hideUnwantedElements() {
    // Hide elements that should not be visible
    const elementsToHide = [
        '.performance-settings',
        '.share-buttons', 
        '.cart-panel',
        '.favorites-panel',
        '.download-history-panel',
        '.package-builder-container',
        '.modal-overlay',
        '.share-modal-overlay',
        '.share-notification'
    ];
    
    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el) {
                el.style.display = 'none';
            }
        });
    });
    
    // Hide theme dropdown initially
    const themeDropdown = document.getElementById('themeDropdown');
    if (themeDropdown) {
        themeDropdown.style.display = 'none';
    }
    
    console.log('🧹 Cleaned up unwanted visible elements');
}

// Enhanced theme dropdown functionality
function enhanceThemeDropdown() {
    const themeToggle = document.getElementById('themeToggle');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeClose = document.getElementById('themeClose');
    
    if (!themeToggle || !themeDropdown) return;
    
    // Toggle dropdown
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = themeDropdown.style.display === 'block';
        themeDropdown.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            themeDropdown.classList.add('active');
        } else {
            themeDropdown.classList.remove('active');
        }
    });
    
    // Close dropdown
    if (themeClose) {
        themeClose.addEventListener('click', () => {
            themeDropdown.style.display = 'none';
            themeDropdown.classList.remove('active');
        });
    }
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-selector')) {
            themeDropdown.style.display = 'none';
            themeDropdown.classList.remove('active');
        }
    });
    
    console.log('🎨 Enhanced theme dropdown functionality');
}

// Remove or hide problematic elements
function cleanupProblematicElements() {
    // Remove performance settings if they exist
    const perfSettings = document.getElementById('performanceSettings');
    if (perfSettings) {
        perfSettings.remove();
        console.log('🗑️ Removed performance settings');
    }
    
    // Remove download history panel
    const downloadHistory = document.getElementById('downloadHistoryPanel');
    if (downloadHistory) {
        downloadHistory.remove();
        console.log('🗑️ Removed download history panel');
    }
    
    // Remove share buttons container if it's causing issues
    const shareContainer = document.querySelector('.share-container');
    if (shareContainer) {
        shareContainer.remove();
        console.log('🗑️ Removed share container');
    }
    
    // Remove marketplace counters that might be showing as text
    const counters = document.querySelectorAll('.cart-counter, .favorites-counter, .history-counter');
    counters.forEach(counter => {
        if (counter && counter.textContent.trim()) {
            counter.remove();
        }
    });
    
    console.log('🧹 Cleaned up problematic elements');
}

// Update the initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Clean Shark Console...');
    
    // Clean up first
    cleanupProblematicElements();
    hideUnwantedElements();
    
    // Then initialize features
    initMatrixBackground();
    initThemeSystem();
    enhanceThemeDropdown();
    
    showNotification('🦈 Clean Shark Console loaded!', 'success');
    
    console.log('✅ Clean Shark Console ready!');
});

// Add cleanup on window load as well
window.addEventListener('load', () => {
    setTimeout(() => {
        hideUnwantedElements();
        cleanupProblematicElements();
    }, 1000);
});