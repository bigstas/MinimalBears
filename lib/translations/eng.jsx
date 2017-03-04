import counterpart from 'counterpart'

// Set default locale to 'eng'. The automatic default would be 'en', which would be unrecognised since we're using three-letter codes.
// This will run once on startup and not run again.
// For future - maybe try to get their locale first?
//counterpart.setLocale('eng')

counterpart.registerTranslations('eng', {
    example: {
        greeting: 'Hello %(name)s! How are you today?'
    },
    notfound: {
        title: "Your webpage was not found.",
        text: "Sad bear face. Check you input the URL correctly."
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
        welcome: "Welcome",
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
            1: "English",
            2: "German",
            3: "Polish"
        },
        progressLabel: {
            begin: "Begin",
            playAgain: "Listen again",
            next: "Next",
            goAgain: "Play again"
        },
        correct: "Correct!",
        wrong: "Oops!"
    },
    record: {
        startLabel: {
            record: "Record",
            done: "Done",
            next: "Next",
            reRecordAll: "Re-record All",
            tooltip1: "Record all the words,",
            tooltip2: "one after the other."
        },
        stopTooltip: "Click here to stop recording.",
        playbackAll: "Playback All",
        playbackAllTooltip: "Play all the audio.",
        submit: "Sumbit",
        submitTooltip: "If you are ready, send all the audio to the database.",
        reRecordTooltip: "Re-record this word",
        playbackTooltip: "Play back"
    }
})