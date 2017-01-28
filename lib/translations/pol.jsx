import counterpart from 'counterpart'

counterpart.registerTranslations('pol', {
    example: {
        greeting: 'Cześć %(name)s! Jak życie płynie?'
    },
    notfound: {
        title: "Nie znaleziono tej strony.",
        text: "Niestety. Sprawdź, czy dobrze wpisano URL."
    },
    nav: {
        home: "Strona Główna",
        about: "O tej stronie",
        train: "Ćwicz",
        record: "Nagrywaj",
        guest: "Gość",
        profile: "Profil",
        settings: "Ustawienia"
    },
    home: {
        welcome: "Witaj!",
        intro: " to aplikacja, która Ci pozwoli ćwiczyć brzmienia z obcych języków.",
        continue: "Kontynuuj jako gość",
        signIn: "Wloguj",
        register: "Zapisz się"
    },
    about: {
        title: 'Minimal Bears: aplikacja, która Ci pozwala ćwiczyć głoski z obcych języków.',
        whatIs: 'Co to jest Minimal Bears?',
        p1: {
            line1: 'Minimal Bears to aplikacja internetowa która stosuje technikę zwaną ',
            HVPT: 'Trening Fonetyczny o Wyskokiej Zmienności',
            line2: ' (HVPT) aby pomóc ludziom nauczyć się brzmienia głosków pochodzących z języków obcych.'
        }
        
    },
    train: {
        chooseLanguage: "Wybierz który język chcesz poćwiczyć",
        chooseContrast: "Wybierz który kontrast chcesz poćwiczyć",
        changeLanguage: "Zmień język",
        sorryNoContrasts: "Niestety nie mamy jeszcze przygotowanych plików audio dla tego języka. Pracujemy nad tym!",
        score: "Wynik",
        language: {
            English: "Angielski",
            Polish: "Polski",
            German: "Niemiecki"
        },
        progressLabel: {
            begin: "Zacznij",
            playAgain: "Usłysz znowu",
            next: "Następne",
            goAgain: "Zagraj jeszcze raz"
        },
        correct: "Dobrze!",
        wrong: "Źle!"
    },
    record: {
        startLabel: {
            record: "Nagraj",
            done: "Gotowe",
            next: "Następny",
            reRecordAll: "Nagraj wszystkie od nowa",
            tooltip1: "Nagraj wszystkie słowa",
            tooltip2: "jedne po drugim."
        },
        stopTooltip: "Kliknij tutaj aby przestać nagrywanie.",
        playbackAll: "Odegraj wszystko",
        playbackAllTooltip: "Odegraj wszystkie nagrania.",
        submit: "Wyślij",
        submitTooltip: "Gdy jesteś gotowy/a, wyślij wszystkie nagrania do bazy danych.",
        reRecordTooltip: "Nagraj to słowo od nowa",
        playbackTooltip: "Odegraj słowo"
    }
})