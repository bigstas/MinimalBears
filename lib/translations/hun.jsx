import counterpart from 'counterpart'

counterpart.registerTranslations('hun', {
    example: {
        greeting: 'Jó napot %(name)s! Hogy vagy?'
    },
    nav: {
        home: "Home",
        about: "About",
        train: "Train",
        record: "Record",
        guest: "Vendég",
        profile: "Profile",
        settings: "Settings"
    },
    notfound: {
        title: "Your webpage was not found.",
        text: "Sad bear face. Check you input the URL correctly."
    },
    home: {
        welcome: "Üdvövlöm!",
        intro: " egy programma, ami segít az akcent tanulásával.",
        continue: "Continue as guest",
        signIn: "Sign In",
        register: "Register"
    },
    about: {
        title: 'Minimal Bears: The research-based web app that improves your accent.',
        whatIs: 'Mi a Minimal Bears?'
    },
    train: {
        chooseLanguage: "Choose the language you want to train",
        chooseContrast: "Choose which contrast you want to train",
        changeLanguage: "Change language",
        sorryNoContrasts: "Sajnos nincs ez a nyelv hangfájlák. Dolgozunk rajta!",
        score: "Score",
        language: {
            English: "Angol",
            Polish: "Lengyel",
            German: "Német"
        },
        progressLabel: {
            begin: "Begin",
            playAgain: "Play Again",
            next: "Next",
            goAgain: "Go Again"
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