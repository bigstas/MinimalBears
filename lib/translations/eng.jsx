import counterpart from 'counterpart'

// Set default locale to 'eng'. The automatic default would be 'en', which would be unrecognised since we're using three-letter codes.
// This will run once on startup and not run again.
// For future - maybe try to get their locale first?
counterpart.setLocale('eng')

counterpart.registerTranslations('eng', {
    example: {
        greeting: 'Hello %(name)s! How are you today?'
    },
    nav: {
        home: "Home",
        about: "About",
        train: "Train",
        record: "Record",
        guest: "Guest",
        profile: "Profile",
        settings: "Settings"
    },
    home: {
        welcome: "Welcome!",
        intro: " is an app that will help you learn new sounds in foreign languages.",
        continue: "Continue as guest",
        signIn: "Sign In",
        register: "Register"
    },
    about: {
        title: 'Minimal Bears: The research-based web app that improves your accent.',
        whatIs: 'What is Minimal Bears?',
        p1: {
            line1: 'Minimal Bears is a web app that uses a technique known as ',
            HVPT: 'High Variability Phonetic Training',
            line2: ' (HVPT) to help people learn the sounds of a foreign language.'
        }
    },
    train: {
        chooseLanguage: "Choose the language you want to train",
        chooseContrast: "Choose which contrast you want to train",
        changeLanguage: "Change language",
        sorryNoContrasts: "Sorry, we don't have enough audio ready for this language. We're working on it!",
        score: "Score",
        language: {
            English: "English",
            Polish: "Polish",
            German: "German"
        },
        label: {
            begin: "Begin",
            playAgain: "Listen again",
            next: "Next",
            goAgain: "Play again"
        }
    }
})