// Script Marketplace Data and Content
// This file contains all the script data, categories, pricing, and features for the marketplace

// Script Categories with Thai and English names
const SCRIPT_CATEGORIES = {
    runner: {
        id: 'runner',
        name: 'Script Runners',
        nameTh: '🚀 ตัวรันสคริปต์ (Runners)',
        description: 'Primary tools for executing custom scripts and payloads',
        descriptionTh: 'เครื่องมือหลักสำหรับการรันสคริปต์และเพย์โหลดแบบกำหนดเอง',
        icon: '🚀',
        color: '#00ff41'
    },
    ammunition: {
        id: 'ammunition',
        name: 'Ammunition',
        nameTh: '🔫 กระสุน/สคริปต์ (Ammunition)',
        description: 'Bookmarklets and small script payloads for quick operations',
        descriptionTh: 'Bookmarklets และสคริปต์ขนาดเล็กสำหรับการปฏิบัติการที่รวดเร็ว',
        icon: '🔫',
        color: '#ff4444'
    },
    security: {
        id: 'security',
        name: 'Combat Tools',
        nameTh: '🔒 อาวุธต่อสู้ (Security)',
        description: 'Advanced weapons for digital combat and analysis',
        descriptionTh: 'อาวุธขั้นสูงสำหรับการต่อสู้และวิเคราะห์ดิจิทัล',
        icon: '🔒',
        color: '#ff4444'
    },
    automation: {
        id: 'automation',
        name: 'Auto-Tactics',
        nameTh: '⚡ แท็กติกอัตโนมัติ (Automation)',
        description: 'Automate repetitive tactical maneuvers',
        descriptionTh: 'จัดทำแผนผังยุทธวิธีและการโต้ตอบแบบอัตโนมัติ',
        icon: '⚡',
        color: '#ffff00'
    },
    data: {
        id: 'data',
        name: 'Intelligence Ops',
        nameTh: '📊 ปฏิบัติการข่าวกรอง (Data)',
        description: 'Extract intelligence from enemy environments',
        descriptionTh: 'ดึงข้อมูลข่าวกรองจากสภาพแวดล้อมเป้าหมาย',
        icon: '📊',
        color: '#00ffff'
    }
};

// Difficulty Levels
const DIFFICULTY_LEVELS = {
    beginner: {
        id: 'beginner',
        name: 'Beginner',
        nameTh: '🟢 ผู้เริ่มต้น',
        description: 'Easy to use, no technical knowledge required',
        descriptionTh: 'ใช้งานง่าย ไม่ต้องมีความรู้ทางเทคนิค',
        color: '#00ff41',
        icon: '🟢'
    },
    intermediate: {
        id: 'intermediate',
        name: 'Intermediate',
        nameTh: '🟡 ระดับกลาง',
        description: 'Some technical knowledge helpful',
        descriptionTh: 'ควรมีความรู้ทางเทคนิคบ้าง',
        color: '#ffff00',
        icon: '🟡'
    },
    advanced: {
        id: 'advanced',
        name: 'Advanced',
        nameTh: '🔴 ขั้นสูง',
        description: 'Requires technical expertise',
        descriptionTh: 'ต้องมีความเชี่ยวชาญทางเทคนิค',
        color: '#ff4444',
        icon: '🔴'
    }
};

// Script Marketplace Data
const MARKETPLACE_SCRIPTS = [
    // Script Runners
    {
        id: 'gooscript-extension',
        name: 'Gooscript Extension',
        nameTh: 'กูสคริปต์ (Extension)',
        category: 'runner',
        difficulty: 'intermediate',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 5.0,
        downloads: 8500,
        description: 'Powerful browser extension for managing and running advanced user scripts safely.',
        descriptionTh: 'ส่วนขยายเบราว์เซอร์ที่ทรงพลังสำหรับจัดการและรันสคริปต์ขั้นสูงได้อย่างปลอดภัย',
        features: [
            'Auto-execute on specified domains',
            'Safe script storage',
            'Advanced API integration',
            'Stealth mode execution'
        ],
        featuresTh: [
            'รันอัตโนมัติในโดเมนที่กำหนด',
            'จัดเก็บสคริปต์อย่างปลอดภัย',
            'รวม API ขั้นสูง',
            'การรันโหมดพรางตัว'
        ],
        demoCode: `// Gooscript Loader Pattern
(function() {
    console.log('🚀 Gooscript Engine Initialized');
    // Your stealth payloads go here
})();`,
        tags: ['runner', 'extension', 'gooscript', 'stealth'],
        author: 'Goohub Team',
        version: '1.2.5',
        lastUpdated: '2024-12-20',
        fileSize: '1.2 MB',
        compatibility: ['Chrome', 'Edge', 'Kiwi'],
        compatibleWith: ['extension']
    },

    {
        id: 'console2-js',
        name: 'console2.js',
        nameTh: 'คอนโซลทู (console2.js)',
        category: 'runner',
        difficulty: 'beginner',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.9,
        downloads: 12000,
        description: 'Lightweight floating console library that works on any website via bookmarklet.',
        descriptionTh: 'ไลบรารีคอนโซลแบบลอยตัวน้ำหนักเบาที่ทำงานได้ทุกเว็บไซต์ผ่าน bookmarklet',
        features: [
            'Floating UI',
            'Quick Command Input',
            'Network Activity Log',
            'DOM element inspector'
        ],
        featuresTh: [
            'UI แบบลอยตัว',
            'อินพุตคำสั่งด่วน',
            'บันทึกกิจกรรมเครือข่าย',
            'ตัวตรวจสอบองค์ประกอบ DOM'
        ],
        demoCode: `// console2.js Local Load
javascript:(function(){var s=document.createElement('script');s.src='${window.location.origin}/bookmarklettool/console2.js?t='+Date.now();document.body.appendChild(s);})();`,
        tags: ['runner', 'console', 'javascript', 'debug'],
        author: 'Goohub Community',
        version: '2.0.1',
        lastUpdated: '2024-12-18',
        fileSize: '15 KB',
        compatibility: ['All Browsers'],
        compatibleWith: ['bookmarklet', 'console']
    },

    {
        id: 'erudark',
        name: 'Erudark (อีรูดาก)',
        nameTh: 'อีรูดาก (Erudark)',
        category: 'runner',
        difficulty: 'advanced',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.7,
        downloads: 666,
        description: 'Special edition of Eruda with unrestricted EVAL capabilities. Use with caution, it is dark!',
        descriptionTh: 'Eruda รุ่นพิเศษที่มาพร้อมความสามารถ EVAL ที่ไร้ขีดจำกัด ระวังหน่อยนะ มันดาร์คมาก! (เน้นฮา)',
        features: [
            'Unrestricted Eval Execution',
            'Dark Mode Theme (Pure Black)',
            'Experimental Lab Features',
            'Funny Error Messages'
        ],
        featuresTh: [
            'รัน Eval แบบไม่จำกัด',
            'ธีมโหมดมืด (ดำสนิท)',
            'ฟีเจอร์แล็บทดลอง',
            'ข้อความแจ้งเตือนสุดปั่น'
        ],
        demoCode: `// Erudark (Console V1) Local Load
javascript:(function(){var s=document.createElement('script');s.src='${window.location.origin}/bookmarklettool/console1.js?t='+Date.now();document.body.appendChild(s);})();`,
        tags: ['runner', 'eval', 'dark', 'funny', 'hacker'],
        author: 'Dark Goonee',
        version: '6.6.6',
        lastUpdated: '2025-01-13',
        fileSize: '128 KB',
        compatibility: ['Chrome', 'Firefox', 'Mobile'],
        compatibleWith: ['bookmarklet', 'console']
    },

    // Abridge some of the old security tools to make space
    // Security Tools
    {
        id: 'burp-shark-pro',
        name: 'BurpShark Pro',
        nameTh: 'เบิร์ปชาร์ค โปร',
        category: 'security',
        difficulty: 'advanced',
        price: 'Premium',
        priceTh: 'พรีเมียม',
        rating: 4.8,
        downloads: 15420,
        description: 'Advanced web application security scanner with automated vulnerability detection',
        descriptionTh: 'เครื่องมือสแกนความปลอดภัยเว็บแอปพลิเคชันขั้นสูงพร้อมการตรวจจับช่องโหว่อัตโนมัติ',
        features: [
            'SQL Injection Detection',
            'XSS Vulnerability Scanner',
            'CSRF Token Analysis',
            'Authentication Bypass Testing',
            'Automated Report Generation'
        ],
        featuresTh: [
            'ตรวจจับ SQL Injection',
            'สแกนช่องโหว่ XSS',
            'วิเคราะห์ CSRF Token',
            'ทดสอบการข้าม Authentication',
            'สร้างรายงานอัตโนมัติ'
        ],
        demoCode: `// BurpShark Pro - Advanced Security Scanner
(function() {
    const scanner = {
        init() {
            this.createUI();
            this.startScan();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'burpshark-panel';
            panel.innerHTML = \`
                <div class="scanner-header">
                    <h3>🦈 BurpShark Pro Scanner</h3>
                    <div class="scan-progress">
                        <div class="progress-bar"></div>
                    </div>
                </div>
                <div class="scan-results">
                    <div class="vulnerability-count">
                        <span class="high-risk">0 High</span>
                        <span class="medium-risk">0 Medium</span>
                        <span class="low-risk">0 Low</span>
                    </div>
                </div>
            \`;
            document.body.appendChild(panel);
        },
        
        startScan() {
            console.log('🦈 Starting BurpShark Pro scan...');
            this.scanForSQLInjection();
            this.scanForXSS();
            this.scanForCSRF();
        },
        
        scanForSQLInjection() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input[type="text"], input[type="email"]');
                inputs.forEach(input => {
                    // Test SQL injection patterns
                    const testPayloads = ["'", "1' OR '1'='1", "'; DROP TABLE users; --"];
                    console.log(\`Testing SQL injection on: \${input.name || input.id}\`);
                });
            });
        }
    };
    
    scanner.init();
})();`,
        tags: ['security', 'scanner', 'vulnerability', 'sql-injection', 'xss'],
        author: 'SharkSec Team',
        authorTh: 'ทีมชาร์คเซค',
        version: '2.1.0',
        lastUpdated: '2024-12-15',
        fileSize: '45.2 KB',
        compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        compatibleWith: ['console', 'extension', 'bookmarklet'],
        documentation: 'https://docs.sharksec.com/burpshark-pro',
        support: 'https://support.sharksec.com'
    },

    {
        id: 'shark-scan-lite',
        name: 'SharkScan Lite',
        nameTh: 'ชาร์คสแกน ไลท์',
        category: 'security',
        difficulty: 'beginner',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.5,
        downloads: 28750,
        description: 'Quick and easy security scanner for basic vulnerability detection',
        descriptionTh: 'เครื่องมือสแกนความปลอดภัยที่รวดเร็วและง่ายสำหรับการตรวจจับช่องโหว่พื้นฐาน',
        features: [
            'Basic XSS Detection',
            'Form Security Check',
            'HTTPS Verification',
            'Cookie Security Analysis',
            'Simple Report Export'
        ],
        featuresTh: [
            'ตรวจจับ XSS พื้นฐาน',
            'ตรวจสอบความปลอดภัยฟอร์ม',
            'ยืนยัน HTTPS',
            'วิเคราะห์ความปลอดภัย Cookie',
            'ส่งออกรายงานง่าย'
        ],
        demoCode: `// SharkScan Lite - Basic Security Scanner
(function() {
    const scanner = {
        scan() {
            console.log('🦈 SharkScan Lite - Starting basic security scan...');
            
            // Check HTTPS
            if (location.protocol !== 'https:') {
                console.warn('⚠️ Site not using HTTPS - Security Risk!');
            }
            
            // Check for forms without CSRF protection
            const forms = document.querySelectorAll('form');
            forms.forEach((form, index) => {
                const csrfToken = form.querySelector('input[name*="csrf"], input[name*="token"]');
                if (!csrfToken) {
                    console.warn(\`⚠️ Form \${index + 1} missing CSRF protection\`);
                }
            });
            
            // Check cookies
            const cookies = document.cookie.split(';');
            cookies.forEach(cookie => {
                if (!cookie.includes('Secure') || !cookie.includes('HttpOnly')) {
                    console.warn('⚠️ Insecure cookie detected:', cookie.trim());
                }
            });
            
            console.log('✅ Basic security scan completed');
        }
    };
    
    scanner.scan();
})();`,
        tags: ['security', 'basic', 'https', 'cookies', 'forms'],
        author: 'SharkSec Community',
        authorTh: 'ชุมชนชาร์คเซค',
        version: '1.5.2',
        lastUpdated: '2024-12-10',
        fileSize: '12.8 KB',
        compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        compatibleWith: ['console', 'bookmarklet'],
        documentation: 'https://docs.sharksec.com/sharkscan-lite',
        support: 'https://community.sharksec.com'
    },

    // Fun & Tactical Ammunition (Bookmarklets)
    {
        id: 'design-mode',
        name: 'Design Mode Pro',
        nameTh: 'โหมดแก้ไขหน้าเว็บ (Design Mode)',
        category: 'ammunition',
        difficulty: 'beginner',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.8,
        downloads: 5400,
        description: 'Instantly make any website editable. Click and type anywhere!',
        descriptionTh: 'เปลี่ยนทุกเว็บไซต์ให้แก้ไขได้ทันที คลิกแล้วพิมพ์ตรงไหนก็ได้!',
        features: ['Inline Text Editing', 'Rich Text Support', 'Layout Manipulation'],
        featuresTh: ['แก้ไขข้อความในหน้า', 'รองรับ Rich Text', 'ปรับแต่งเลย์เอาต์'],
        demoCode: `javascript:document.designMode=document.designMode==='on'?'off':'on';void(0);`,
        tags: ['hack', 'edit', 'design', 'fun'],
        author: 'Goohub Labs',
        version: '1.0.0',
        lastUpdated: '2025-02-16',
        fileSize: '1 KB',
        compatibility: ['All Browsers'],
        compatibleWith: ['bookmarklet']
    },

    {
        id: 'pass-reveal',
        name: 'Password Phantom',
        nameTh: 'เผยรหัสผ่าน (Password Reveal)',
        category: 'ammunition',
        difficulty: 'beginner',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.9,
        downloads: 7200,
        description: 'Unmask password fields to see what you typed.',
        descriptionTh: 'เปลี่ยนช่องรหัสผ่าน (จุดไข่ปลา) ให้กลายเป็นตัวอักษรเพื่อตรวจสอบความถูกต้อง',
        features: ['Instant Unmasking', 'Non-destructive', 'Global Effect'],
        featuresTh: ['เผยรหัสทันที', 'ไม่ทำลายข้อมูล', 'มีผลทั้งหน้า'],
        demoCode: `javascript:(function(){var p=document.querySelectorAll('input[type="password"]');for(var i=0;i<p.length;i++)p[i].type='text';})();`,
        tags: ['security', 'utility', 'password'],
        author: 'Goohub Labs',
        version: '1.0.1',
        lastUpdated: '2025-02-16',
        fileSize: '1 KB',
        compatibility: ['All Browsers'],
        compatibleWith: ['bookmarklet']
    },

    {
        id: 'element-zapper',
        name: 'Element Zapper',
        nameTh: 'ตัวลบองค์ประกอบ (Zapper)',
        category: 'ammunition',
        difficulty: 'intermediate',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.7,
        downloads: 3100,
        description: 'Click on any element to remove it from the page. Great for clearing ads or annoying popups.',
        descriptionTh: 'คลิกที่ส่วนไหนก็ได้ในหน้าเว็บเพื่อลบทิ้ง เหมาะสำหรับลบโฆษณาหรือป๊อปอัพที่น่ารำคาญ',
        features: ['Click-to-Remove', 'Crosshair Cursor', 'Permanent Removal (Session)'],
        featuresTh: ['คลิกเพื่อลบ', 'เป้าเล็งกากบาท', 'ลบถาวรในเซสชัน'],
        demoCode: `javascript:(function(){document.body.style.cursor='crosshair';document.addEventListener('click',function(e){e.preventDefault();e.target.remove();}, {once:true});})();`,
        tags: ['utility', 'cleaner', 'adblock'],
        author: 'SharkTool',
        version: '2.0.4',
        lastUpdated: '2025-02-16',
        fileSize: '2 KB',
        compatibility: ['All Browsers'],
        compatibleWith: ['bookmarklet']
    },

    {
        id: 'dark-force',
        name: 'Dark Force Enforcer',
        nameTh: 'บังคับโหมดมืด (Dark Enforcer)',
        category: 'ammunition',
        difficulty: 'beginner',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.6,
        downloads: 8900,
        description: 'Force dark mode on any light-themed website using intelligent CSS inversion.',
        descriptionTh: 'บังคับให้ทุกเว็บเข้าสู่โหมดมืดด้วยเทคนิค CSS Inversion อัจฉริยะ',
        features: ['Smart Inversion', 'Image Protection', 'One-Click Activation'],
        featuresTh: ['กลับสีอัจฉริยะ', 'ถนอมสายตา', 'เปิดใช้งานในคลิกเดียว'],
        demoCode: `javascript:(function(){var s=document.createElement('style');s.innerHTML='html,img,video{filter:invert(1)hue-rotate(180deg)}';document.head.appendChild(s);})();`,
        tags: ['theme', 'darkmode', 'eye-care'],
        author: 'Goohub Labs',
        version: '1.1.0',
        lastUpdated: '2025-02-16',
        fileSize: '1.5 KB',
        compatibility: ['All Browsers'],
        compatibleWith: ['bookmarklet']
    },

    {
        id: 'image-flipper',
        name: 'Image Rebel',
        nameTh: 'กบฏรูปภาพ (Image Flipper)',
        category: 'ammunition',
        difficulty: 'beginner',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.3,
        downloads: 1200,
        description: 'Flip every image on the page upside down. Pure chaos!',
        descriptionTh: 'กลับหัวรูปภาพทุกรูปในหน้าเว็บ... เพื่อความป่วนล้วนๆ!',
        features: ['Mass Rotation', 'Non-destructive', 'Pure Fun'],
        featuresTh: ['หมุนรูปทั้งหมด', 'ไม่ทำลายข้อมูล', 'เน้นฮา'],
        demoCode: `javascript:(function(){var i=document.querySelectorAll('img');for(var j=0;j<i.length;j++)i[j].style.transform+='rotate(180deg)';})();`,
        tags: ['fun', 'prank', 'visual'],
        author: 'Dark Goonee',
        version: '1.0.0',
        lastUpdated: '2025-02-16',
        fileSize: '1 KB',
        compatibility: ['All Browsers'],
        compatibleWith: ['bookmarklet']
    },

    // UI Automation Tools
    {
        id: 'form-filler-pro',
        name: 'Form Filler Pro',
        nameTh: 'ฟอร์มฟิลเลอร์ โปร',
        category: 'automation',
        difficulty: 'intermediate',
        price: 'Premium',
        priceTh: 'พรีเมียม',
        rating: 4.7,
        downloads: 22100,
        description: 'Intelligent form filling with custom profiles and data validation',
        descriptionTh: 'การกรอกฟอร์มอัจฉริยะพร้อมโปรไฟล์ที่กำหนดเองและการตรวจสอบข้อมูล',
        features: [
            'Multiple User Profiles',
            'Smart Field Detection',
            'Data Validation',
            'Custom Fill Patterns',
            'Bulk Form Processing'
        ],
        featuresTh: [
            'โปรไฟล์ผู้ใช้หลายรูปแบบ',
            'ตรวจจับฟิลด์อัจฉริยะ',
            'ตรวจสอบข้อมูล',
            'รูปแบบการกรอกที่กำหนดเอง',
            'ประมวลผลฟอร์มจำนวนมาก'
        ],
        demoCode: `// Form Filler Pro - Intelligent Form Automation
(function() {
    const formFiller = {
        profiles: {
            developer: {
                name: 'John Developer',
                email: 'john.dev@example.com',
                phone: '+1-555-0123',
                company: 'Tech Corp',
                title: 'Senior Developer'
            },
            tester: {
                name: 'Jane Tester',
                email: 'jane.test@example.com',
                phone: '+1-555-0456',
                company: 'QA Solutions',
                title: 'QA Engineer'
            }
        },
        
        init() {
            this.createUI();
            this.detectForms();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'form-filler-panel';
            panel.innerHTML = \`
                <div class="filler-header">
                    <h3>📝 Form Filler Pro</h3>
                    <select id="profile-select">
                        <option value="developer">Developer Profile</option>
                        <option value="tester">Tester Profile</option>
                    </select>
                    <button onclick="formFiller.fillAllForms()">Fill All Forms</button>
                </div>
            \`;
            document.body.appendChild(panel);
        },
        
        fillAllForms() {
            const selectedProfile = document.getElementById('profile-select').value;
            const profile = this.profiles[selectedProfile];
            
            document.querySelectorAll('form').forEach(form => {
                this.fillForm(form, profile);
            });
        },
        
        fillForm(form, profile) {
            // Smart field detection and filling
            const nameField = form.querySelector('input[name*="name"], input[id*="name"]');
            const emailField = form.querySelector('input[type="email"], input[name*="email"]');
            const phoneField = form.querySelector('input[type="tel"], input[name*="phone"]');
            
            if (nameField) nameField.value = profile.name;
            if (emailField) emailField.value = profile.email;
            if (phoneField) phoneField.value = profile.phone;
            
            console.log('✅ Form filled with', selectedProfile, 'profile');
        }
    };
    
    formFiller.init();
})();`,
        tags: ['automation', 'forms', 'profiles', 'validation', 'bulk'],
        author: 'AutoTools Inc',
        authorTh: 'ออโต้ทูลส์ อิงค์',
        version: '3.2.1',
        lastUpdated: '2024-12-12',
        fileSize: '38.7 KB',
        compatibility: ['Chrome', 'Firefox', 'Safari'],
        compatibleWith: ['console', 'extension'],
        documentation: 'https://docs.autotools.com/form-filler-pro',
        support: 'https://support.autotools.com'
    },

    {
        id: 'page-inspector',
        name: 'Page Inspector',
        nameTh: 'เพจอินสเปคเตอร์',
        category: 'automation',
        difficulty: 'beginner',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.3,
        downloads: 35600,
        description: 'Inspect and analyze web page elements with visual highlighting',
        descriptionTh: 'ตรวจสอบและวิเคราะห์องค์ประกอบของหน้าเว็บพร้อมการเน้นแบบภาพ',
        features: [
            'Element Highlighting',
            'CSS Property Inspector',
            'DOM Tree Navigation',
            'Responsive Design Testing',
            'Accessibility Checker'
        ],
        featuresTh: [
            'เน้นองค์ประกอบ',
            'ตรวจสอบคุณสมบัติ CSS',
            'นำทางต้นไม้ DOM',
            'ทดสอบการออกแบบตอบสนอง',
            'ตรวจสอบการเข้าถึง'
        ],
        demoCode: `// Page Inspector - Visual Element Analysis
(function() {
    const inspector = {
        active: false,
        
        init() {
            this.createUI();
            this.setupEventListeners();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'inspector-panel';
            panel.innerHTML = \`
                <div class="inspector-header">
                    <h3>🔍 Page Inspector</h3>
                    <button onclick="inspector.toggle()">Toggle Inspector</button>
                </div>
                <div class="inspector-info">
                    <div id="element-info">Hover over elements to inspect</div>
                </div>
            \`;
            document.body.appendChild(panel);
        },
        
        toggle() {
            this.active = !this.active;
            if (this.active) {
                document.body.style.cursor = 'crosshair';
                console.log('🔍 Inspector activated - hover over elements');
            } else {
                document.body.style.cursor = 'default';
                this.clearHighlight();
            }
        },
        
        setupEventListeners() {
            document.addEventListener('mouseover', (e) => {
                if (!this.active) return;
                
                this.highlightElement(e.target);
                this.showElementInfo(e.target);
            });
            
            document.addEventListener('mouseout', (e) => {
                if (!this.active) return;
                this.clearHighlight();
            });
        },
        
        highlightElement(element) {
            this.clearHighlight();
            element.style.outline = '2px solid #00ff41';
            element.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
        },
        
        clearHighlight() {
            document.querySelectorAll('*').forEach(el => {
                el.style.outline = '';
                el.style.backgroundColor = '';
            });
        },
        
        showElementInfo(element) {
            const info = document.getElementById('element-info');
            const rect = element.getBoundingClientRect();
            info.innerHTML = \`
                <strong>\${element.tagName.toLowerCase()}</strong><br>
                Class: \${element.className || 'none'}<br>
                ID: \${element.id || 'none'}<br>
                Size: \${Math.round(rect.width)}x\${Math.round(rect.height)}px
            \`;
        }
    };
    
    inspector.init();
})();`,
        tags: ['inspector', 'elements', 'css', 'dom', 'accessibility'],
        author: 'DevTools Community',
        authorTh: 'ชุมชนเดฟทูลส์',
        version: '2.0.5',
        lastUpdated: '2024-12-08',
        fileSize: '25.4 KB',
        compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        documentation: 'https://docs.devtools.com/page-inspector',
        support: 'https://community.devtools.com'
    },

    // Data Extraction Tools
    {
        id: 'data-harvester',
        name: 'Data Harvester Pro',
        nameTh: 'ดาต้าฮาร์เวสเตอร์ โปร',
        category: 'data',
        difficulty: 'advanced',
        price: 'Premium',
        priceTh: 'พรีเมียม',
        rating: 4.9,
        downloads: 18900,
        description: 'Advanced data extraction with AI-powered content recognition',
        descriptionTh: 'การดึงข้อมูลขั้นสูงพร้อมการรู้จำเนื้อหาด้วย AI',
        features: [
            'AI Content Recognition',
            'Bulk Data Export',
            'Custom Extraction Rules',
            'Real-time Processing',
            'Multiple Export Formats'
        ],
        featuresTh: [
            'การรู้จำเนื้อหาด้วย AI',
            'ส่งออกข้อมูลจำนวนมาก',
            'กฎการดึงข้อมูลที่กำหนดเอง',
            'ประมวลผลแบบเรียลไทม์',
            'รูปแบบการส่งออกหลายแบบ'
        ],
        demoCode: `// Data Harvester Pro - AI-Powered Data Extraction
(function() {
    const harvester = {
        extractedData: [],
        
        init() {
            this.createUI();
            this.startExtraction();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'harvester-panel';
            panel.innerHTML = \`
                <div class="harvester-header">
                    <h3>📊 Data Harvester Pro</h3>
                    <div class="extraction-stats">
                        <span id="extracted-count">0</span> items extracted
                    </div>
                </div>
                <div class="extraction-controls">
                    <button onclick="harvester.extractText()">Extract Text</button>
                    <button onclick="harvester.extractImages()">Extract Images</button>
                    <button onclick="harvester.extractLinks()">Extract Links</button>
                    <button onclick="harvester.exportData()">Export Data</button>
                </div>
                <div class="extraction-preview" id="preview-area"></div>
            \`;
            document.body.appendChild(panel);
        },
        
        extractText() {
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
            const textData = [];
            
            textElements.forEach(el => {
                const text = el.textContent.trim();
                if (text.length > 10) {
                    textData.push({
                        type: 'text',
                        content: text,
                        tag: el.tagName.toLowerCase(),
                        length: text.length
                    });
                }
            });
            
            this.extractedData.push(...textData);
            this.updateStats();
            console.log(\`📊 Extracted \${textData.length} text elements\`);
        },
        
        extractImages() {
            const images = document.querySelectorAll('img');
            const imageData = [];
            
            images.forEach(img => {
                imageData.push({
                    type: 'image',
                    src: img.src,
                    alt: img.alt || 'No alt text',
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            });
            
            this.extractedData.push(...imageData);
            this.updateStats();
            console.log(\`📊 Extracted \${imageData.length} images\`);
        },
        
        extractLinks() {
            const links = document.querySelectorAll('a[href]');
            const linkData = [];
            
            links.forEach(link => {
                linkData.push({
                    type: 'link',
                    url: link.href,
                    text: link.textContent.trim(),
                    target: link.target || '_self'
                });
            });
            
            this.extractedData.push(...linkData);
            this.updateStats();
            console.log(\`📊 Extracted \${linkData.length} links\`);
        },
        
        updateStats() {
            document.getElementById('extracted-count').textContent = this.extractedData.length;
        },
        
        exportData() {
            const dataStr = JSON.stringify(this.extractedData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'extracted-data.json';
            a.click();
            
            console.log('📊 Data exported successfully');
        }
    };
    
    harvester.init();
})();`,
        tags: ['data', 'extraction', 'ai', 'export', 'bulk'],
        author: 'DataMine Solutions',
        authorTh: 'ดาต้าไมน์ โซลูชั่นส์',
        version: '4.1.0',
        lastUpdated: '2024-12-14',
        fileSize: '67.3 KB',
        compatibility: ['Chrome', 'Firefox', 'Edge'],
        documentation: 'https://docs.datamine.com/harvester-pro',
        support: 'https://support.datamine.com'
    },

    // Performance Tools
    {
        id: 'performance-analyzer',
        name: 'Performance Analyzer',
        nameTh: 'เพอร์ฟอร์แมนซ์อนาไลเซอร์',
        category: 'performance',
        difficulty: 'intermediate',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.6,
        downloads: 31200,
        description: 'Comprehensive website performance analysis and optimization suggestions',
        descriptionTh: 'การวิเคราะห์ประสิทธิภาพเว็บไซต์ที่ครอบคลุมและข้อเสนอแนะการปรับปรุง',
        features: [
            'Load Time Analysis',
            'Resource Optimization',
            'Core Web Vitals',
            'Performance Score',
            'Optimization Suggestions'
        ],
        featuresTh: [
            'วิเคราะห์เวลาโหลด',
            'ปรับปรุงทรัพยากร',
            'Core Web Vitals',
            'คะแนนประสิทธิภาพ',
            'ข้อเสนอแนะการปรับปรุง'
        ],
        demoCode: `// Performance Analyzer - Website Performance Analysis
(function() {
    const analyzer = {
        metrics: {},
        
        init() {
            this.createUI();
            this.analyzePerformance();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'performance-panel';
            panel.innerHTML = \`
                <div class="performance-header">
                    <h3>🚀 Performance Analyzer</h3>
                    <div class="performance-score" id="perf-score">Analyzing...</div>
                </div>
                <div class="metrics-display" id="metrics-display"></div>
                <div class="suggestions" id="suggestions"></div>
            \`;
            document.body.appendChild(panel);
        },
        
        analyzePerformance() {
            // Analyze load time
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.metrics.loadTime = loadTime;
            
            // Count resources
            const resources = performance.getEntriesByType('resource');
            this.metrics.resourceCount = resources.length;
            
            // Analyze DOM
            this.metrics.domElements = document.querySelectorAll('*').length;
            
            // Check images
            const images = document.querySelectorAll('img');
            this.metrics.imageCount = images.length;
            
            // Calculate performance score
            this.calculateScore();
            this.displayResults();
            this.generateSuggestions();
        },
        
        calculateScore() {
            let score = 100;
            
            // Deduct points for slow load time
            if (this.metrics.loadTime > 3000) score -= 20;
            else if (this.metrics.loadTime > 2000) score -= 10;
            
            // Deduct points for too many resources
            if (this.metrics.resourceCount > 100) score -= 15;
            else if (this.metrics.resourceCount > 50) score -= 8;
            
            // Deduct points for too many DOM elements
            if (this.metrics.domElements > 1500) score -= 15;
            else if (this.metrics.domElements > 1000) score -= 8;
            
            this.metrics.score = Math.max(0, score);
        },
        
        displayResults() {
            const scoreEl = document.getElementById('perf-score');
            const metricsEl = document.getElementById('metrics-display');
            
            scoreEl.textContent = \`Score: \${this.metrics.score}/100\`;
            scoreEl.className = this.metrics.score > 80 ? 'good' : this.metrics.score > 60 ? 'fair' : 'poor';
            
            metricsEl.innerHTML = \`
                <div class="metric">Load Time: \${this.metrics.loadTime}ms</div>
                <div class="metric">Resources: \${this.metrics.resourceCount}</div>
                <div class="metric">DOM Elements: \${this.metrics.domElements}</div>
                <div class="metric">Images: \${this.metrics.imageCount}</div>
            \`;
        },
        
        generateSuggestions() {
            const suggestions = [];
            
            if (this.metrics.loadTime > 2000) {
                suggestions.push('⚡ Optimize load time - consider compressing resources');
            }
            
            if (this.metrics.resourceCount > 50) {
                suggestions.push('📦 Reduce number of HTTP requests');
            }
            
            if (this.metrics.domElements > 1000) {
                suggestions.push('🏗️ Simplify DOM structure');
            }
            
            if (this.metrics.imageCount > 20) {
                suggestions.push('🖼️ Optimize images - use WebP format and lazy loading');
            }
            
            document.getElementById('suggestions').innerHTML = 
                '<h4>Optimization Suggestions:</h4>' + 
                suggestions.map(s => \`<div class="suggestion">\${s}</div>\`).join('');
        }
    };
    
    analyzer.init();
})();`,
        tags: ['performance', 'optimization', 'metrics', 'analysis', 'speed'],
        author: 'SpeedBoost Labs',
        authorTh: 'สปีดบูสต์ แลบส์',
        version: '2.3.4',
        lastUpdated: '2024-12-11',
        fileSize: '42.1 KB',
        compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        documentation: 'https://docs.speedboost.com/performance-analyzer',
        support: 'https://support.speedboost.com'
    },

    // Fun & Games
    {
        id: 'website-screenshot',
        name: 'Website Screenshot Tool',
        nameTh: 'เครื่องมือจับภาพหน้าจอ',
        category: 'fun',
        difficulty: 'beginner',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.4,
        downloads: 45300,
        description: 'Capture full-page screenshots with annotation and sharing features',
        descriptionTh: 'จับภาพหน้าจอแบบเต็มหน้าพร้อมคุณสมบัติการใส่คำอธิบายและแชร์',
        features: [
            'Full Page Capture',
            'Annotation Tools',
            'Multiple Formats',
            'Instant Sharing',
            'Batch Processing'
        ],
        featuresTh: [
            'จับภาพเต็มหน้า',
            'เครื่องมือใส่คำอธิบาย',
            'รูปแบบหลายแบบ',
            'แชร์ทันที',
            'ประมวลผลแบบกลุ่ม'
        ],
        demoCode: `// Website Screenshot Tool - Full Page Capture
(function() {
    const screenshotTool = {
        init() {
            this.createUI();
            this.setupCapture();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'screenshot-panel';
            panel.innerHTML = \`
                <div class="screenshot-header">
                    <h3>📸 Screenshot Tool</h3>
                    <div class="capture-options">
                        <button onclick="screenshotTool.captureVisible()">Visible Area</button>
                        <button onclick="screenshotTool.captureFullPage()">Full Page</button>
                        <button onclick="screenshotTool.captureElement()">Select Element</button>
                    </div>
                </div>
                <div class="screenshot-preview" id="screenshot-preview"></div>
            \`;
            document.body.appendChild(panel);
        },
        
        captureVisible() {
            console.log('📸 Capturing visible area...');
            this.simulateCapture('visible');
        },
        
        captureFullPage() {
            console.log('📸 Capturing full page...');
            this.simulateCapture('fullpage');
        },
        
        captureElement() {
            console.log('📸 Click on an element to capture...');
            document.body.style.cursor = 'crosshair';
            
            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.simulateElementCapture(e.target);
                document.body.style.cursor = 'default';
                document.removeEventListener('click', clickHandler, true);
            };
            
            document.addEventListener('click', clickHandler, true);
        },
        
        simulateCapture(type) {
            const preview = document.getElementById('screenshot-preview');
            preview.innerHTML = \`
                <div class="capture-result">
                    <div class="capture-info">
                        <strong>Capture Type:</strong> \${type}<br>
                        <strong>Dimensions:</strong> \${window.innerWidth}x\${window.innerHeight}px<br>
                        <strong>Timestamp:</strong> \${new Date().toLocaleString()}
                    </div>
                    <div class="capture-actions">
                        <button onclick="screenshotTool.downloadImage()">💾 Download</button>
                        <button onclick="screenshotTool.copyToClipboard()">📋 Copy</button>
                        <button onclick="screenshotTool.shareImage()">🔗 Share</button>
                    </div>
                </div>
            \`;
        },
        
        simulateElementCapture(element) {
            const rect = element.getBoundingClientRect();
            const preview = document.getElementById('screenshot-preview');
            
            preview.innerHTML = \`
                <div class="capture-result">
                    <div class="capture-info">
                        <strong>Element:</strong> \${element.tagName.toLowerCase()}<br>
                        <strong>Dimensions:</strong> \${Math.round(rect.width)}x\${Math.round(rect.height)}px<br>
                        <strong>Class:</strong> \${element.className || 'none'}
                    </div>
                    <div class="capture-actions">
                        <button onclick="screenshotTool.downloadImage()">💾 Download</button>
                        <button onclick="screenshotTool.copyToClipboard()">📋 Copy</button>
                    </div>
                </div>
            \`;
        },
        
        downloadImage() {
            console.log('💾 Downloading screenshot...');
            alert('Screenshot would be downloaded as PNG file');
        },
        
        copyToClipboard() {
            console.log('📋 Copying to clipboard...');
            alert('Screenshot copied to clipboard');
        },
        
        shareImage() {
            console.log('🔗 Sharing screenshot...');
            alert('Share dialog would open');
        }
    };
    
    screenshotTool.init();
})();`,
        tags: ['screenshot', 'capture', 'annotation', 'sharing', 'visual'],
        author: 'ScreenCap Studios',
        authorTh: 'สกรีนแคป สตูดิโอส์',
        version: '1.8.2',
        lastUpdated: '2024-12-09',
        fileSize: '28.9 KB',
        compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        documentation: 'https://docs.screencap.com/screenshot-tool',
        support: 'https://support.screencap.com'
    },

    {
        id: 'text-to-speech',
        name: 'Text-to-Speech Reader',
        nameTh: 'เครื่องอ่านข้อความเป็นเสียง',
        category: 'fun',
        difficulty: 'beginner',
        price: 'Free',
        priceTh: 'ฟรี',
        rating: 4.2,
        downloads: 38700,
        description: 'Convert any text on the page to natural-sounding speech',
        descriptionTh: 'แปลงข้อความใดๆ บนหน้าเว็บเป็นเสียงพูดที่ฟังธรรมชาติ',
        features: [
            'Natural Voice Synthesis',
            'Multiple Languages',
            'Speed Control',
            'Text Highlighting',
            'Voice Selection'
        ],
        featuresTh: [
            'การสังเคราะห์เสียงธรรมชาติ',
            'หลายภาษา',
            'ควบคุมความเร็ว',
            'เน้นข้อความ',
            'เลือกเสียง'
        ],
        demoCode: `// Text-to-Speech Reader - Natural Voice Synthesis
(function() {
    const ttsReader = {
        synthesis: window.speechSynthesis,
        currentUtterance: null,
        isReading: false,
        
        init() {
            this.createUI();
            this.loadVoices();
        },
        
        createUI() {
            const panel = document.createElement('div');
            panel.id = 'tts-panel';
            panel.innerHTML = \`
                <div class="tts-header">
                    <h3>🔊 Text-to-Speech Reader</h3>
                    <div class="tts-controls">
                        <button onclick="ttsReader.readSelection()">Read Selection</button>
                        <button onclick="ttsReader.readPage()">Read Page</button>
                        <button onclick="ttsReader.pauseResume()" id="pause-btn">Pause</button>
                        <button onclick="ttsReader.stop()">Stop</button>
                    </div>
                </div>
                <div class="tts-settings">
                    <label>Voice: 
                        <select id="voice-select"></select>
                    </label>
                    <label>Speed: 
                        <input type="range" id="speed-slider" min="0.5" max="2" step="0.1" value="1">
                        <span id="speed-value">1.0x</span>
                    </label>
                    <label>Pitch: 
                        <input type="range" id="pitch-slider" min="0.5" max="2" step="0.1" value="1">
                        <span id="pitch-value">1.0</span>
                    </label>
                </div>
                <div class="tts-status" id="tts-status">Ready to read</div>
            \`;
            document.body.appendChild(panel);
            
            this.setupEventListeners();
        },
        
        loadVoices() {
            const voiceSelect = document.getElementById('voice-select');
            const voices = this.synthesis.getVoices();
            
            voices.forEach((voice, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = \`\${voice.name} (\${voice.lang})\`;
                voiceSelect.appendChild(option);
            });
        },
        
        setupEventListeners() {
            document.getElementById('speed-slider').addEventListener('input', (e) => {
                document.getElementById('speed-value').textContent = e.target.value + 'x';
            });
            
            document.getElementById('pitch-slider').addEventListener('input', (e) => {
                document.getElementById('pitch-value').textContent = e.target.value;
            });
        },
        
        readSelection() {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                this.speak(selectedText);
            } else {
                alert('Please select some text to read');
            }
        },
        
        readPage() {
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span');
            let pageText = '';
            
            textElements.forEach(el => {
                const text = el.textContent.trim();
                if (text.length > 0) {
                    pageText += text + '. ';
                }
            });
            
            if (pageText) {
                this.speak(pageText);
            }
        },
        
        speak(text) {
            if (this.isReading) {
                this.stop();
            }
            
            this.currentUtterance = new SpeechSynthesisUtterance(text);
            
            // Apply settings
            const voiceIndex = document.getElementById('voice-select').value;
            const voices = this.synthesis.getVoices();
            if (voices[voiceIndex]) {
                this.currentUtterance.voice = voices[voiceIndex];
            }
            
            this.currentUtterance.rate = parseFloat(document.getElementById('speed-slider').value);
            this.currentUtterance.pitch = parseFloat(document.getElementById('pitch-slider').value);
            
            // Event listeners
            this.currentUtterance.onstart = () => {
                this.isReading = true;
                document.getElementById('tts-status').textContent = 'Reading...';
                document.getElementById('pause-btn').textContent = 'Pause';
            };
            
            this.currentUtterance.onend = () => {
                this.isReading = false;
                document.getElementById('tts-status').textContent = 'Finished reading';
                document.getElementById('pause-btn').textContent = 'Pause';
            };
            
            this.synthesis.speak(this.currentUtterance);
        },
        
        pauseResume() {
            if (this.synthesis.paused) {
                this.synthesis.resume();
                document.getElementById('pause-btn').textContent = 'Pause';
                document.getElementById('tts-status').textContent = 'Reading...';
            } else if (this.isReading) {
                this.synthesis.pause();
                document.getElementById('pause-btn').textContent = 'Resume';
                document.getElementById('tts-status').textContent = 'Paused';
            }
        },
        
        stop() {
            this.synthesis.cancel();
            this.isReading = false;
            document.getElementById('tts-status').textContent = 'Stopped';
            document.getElementById('pause-btn').textContent = 'Pause';
        }
    };
    
    // Load voices when available
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => ttsReader.loadVoices();
    }
    
    ttsReader.init();
})();`,
        tags: ['tts', 'speech', 'accessibility', 'voice', 'reading'],
        author: 'VoiceTech Solutions',
        authorTh: 'วอยซ์เทค โซลูชั่นส์',
        version: '2.1.3',
        lastUpdated: '2024-12-07',
        fileSize: '34.6 KB',
        compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        documentation: 'https://docs.voicetech.com/tts-reader',
        support: 'https://support.voicetech.com'
    }
];

// Pricing tiers
const PRICING_TIERS = {
    free: {
        id: 'free',
        name: 'Free',
        nameTh: 'ฟรี',
        price: 0,
        color: '#00ff41',
        features: ['Basic functionality', 'Community support', 'Regular updates']
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        nameTh: 'พรีเมียม',
        price: 9.99,
        color: '#ffff00',
        features: ['Advanced features', 'Priority support', 'Early access', 'Custom profiles']
    },
    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        nameTh: 'องค์กร',
        price: 29.99,
        color: '#ff00ff',
        features: ['All features', '24/7 support', 'Custom development', 'Team management']
    }
};

// Export all data for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SCRIPT_CATEGORIES,
        DIFFICULTY_LEVELS,
        MARKETPLACE_SCRIPTS,
        PRICING_TIERS
    };
} else {
    // Make available globally for browser use
    window.MarketplaceData = {
        SCRIPT_CATEGORIES,
        DIFFICULTY_LEVELS,
        MARKETPLACE_SCRIPTS,
        PRICING_TIERS
    };
}