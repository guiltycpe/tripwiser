// Global translation composable
// Provides reactive translations across the entire application

const globalLocale = ref('en')

// Complete translations for all pages
const translations = {
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
        },
        home: {
            hero: {
                title: 'Plan Your Perfect Trip',
                subtitle: 'AI-powered itineraries tailored to your preferences',
                startButton: 'Start Planning',
                learnMore: 'Learn More'
            },
            features: {
                title: 'Why Choose TripWiser?',
                ai: {
                    title: 'AI-Powered Planning',
                    description: 'Our intelligent algorithm creates personalized itineraries based on your interests.'
                },
                save: {
                    title: 'Save Time & Money',
                    description: 'Get the best recommendations for restaurants, hotels, and activities.'
                },
                share: {
                    title: 'Share & Collaborate',
                    description: 'Plan trips with friends and family in real-time.'
                }
            },
            cta: {
                title: 'Ready to Start Your Adventure?',
                subtitle: 'Join thousands of travelers who plan smarter with TripWiser.',
                button: 'Get Started Free'
            }
        },
        features: {
            hero: {
                title: 'Powerful Features',
                subtitle: 'Everything you need to plan the perfect trip'
            },
            list: {
                ai: {
                    title: 'AI Trip Generation',
                    description: 'Our advanced AI creates personalized itineraries in seconds.'
                },
                maps: {
                    title: 'Interactive Maps',
                    description: 'Visualize your trip with beautiful interactive maps.'
                },
                budget: {
                    title: 'Budget Tracking',
                    description: 'Keep track of expenses and stay within your budget.'
                },
                collab: {
                    title: 'Collaboration',
                    description: 'Plan trips together with friends and family.'
                },
                offline: {
                    title: 'Offline Access',
                    description: 'Access your itinerary even without internet.'
                },
                recommendations: {
                    title: 'Smart Recommendations',
                    description: 'Get personalized suggestions for restaurants and activities.'
                }
            }
        },
        pricing: {
            hero: {
                title: 'Simple, Transparent Pricing',
                subtitle: 'Choose the plan that fits your travel style'
            },
            plans: {
                free: {
                    name: 'Free',
                    price: '€0',
                    period: '/month',
                    features: ['1 trip per month', 'Basic AI recommendations', 'Email support'],
                    button: 'Get Started'
                },
                pro: {
                    name: 'Pro',
                    price: '€9.99',
                    period: '/month',
                    features: ['Unlimited trips', 'Advanced AI', 'Priority support', 'Offline access', 'Collaboration'],
                    button: 'Start Free Trial',
                    popular: 'Most Popular'
                },
                team: {
                    name: 'Team',
                    price: '€24.99',
                    period: '/month',
                    features: ['Everything in Pro', 'Team management', 'Shared itineraries', 'Analytics', 'API access'],
                    button: 'Contact Sales'
                }
            }
        },
        about: {
            hero: {
                title: 'About TripWiser',
                subtitle: 'Making travel planning simple and enjoyable'
            },
            mission: {
                title: 'Our Mission',
                description: 'We believe everyone deserves amazing travel experiences. Our mission is to make trip planning effortless, so you can focus on creating memories.'
            },
            team: {
                title: 'Meet Our Team',
                description: 'A passionate group of travelers and technologists.'
            },
            values: {
                title: 'Our Values',
                innovation: 'Innovation',
                quality: 'Quality',
                community: 'Community'
            }
        },
        plan: {
            hero: {
                title: 'Plan Your Trip',
                subtitle: 'Tell us about your dream vacation'
            },
            form: {
                departure: 'Departure City',
                departurePlaceholder: 'Where are you leaving from?',
                destination: 'Destination',
                destinationPlaceholder: 'Where do you want to go?',
                departureDate: 'Departure Date',
                returnDate: 'Return Date',
                budget: 'Budget',
                budgetOptions: {
                    budget: 'Budget',
                    moderate: 'Moderate',
                    luxury: 'Luxury'
                },
                travelStyle: 'Travel Style',
                styleOptions: {
                    adventure: 'Adventure',
                    relaxation: 'Relaxation',
                    culture: 'Culture',
                    food: 'Food & Wine',
                    nature: 'Nature'
                },
                roadTrip: 'Road Trip?',
                roadTripYes: 'Yes, I want a road trip!',
                submit: 'Generate My Itinerary',
                generating: 'Generating...'
            }
        },
        dashboard: {
            welcome: 'Welcome back',
            subtitle: 'Manage your trips and plan new adventures',
            newTrip: 'New Trip',
            logout: 'Logout',
            stats: {
                totalTrips: 'Total Trips',
                countries: 'Countries Visited',
                upcoming: 'Upcoming Trips',
                memberSince: 'Member Since'
            },
            trips: {
                title: 'Your Trips',
                all: 'All Trips',
                upcoming: 'Upcoming',
                past: 'Past',
                empty: 'No trips yet',
                emptySubtitle: 'Start planning your first adventure!',
                createFirst: 'Create Your First Trip',
                from: 'From',
                budget: 'budget',
                viewDetails: 'View Details',
                edit: 'Edit',
                deleteConfirm: 'Are you sure you want to delete this trip?'
            }
        },
        auth: {
            login: {
                title: 'Welcome Back',
                subtitle: 'Sign in to continue your journey',
                email: 'Email',
                emailPlaceholder: 'you@example.com',
                password: 'Password',
                passwordPlaceholder: '••••••••',
                rememberMe: 'Remember me',
                forgotPassword: 'Forgot password?',
                submit: 'Sign In',
                submitting: 'Signing in...',
                noAccount: "Don't have an account?",
                signupLink: 'Sign up for free',
                backHome: 'Back to home'
            },
            signup: {
                title: 'Create Account',
                subtitle: 'Start planning your perfect trips',
                fullName: 'Full Name',
                fullNamePlaceholder: 'John Doe',
                email: 'Email',
                emailPlaceholder: 'you@example.com',
                password: 'Password',
                passwordPlaceholder: '••••••••',
                passwordHint: 'Minimum 6 characters',
                terms: 'I agree to the',
                termsLink: 'Terms of Service',
                and: 'and',
                privacyLink: 'Privacy Policy',
                submit: 'Create Account',
                submitting: 'Creating account...',
                hasAccount: 'Already have an account?',
                loginLink: 'Sign in',
                backHome: 'Back to home',
                success: 'Account created successfully! Redirecting...'
            }
        },
        common: {
            loading: 'Loading...',
            error: 'An error occurred',
            tryAgain: 'Try Again',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close'
        }
    },
    fr: {
        nav: {
            home: 'Accueil',
            features: 'Fonctionnalités',
            pricing: 'Tarifs',
            about: 'À propos',
            login: 'Connexion',
            signup: "S'inscrire",
            dashboard: 'Tableau de bord',
            logout: 'Déconnexion'
        },
        home: {
            hero: {
                title: 'Planifiez Votre Voyage Parfait',
                subtitle: 'Itinéraires personnalisés par Intelligence Artificielle',
                startButton: 'Commencer à Planifier',
                learnMore: 'En Savoir Plus'
            },
            features: {
                title: 'Pourquoi Choisir TripWiser ?',
                ai: {
                    title: 'Planification par IA',
                    description: 'Notre algorithme intelligent crée des itinéraires personnalisés selon vos intérêts.'
                },
                save: {
                    title: 'Gagnez Temps & Argent',
                    description: 'Obtenez les meilleures recommandations pour restaurants, hôtels et activités.'
                },
                share: {
                    title: 'Partagez & Collaborez',
                    description: 'Planifiez des voyages avec vos amis et votre famille en temps réel.'
                }
            },
            cta: {
                title: 'Prêt à Commencer Votre Aventure ?',
                subtitle: 'Rejoignez des milliers de voyageurs qui planifient plus intelligemment avec TripWiser.',
                button: 'Commencer Gratuitement'
            }
        },
        features: {
            hero: {
                title: 'Fonctionnalités Puissantes',
                subtitle: 'Tout ce dont vous avez besoin pour planifier le voyage parfait'
            },
            list: {
                ai: {
                    title: 'Génération par IA',
                    description: 'Notre IA avancée crée des itinéraires personnalisés en quelques secondes.'
                },
                maps: {
                    title: 'Cartes Interactives',
                    description: 'Visualisez votre voyage avec de belles cartes interactives.'
                },
                budget: {
                    title: 'Suivi du Budget',
                    description: 'Suivez vos dépenses et restez dans votre budget.'
                },
                collab: {
                    title: 'Collaboration',
                    description: 'Planifiez des voyages ensemble avec vos amis et votre famille.'
                },
                offline: {
                    title: 'Accès Hors Ligne',
                    description: 'Accédez à votre itinéraire même sans connexion internet.'
                },
                recommendations: {
                    title: 'Recommandations Intelligentes',
                    description: 'Recevez des suggestions personnalisées pour restaurants et activités.'
                }
            }
        },
        pricing: {
            hero: {
                title: 'Tarification Simple et Transparente',
                subtitle: 'Choisissez le forfait qui correspond à votre style de voyage'
            },
            plans: {
                free: {
                    name: 'Gratuit',
                    price: '0€',
                    period: '/mois',
                    features: ['1 voyage par mois', 'Recommandations IA basiques', 'Support par email'],
                    button: 'Commencer'
                },
                pro: {
                    name: 'Pro',
                    price: '9,99€',
                    period: '/mois',
                    features: ['Voyages illimités', 'IA avancée', 'Support prioritaire', 'Accès hors ligne', 'Collaboration'],
                    button: 'Essai Gratuit',
                    popular: 'Le Plus Populaire'
                },
                team: {
                    name: 'Équipe',
                    price: '24,99€',
                    period: '/mois',
                    features: ['Tout dans Pro', 'Gestion d\'équipe', 'Itinéraires partagés', 'Analytiques', 'Accès API'],
                    button: 'Contacter les Ventes'
                }
            }
        },
        about: {
            hero: {
                title: 'À Propos de TripWiser',
                subtitle: 'Rendre la planification de voyage simple et agréable'
            },
            mission: {
                title: 'Notre Mission',
                description: 'Nous croyons que tout le monde mérite des expériences de voyage extraordinaires. Notre mission est de rendre la planification de voyage sans effort, pour que vous puissiez vous concentrer sur la création de souvenirs.'
            },
            team: {
                title: 'Notre Équipe',
                description: 'Un groupe passionné de voyageurs et de technologues.'
            },
            values: {
                title: 'Nos Valeurs',
                innovation: 'Innovation',
                quality: 'Qualité',
                community: 'Communauté'
            }
        },
        plan: {
            hero: {
                title: 'Planifiez Votre Voyage',
                subtitle: 'Parlez-nous de vos vacances de rêve'
            },
            form: {
                departure: 'Ville de Départ',
                departurePlaceholder: "D'où partez-vous ?",
                destination: 'Destination',
                destinationPlaceholder: 'Où voulez-vous aller ?',
                departureDate: 'Date de Départ',
                returnDate: 'Date de Retour',
                budget: 'Budget',
                budgetOptions: {
                    budget: 'Économique',
                    moderate: 'Modéré',
                    luxury: 'Luxe'
                },
                travelStyle: 'Style de Voyage',
                styleOptions: {
                    adventure: 'Aventure',
                    relaxation: 'Détente',
                    culture: 'Culture',
                    food: 'Gastronomie',
                    nature: 'Nature'
                },
                roadTrip: 'Road Trip ?',
                roadTripYes: 'Oui, je veux un road trip !',
                submit: 'Générer Mon Itinéraire',
                generating: 'Génération en cours...'
            }
        },
        dashboard: {
            welcome: 'Bienvenue',
            subtitle: 'Gérez vos voyages et planifiez de nouvelles aventures',
            newTrip: 'Nouveau Voyage',
            logout: 'Déconnexion',
            stats: {
                totalTrips: 'Total Voyages',
                countries: 'Pays Visités',
                upcoming: 'Voyages à Venir',
                memberSince: 'Membre Depuis'
            },
            trips: {
                title: 'Vos Voyages',
                all: 'Tous les Voyages',
                upcoming: 'À Venir',
                past: 'Passés',
                empty: 'Pas encore de voyages',
                emptySubtitle: 'Commencez à planifier votre première aventure !',
                createFirst: 'Créer Votre Premier Voyage',
                from: 'De',
                budget: 'budget',
                viewDetails: 'Voir les Détails',
                edit: 'Modifier',
                deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce voyage ?'
            }
        },
        auth: {
            login: {
                title: 'Bon Retour',
                subtitle: 'Connectez-vous pour continuer votre voyage',
                email: 'Email',
                emailPlaceholder: 'vous@exemple.com',
                password: 'Mot de passe',
                passwordPlaceholder: '••••••••',
                rememberMe: 'Se souvenir de moi',
                forgotPassword: 'Mot de passe oublié ?',
                submit: 'Se Connecter',
                submitting: 'Connexion en cours...',
                noAccount: "Vous n'avez pas de compte ?",
                signupLink: 'Inscrivez-vous gratuitement',
                backHome: 'Retour à l\'accueil'
            },
            signup: {
                title: 'Créer un Compte',
                subtitle: 'Commencez à planifier vos voyages parfaits',
                fullName: 'Nom Complet',
                fullNamePlaceholder: 'Jean Dupont',
                email: 'Email',
                emailPlaceholder: 'vous@exemple.com',
                password: 'Mot de passe',
                passwordPlaceholder: '••••••••',
                passwordHint: 'Minimum 6 caractères',
                terms: "J'accepte les",
                termsLink: 'Conditions d\'Utilisation',
                and: 'et la',
                privacyLink: 'Politique de Confidentialité',
                submit: 'Créer un Compte',
                submitting: 'Création en cours...',
                hasAccount: 'Vous avez déjà un compte ?',
                loginLink: 'Connectez-vous',
                backHome: 'Retour à l\'accueil',
                success: 'Compte créé avec succès ! Redirection...'
            }
        },
        common: {
            loading: 'Chargement...',
            error: 'Une erreur est survenue',
            tryAgain: 'Réessayer',
            cancel: 'Annuler',
            save: 'Enregistrer',
            delete: 'Supprimer',
            edit: 'Modifier',
            close: 'Fermer'
        }
    }
} as const

export type Locale = 'en' | 'fr'

export function useTranslations() {
    const locale = computed({
        get: () => globalLocale.value as Locale,
        set: (val: Locale) => { globalLocale.value = val }
    })

    const t = computed(() => translations[globalLocale.value as Locale])

    function setLocale(newLocale: Locale) {
        globalLocale.value = newLocale
    }

    return {
        locale,
        t,
        setLocale,
        translations
    }
}
