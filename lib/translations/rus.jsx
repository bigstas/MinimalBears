import counterpart from 'counterpart'

counterpart.registerTranslations('rus', {
    example: {
        greeting: 'Hello %(name)s! How are you today?'
    },
    nav: {
        home: "Главная",
        about: "Об этом программе",
        train: "Тренировка",
        record: "Запис",
        guest: "Гость",
        profile: "Профиль",
        settings: "Настройки"
    },
    notfound: {
        title: "Веб-страница не найдена.",
        text: "Проверийте, что адрес правильно введен."
    },
    home: {
        welcome: "Добро пожаловать",
        intro: " это программа, которая Вам поможиет учиться звуки иностранных языков.",
        continue: "Продолжать гостьом",
        signIn: "Sign In",
        register: "Регистировать"
    },
    about: {
        title: 'Minimal Bears: The research-based web app that improves your accent.',
        whatIs: 'Что это Minimal Bears?',
        p1: {
            line1: 'Minimal Bears is a web app that uses a technique known as ',
            HVPT: 'High Variability Phonetic Training',
            line2: ' (HVPT) to help people learn the sounds of a foreign language.'
        }
    },
    loading: {
        loading: 'Пожалуйста, подождите...'
    },
    train: {
        chooseLanguage: "Choose the language you want to train",
        chooseContrast: "Choose which contrast you want to train",
        changeLanguage: "Изменить язык",
        sorryNoContrasts: "Sorry, we don't have enough audio ready for this language. We're working on it!",
        score: "Счот",
        language: {
            1: "Английский",
            2: "Немецкий",
            3: "Польский"
        },
        contrast: {
            1: "ee/i",
            3: "i/e",
            11: "l/r", 
            2: "s/th"
        },
        progressLabel: {
            begin: "Начинать",
            playAgain: "Послушать снова",
            next: "Следующий",
            goAgain: "Заиграть еще раз"
        },
        correct: "Хорошо!",
        wrong: "Неправильно!"
    },
    record: {
        startLabel: {
            record: "Record",
            done: "Все",
            next: "Следующий",
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