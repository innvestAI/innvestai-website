// Configuration for InnvestAI Website
// This file handles environment-specific settings

const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'https://mzkdnfb43hmilf2gfsbg6d5lgq0jajdu.lambda-url.us-east-1.on.aws/',
        TIMEOUT: 10000, // 10 seconds
        RETRY_ATTEMPTS: 2,
        RETRY_DELAY: 1000 // 1 second
    },
    
    // Environment Detection
    ENVIRONMENT: (() => {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('staging') || hostname.includes('dev')) {
            return 'staging';
        } else {
            return 'production';
        }
    })(),
    
    // Feature Flags
    FEATURES: {
        ANALYTICS: true,
        COOKIE_NOTICE: true,
        FORM_VALIDATION: true,
        DEBUG_MODE: false
    },
    
    // UI Configuration
    UI: {
        FORM_SUCCESS_MESSAGE: 'Thank you for joining our waitlist! We will be in touch soon.',
        FORM_ERROR_MESSAGE: 'Your information was saved locally, but there was an issue connecting to our servers. We will still contact you!',
        BUTTON_STATES: {
            DEFAULT: 'SEND',
            LOADING: 'SENDING...',
            SUCCESS: 'SENT',
            ERROR: 'TRY AGAIN'
        }
    },
    
    // Analytics Configuration (if needed)
    ANALYTICS: {
        GOOGLE_ANALYTICS_ID: '',
        HOTJAR_ID: ''
    }
};

// Environment-specific overrides
if (CONFIG.ENVIRONMENT === 'development') {
    CONFIG.FEATURES.DEBUG_MODE = true;
    CONFIG.API.TIMEOUT = 5000; // Shorter timeout for development
}

// Debug logging
if (CONFIG.FEATURES.DEBUG_MODE) {
    console.log('InnvestAI Config:', CONFIG);
}

// Export configuration
window.INNVEST_CONFIG = CONFIG;
