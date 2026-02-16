// Meta Tag Manager for Dynamic SEO and Social Sharing
class MetaTagManager {
    constructor() {
        this.baseMetaTags = this.getBaseMetaTags();
        this.currentContext = {
            page: 'home',
            tool: null,
            theme: 'matrix'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateMetaTags();
    }

    getBaseMetaTags() {
        return {
            title: 'ศูนรวมของเล่นDevสไตล์Hacker - Advanced Web Security Toolkit',
            description: 'Discover powerful web security tools and development utilities for ethical hackers and developers. Features floating console, security scanners, and hacker-themed interface.',
            keywords: 'web security, ethical hacking, developer tools, security scanner, penetration testing, javascript tools, hacker tools, dev utilities, security testing, web development',
            image: 'https://goohub.js.org/gooimage/goometa.png',
            url: window.location.href,
            type: 'website',
            siteName: 'Shark Console',
            twitterCreator: '@Omgnhoy'
        };
    }

    setupEventListeners() {
        // Listen for tool modal opens
        document.addEventListener('toolModalOpened', (e) => {
            this.updateContextForTool(e.detail.tool);
        });

        // Listen for tool modal closes
        document.addEventListener('toolModalClosed', () => {
            this.resetToHome();
        });

        // Listen for theme changes
        document.addEventListener('themeChanged', (e) => {
            this.updateContextForTheme(e.detail.theme);
        });

        // Listen for script marketplace interactions
        document.addEventListener('scriptViewed', (e) => {
            this.updateContextForScript(e.detail.script);
        });

        // Listen for page navigation (if implementing SPA features)
        window.addEventListener('popstate', () => {
            this.updateFromURL();
        });
    }

    updateContextForTool(tool) {
        this.currentContext = {
            page: 'tool',
            tool: tool,
            theme: this.getCurrentTheme()
        };
        this.updateMetaTags();
    }

    updateContextForScript(script) {
        this.currentContext = {
            page: 'script',
            tool: script,
            theme: this.getCurrentTheme()
        };
        this.updateMetaTags();
    }

    updateContextForTheme(theme) {
        this.currentContext.theme = theme;
        this.updateMetaTags();
    }

    resetToHome() {
        this.currentContext = {
            page: 'home',
            tool: null,
            theme: this.getCurrentTheme()
        };
        this.updateMetaTags();
    }

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'matrix';
    }

    updateFromURL() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        if (params.has('tool')) {
            // If URL has tool parameter, update context
            const toolId = params.get('tool');
            // Find tool data and update context
            this.findAndUpdateTool(toolId);
        } else {
            this.resetToHome();
        }
    }

    findAndUpdateTool(toolId) {
        // This would integrate with your existing tool data
        const toolData = this.getToolById(toolId);
        if (toolData) {
            this.updateContextForTool(toolData);
        }
    }

    getToolById(toolId) {
        // Integration with existing tool data
        const tools = {
            'floating-console': {
                name: 'Floating Console',
                description: 'Portable console for developers and ethical hackers',
                icon: '🚀',
                category: 'development'
            },
            'security-tools': {
                name: 'Security Tools Suite',
                description: '7 comprehensive security testing tools for vulnerability assessment',
                icon: '🔧',
                category: 'security'
            },
            'twitter-theme': {
                name: 'Twitter Theme Customizer',
                description: 'Easy Twitter theme customization extension',
                icon: '📱',
                category: 'customization'
            },
            'code-snippets': {
                name: 'Code Snippets Manager',
                description: 'Save and organize JavaScript code snippets',
                icon: '💾',
                category: 'development'
            },
            'metatag-generator': {
                name: 'Metatag Generator',
                description: 'Professional metatag generation tool',
                icon: '⚡',
                category: 'seo'
            },
            'matrix-theme': {
                name: 'Matrix Theme Interface',
                description: 'Hacker-inspired design with customizable themes',
                icon: '🎨',
                category: 'design'
            }
        };

        return tools[toolId] || null;
    }

    updateMetaTags() {
        const metaTags = this.generateMetaTags();

        // Update document title
        document.title = metaTags.title;

        // Update meta tags
        this.updateMetaTag('name', 'description', metaTags.description);
        this.updateMetaTag('name', 'keywords', metaTags.keywords);
        this.updateMetaTag('name', 'author', metaTags.author);

        // Update Open Graph tags
        this.updateMetaTag('property', 'og:title', metaTags.title);
        this.updateMetaTag('property', 'og:description', metaTags.description);
        this.updateMetaTag('property', 'og:image', metaTags.image);
        this.updateMetaTag('property', 'og:url', metaTags.url);
        this.updateMetaTag('property', 'og:type', metaTags.type);

        // Update Twitter Card tags
        this.updateMetaTag('property', 'twitter:title', metaTags.title);
        this.updateMetaTag('property', 'twitter:description', metaTags.description);
        this.updateMetaTag('property', 'twitter:image', metaTags.image);
        this.updateMetaTag('property', 'twitter:url', metaTags.url);

        // Update theme color based on current theme
        this.updateMetaTag('name', 'theme-color', this.getThemeColor());

        // Update canonical URL
        this.updateCanonicalURL(metaTags.url);

        // Update structured data
        this.updateStructuredData(metaTags);
    }

    generateMetaTags() {
        const base = this.baseMetaTags;
        const context = this.currentContext;

        switch (context.page) {
            case 'tool':
                return this.generateToolMetaTags(context.tool);
            case 'script':
                return this.generateScriptMetaTags(context.tool);
            default:
                return this.generateHomeMetaTags();
        }
    }

    generateHomeMetaTags() {
        const theme = this.getCurrentTheme();
        const themeNames = {
            matrix: 'Matrix Green',
            cyberpunk: 'Cyberpunk Purple',
            hacker: 'Hacker Blue',
            neon: 'Neon Yellow',
            ocean: 'Ocean Blue',
            fire: 'Fire Orange'
        };

        return {
            title: `ศูนรวมของเล่นDevสไตล์Hacker - ${themeNames[theme]} Theme`,
            description: `Advanced web security toolkit with ${themeNames[theme]} theme. Features floating console, security scanners, and development utilities for ethical hackers.`,
            keywords: this.baseMetaTags.keywords + `, ${theme} theme, hacker interface, security testing`,
            image: this.generateDynamicPreviewURL(),
            url: window.location.href,
            type: 'website',
            author: 'Shark Console Team'
        };
    }

    generateToolMetaTags(tool) {
        const theme = this.getCurrentTheme();

        return {
            title: `${tool.name} - Shark Console Dev Tools`,
            description: `${tool.description} | Part of the advanced web security toolkit for ethical hackers and developers.`,
            keywords: `${tool.name}, ${tool.category}, ${this.baseMetaTags.keywords}`,
            image: this.generateToolPreviewURL(tool),
            url: this.generateToolURL(tool),
            type: 'article',
            author: 'Shark Console Team'
        };
    }

    generateScriptMetaTags(script) {
        return {
            title: `${script.name} - Script Marketplace`,
            description: `${script.description} | Download and use this powerful script from our marketplace.`,
            keywords: `${script.name}, javascript script, ${script.category}, automation, ${this.baseMetaTags.keywords}`,
            image: this.generateScriptPreviewURL(script),
            url: this.generateScriptURL(script),
            type: 'product',
            author: script.author || 'Shark Console Team'
        };
    }

    generateDynamicPreviewURL() {
        // This would integrate with the social sharing system to generate dynamic previews
        const theme = this.getCurrentTheme();
        const baseURL = window.location.origin;
        return `${baseURL}/api/preview?theme=${theme}&type=home&t=${Date.now()}`;
    }

    generateToolPreviewURL(tool) {
        const theme = this.getCurrentTheme();
        const baseURL = window.location.origin;
        return `${baseURL}/api/preview?theme=${theme}&type=tool&tool=${encodeURIComponent(tool.name)}&t=${Date.now()}`;
    }

    generateScriptPreviewURL(script) {
        const theme = this.getCurrentTheme();
        const baseURL = window.location.origin;
        return `${baseURL}/api/preview?theme=${theme}&type=script&script=${encodeURIComponent(script.name)}&t=${Date.now()}`;
    }

    generateToolURL(tool) {
        const baseURL = window.location.origin + window.location.pathname;
        return `${baseURL}?tool=${encodeURIComponent(tool.name.toLowerCase().replace(/\s+/g, '-'))}`;
    }

    generateScriptURL(script) {
        const baseURL = window.location.origin + window.location.pathname;
        return `${baseURL}?script=${encodeURIComponent(script.name.toLowerCase().replace(/\s+/g, '-'))}`;
    }

    getThemeColor() {
        const themeColors = {
            matrix: '#00ff41',
            cyberpunk: '#ff00ff',
            hacker: '#00ffff',
            neon: '#ffff00',
            ocean: '#0099ff',
            fire: '#ff4500'
        };
        return themeColors[this.getCurrentTheme()] || '#00ff41';
    }

    updateMetaTag(attribute, name, content) {
        let tag = document.querySelector(`meta[${attribute}="${name}"]`);

        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attribute, name);
            document.head.appendChild(tag);
        }

        tag.setAttribute('content', content);
    }

    updateCanonicalURL(url) {
        let canonical = document.querySelector('link[rel="canonical"]');

        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }

        canonical.setAttribute('href', url);
    }

    updateStructuredData(metaTags) {
        // Update the main structured data
        const structuredData = {
            "@context": "https://schema.org",
            "@type": this.currentContext.page === 'tool' ? "SoftwareApplication" : "WebApplication",
            "name": metaTags.title,
            "description": metaTags.description,
            "url": metaTags.url,
            "image": metaTags.image,
            "author": {
                "@type": "Organization",
                "name": metaTags.author
            },
            "applicationCategory": this.getApplicationCategory(),
            "operatingSystem": "Web Browser",
            "dateModified": new Date().toISOString().split('T')[0]
        };

        // Add tool-specific data
        if (this.currentContext.tool) {
            structuredData.featureList = [this.currentContext.tool.description];
            structuredData.category = this.currentContext.tool.category;
        }

        this.updateStructuredDataScript('main-app-data', structuredData);
    }

    getApplicationCategory() {
        if (this.currentContext.tool) {
            const categoryMap = {
                security: 'SecurityApplication',
                development: 'DeveloperApplication',
                customization: 'BrowserApplication',
                seo: 'BusinessApplication',
                design: 'DesignApplication'
            };
            return categoryMap[this.currentContext.tool.category] || 'DeveloperApplication';
        }
        return 'DeveloperApplication';
    }

    updateStructuredDataScript(id, data) {
        let script = document.getElementById(id);

        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = id;
            document.head.appendChild(script);
        }

        script.textContent = JSON.stringify(data, null, 2);
    }

    // Public API methods
    setContext(page, tool = null, theme = null) {
        this.currentContext = {
            page: page,
            tool: tool,
            theme: theme || this.getCurrentTheme()
        };
        this.updateMetaTags();
    }

    getMetaTags() {
        return this.generateMetaTags();
    }

    // SEO utilities
    generateSitemap() {
        const tools = Object.keys(this.getToolById('') || {});
        const baseURL = window.location.origin + window.location.pathname;

        const urls = [
            { url: baseURL, priority: 1.0, changefreq: 'weekly' },
            ...tools.map(toolId => ({
                url: `${baseURL}?tool=${toolId}`,
                priority: 0.8,
                changefreq: 'monthly'
            }))
        ];

        return urls;
    }

    generateRobotsTxt() {
        return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: ${window.location.origin}/sitemap.xml`;
    }

    // Analytics integration
    trackSEOMetrics() {
        const metrics = {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.content,
            keywords: document.querySelector('meta[name="keywords"]')?.content,
            canonicalURL: document.querySelector('link[rel="canonical"]')?.href,
            ogImage: document.querySelector('meta[property="og:image"]')?.content,
            theme: this.getCurrentTheme(),
            context: this.currentContext,
            timestamp: Date.now()
        };

        // Store in localStorage for analytics
        const seoHistory = JSON.parse(localStorage.getItem('seoMetrics') || '[]');
        seoHistory.push(metrics);

        // Keep only last 100 entries
        if (seoHistory.length > 100) {
            seoHistory.splice(0, seoHistory.length - 100);
        }

        localStorage.setItem('seoMetrics', JSON.stringify(seoHistory));

        return metrics;
    }
}

// Initialize Meta Tag Manager
document.addEventListener('DOMContentLoaded', () => {
    window.metaTagManager = new MetaTagManager();

    // Integrate with existing social sharing system
    if (window.socialSharingSystem) {
        // Update social sharing when meta tags change
        document.addEventListener('metaTagsUpdated', () => {
            window.socialSharingSystem.previewCache.clear();
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MetaTagManager;
}