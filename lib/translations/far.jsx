import counterpart from 'counterpart'

counterpart.registerTranslations('far', {
    example: {
        greeting: 'Hello %(name)s! How are you today?'
    },
    nav: {
        home: "صفحه نخست",
        about: "در باره این برنامه",
        train: "مشق",
        record: "ضبط",
        guest: "مهمان",
        profile: "پروفایل",
        settings: "تنظیمات"
    },
    notfound: {
        title: "صفحه وب کشف نشد",
        text: "Sad bear face. Check you input the URL correctly."
    },
    home: {
        welcome: "خوش آمدید",
        intro: ".یک برنامه است که مردان را کمک می کند که صداها زبان خارجی را یاد بگیرند ",
        continue: "Continue as guest",
        signIn: "ورود",
        register: "ثبت نام"
    },
    about: {
        title: 'Minimal Bears: The research-based web app that improves your accent.',
        whatIs: 'چیست؟ Minimal Bears?',
        p1: {
            line1: 'Minimal Bears is a web app that uses a technique known as ',
            HVPT: 'High Variability Phonetic Training',
            line2: ' (HVPT) to help people learn the sounds of a foreign language.'
        }
    },
    loading: {
        loading: '...لتفا صبر کنید'
    },
    train: {
        chooseLanguage: "لتفا زبان را امتحان کن",
        chooseContrast: "Choose which contrast you want to train",
        changeLanguage: "زبان را تغییر کن",
        sorryNoContrasts: "Sorry, we don't have enough audio ready for this language. We're working on it!",
        score: "نمره",
        language: {
            1: "اینگلیسی",
            2: "آلمانی",
            3: "لخستانی"
        },
        progressLabel: {
            begin: "شروع کن",
            playAgain: "دوباره کوش کن",
            next: "بعد",
            goAgain: "دوباره تمرین کن"
        },
        correct: "!درست است",
        wrong: "!اشتباه"
    },
    record: {
        startLabel: {
            record: "Record",
            done: "Done",
            next: "بعد",
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