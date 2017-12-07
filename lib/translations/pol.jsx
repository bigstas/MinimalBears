import counterpart from 'counterpart'

counterpart.registerTranslations('pol', {
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
        welcome: "Witaj",
        intro: "<strong>Minimal Bears</strong> to aplikacja, która pozwoli Ci udoskonalić wymowę obcych języków.",
        continue: "Kontynuuj jako gość",
        signIn: "Wloguj",
        register: "Zapisz się"
    },
    about: {
        title: 'Minimal Bears: aplikacja, która pozwoli Ci udoskonalić wymowę głosek w obcych językach.',
        whatIs: 'Co to jest Minimal Bears?',
        p1: {
            line1: 'Minimal Bears to aplikacja internetowa stosująca technikę zwaną ',
            HVPT: 'Trening Fonetyczny o Wysokiej Zmienności',
            line2: ' (po angielsku High Variability Phonetic Training, czyli HVPT) aby pomóc ludziom nauczyć się brzmienia głosek pochodzących z języków obcych.'
        }
    },
    loading: {
        loading: 'Trwa ładowanie strony...'
    },
    auth: {
        email: "Email:",
        username: "Nazwa użytownika:",
        password: "Hasło:",
        confirmPassword: "Potwierdź hasło:",
        register: {
            joinTitle: "Załącz się.",
            joining: "Joining allows you to keep track of your progress, contribute recordings, and receive suggestions for what you should practise next.",
            emailError: "Please provide a valid email address.",
            usernameError: "Ta nazwa użytownika jest już w użytku. Proszę wybrać inną.",
            passwordError: "Twoje hasło musi być takie same w obu polach.",
            joinButtonLabel: "Załącz się",
            loginLink: "Masz już konto? Zaloguj."
        },
        login: {
            loginTitle: "Zaloguj.",
            loggingIn: "Zalogowanie pozwala Ci zachować i śledzić Twój progres.",
            emailError: "Proszę wprowadź adres email.",
            passwordError: "O jej! Błędny adres email lub hasło.",
            loginButtonLabel: "Zaloguj się",
            joinLink: "Potrzebujesz konto? Załącz się."
        }
    },
    train: {
        chooseLanguage: "Wybierz który język chcesz poćwiczyć",
        chooseContrast: "Wybierz który kontrast chcesz poćwiczyć",
        changeLanguage: "Zmień język",
        sorryNoContrasts: "Niestety nie mamy jeszcze przygotowanych plików audio dla tego języka. Pracujemy nad tym!",
        score: "Wynik",
        language: {
            1: "Angielski",
            2: "Niemiecki",
            3: "Polski"
        },
        contrast: {
            1: "ee/i",
            3: "i/e",
            11: "l/r", 
            2: "s/th"
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
        stopTooltip: "Kliknij tutaj aby przerwać nagrywanie.",
        playbackAll: "Odtwórz wszystko",
        playbackAllTooltip: "Odtwórz wszystkie nagrania.",
        submit: "Wyślij",
        submitTooltip: "Gdy jesteś gotowy/a, wyślij wszystkie nagrania do bazy danych.",
        reRecordTooltip: "Nagraj to słowo od nowa",
        playbackTooltip: "Odtwórz słowo",
        tutorial: {
            buttons: {
                back: "Cofnij",
                close: "Zamknij",
                last: "Koniec",
                next: "Następne",
                skip: "Pomiń"
            },
            step0: {
                title: 'Lista słów',
                text: "Tu się pojawia lista słów do nagrania. Ta strona na tym polega, że nagrywamy ludzi polskojęzycznych wymawiających słowa po Polsku, aby obcokrajowcy uczący się Polskiego mogli ćwiczyć swój słuch tymi nagrywaniami."
            },
            step1: {
                title: 'Nagrywaj',
                text: "Kliknij tu, aby rozpocząć nagrywanie. Potem znowu to kliknij, aby nagrać następne słowo."
            },
            step2: {
                title: 'Przerwać nagrywanie',
                text: 'Kliknij tu, aby przestać nagrywanie.',
            },
            step3: {
                title: 'Odtwórz pojedyńcze słowo',
                text: "Każde nagrane słowo może być odtworzone aby sprawdzić, że dobrze się nagrało."
            },
            step4: {
                title: 'Nagraj poszczególne słowo',
                text: "Jeśli należy poprawić nagranie jednego słowa, można tu kliknąć, aby nagrać go od nowa."
            },
            step5: {
                title: 'Odtwórz wszystkie',
                text: 'Można równierz odtworzyć wszystkie nagrania po kolei klikając tu.'
            },
            step6: {
                title: 'Wyślij',
                text: "Gdy jesteś gotowy/a, wyślij audio do bazy danych. Dzięki!"
            },
            step7: {
                title: 'Pomoc',
                text: "Jeśli kiedykolwiek zechcesz jeszcze raz obejrzeć ten tutorial, to kliknij tu by go uruchomić."
            }
        }
    },
    edit: {
        submit: 'Wyślij',
        playClip: 'Odtwórz kawałek'
    }
})