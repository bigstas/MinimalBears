import counterpart from 'counterpart'

counterpart.registerTranslations('eng', {
    general: {
        minbears: "Minimal Bears",
        article: "" /* articles are NOT REQUIRED in most languages, only for some e.g. Le Minimal Bears, El Minimal Bears, A Minimal Bears, Al (?) Minimal Bears */
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
        continue: "Try it out",
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
    loading: {
        loading: 'Loading...'
    },
    auth: {
        email: "Email:",
        username: "Username:",
        password: "Password:",
        confirmPassword: "Confirm password:",
        register: {
            joinTitle: "Join.",
            joining: "Joining allows you to keep track of your progress, contribute recordings, and receive suggestions for what you should practise next.",
            emailError: "invalid email address",
            usernameError: "username unavailable",
            passwordError: "password mismatch",
            languageError: "select your native language",
            joinButtonLabel: "Join now",
            loginLink: "Have an account? Log in.",
            tooltip: {
                title: "Why we ask this:",
                line1: "You can contribute to the project by recording your voice",
                line2: "saying words in your native language.",
                line3: "Knowing your native accent will allow us to",
                line4: "ask you for words in the appropriate language.",
                line5: "We do not share your data with anyone."
            }
        },
        login: {
            loginTitle: "Log in.",
            loggingIn: "Logging in allows you to save and view your progress.",
            emailError: "Please enter an email address.",
            passwordError: "Oops! Incorrect email address or password.",
            loginButtonLabel: "Sign In",
            joinLink: "Need an account? Join now."
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
        contrast: {
            1: {
                name: "ee/i",
                examples: {
                    0: "sheep/ship",
                    1: "read/rid",
                    2: "feast/fist"
                }
            },
            3: {
                name: "i/e",
                examples: {
                    0: "hill/hell",
                    1: "rid/red",
                    2: "middle/meddle"
                }
            },
            11: {
                name: "l/r", 
                examples: {
                    0: "law/raw",
                    1: "late/rate",
                    2: "light/right"
                }
            },
            2: {
                name: "s/th",
                examples: {
                    0: "mouse/mouth",
                    1: "sum/thumb",
                    2: "sing/thing"
                }
            }
        },
        progressLabel: {
            begin: "Begin",
            playAgain: "Listen again",
            next: "Next",
            goAgain: "Play again"
        },
        viewStats: "View Stats",
        correct: "Correct!",
        wrong: "Oops!"
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
        submit: "Submit",
        submitTooltip: "If you are ready, send all the audio to the database.",
        reRecordTooltip: "Re-record this word",
        playbackTooltip: "Play back",
        tutorial: {
            buttons: {
                back: "Back",
                close: "Close",
                last: "Done",
                next: "Next",
                skip: "Skip"
            },
            step0: {
                title: 'The word list',
                text: "Here is a list of words to record. The purpose of this page is to record native English speakers pronouncing words, so that second language learners of English can practice their listening skills with these recordings in the app."
            },
            step1: {
                title: 'The Record button',
                text: "Press this to record. Then, press it to record the next thing."
            },
            step2: {
                title: 'The Stop button',
                text: 'Press this to stop recording.',
            },
            step3: {
                title: 'Play back word',
                text: "Each word you've recorded can be played back individually to check that it's okay."
            },
            step4: {
                title: 'Re-record word',
                text: "If you think you need to correct it, you can re-record the word by pressing here."
            },
            step5: {
                title: 'Play back all',
                text: "You can also play back all that you've recorded so far, in sequence."
            },
            step6: {
                title: 'Submit',
                text: "When you're ready, submit the audio you have recorded."
            },
            step7: {
                title: 'Help',
                text: "If you ever want to run the tutorial again, just press this button."
            }
        }
    },
    edit: {
        submit: 'Submit',
        playClip: 'Play Clip'
    },
    suggest: {
        mainMessage: "On this page, you can suggest either new contrasts for a given language, or new word pairs for a given contrast. Please choose which you would like to suggest below.",
        contrasts: "contrasts",
        words: "words"
    }
})