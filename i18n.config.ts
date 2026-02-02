// i18n configuration
// Note: For now, translations are inline. 
// The JSON files in /locales/ are templates for future expansion.

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            nav: {
                home: 'Home',
                features: 'Features',
                pricing: 'Pricing',
                about: 'About',
                login: 'Login',
                signup: 'Sign Up',
                dashboard: 'Dashboard',
                logout: 'Logout'
            }
        },
        fr: {
            nav: {
                home: 'Accueil',
                features: 'Fonctionnalités',
                pricing: 'Tarifs',
                about: 'À propos',
                login: 'Connexion',
                signup: 'S\'inscrire',
                dashboard: 'Tableau de bord',
                logout: 'Déconnexion'
            }
        }
    }
}))
