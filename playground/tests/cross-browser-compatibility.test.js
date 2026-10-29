// Cross-Browser Compatibility Tests
// Tests to ensure consistent functionality across different browsers and versions

class CrossBrowserCompatibilityTests {
    constructor() {
        this.testResults = [];
        this.browserInfo = this.detectBrowser();
        this.supportedFeatures = {};
        this.polyfillsNeeded = [];
    }

    async runAllTests() {
        console.log('🌐 Starting Cross-Browser Compatibility Tests...');
        console.log(`Browser: ${this.browserInfo.name} ${this.browserInfo.version}`);
        
        try {
            await this.testBrowserFeatureSupport();
            await this.testCSSFeatures();
            await this.testJavaScriptAPIs();
            await this.testWebAPIs();
            await this.testResponsiveFeatures();
            await this.testAccessibilityFeatures();
            await this.testPerformanceAPIs();
            
            this.generateCompatibilityReport();
            return this.testResults;
        } catch (error) {
            console.error('Cross-browser compatibility tests failed:', error);
            throw error;
        }
    }

    detectBrowser() {
        const userAgent = navigator.userAgent;
        let browserName = 'Unknown';
        let browserVersion = 'Unknown';

        // Chrome
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
            browserName = 'Chrome';
            const match = userAgent.match(/Chrome\/(\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        }
        // Firefox
        else if (userAgent.includes('Firefox')) {
            browserName = 'Firefox';
            const match = userAgent.match(/Firefox\/(\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        }
        // Safari
        else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            browserName = 'Safari';
            const match = userAgent.match(/Version\/(\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        }
        // Edge
        else if (userAgent.includes('Edg')) {
            browserName = 'Edge';
            const match = userAgent.match(/Edg\/(\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        }
        // Internet Explorer
        else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
            browserName = 'Internet Explorer';
            const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        }

        return {
            name: browserName,
            version: browserVersion,
            userAgent: userAgent,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
        };
    }

    async testBrowserFeatureSupport() {
        console.log('Testing browser feature support...');
        
        const features = [
            // ES6+ Features
            { name: 'Arrow Functions', test: () => { try { eval('() => {}'); return true; } catch(e) { return false; } } },
            { name: 'Template Literals', test: () => { try { eval('`template`'); return true; } catch(e) { return false; } } },
            { name: 'Destructuring', test: () => { try { eval('const {a} = {a:1}'); return true; } catch(e) { return false; } } },
            { name: 'Async/Await', test: () => { try { eval('async function test() { await Promise.resolve(); }'); return true; } catch(e) { return false; } } },
            { name: 'Classes', test: () => { try { eval('class Test {}'); return true; } catch(e) { return false; } } },
            { name: 'Modules', test: () => 'noModule' in HTMLScriptElement.prototype },
            
            // DOM APIs
            { name: 'querySelector', test: () => typeof document.querySelector === 'function' },
            { name: 'addEventListener', test: () => typeof document.addEventListener === 'function' },
            { name: 'classList', test: () => 'classList' in document.createElement('div') },
            { name: 'dataset', test: () => 'dataset' in document.createElement('div') },
            { name: 'CustomEvent', test: () => typeof CustomEvent === 'function' },
            
            // Canvas and Graphics
            { name: 'Canvas 2D', test: () => {
                const canvas = document.createElement('canvas');
                return !!(canvas.getContext && canvas.getContext('2d'));
            }},
            { name: 'WebGL', test: () => {
                const canvas = document.createElement('canvas');
                return !!(canvas.getContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
            }},
            
            // Storage APIs
            { name: 'localStorage', test: () => typeof Storage !== 'undefined' && 'localStorage' in window },
            { name: 'sessionStorage', test: () => typeof Storage !== 'undefined' && 'sessionStorage' in window },
            { name: 'IndexedDB', test: () => 'indexedDB' in window },
            
            // Network APIs
            { name: 'Fetch API', test: () => typeof fetch === 'function' },
            { name: 'XMLHttpRequest', test: () => typeof XMLHttpRequest === 'function' },
            { name: 'WebSocket', test: () => typeof WebSocket === 'function' },
            
            // Media APIs
            { name: 'getUserMedia', test: () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) },
            { name: 'Web Audio API', test: () => typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined' },
            
            // Performance APIs
            { name: 'Performance API', test: () => typeof performance !== 'undefined' },
            { name: 'Performance Observer', test: () => typeof PerformanceObserver !== 'undefined' },
            { name: 'Intersection Observer', test: () => typeof IntersectionObserver !== 'undefined' },
            { name: 'Mutation Observer', test: () => typeof MutationObserver !== 'undefined' },
            
            // Service Worker
            { name: 'Service Worker', test: () => 'serviceWorker' in navigator },
            { name: 'Push API', test: () => 'PushManager' in window },
            { name: 'Notification API', test: () => 'Notification' in window }
        ];

        for (const feature of features) {
            const supported = feature.test();
            this.supportedFeatures[feature.name] = supported;
            
            this.testResults.push({
                test: `Feature Support - ${feature.name}`,
                passed: supported,
                browser: this.browserInfo.name,
                version: this.browserInfo.version,
                critical: this.isCriticalFeature(feature.name)
            });

            if (!supported && this.isCriticalFeature(feature.name)) {
                this.polyfillsNeeded.push(feature.name);
            }
        }
    }

    async testCSSFeatures() {
        console.log('Testing CSS feature support...');
        
        const cssFeatures = [
            // Layout
            { name: 'CSS Grid', property: 'display', value: 'grid' },
            { name: 'Flexbox', property: 'display', value: 'flex' },
            { name: 'CSS Variables', property: '--test-var', value: 'test' },
            
            // Visual Effects
            { name: 'CSS Transforms', property: 'transform', value: 'translateX(0)' },
            { name: 'CSS Transitions', property: 'transition', value: 'all 0.3s ease' },
            { name: 'CSS Animations', property: 'animation', value: 'test 1s ease' },
            { name: 'CSS Filters', property: 'filter', value: 'blur(1px)' },
            { name: 'Backdrop Filter', property: 'backdrop-filter', value: 'blur(1px)' },
            { name: 'CSS Gradients', property: 'background', value: 'linear-gradient(to right, red, blue)' },
            { name: 'Box Shadow', property: 'box-shadow', value: '0 0 10px rgba(0,0,0,0.5)' },
            { name: 'Text Shadow', property: 'text-shadow', value: '1px 1px 1px rgba(0,0,0,0.5)' },
            
            // Modern Features
            { name: 'CSS Clip Path', property: 'clip-path', value: 'circle(50%)' },
            { name: 'CSS Mask', property: 'mask', value: 'url(#mask)' },
            { name: 'CSS Scroll Snap', property: 'scroll-snap-type', value: 'x mandatory' },
            { name: 'CSS Sticky Position', property: 'position', value: 'sticky' },
            
            // Typography
            { name: 'CSS Font Feature Settings', property: 'font-feature-settings', value: '"liga" 1' },
            { name: 'CSS Font Display', property: 'font-display', value: 'swap' },
            
            // Responsive
            { name: 'CSS Media Queries', test: () => window.matchMedia && window.matchMedia('(min-width: 768px)').matches !== undefined },
            { name: 'CSS Container Queries', property: 'container-type', value: 'inline-size' }
        ];

        const testElement = document.createElement('div');
        document.body.appendChild(testElement);

        for (const feature of cssFeatures) {
            let supported = false;
            
            if (feature.test) {
                supported = feature.test();
            } else {
                try {
                    testElement.style[feature.property] = feature.value;
                    supported = testElement.style[feature.property] === feature.value ||
                               testElement.style[feature.property] !== '';
                } catch (e) {
                    supported = false;
                }
            }
            
            this.testResults.push({
                test: `CSS Feature - ${feature.name}`,
                passed: supported,
                browser: this.browserInfo.name,
                version: this.browserInfo.version,
                critical: this.isCriticalCSSFeature(feature.name)
            });

            if (!supported && this.isCriticalCSSFeature(feature.name)) {
                this.polyfillsNeeded.push(`CSS ${feature.name}`);
            }
        }

        document.body.removeChild(testElement);
    }

    async testJavaScriptAPIs() {
        console.log('Testing JavaScript API compatibility...');
        
        const apiTests = [
            // Array methods
            { name: 'Array.from', test: () => typeof Array.from === 'function' },
            { name: 'Array.includes', test: () => typeof Array.prototype.includes === 'function' },
            { name: 'Array.find', test: () => typeof Array.prototype.find === 'function' },
            { name: 'Array.findIndex', test: () => typeof Array.prototype.findIndex === 'function' },
            
            // Object methods
            { name: 'Object.assign', test: () => typeof Object.assign === 'function' },
            { name: 'Object.keys', test: () => typeof Object.keys === 'function' },
            { name: 'Object.values', test: () => typeof Object.values === 'function' },
            { name: 'Object.entries', test: () => typeof Object.entries === 'function' },
            
            // String methods
            { name: 'String.includes', test: () => typeof String.prototype.includes === 'function' },
            { name: 'String.startsWith', test: () => typeof String.prototype.startsWith === 'function' },
            { name: 'String.endsWith', test: () => typeof String.prototype.endsWith === 'function' },
            { name: 'String.repeat', test: () => typeof String.prototype.repeat === 'function' },
            
            // Promise API
            { name: 'Promise', test: () => typeof Promise === 'function' },
            { name: 'Promise.all', test: () => typeof Promise.all === 'function' },
            { name: 'Promise.race', test: () => typeof Promise.race === 'function' },
            { name: 'Promise.resolve', test: () => typeof Promise.resolve === 'function' },
            
            // Map and Set
            { name: 'Map', test: () => typeof Map === 'function' },
            { name: 'Set', test: () => typeof Set === 'function' },
            { name: 'WeakMap', test: () => typeof WeakMap === 'function' },
            { name: 'WeakSet', test: () => typeof WeakSet === 'function' },
            
            // Symbol
            { name: 'Symbol', test: () => typeof Symbol === 'function' },
            { name: 'Symbol.iterator', test: () => typeof Symbol !== 'undefined' && typeof Symbol.iterator === 'symbol' },
            
            // Proxy and Reflect
            { name: 'Proxy', test: () => typeof Proxy === 'function' },
            { name: 'Reflect', test: () => typeof Reflect === 'object' },
            
            // Typed Arrays
            { name: 'ArrayBuffer', test: () => typeof ArrayBuffer === 'function' },
            { name: 'Uint8Array', test: () => typeof Uint8Array === 'function' },
            { name: 'Float32Array', test: () => typeof Float32Array === 'function' },
            
            // Internationalization
            { name: 'Intl', test: () => typeof Intl === 'object' },
            { name: 'Intl.DateTimeFormat', test: () => typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function' },
            { name: 'Intl.NumberFormat', test: () => typeof Intl !== 'undefined' && typeof Intl.NumberFormat === 'function' }
        ];

        for (const api of apiTests) {
            const supported = api.test();
            
            this.testResults.push({
                test: `JavaScript API - ${api.name}`,
                passed: supported,
                browser: this.browserInfo.name,
                version: this.browserInfo.version,
                critical: this.isCriticalJSAPI(api.name)
            });

            if (!supported && this.isCriticalJSAPI(api.name)) {
                this.polyfillsNeeded.push(`JS ${api.name}`);
            }
        }
    }

    async testWebAPIs() {
        console.log('Testing Web API compatibility...');
        
        const webAPITests = [
            // Touch and Pointer Events
            { name: 'Touch Events', test: () => 'ontouchstart' in window },
            { name: 'Pointer Events', test: () => 'onpointerdown' in window },
            { name: 'Gesture Events', test: () => 'ongesturestart' in window },
            
            // Device APIs
            { name: 'Device Orientation', test: () => 'DeviceOrientationEvent' in window },
            { name: 'Device Motion', test: () => 'DeviceMotionEvent' in window },
            { name: 'Vibration API', test: () => 'vibrate' in navigator },
            { name: 'Battery API', test: () => 'getBattery' in navigator },
            
            // Clipboard API
            { name: 'Clipboard API', test: () => 'clipboard' in navigator },
            { name: 'Clipboard Read', test: () => navigator.clipboard && typeof navigator.clipboard.readText === 'function' },
            { name: 'Clipboard Write', test: () => navigator.clipboard && typeof navigator.clipboard.writeText === 'function' },
            
            // Fullscreen API
            { name: 'Fullscreen API', test: () => 
                'requestFullscreen' in document.documentElement ||
                'webkitRequestFullscreen' in document.documentElement ||
                'mozRequestFullScreen' in document.documentElement ||
                'msRequestFullscreen' in document.documentElement
            },
            
            // Page Visibility API
            { name: 'Page Visibility', test: () => 'visibilityState' in document },
            
            // Resize Observer
            { name: 'Resize Observer', test: () => typeof ResizeObserver !== 'undefined' },
            
            // Web Animations API
            { name: 'Web Animations', test: () => 'animate' in document.createElement('div') },
            
            // Gamepad API
            { name: 'Gamepad API', test: () => 'getGamepads' in navigator },
            
            // Geolocation API
            { name: 'Geolocation', test: () => 'geolocation' in navigator },
            
            // File API
            { name: 'File API', test: () => typeof File !== 'undefined' },
            { name: 'FileReader', test: () => typeof FileReader !== 'undefined' },
            { name: 'Blob', test: () => typeof Blob !== 'undefined' },
            
            // Drag and Drop
            { name: 'Drag and Drop', test: () => 'draggable' in document.createElement('div') },
            
            // History API
            { name: 'History API', test: () => 'pushState' in history },
            
            // Web Workers
            { name: 'Web Workers', test: () => typeof Worker !== 'undefined' },
            { name: 'Shared Workers', test: () => typeof SharedWorker !== 'undefined' },
            
            // WebRTC
            { name: 'WebRTC', test: () => 'RTCPeerConnection' in window || 'webkitRTCPeerConnection' in window },
            
            // Payment Request API
            { name: 'Payment Request', test: () => 'PaymentRequest' in window },
            
            // Web Share API
            { name: 'Web Share', test: () => 'share' in navigator }
        ];

        for (const api of webAPITests) {
            const supported = api.test();
            
            this.testResults.push({
                test: `Web API - ${api.name}`,
                passed: supported,
                browser: this.browserInfo.name,
                version: this.browserInfo.version,
                critical: this.isCriticalWebAPI(api.name)
            });

            if (!supported && this.isCriticalWebAPI(api.name)) {
                this.polyfillsNeeded.push(`Web API ${api.name}`);
            }
        }
    }

    async testResponsiveFeatures() {
        console.log('Testing responsive design features...');
        
        const responsiveTests = [
            {
                name: 'Viewport Meta Tag',
                test: () => {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    return viewport && viewport.content.includes('width=device-width');
                }
            },
            {
                name: 'Media Query Support',
                test: () => window.matchMedia && typeof window.matchMedia === 'function'
            },
            {
                name: 'CSS Viewport Units',
                test: () => {
                    const testEl = document.createElement('div');
                    testEl.style.height = '1vh';
                    return testEl.style.height === '1vh';
                }
            },
            {
                name: 'CSS Calc Function',
                test: () => {
                    const testEl = document.createElement('div');
                    testEl.style.width = 'calc(100% - 10px)';
                    return testEl.style.width.includes('calc');
                }
            },
            {
                name: 'Responsive Images',
                test: () => {
                    const img = document.createElement('img');
                    return 'srcset' in img && 'sizes' in img;
                }
            },
            {
                name: 'Picture Element',
                test: () => 'HTMLPictureElement' in window
            }
        ];

        for (const test of responsiveTests) {
            const supported = test.test();
            
            this.testResults.push({
                test: `Responsive Feature - ${test.name}`,
                passed: supported,
                browser: this.browserInfo.name,
                version: this.browserInfo.version,
                critical: true
            });
        }
    }

    async testAccessibilityFeatures() {
        console.log('Testing accessibility features...');
        
        const a11yTests = [
            {
                name: 'ARIA Support',
                test: () => {
                    const testEl = document.createElement('div');
                    testEl.setAttribute('aria-label', 'test');
                    return testEl.getAttribute('aria-label') === 'test';
                }
            },
            {
                name: 'Focus Management',
                test: () => {
                    const testEl = document.createElement('button');
                    return typeof testEl.focus === 'function';
                }
            },
            {
                name: 'Keyboard Navigation',
                test: () => {
                    const testEl = document.createElement('div');
                    testEl.tabIndex = 0;
                    return testEl.tabIndex === 0;
                }
            },
            {
                name: 'Screen Reader Support',
                test: () => {
                    // Check for common screen reader indicators
                    return 'speechSynthesis' in window || 'webkitSpeechSynthesis' in window;
                }
            },
            {
                name: 'High Contrast Mode',
                test: () => {
                    if (window.matchMedia) {
                        return window.matchMedia('(prefers-contrast: high)').matches !== undefined;
                    }
                    return false;
                }
            },
            {
                name: 'Reduced Motion',
                test: () => {
                    if (window.matchMedia) {
                        return window.matchMedia('(prefers-reduced-motion: reduce)').matches !== undefined;
                    }
                    return false;
                }
            }
        ];

        for (const test of a11yTests) {
            const supported = test.test();
            
            this.testResults.push({
                test: `Accessibility Feature - ${test.name}`,
                passed: supported,
                browser: this.browserInfo.name,
                version: this.browserInfo.version,
                critical: true
            });
        }
    }

    async testPerformanceAPIs() {
        console.log('Testing performance API support...');
        
        const perfTests = [
            { name: 'Performance.now', test: () => typeof performance.now === 'function' },
            { name: 'Performance.mark', test: () => typeof performance.mark === 'function' },
            { name: 'Performance.measure', test: () => typeof performance.measure === 'function' },
            { name: 'Performance.getEntries', test: () => typeof performance.getEntries === 'function' },
            { name: 'Performance.memory', test: () => 'memory' in performance },
            { name: 'Navigation Timing', test: () => 'timing' in performance },
            { name: 'Resource Timing', test: () => typeof performance.getEntriesByType === 'function' },
            { name: 'User Timing', test: () => typeof performance.mark === 'function' && typeof performance.measure === 'function' },
            { name: 'Performance Observer', test: () => typeof PerformanceObserver !== 'undefined' },
            { name: 'Long Task API', test: () => {
                try {
                    return 'PerformanceLongTaskTiming' in window;
                } catch (e) {
                    return false;
                }
            }}
        ];

        for (const test of perfTests) {
            const supported = test.test();
            
            this.testResults.push({
                test: `Performance API - ${test.name}`,
                passed: supported,
                browser: this.browserInfo.name,
                version: this.browserInfo.version,
                critical: this.isCriticalPerfAPI(test.name)
            });
        }
    }

    // Helper methods to determine critical features
    isCriticalFeature(featureName) {
        const criticalFeatures = [
            'querySelector', 'addEventListener', 'classList', 'Canvas 2D',
            'localStorage', 'Fetch API', 'Performance API'
        ];
        return criticalFeatures.includes(featureName);
    }

    isCriticalCSSFeature(featureName) {
        const criticalCSSFeatures = [
            'Flexbox', 'CSS Transforms', 'CSS Transitions', 'CSS Media Queries'
        ];
        return criticalCSSFeatures.includes(featureName);
    }

    isCriticalJSAPI(apiName) {
        const criticalAPIs = [
            'Array.from', 'Object.assign', 'Promise', 'Map', 'Set'
        ];
        return criticalAPIs.includes(apiName);
    }

    isCriticalWebAPI(apiName) {
        const criticalWebAPIs = [
            'Touch Events', 'Clipboard API', 'Page Visibility', 'History API'
        ];
        return criticalWebAPIs.includes(apiName);
    }

    isCriticalPerfAPI(apiName) {
        const criticalPerfAPIs = [
            'Performance.now', 'Performance.getEntries', 'Navigation Timing'
        ];
        return criticalPerfAPIs.includes(apiName);
    }

    generateCompatibilityReport() {
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        const passRate = (passed / total * 100).toFixed(1);
        
        const criticalTests = this.testResults.filter(r => r.critical);
        const criticalPassed = criticalTests.filter(r => r.passed).length;
        const criticalPassRate = criticalTests.length > 0 ? (criticalPassed / criticalTests.length * 100).toFixed(1) : '100';

        console.log(`\n🌐 Cross-Browser Compatibility Report`);
        console.log(`====================================`);
        console.log(`Browser: ${this.browserInfo.name} ${this.browserInfo.version}`);
        console.log(`User Agent: ${this.browserInfo.userAgent}`);
        console.log(`Mobile: ${this.browserInfo.isMobile ? 'Yes' : 'No'}`);
        console.log(`\nTotal Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${total - passed}`);
        console.log(`Overall Pass Rate: ${passRate}%`);
        console.log(`Critical Features Pass Rate: ${criticalPassRate}%`);
        
        if (this.polyfillsNeeded.length > 0) {
            console.log(`\n⚠️  Polyfills Needed:`);
            this.polyfillsNeeded.forEach(polyfill => {
                console.log(`  - ${polyfill}`);
            });
        }

        // Group results by category
        const categories = {};
        this.testResults.forEach(result => {
            const category = result.test.split(' - ')[0];
            if (!categories[category]) {
                categories[category] = { passed: 0, total: 0, failed: [] };
            }
            categories[category].total++;
            if (result.passed) {
                categories[category].passed++;
            } else {
                categories[category].failed.push(result.test);
            }
        });

        console.log(`\n📊 Results by Category:`);
        Object.entries(categories).forEach(([category, stats]) => {
            const categoryPassRate = (stats.passed / stats.total * 100).toFixed(1);
            console.log(`  ${category}: ${stats.passed}/${stats.total} (${categoryPassRate}%)`);
            if (stats.failed.length > 0) {
                stats.failed.forEach(test => {
                    console.log(`    ❌ ${test.replace(category + ' - ', '')}`);
                });
            }
        });

        // Browser-specific recommendations
        this.generateBrowserRecommendations();

        // Save detailed report
        const report = {
            browser: this.browserInfo,
            summary: { 
                total, 
                passed, 
                failed: total - passed, 
                passRate,
                criticalPassRate 
            },
            results: this.testResults,
            categories: categories,
            polyfillsNeeded: this.polyfillsNeeded,
            supportedFeatures: this.supportedFeatures,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('cross-browser-compatibility-report', JSON.stringify(report));
        return report;
    }

    generateBrowserRecommendations() {
        console.log(`\n💡 Browser-Specific Recommendations:`);
        
        const browserName = this.browserInfo.name.toLowerCase();
        const browserVersion = parseInt(this.browserInfo.version);

        switch (browserName) {
            case 'chrome':
                if (browserVersion < 80) {
                    console.log('  - Consider updating Chrome for better performance and security');
                }
                if (!this.supportedFeatures['CSS Container Queries']) {
                    console.log('  - CSS Container Queries not supported, use media queries as fallback');
                }
                break;

            case 'firefox':
                if (browserVersion < 75) {
                    console.log('  - Consider updating Firefox for better CSS Grid support');
                }
                if (!this.supportedFeatures['Backdrop Filter']) {
                    console.log('  - Backdrop filter not supported, use alternative blur effects');
                }
                break;

            case 'safari':
                if (browserVersion < 14) {
                    console.log('  - Consider updating Safari for better Web API support');
                }
                if (!this.supportedFeatures['CSS Container Queries']) {
                    console.log('  - CSS Container Queries limited support, test thoroughly');
                }
                console.log('  - Use -webkit- prefixes for experimental features');
                break;

            case 'edge':
                if (browserVersion < 80) {
                    console.log('  - Consider updating Edge for better Chromium compatibility');
                }
                break;

            case 'internet explorer':
                console.log('  - ⚠️  Internet Explorer is not recommended for modern web applications');
                console.log('  - Consider implementing extensive polyfills or showing upgrade notice');
                break;

            default:
                console.log('  - Test thoroughly on this browser as it may have unique quirks');
        }

        if (this.browserInfo.isMobile) {
            console.log('  - Mobile browser detected:');
            console.log('    - Test touch interactions thoroughly');
            console.log('    - Optimize for smaller screens and touch targets');
            console.log('    - Consider performance implications of animations');
        }
    }
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrossBrowserCompatibilityTests;
} else {
    window.CrossBrowserCompatibilityTests = CrossBrowserCompatibilityTests;
}