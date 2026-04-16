export default defineNuxtConfig({
    modules: ['@pinia/nuxt'],
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    nitro: {
        devProxy: {
            '/api': {
                target: 'http://localhost:3100/api', // local backend URL
                changeOrigin: true,
                prependPath: true,
            }
        }
    },
    css: [
        '@/assets/css/main.css',
        '@/assets/css/transactions.css'
    ],
    app: {
        head: {
            meta: [
                { charset: 'utf-8' },
                { property: 'og:site_name', content: 'ScanHand' },
                { property: 'og:type', content: 'website' },
                { property: 'og:title', content: 'ScanHand — хиромантия по фото ладоней' },
                { property: 'og:url', content: 'https://scanhand.ru' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover interactive-widget=resizes-content' },
                { name: 'description', content: 'ScanHand — онлайн-хиромантия по фото. Загрузите снимки обеих рук и получите детальный разбор линий судьбы: ваш характер, карьера, отношения и будущее' },
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
                { rel: 'icon', href: '/favicon.ico' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap' }
            ]
        },
    }
})