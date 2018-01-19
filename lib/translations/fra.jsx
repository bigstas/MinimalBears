import counterpart from 'counterpart'

counterpart.registerTranslations('fra', {
    notfound: {
        title: "Your webpage was not found.",
        text: "Sad bear face. Check you input the URL correctly."
    },
    nav: {
        home: "Page principale",
        about: "A propos",
        train: "Entraîner",
        record: "Record",
        guest: "Guest",
        profile: "Profil",
        settings: "Settings"
    },
    home: {
        welcome: "Bienvenue",
        intro: " is an app that will help you learn new sounds in foreign languages.",
        continue: "Continue as guest",
        signIn: "Sign In",
        register: "Registrer"
    },
    about: {
        bearCaption: "Brown Bear has done thorough research",
        whatIs: {
            heading: "Qu'est-ce que c'est Minimal Bears?",
            p1: "C'est possible que vous ayez remarqué que les étudiants adultes de n'importe quelle langue parlent avec un accent étranger, même après des années d'apprentissage et de pratique. Ça peut être une barrière à la communication, et souvent peut faire paraître qu'ils parlent moins bien que dans la realité.",
            p2: "Minimal Bears est une application web qui vous aide à apprendre les sons des langues étrangères. C'est <strong>simple</strong>, c'est <strong>rapide</strong>, et il est <strong>prouvé scientifiquement</strong> que cela marche.",
            p3_start: "L'application est <strong>gratuite</strong> et <strong>open source</strong>, et vous pouvez commencer à l'utiliser ",
            p3_link: "tout de suite",
            p3_end: "."
        },
        howWorks: {
            heading: "Comment est-ce qu'elle fonctionne?",
            p1: `On apprend en jouant un jeu très simple. On nous montre une paire de mots sur l'écran qui diffèrent seulement d'un son - par exemple (en anglais) "mouse" et "mouth", ou "sheep" et "ship"; ou (en français) "ronger" et "ranger". Telle paire de mots s'appelle une <strong>paire minimale</strong>. On écoute un des deux mots, et il faut décider quel mot a été dit. Ensuite l'application montre quel est le mot correct.`,
            p2: `Les scientifiques ont appelé cette technique <strong>Entraînement Phonétique de Haute Variabilité</strong> (EPHV; HVPT en Anglais). Il était <a target="_blank" href="%(url1)s">déjà connu depuis longtemps</a> que c'était une méthode effective pour améliorer l'aptitude des gens <a target="_blank" href="%(url2)s">de touts niveaux d'apprentissage</a> à distinguer les sons proches d'une langue étrangère, et <a target="_blank" href="%(url3)s">par conséquent d'améliorer son accent</a>. Malgré les études sur ce sujet, cette technique <a target="_blank" href="%(url4)s">n'est pas très connue</a>, donc nous avons créé Minimal Bears pour combler cette lacune.`,
            p3: "Avec la pratique, il va vous être de plus en plus facile de recconaître les sons."
        },
        whyUse: {
            heading: "Pourquoi est-ce que je voudrais l'utiliser?",
            p1: "Cette vidéo démontre d'une façon humoristique le type de problème que nous essayons de résoudre. La vidéo est en anglais. (Vidéo produite par Jokhie Judy.)"
        },
        results: {
            heading: "Quelles sortes de résultats puis-j'attendre?",
            p1: `Avant l'entraînement. les étudiants de langues étrangères réussissent à distinguer les sons proches <a target="_blank" href="http://www.minimalbears.com/articles/rl_japanese_slightly_better_than_chance.pdf">à peine mieux que s'ils choisissent les mots au hasard</a>, même s'ils ont vécu dans le pays dans lequelle on parle cette langue plusieurs années. Cependent, une améloration majeure à été vérifiée <a target="_blank" href="http://www.minimalbears.com/articles/th_francophones.pdf">après seulement 90 minutes d'entraînement</a> selon cette méthode.`,
            p2: `L'amélioration a été vérifiée auprès des gens ayant des langues maternelles diverses, et apprenant des langues variées. La méthode a été prouvée pour des étudiants d'anglais ayant comme langue maternelle <a target="_blank" href="%(Korean)s">le coréen</a>, <a target="_blank" href="%(Japanese)s">le japonais</a>, <a target="_blank" href="%(Cantonese)s">le cantonais</a>, <a target="_blank" href="%(Mandarin)s">le mandarin</a>, <a target="_blank" href="%(French)s">le français</a>, <a target="_blank" href="%(Arabic)s">l'arabe</a>, <a target="_blank" href="%(German)s">l'aleman</a>, <a target="_blank" href="%(Portuguese)s">le portuguais</a>, <a target="_blank" href="%(Finnish)s">le finlandais</a>, <a target="_blank" href="%(Greek)s">le grec</a>, et <a target="_blank" href="%(Catalan)s">le catalan</a>; pour <a target="_blank" href="%(ChineseKorean)s">des étudiants de coréen ayant comme langue maternelle le chinois</a>; et <a target="_blank" href="%(EnglishArabic)s">des étudiants ayant comme langue maternelle l'anglais apprenant l'arabe</a>, <a target="_blank" href="%(EnglishKorean)s">le coréen</a>, et <a target="_blank" href="%(EnglishMandarin)s">le mandarin</a>.`,
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
        loading: 'Chargeant...'
    },
    train: {
        chooseLanguage: "Choose the language you want to train",
        chooseContrast: "Choose which contrast you want to train",
        changeLanguage: "Change language",
        sorryNoContrasts: "Sorry, we don't have enough audio ready for this language. We're working on it!",
        score: "Score",
        language: {
            eng: "Anglais",
            deu: "Aleman",
            pol: "Polonais"
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
                title: 'The Record button',
                text: "Press this to record. Then, press it to record the next thing."
            },
            step1: {
                title: 'The Stop button',
                text: 'Press this to stop recording.',
            },
            step2: {
                title: 'Play back all',
                text: 'Play back all that you have recorded so far, in sequence.'
            },
            step3: {
                title: 'Submit',
                text: "When you're ready, submit the audio you have recorded."
            }
        }
    }
})