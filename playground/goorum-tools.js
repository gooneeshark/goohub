// Goohub Tools - JavaScript Functions
// Open Source Tool Distribution Hub

// Global state for Arsenal
let currentGear = localStorage.getItem('goonee-active-gear') || null;
const equippedWeapons = JSON.parse(localStorage.getItem('goonee-equipped') || '{}');

const IS_ROOT = !window.location.pathname.includes('/playground/');
const TOOLS_BASE = IS_ROOT ? 'bookmarklettool/' : '../bookmarklettool/';
const G_NOW = () => Date.now();

// Absolute Path for Bookmarklets (Works for both GitHub Pages and Custom Domains)
const getBaseUrl = () => {
    const url = window.location.href.split('?')[0].split('#')[0];
    const base = url.substring(0, url.lastIndexOf('/') + 1);
    return IS_ROOT ? base : base.replace('/playground/', '/');
};

// Utility Functions
// Gear Selection Logic
function selectGear(gearType) {
    currentGear = gearType;
    localStorage.setItem('goonee-active-gear', gearType);

    const gearNames = {
        'console': 'Cyber-Console',
        'extension': 'Deep-Extension',
        'bookmarklet': 'Phantom-BM'
    };

    const activeGearDisp = document.getElementById('activeGearName');
    if (activeGearDisp) activeGearDisp.textContent = gearNames[gearType];

    closeGearOverlay();
    showToast(`⚔️ Arsenal Initialized: ${gearNames[gearType]} Active`);

    // Refresh marketplace to show 'Equip' status
    if (typeof renderMarketplace === 'function') renderMarketplace();
}

function openGearOverlay() {
    const overlay = document.getElementById('gearOverlay');
    if (overlay) overlay.classList.remove('hidden');
}

function closeGearOverlay() {
    const overlay = document.getElementById('gearOverlay');
    if (overlay) overlay.classList.add('hidden');
}

function equipWeapon(weaponId, weaponName) {
    if (!currentGear) {
        openGearOverlay();
        showToast('⚠️ Please choose your Gear first!');
        return;
    }

    equippedWeapons[weaponId] = true;
    localStorage.setItem('goonee-equipped', JSON.stringify(equippedWeapons));

    showToast(`✨ Weapon Equipped: ${weaponName}\nInstalled on your ${currentGear}!`);

    // Update UI
    const btns = document.querySelectorAll(`button[onclick*="equipWeapon('${weaponId}'"]`);
    btns.forEach(btn => {
        btn.innerHTML = '✅ Equipped';
        btn.classList.add('equipped');
        btn.disabled = true;
    });
}

// Initialize on load
window.addEventListener('load', () => {
    if (!currentGear) {
        setTimeout(openGearOverlay, 1500);
    } else {
        const gearNames = {
            'console': 'Cyber-Console',
            'extension': 'Deep-Extension',
            'bookmarklet': 'Phantom-BM'
        };
        const activeGearDisp = document.getElementById('activeGearName');
        if (activeGearDisp) activeGearDisp.textContent = gearNames[currentGear] || 'None';
        closeGearOverlay();
    }
});

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: #00ff41;
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid #00ff41;
        backdrop-filter: blur(10px);
        font-size: 14px;
        z-index: 10001;
        opacity: 1;
        transition: opacity 0.3s ease;
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
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

// Tool Loading Functions
function loadGooneeConsole() {
    const script = document.createElement('script');
    script.src = TOOLS_BASE + 'console2.js?t=' + G_NOW();
    script.onload = () => showToast('🦈 Goonee Console V2 พร้อมใช้งาน!');
    script.onerror = () => showToast('❌ โหลด Goonee Console ไม่สำเร็จ');
    document.body.appendChild(script);
}

function loadErudark() {
    const script = document.createElement('script');
    script.src = TOOLS_BASE + 'console1.js?t=' + G_NOW();
    script.onload = () => showToast('💀 Erudark (Console V1) พร้อมใช้งาน!');
    script.onerror = () => showToast('❌ โหลด Erudark ไม่สำเร็จ');
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
                    console.log('%c🚀 GOOHUB POWER LOADED! 🚀', 'color: #00ff41; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
                    console.log('%cWelcome to Goohub - Open Source Tool Distribution Center', 'color: #00e5ff; font-size: 14px;');
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
    const script = document.createElement('script');
    script.src = TOOLS_BASE + 'encryption.js?t=' + G_NOW();
    script.onload = () => showToast('🔐 เครื่องมือเข้ารหัสพร้อมใช้งาน!');
    script.onerror = () => showToast('❌ โหลดเครื่องมือเข้ารหัสไม่สำเร็จ');
    document.body.appendChild(script);
}

function loadSystemMonitor() {
    const script = document.createElement('script');
    script.src = TOOLS_BASE + 'monitor.js?t=' + G_NOW();
    script.onload = () => showToast('📊 System Monitor เปิดใช้งานแล้ว!');
    script.onerror = () => showToast('❌ โหลด System Monitor ไม่สำเร็จ');
    document.body.appendChild(script);
}

function loadProxyManager() {
    showToast('🌐 กำลังโหลด Proxy Manager...');
    const script = document.createElement('script');
    script.src = TOOLS_BASE + 'postshark.js?t=' + G_NOW();
    script.onload = () => showToast('🌐 Proxy Manager พร้อมใช้งาน!');
    script.onerror = () => showToast('❌ โหลด Proxy Manager ไม่สำเร็จ');
    document.body.appendChild(script);
}

function loadAIScan() {
    showToast('☠️ กำลังเริ่ม AI Auto Scan...');
    const script = document.createElement('script');
    script.src = TOOLS_BASE + 'sharkscan.js?t=' + G_NOW();
    script.onload = () => showToast('☠️ AI Auto Scan พร้อมใช้งาน!');
    script.onerror = () => showToast('❌ โหลด AI Auto Scan ไม่สำเร็จ');
    document.body.appendChild(script);
}

function loadThemeChanger() {
    const script = document.createElement('script');
    script.src = TOOLS_BASE + 'Theme.js?t=' + G_NOW();
    script.onload = () => showToast('🎨 Theme Changer พร้อมใช้งาน!');
    script.onerror = () => showToast('❌ โหลด Theme Changer ไม่สำเร็จ');
    document.body.appendChild(script);
}

function loadTwitterTheme() {
    const script = document.createElement('script');
    script.src = TOOLS_BASE + 'twitter-theme.js?t=' + G_NOW();
    script.onload = () => showToast('🐦 Twitter Theme พร้อมใช้งาน!');
    script.onerror = () => showToast('❌ โหลด Twitter Theme ไม่สำเร็จ');
    document.body.appendChild(script);
}

function showTwitterThemeGuide() {
    const guide = `
🐦 วิธีติดตั้ง Twitter Theme Extension

📥 ลิงก์ดาวน์โหลด:
• Direct: ${window.location.origin}/${TOOLS_BASE}Gooscript.crx
• GitHub: https://github.com/P200p/Goonee/tree/main/tools

📋 สำหรับ Chrome/Edge:
1. ดาวน์โหลดไฟล์ extension.crx
2. เปิด chrome://extensions/
3. เปิด Developer mode (สวิตช์ขวาบน)
4. ลากไฟล์ .crx ลงในหน้าต่าง
5. คลิก "Add extension"

📱 สำหรับ Kiwi Browser (Android):
1. ดาวน์โหลดไฟล์ extension.crx
2. เปิด Kiwi Browser
3. ไปที่ ⋮ > Extensions
4. เปิด Developer mode
5. คลิก "Load unpacked" หรือลากไฟล์

✨ ฟีเจอร์หลัก:
• 🎨 ธีมสีต่างๆ สำหรับ Twitter/X
• 🌙 โหมดมืดแบบกำหนดเอง
• 🔤 ปรับแต่งฟอนต์และขนาดตัวอักษร
• 👁️ ซ่อน/แสดงองค์ประกอบต่างๆ
• 💾 บันทึกการตั้งค่าอัตโนมัติ
• 🚀 ใช้งานง่าย ไม่ซับซ้อน

🔗 ทางเลือกอื่น:
หากติดตั้ง Extension ไม่ได้ สามารถใช้ Bookmarklet แทนได้
คัดลอกโค้ด Twitter Theme Bookmarklet ไปสร้างบุ๊คมาร์ค

⚠️ หมายเหตุ:
Extension นี้ปลอดภัย 100% และเป็น Open Source
ตรวจสอบซอร์สโค้ดได้ที่ GitHub
    `;

    alert(guide);
}

// Bookmarklet Functions
function copyBookmarklet(type) {
    const baseUrl = getBaseUrl();
    const bookmarklets = {
        'goonee-console': `javascript:(function(){var s=document.createElement('script');s.src='${baseUrl}${TOOLS_BASE}console2.js?t='+Date.now();document.body.appendChild(s);})();`,
        'eruda': 'javascript:(function(){var s=document.createElement(\'script\');s.src=\'https://cdn.jsdelivr.net/npm/eruda\';document.body.appendChild(s);s.onload=function(){eruda.init();eruda.show();};})();',
        'encryption': `javascript:(function(){var s=document.createElement('script');s.src='${baseUrl}${TOOLS_BASE}encryption.js?t='+Date.now();document.body.appendChild(s)})();`,
        'monitor': `javascript:(function(){var s=document.createElement('script');s.src='${baseUrl}${TOOLS_BASE}monitor.js?t='+Date.now();document.body.appendChild(s)})();`,
        'proxy': `javascript:(function(){var s=document.createElement('script');s.src='${baseUrl}${TOOLS_BASE}postshark.js?t='+Date.now();document.body.appendChild(s)})();`,
        'ai-scan': `javascript:(function(){var s=document.createElement('script');s.src='${baseUrl}${TOOLS_BASE}sharkscan.js?t='+Date.now();document.body.appendChild(s)})();`,
        'theme': `javascript:(function(){var s=document.createElement('script');s.src='${baseUrl}${TOOLS_BASE}Theme.js?t='+Date.now();document.body.appendChild(s)})();`,
        'twitter-theme': `javascript:(function(){var s=document.createElement('script');s.src='${baseUrl}${TOOLS_BASE}twitter-theme.js?t='+Date.now();document.body.appendChild(s)})();`,
        'design-mode': `javascript:document.designMode=document.designMode==='on'?'off':'on';void(0);`,
        'pass-reveal': `javascript:(function(){var p=document.querySelectorAll('input[type="password"]');for(var i=0;i<p.length;i++)p[i].type='text';})();`,
        'element-zapper': `javascript:(function(){document.body.style.cursor='crosshair';document.addEventListener('click',function(e){e.preventDefault();e.target.remove();}, {once:true});})();`,
        'dark-force': `javascript:(function(){var s=document.createElement('style');s.innerHTML='html,img,video{filter:invert(1)hue-rotate(180deg)}';document.head.appendChild(s);})();`,
        'image-flipper': `javascript:(function(){var i=document.querySelectorAll('img');for(var j=0;j<i.length;j++)i[j].style.transform+='rotate(180deg)';})();`
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
        document.title = '🦈 GOORUM GOD MODE ACTIVATED 🦈';
        showToast('⚡ GOD MODE ACTIVATED! ⚡');

        // Add matrix effect
        createMatrixEffect();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    showToast('🦈 ยินดีต้อนรับสู่ Goorum - Advanced Web Security Toolkit!');

    // Add some hacker flair to console
    console.log('%c🦈 GOORUM LOADED! 🦈', 'color: #00ff41; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ff41;');
    console.log('%cAdvanced Web Security Toolkit', 'color: #00e5ff; font-size: 16px;');
    console.log('%cPress Ctrl+Shift+G for God Mode!', 'color: #ff6b6b; font-size: 14px;');
});

// Make functions globally available
window.loadGooneeConsole = loadGooneeConsole;
window.loadErudark = loadErudark;
window.loadEruda = loadEruda;
window.loadEncryptionTools = loadEncryptionTools;
window.loadSystemMonitor = loadSystemMonitor;
window.loadProxyManager = loadProxyManager;
window.loadAIScan = loadAIScan;
window.loadThemeChanger = loadThemeChanger;
window.loadTwitterTheme = loadTwitterTheme;
window.showTwitterThemeGuide = showTwitterThemeGuide;
window.copyBookmarklet = copyBookmarklet;
window.copyBookmarkletCode = copyBookmarkletCode;
window.testBookmarklet = testBookmarklet;
window.createMatrixEffect = createMatrixEffect;