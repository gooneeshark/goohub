/**
 * Goohub Configuration File
 * ใช้เพื่อเก็บ domain และ asset URL ให้ติดตรึง
 * เมื่อต้องเปลี่ยน domain ในอนาคต แค่เปลี่ยนที่นี่ไฟล์เดียว!
 */

const GOOHUB_CONFIG = {
    // 🌍 Primary Domain (เปลี่ยนตรงนี้เมื่อ migrate)
    primaryDomain: 'https://goohub.js.org',

    // 🔄 Fallback Domains (ลองตามลำดับหากโดเมนหลักล้มเหลว)
    fallbackDomains: [
        'https://goohubl.vercel.app'
    ],

    // 🖼️ Image Assets
    images: {
        meta: '/gooimage/metarum.png',
        app: '/gooimage/app.png',
        youtube: '/gooimage/yg.gif',
        twitter: '/gooimage/tw.gif',
        facebook: '/gooimage/fb.gif'
    },

    // 📁 Script Endpoints
    endpoints: {
        console2: '/console2.js',
        eruda: '/sharktool/Eruda.js',
        monitor: '/sharktool/monitor.js',
        theme: '/sharktool/Theme.js'
    }
};

/**
 * ✅ Get Full Asset URL with cache-busting
 * @param {string} path - Asset path
 * @returns {string} Full URL with timestamp
 * 
 * Usage: getAssetURL('/console2.js')
 */
function getAssetURL(path) {
    return GOOHUB_CONFIG.primaryDomain + path + '?t=' + Date.now();
}

/**
 * ✅ Get Image URL
 * @param {string} imageName - Image key from config
 * @returns {string} Full image URL
 * 
 * Usage: getImageURL('twitter') // returns https://goohub.js.org/gooimage/tw.gif
 */
function getImageURL(imageName) {
    const path = GOOHUB_CONFIG.images[imageName];
    if (!path) {
        console.warn(`⚠️ Image not found in config: ${imageName}`);
        return null;
    }
    return GOOHUB_CONFIG.primaryDomain + path;
}

/**
 * ✅ Auto-detect development vs production
 */
(function detectEnvironment() {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        GOOHUB_CONFIG.primaryDomain = 'http://localhost:8000';
        console.log('🔧 Development mode: Using localhost');
    }
})();


/**
 * ✅ Fetch with Fallback
 * หากโดเมนหลักล้มเหลว ลองไป fallback
 */
async function fetchAssetWithFallback(endpoint) {
    const domains = [GOOHUB_CONFIG.primaryDomain, ...GOOHUB_CONFIG.fallbackDomains];

    for (let domain of domains) {
        try {
            const url = domain + endpoint + '?t=' + Date.now();
            const response = await fetch(url, { method: 'HEAD' });

            if (response.ok) {
                console.log(`✅ Asset loaded from: ${domain}`);
                return domain + endpoint;
            }
        } catch (error) {
            console.warn(`⚠️ Failed to load from ${domain}, trying next...`);
        }
    }

    throw new Error(`❌ Could not load asset: ${endpoint} from any domain`);
}
