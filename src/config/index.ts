// Application configuration

export const API_CONFIG = {
    BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://json-report-backend.onrender.com' 
        : 'http://localhost:8000',
    ENDPOINTS: {
        PREDEFINED: '/columns/predefined_dataset',
        MOBILE:'/columns/parse-columns',
    },
    TIMEOUT: 30000,
} as const;

export const APP_CONFIG = {
    NAME: 'Generador de Estructura JSON para Reportes',
    VERSION: '1.0.0',
    DEFAULT_THEME: 'dark' as const,
    SUPPORTED_LOCALES: ['es', 'en', 'pt'] as const,
} as const;

export const STORAGE_KEYS = {
    THEME: 'app_theme',
    LAST_CONFIG: 'last_config',
    USER_PREFERENCES: 'user_preferences',
} as const;