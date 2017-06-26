import counterpart from 'counterpart'

counterpart.registerTranslations('lit', {
    example: {
        greeting: 'Hello %(name)s! How are you today?'
    },
    notfound: {
        title: "Tinklo puslapis nerasta.",
        text: "Sad bear face. Check you input the URL correctly."
    },
    nav: {
        home: "Pagrindinis Puslapis",
        about: "Apie šią programą",
        train: "Treniruotis",
        record: "Įrašyti",
        guest: "Svečias",
        profile: "Profilis",
        settings: "Nustatymai"
    },
    home: {
        welcome: "Svieki",
        intro: " yra programa, kuri padės jums išmokyti garsus užsenio kalbomis.",
        continue: "Tęsti be registracijos",
        signIn: "Prisijungti",
        register: "Įregistruoti"
    },
    about: {
        title: 'Minimal Bears: tyrimais paremta programa, kuri padės tau tobulinti akcentus užsenio kalbose.',
        whatIs: 'Kas yra Minimal Bears?',
        p1: {
            line1: 'Minimal Bears is a web app that uses a technique known as ',
            HVPT: 'High Variability Phonetic Training',
            line2: ' (HVPT) to help people learn the sounds of a foreign language.'
        }
    },
    loading: {
        loading: 'Prašom palaukti...'
    },
    train: {
        chooseLanguage: "Pasirinkite kalbą, kuri norėtumete praktikuoti",
        chooseContrast: "Pasirinkite kontrastą, kuri norėtumete praktikuoti",
        changeLanguage: "Pakeisti kalbą",
        sorryNoContrasts: "Atsiprašau, ne turime pakankamai šios kalbos garso failų. Netrukus ten bus!",
        score: "Puantai",
        language: {
            1: "Anglų",
            2: "Vokiečių",
            3: "Lenkų"
        },
        contrast: {
            1: "ee/i",
            3: "i/e",
            11: "l/r", 
            2: "s/th"
        },
        progressLabel: {
            begin: "Pradėti",
            playAgain: "Paklausyti dar kartą",
            next: "Sekantis",
            goAgain: "Praktikuoti dar kartą"
        },
        correct: "Teisingai!",
        wrong: "Oi!"
    },
    record: {
        startLabel: {
            record: "Įrašyti",
            done: "Gatavas",
            next: "Sekantis",
            reRecordAll: "Įrašyti visą iš naujo",
            tooltip1: "Įrašyti visus žodžius,",
            tooltip2: "vieną po kito."
        },
        stopTooltip: "Paspauskite čia tam pertraukti įrašyti.",
        playbackAll: "Atkurti visus",
        playbackAllTooltip: "Atkurti visus garso failus.",
        submit: "Pateikti",
        submitTooltip: "Jeigu esi paruoštas, siųsk visus garso failus į duomenų bazę.",
        reRecordTooltip: "Įrašyti šį žodį iš naujo",
        playbackTooltip: "Atkurti šį žodį",
        tutorial: {
            buttons: {
                back: "Atgal",
                close: "Uždaryti",
                last: "Baigti",
                next: "Pirmyn",
                skip: "Praleisti"
            },
            step0: {
                title: 'The Record button',
                text: "Press this to record. Then, press it to record the next thing."
            },
            step1: {
                title: 'Pertraukti',
                text: 'Press this to stop recording.',
            },
            step2: {
                title: 'Play back all',
                text: 'Play back all that you have recorded so far, in sequence.'
            },
            step3: {
                title: 'Siųsti į duomenų bazę',
                text: "When you're ready, submit the audio you have recorded."
            }
        }
    }
})