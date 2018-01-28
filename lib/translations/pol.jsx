import counterpart from 'counterpart'

counterpart.registerTranslations('pol', {
    notfound: {
        title: "Nie znaleziono tej strony.",
        text: "Niestety. Sprawdź, czy dobrze wpisano URL."
    },
    nav: {
        home: "Strona Główna",
        about: "O nas",
        train: "Ćwicz",
        record: "Nagraj się",
        guest: "Gość",
        profile: "Profil",
        settings: "Ustawienia",
        login: "Zaloguj",
        logout: "Wyloguj",
        register: "Zapisz się",
        moderation: "Moderacja",
        contactUs: "Skontaktuj się"
    },
    home: {
        welcome: "Witaj",
        intro: "<strong>Minimal Bears</strong> to aplikacja, która pozwoli Ci udoskonalić wymowę obcych języków.",
        continue: "Kontynuuj jako gość",
        signIn: "Wloguj",
        register: "Zapisz się"
    },
    about: {
        bearCaption: "Brązowy Miś zrobił swoje badania",
        whatIs: {
            heading: "Czym jest Minimal Bears?",
            p1: "Zapewne zauważyłeś, że dorośli uczący się języka zachowują swój akcent nawet po wielu latach nauki i praktyki. Może być to przeszkodą w komunikacji i sprawiać, że mówca wydaje się posługiwać językiem mniej biegle niż w rzeczywistości.",
            p2: "Minimal Bears jest aplikacją, która pomoże Ci w nauce wymowy obcego języka. Jest to <strong>proste</strong>, <strong>szybkie</strong> i, jak dowodzi nauka, niezwykle <strong>efektywne</strong>.",
            p3_start: "Aplikacja jest <strong>darmowa</strong> i o <strong>otwartym kodzie źródłowym</strong>. Możesz zacząć używać jej nawet ",
            p3_link: "w tej chwili",
            p3_end: "."
        },
        howWorks: {
            heading: "Jak to działa?",
            p1: `Uczysz się, grając w prostą grę. Usłyszysz parę słów, które różnią się od siebie tylko jednym dźwiękiem - na przykład angielskie ,,mouse’’ i ,,mouth’’, ,,sheep’’ i ,,ship’’ oraz ,,cat’’ i ,,cut’’, lub polskie ,,waż’’ i ,,wasz’’. Takie pary nazywają się <strong>parami minimalnymi</strong>. Po usłyszeniu jednego słowa z zestawienia zdecydujesz, które z nich zostało wypowiedziane. Zaraz po Twoim wyborze dostaniesz poprawną odpowiedź.`,
            p2: `Naukowcy nazwali tę technikę High Variability Phonetic Training (HVPT), czyli ,,trening fonetyczny o wysokiej częstotliwości’’. Jest <a target="_blank" href="%(url1)s">wiadomo od dłuższego czasu</a>, iż efektywnie poprawia zdolność rozróżniania podobnych dźwięków w języku obcym u użytkownika <a target="_blank" href="%(url2)s">bez względu na jego poziom biegłości</a>, i <a target="_blank" href="%(url3)s">w rezultacie udoskonala akcent</a>. Pomimo badań, ta technika <a target="_blank" href="%(url4)s">nie jest zbyt znana</a> i stworzyliśmy Minimal Bears z myślą o rozpowszechnieniu jej. `,
            p3: "Wraz z praktyką, rozróżnianie poszczególnych dźwięków będzie stawać się coraz łatwiejsze."
        },
        whyUse: {
            heading: "Dlaczego warto używać tę aplikację?",
            p1: "To wideo humorystycznie przedstawia przykład problemów, które próbujemy rozwiązać. (Wideo jest po angielsku i umieszczone na YouTube przez Jokhie Judy.)"
        },
        results: {
            heading: "Jakich rezultatów możesz oczekiwać?",
            p1: `Bez używania tej techniki, osoby uczące się języka często odróżniają podobne dźwięki w języku obcym <a target="_blank" href="http://www.minimalbears.com/articles/rl_japanese_slightly_better_than_chance.pdf">zaledwie odrobinę lepiej niż wybierając słowo na chybił-trafił</a> - nawet jeśli żyją przez wiele lat w obcym państwie i posługują się jego narodowym językiem. Lecz <a target="_blank" href="http://www.minimalbears.com/articles/th_francophones.pdf">już po 90 minutach</a> używania tej techniki badania wykazały znaczną poprawę.`,
            p2: `Rezultaty zostały zweryfikowane u mówców i uczących się wielu różnych języków, w tym u <a target="_blank" href="%(Korean)s">Koreańczyków</a>, <a target="_blank" href="%(Japanese)s">Japończyków</a>, <a target="_blank" href="%(Cantonese)s">Chiń</a>cz<a target="_blank" href="%(Mandarin)s">yków</a>, <a target="_blank" href="%(French)s">Francuzów</a>, <a target="_blank" href="%(Arabic)s">Arabów</a>, <a target="_blank" href="%(German)s">Niemców</a>, <a target="_blank" href="%(Portuguese)s">Brazylijczyków</a>, <a target="_blank" href="%(Finnish)s">Finów</a>, <a target="_blank" href="%(Greek)s">Greków</a> i <a target="_blank" href="%(Catalan)s">Katalończyków</a> uczących się języka angielskiego, <a target="_blank" href="%(ChineseKorean)s">Chińczyków uczących się języka koreańskiego</a> oraz <a target="_blank" href="%(EnglishArabic)s">ojczystych użytkowników angielskiego uczących się arabskiego</a>, <a target="_blank" href="%(EnglishKorean)s">koreańskiego</a> i <a target="_blank" href="%(EnglishMandarin)s">mandaryńskiego</a>.`,
            p3: `Naukowcy odkryli, że ta metoda ma długotrwały i pozytywny wpływ, który z czasem obniża się tylko nieznacznie. Jeden zespół naukowców wykazał, że uczący się wypadli znacznie lepiej <a target="_blank" href="%(sixMonths)s">nawet sześć miesięcy później</a> i bez używania HVPT w międzyczasie od tych, którzy tej techniki w ogóle nie używali.`,
            p4: `Oprócz polepszenia się odbierania i produkcji dźwięków, uczniowie zadeklarowali również <a target="_blank" href="%(confidence)s">większą pewność siebie</a>, tak jak w tym przypadku:`,
            p5: `,,Teraz czuję się bardziej pewny siebie niż przed praktyką. Mam więcej pewności w wymowie i słuchaniu. Ogólnie mam więcej pewności z językiem.’’`,
            p6: `Zatem bez względu na Twój język ojczysty, język, którego się uczysz oraz <a target="_blank" href="%(proficiency)s">poziom biegłości</a>, HVPT może Ci pomóc w szlifowaniu swoich umiejętności.`
        },
        whyWorks: {
            heading: "Dlaczego to działa tak dobrze?",
            p1: "Są trzy główne powody, które sprawiają, że ta metoda jest tak efektywna: <strong>brak kontekstu</strong>, <strong>zróżnicowani mówcy</strong> i <strong>natychmiastowa informacja zwrotna</strong>. Wszystkie trzy są podstawą Minimal Bears.",
            context: {
                heading: "Brak kontekstu",
                p1: `Dla większości par minimalnych, możemy użyć kontekstu jako przewodnika. Na przykład, przypuśćmy że uczeń ma problem z rozróżnieniem słów ,,mouse’’ (<em>mysz</em>) i ,,mouth’’ (<em>usta</em>), które w wymowie brzmią bardzo podobnie. Jeśli uczeń usłyszy ,,you took the words right of my mouth!’’ (<em>z ust mi to wyjąłeś!</em>), jest pewne, że nie chodzi tutaj o ,,mouse’’ (<em>mysz</em>).`,
                p2: `Zatem sama rozmowa z ojczystym użytkownikiem języka angielskiego nie gwarantuje poprawy wymowy i akcentu. Z Minimal Bears nie można polegać na kontekście, co oznacza, że musisz skupić się na rozróżnieniu dźwięków. To trenuje Twoje umiejętności słuchania.`
            },
            varied: {
                heading: "Zróżnicowani mówcy",
                p1: `Jeśli słyszysz wymowę tylko jednej osoby, prawdopodobnie będziesz miał trudność ze zrozumieniem kogoś nowego. Rozsądna jest zatem propozycja, że słuchanie wielu ludzi jest lepsze od słuchania jednego człowieka. To zdrowo rozsądkowe podejście jest także <a target="_blank" href="%(supported)s">poparte badaniami</a>. Z Minimal Bears, możesz wysłuchać nagrań z mówcami z wielu zakątków świata.`
            },
            feedback: {
                heading: "Natychmiastowa informacja zwrotna",
                p1: "To jak ważna jest szybka, jednoznaczna odpowiedź, jest jednym z najważniejszych i popartych solidnymi dowodami odkryć behawiorystyki. Jednakże, w kontekście towarzyskim, małe błędy w wymowie i odróżnianiu dźwięków są rzadko poprawiane w danym momencie. Minimal Bears pozwala na natychmiastowe zobaczenie każdego błędu, co skutkuje w bardzo szybkich postępach w nauce."
            } 
        },
        whichLangs: {
            heading: "Jakie języki można ćwiczyć?",
            p1_start: "Ilość języków w Minimal bears ciągle wzrasta dzięki udziałowi ludzi. Przejdź do ",
            p1_link: ",,Ćwicz’’",
            p1_end: " by zobaczyć, jakie języki są obecnie dostępne.",
            p2: "Interfejs naszej strony również pojawia się w coraz większej ilości języków aby aplikacja była dostępna dla szerszej publiczności."
        },
        getStarted: {
            heading: "Świetnie! Jak zacząć?",
            p1_start: "Przejdź do ",
            p1_link: ",,Ćwicz’’",
            p1_end: ", wybierz swój język oraz język kontrastujący i zacznij ćwiczyć!"
        },
        contribute: {
            heading: "Czy można w jakiś sposób pomóc w rozwoju aplikacji?",
            p1_start: "Nagrania w Minimal bears są brane od społeczności za pomocą crowdsourcingu, tak jak Wikipedia. Aby poszerzyć zawartość (różne kontrasty w różnych językach wymawiane przez zróżnicowanych mówców), polegamy na słowach nagranych przez wolontariuszy. Jeśli chciałbyś przyczynić się do rozwoju aplikacji, przejdź do ",
            p1_link: ",,Nagraj się’’",
            p1_end: " i nagraj swoje słowa."
        }
    },
    loading: {
        loading: 'Trwa ładowanie strony...'
    },
    auth: {
        email: "Adres emailowy:",
        username: "Nazwa użytownika:",
        password: "Hasło:",
        confirmPassword: "Potwierdź hasło:",
        register: {
            joinTitle: "Załącz się.",
            joining: "Joining allows you to keep track of your progress, contribute recordings, and receive suggestions for what you should practise next.",
            emailError: "Błędny adres emailowy.",
            usernameError: "Ta nazwa użytownika jest już w użytku. Proszę wybrać inną.",
            passwordError: "Twoje hasło musi być takie same w obu polach.",
            nativeLanguage: "Język ojczysty:",
            languageError: "select your native language",
            noResults: "No results found",
            notInTheList: "Mój język nie jest na liśćie",
            joinButtonLabel: "Załącz się",
            loginLink: "Masz już konto? Zaloguj.",
            tooltip: "Dlaczego my się pytamy: <br>You can contribute to the project by recording your voice saying words in your native language. <br>Knowing your native language will allow us to ask you for words in the appropriate language. <br>Nie dzielimy się Twoimi danami z nikim.",
            errors: {
                serverError: "We cannot connect to the server! Check your internet connection.",
                duplicateEmail: "This email address already exists in our system. If you've already registered, please log in!",
                duplicateUsername: "Oops! Somebody has already taken this username. Please choose another."
            }
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
            eng: "Angielski",
            deu: "Niemiecki",
            pol: "Polski"
        },
        progressLabel: {
            begin: "Zacznij",
            playAgain: "Usłysz znowu",
            next: "Następne",
            goAgain: "Zagraj jeszcze raz"
        },
        viewStats: "View Stats",
        correct: "Dobrze!",
        wrong: "Źle!"
    },
    norecord: {
        title: "Join the club first!",
        onlyLoggedIn: "Only logged-in users can create recordings. ",
        login: "Log in",
        loginReason: " to join the fun! :)",
        noAccount: "Don't have an account? ",
        signup: "Sign up",
        noSuchLanguage: "We aren't using your language as a training language yet.",
        noRecordingsNeeded: "We are using your language as a training language, but there is nothing that we need recorded at the moment."
    },
    record: {
        preRecord: {
            heading: "Witaj w Nagraj się",
            intro: "Możesz tutaj nagrać słówka w języku polskim tak, by osoby uczące się polskiego mogły ćwiczyć pary minimalne za pomocą Twojego nagrania.",
            contributions: "Minimal Bears jest non profitowe i zbiera dane za pomocą crowd-sourcingu, a zatem polega na Twoim wkładzie w zawartość. ",
            tutorial: `Po naciśnięciu Kontynuuj pojawi się instruktaż jak użyć opcji Nagraj się. Zajmie to około 2 minuty. Nie możesz opuścić instruktażu po tym, gdy już się zacznie.`,
            buttonLabel: "Dalej"
        },
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
        playAll: "Odtwórz całe",
        playClip: "Odtwórz kawałek",
        zoomIn: "Zbliż",
        zoomOut: "Oddal",
        acceptFull: "Akceptuj całość",
        acceptSegment: "Akceptuje kawałek",
        reject: "Odrzuć"
    }
})