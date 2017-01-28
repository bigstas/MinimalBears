import counterpart from 'counterpart'

counterpart.registerTranslations('geo', {
    example: {
        greeting: 'Hello %(name)s! How are you today?'
    },
    nav: {
        home: "მტავარი გვერდი",
        about: "About",
        train: "სასწავლო",
        record: "Record",
        guest: "სტუმარი",
        profile: "პროფილი",
        settings: "Settings"
    },
    notfound: {
        title: "Your webpage was not found.",
        text: "Sad bear face. Check you input the URL correctly."
    },
    home: {
        welcome: "მისასალმები!",
        intro: " is an app that will help you learn new sounds in foreign languages.",
        continue: "Continue as guest",
        signIn: "Sign In",
        register: "რეგისტრირება"
    },
    about: {
        title: 'Minimal Bears: The research-based web app that improves your accent.',
        whatIs: 'Minimal Bears რა არის?',
        p1: {
            line1: 'Minimal Bears is a web app that uses a technique known as ',
            HVPT: 'High Variability Phonetic Training',
            line2: ' (HVPT) to help people learn the sounds of a foreign language.'
        }
    },
    train: {
        chooseLanguage: "რომელი ენის პრაქტიკა გინდა?",
        chooseContrast: "Choose which contrast you want to train",
        changeLanguage: "მე მინდა განსხავებული ენა",
        sorryNoContrasts: "Sorry, we don't have enough audio ready for this language. We're working on it!",
        score: "Score",
        language: {
            English: "ინგლისური",
            Polish: "პოლინური",
            German: "გერმანური"
        },
        progressLabel: {
            begin: "Begin",
            playAgain: "Listen again",
            next: "Next",
            goAgain: "Play again"
        },
        correct: "სწორია!",
        wrong: "არასწორია!"
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