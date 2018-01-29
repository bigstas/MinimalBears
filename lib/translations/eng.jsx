import counterpart from 'counterpart'

counterpart.registerTranslations('eng', {
    general: {
        minbears: "Minimal Bears"
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
        settings: "Settings",
        login: "Log in",
        logout: "Log out",
        register: "Sign up",
        moderation: "Moderation",
        contactUs: "Contact Us"
    },
    home: {
        welcome: "Welcome",
        intro: "<strong>Minimal Bears</strong> is an app that will help you learn new sounds in foreign languages.",
        continue: "Try it out",
        signIn: "Sign In",
        register: "Register",
        profile: {
            weekView: "Week view",
            monthView: "Month view",
            yearView: "Year view",
            allContrasts: "All contrasts",
            charts: {    
                pieChartTitle: "Number of practices by contrast for this period",
                barChartTitle: "Success rate by contrast for this period",
                performanceLegendLabel: "Performance",
                performanceYaxisLabel: "Success rate (percent)",
                practiceLegendLabel: "Practice",
                practiceYaxisLabel: "Practice (reps)",
                weekdays: {
                    0: 'Sunday',
                    1: 'Monday',
                    2: 'Tuesday',
                    3: 'Wednesday',
                    4: 'Thursday',
                    5: 'Friday',
                    6: 'Saturday'
                },
                months: {
                    0: 'Jan',
                    1: 'Feb',
                    2: 'Mar',
                    3: 'Apr',
                    4: 'May',
                    5: 'Jun',
                    6: 'Jul',
                    7: 'Aug',
                    8: 'Sep',
                    9: 'Oct',
                    10: 'Nov',
                    11: 'Dec'
                },
                overall: "overall"
            }
        }
    },
    about: {
        bearCaption: "Brown Bear has done thorough research",
        whatIs: {
            heading: "What is Minimal Bears?",
            p1: "You may have noticed that adult learners of a language speak with a foreign accent, even after many years of learning and practice. This can be a barrier to communication, and often makes them seem less fluent than they really are.",
            p2: "Minimal Bears is a web app that helps you learn the sounds of a foreign language. It's <strong>simple</strong>, it's <strong>quick</strong>, and it's <strong>scientifically proven</strong> to be effective.",
            p3_start: "The app is <strong>free</strong> and <strong>open-source</strong>, and you can start using it ",
            p3_link: "right now",
            p3_end: "."
        },
        howWorks: {
            heading: "How does it work?",
            p1: `You learn by playing a simple game. You are presented with a pair of words that differ only in one sound &ndash; for example "mouse"/"mouth", "sheep"/"ship", or "will"/"well". Such a pair of words is called a <strong>minimal pair</strong>. You hear one of the words being said, and have to decide which one it was. You then get immediate feedback about the correct answer.`,
            p2: `Scientists have called this technique <strong>High Variability Phonetic Training</strong> (HVPT). This has been <a target="_blank" href="%(url1)s">known for some time</a> to be an effective way to improve people's ability to distinguish similar sounds in a foreign language, <a target="_blank" href="%(url2)s">regardless of their level of proficiency</a>, and <a target="_blank" href="%(url3)s">improve their accent as a result</a>. Despite the research, this technique is <a target="_blank" href="%(url4)s">not well-known</a>, and we designed Minimal Bears to fill this gap.`,
            p3: "As you practise, you will find it easier and easier to recognise the sounds."
        },
        whyUse: {
            heading: "Why might I want to use it?",
            p1: "This video provides a humorous demonstration of the kinds of problems we are trying to solve. (Video produced by Jokhie Judy.)"
        },
        results: {
            heading: "What results can I expect?",
            p1: `Prior to training, learners often perform <a target="_blank" href="http://www.minimalbears.com/articles/rl_japanese_slightly_better_than_chance.pdf">barely better than chance</a> at distinguishing similar sounds in a foreign language, even if they've lived in the target language community for several years.{/*TODO link*/} Significant improvements have been verified <a target="_blank" href="http://www.minimalbears.com/articles/th_francophones.pdf">within 90 minutes of training</a>.`,
            p2: `The effect has been verified for speakers and learners of many different languages, including <a target="_blank" href="%(Korean)s">Korean-</a>, <a target="_blank" href="%(Japanese)s">Japanese-</a>, <a target="_blank" href="%(Cantonese)s">Cantonese-</a>, <a target="_blank" href="%(Mandarin)s">Mandarin-</a>, <a target="_blank" href="%(French)s">French-</a>, <a target="_blank" href="%(Arabic)s">Arabic-</a>, <a target="_blank" href="%(German)s">German-</a>, <a target="_blank" href="%(Portuguese)s">Portuguese-</a>, <a target="_blank" href="%(Finnish)s">Finnish-</a>, <a target="_blank" href="%(Greek)s">Greek-</a>, and <a target="_blank" href="%(Catalan)s">Catalan-speaking learners of English</a>; <a target="_blank" href="%(ChineseKorean)s">Chinese learners of Korean</a>; and <a target="_blank" href="%(EnglishArabic)s">English-speaking learners of Arabic</a>, <a target="_blank" href="%(EnglishKorean)s">Korean</a>, and <a target="_blank" href="%(EnglishMandarin)s">Mandarin</a>.`,
            p3: `Researchers have found that people trained by this method have long-term improvements that only diminish very slightly over time. One team found that learners performed significantly better, <a target="_blank" href="%(sixMonths)s">even when tested 6 months later</a>, without any training in the interim.`,
            p4: `In addition to improvements in the perception and production of sounds, learners also reported <a target="_blank" href="%(confidence)s">increased confidence</a>, as in this quote from a learner:`,
            p5: `"I feel a lot more confidence compared to before training. I have more confidence saying it and listening to it. In general I have more confidence with the language."`,
            p6: `So regardless of your mother tongue, the language you are learning, or your <a target="_blank" href="%(proficiency)s">level of proficiency</a>, HVPT can help to improve your language skills.`
        },
        whyWorks: {
            heading: "Why does it work so well?",
            p1: "There are three key features that make HVPT such an effective method: <strong>lack of context</strong>, <strong>varied speakers</strong>, and <strong>immediate feedback</strong>. All of them are present in Minimal Bears.",
            context: {
                heading: "Lack of context",
                p1: `For most minimal pairs, we can use the context as a guide. For example, suppose a learner struggles to distinguish "mouse" and "mouth". If they heard someone say "You took the words right out of my mouth", they're unlikely to start looking for a mouse!`,
                p2: `As a result, simply engaging in conversation with native speakers of the language does not guarantee improvement.{/*TODO add link*/} With Minimal Bears, you can't rely on the context, which means you have to focus on the sounds to distinguish the words. This improves your listening skills.`
            },
            varied: {
                heading: "Varied speakers",
                p1: `If you only hear one person's pronunciation, you might struggle when listening to someone new. It would seem reasonable that listening to many people should be better than listening to just one. This common sense idea is also <a target="_blank" href="%(supported)s">supported by research</a>. With Minimal Bears, you can practise with recordings crowd-sourced from around the world.`
            },
            feedback: {
                heading: "Immediate feedback",
                p1: "The importance of quick, unambiguous feedback for learning is one of behavioural science's most well-supported findings. However, in a social environment, small errors in pronouncing or distinguishing foreign sounds are rarely corrected in the moment. Minimal Bears allows you to immediately perceive any errors, resulting in rapid progress."
            } 
        },
        whichLangs: {
            heading: "Which languages can I practise?",
            p1_start: "The range of languages on Minimal Bears is continually growing, thanks to the contributions from our members. Go to the ",
            p1_link: "Train page",
            p1_end: " to see what languages are currently available.",
            p2: "The site's interface is also becoming available in an increasing number of languages, so that more people can make use of it."
        },
        getStarted: {
            heading: "Great! How do I get started?",
            p1_start: "Go to the ",
            p1_link: "Train page",
            p1_end: ", choose your language and contrast to train, and get practising!"
        },
        contribute: {
            heading: "Is there a way I can contribute?",
            p1_start: "The audio for Minimal Bears is crowd-sourced, like Wikipedia. In order to expand the range of content (different contrasts from different languages, spoken by different people), we rely on words recorded by volunteers. If you'd like to contribute, go to the ",
            p1_link: "Record page",
            p1_end: " and get talking!"
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
            joining: "Joining allows you to keep track of your progress and contribute recordings.",
            emailError: "invalid email address",
            usernameError: "username unavailable",
            passwordError: "password mismatch",
            nativeLanguage: "Native Language:",
            languageError: "select your native language",
            noResults: "No results found",
            notInTheList: "My language is not in the list",
            joinButtonLabel: "Join now",
            loginLink: "Have an account? Log in.",
            tooltip: "Why we ask this:<br>You can contribute to the project by recording your voice<br>saying words in your native language.<br>Knowing your native language will allow us to<br>ask you for words in the appropriate language.<br>We do not share your data with anyone.",
            errors: {
                serverError: "We cannot connect to the server! Check your internet connection.",
                duplicateEmail: "This email address already exists in our system. If you've already registered, please log in!",
                duplicateUsername: "Oops! Somebody has already taken this username. Please choose another."
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
            eng: "English",
            deu: "German",
            pol: "Polish"
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
        preRecord: {
            heading: "Welcome to the Record Page",
            intro: "Here, you can record yourself saying words in your native language, so that learners of your language can practise their listening skills using your recordings.",
            contributions: "Minimal Bears is non-profit and crowd-sourced, and so it relies on contributions like yours for content for people to practise with.",
            tutorial: `If you press "continue", you will be given a tutorial on how to use the Record page. It takes approximately 2 minutes. You will not be able to leave the tutorial once you begin.`,
            buttonLabel: "Continue"
        },
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
        heading: "Moderation",
        thisRecording: "This recording: ",
        playAll: "Play",
        playClip: "Play clip",
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
        acceptFull: "Accept full",
        acceptSegment: "Accept clip",
        reject: "Reject"
    },
    contact: {
        heading: "Contact Us",
        text: "You can contact the developers using the following email addresses. Please don't hesitate to tell us about any bugs you find or any features you would like to see included.",
        programming: "Programming: ",
        artwork: "Artwork: "
    }
})