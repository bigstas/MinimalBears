import counterpart from 'counterpart'

counterpart.registerTranslations('fra', {
    notfound: {
        title: "La page n'était pas trouvée.",
        text: "Dommage. Verifiez si vous avez correctement entré l'URL."
    },
    nav: {
        home: "Page principale",
        about: "A propos",
        train: "S'entraîner",
        record: "S'enregistrer",
        guest: "Invité",
        profile: "Profil",
        settings: "Paramètres",
        login: "Se connecter",
        logout: "Se déconnecter",
        register: "Créer votre compte",
        moderation: "Modération",
        contactUs: "Nous contacter"
    },
    home: {
        welcome: "Bienvenu",
        intro: " est une application qui vous aidera à apprendre de nouveaux sons dans des langues étrangères.",
        continue: "Continuer en tant qu'invité",
        signIn: "Se connecter",
        register: "Créer votre compte"
    },
    about: {
        bearCaption: "Ours Brun à fait des recherches approfondies",
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
            p3: `Les chercheurs ont trouvé que les gens entraînés par cette méthode voient une amélioration sur le long terme, qui ne diminuent que légèrement au fil du temps. Une équipe a trouvé que les étudiants ont obtenu de bien meilleurs résultats <a target="_blank" href="%(sixMonths)s">même lorsqu'ils ont été testés six mois après l'entraînement</a>, sans aucune révision.`,
            p4: `En plus des améliorations dans la perception et la production des sons, les étudiants ont aussi rapporté une <a target="_blank" href="%(confidence)s">augmentation de confiance</a>, comme montre cette citation d'un étudiant:`,
            p5: `"Je me sens plus confiant par rapport à avant l'entraînement. J'ai plus de confiance lorsque je parle et j'écoute [la langue]. En général, je me sens plus à l'aise avec la langue."`,
            p6: `Donc quelles que soient votre langue maternelle, la langue que vous apprenez, et votre <a target="_blank" href="%(proficiency)s">niveau de compétence</a>, EPHV peut vous aider à améliorer vos habilités linguistiques.`
        },
        whyWorks: {
            heading: "Pourquoi est-ce que ça marche si bien?",
            p1: "Il y a trois caractéristiques clés qui font que EPHV est une méthode tellement efficace: <strong>manque de contexte</strong>; <strong>locuteurs variés</strong>; et <strong>correction immédiate</strong>. Tous ces éléments sont présents dans Minimal Bears.",
            context: {
                heading: "Manque de contexte",
                p1: `Pour la plupart des paires minimales, on peut se guider selon le contexte. Par exemple, supposons qu'il y ait un étudiant qui a du difficulté en entendre la différence entre "sang" et "son". TODO: Finir!!`,
                p2: `Par conséquent, simplement s'engager dans les conversations avec des locuteurs de langue maternelle ne garantit pas l'amélioration de la perception des sons. En utilisant Minimal Bears, on ne peut pas dépendre du contexte, donc il est nécessaire d'écouter les sons mêmes pour les distinguer. Ça améliore votre compétences d'écoute.`
            },
            varied: {
                heading: "Locuteurs variés",
                p1: `Si on est habitué à la prononciation d'une seule personne, il est possible qu'écouter une autre soit encore difficile. Il semble raisonnable qu'écouter différentes personnes soit mieux qu'écouter juste une. Cette idée est <a target="_blank" href="%(supported)s">soutenu par la recherche</a>. Avec Minimal Bears, on peut pratiquer avec des enregistrements reçus de la part de volontaires de partout dans le monde.`
            },
            feedback: {
                heading: "Correction immédiate",
                p1: "L'importance d'une évaluation rapide et non ambigüe est une des découvertes les mieux argumentées de la science du comportement. Cependant, dans un environment social, les petites erreurs de prononciation ou de distinction des sons sont rarement corrigées sur le moment. Minimal Bears vous permet de percevoir les erreurs immédiatement, entrainant un progrès rapide."
            } 
        },
        whichLangs: {
            heading: "Quelle langues puis-je pratiquer?",
            p1_start: "L'éventail de langues disponibles sur Minimal Bears croît tout le temps, grâce aux contributions de nos membres. Allez à la ",
            p1_link: "page d'entraînement",
            p1_end: " pour voir quelles langues sont disponibles actuellement.",
            p2: "L'interface du site web est, elle aussi, disponible en de plus en plus langues, pour que plus de monde puisse l'utiliser."
        },
        getStarted: {
            heading: "Super! Comment est-ce que je peux commencer?",
            p1_start: "Allez à la ",
            p1_link: "page d'entraînement",
            p1_end: ", choisissez votre langue à pratiquer, et voilà!"
        },
        contribute: {
            heading: "Y-a-t-il un moyen de contribuer au projet?",
            p1_start: "L'audio pour Minimal Bears est reçu par participation volontaire, comme Wikipedia. Pour accroître la gamme de contenu (des contrastes des langues différentes, diction par des personnes différentes), nous dépendons des mots enregistrées par les volontaires. Si vous voulez contribuer, allez à la ",
            p1_link: "page d'enregistrement",
            p1_end: " et parlez!"
        }
    },
    loading: {
        loading: 'Chargement en cours...'
    },
    auth: {
        email: "Courrier électronique:",
        username: "Nom d'utilisateur:",
        password: "Mot de passe:",
        confirmPassword: "Confirmer votre mot de passe:",
        register: {
            joinTitle: "Créer un compte",
            joining: "Créer un compte vous permet de suivre votre progrès et participer aux enregistrements.",
            emailError: "courrier électronique invalide",
            usernameError: "nom d'utilisateur pas disponible",
            passwordError: "les deux mots de passe ne sont pas les mêmes",
            nativeLanguage: "Langue maternelle:",
            languageError: "selectionner votre langue maternelle",
            noResults: "Pas de résultat",
            notInTheList: "Ma langue n'est pas dans la liste",
            joinButtonLabel: "Créer mon compte",
            loginLink: "Vous avez déjà un compte? Connectez-vous.",
            tooltip: "Pourquoi nous vous le demandons:<br>Vous pouvez participer au projet en enregistrant des mots dans votre langue maternelle. Connaître votre langue maternelle nous aidera à vous demander les mots dans la langue appropriée. Nous ne partageons vos données avec personne.",
            errors: {
                serverError: "Nous ne pouvons pas vous connecter au serveur. Vérifiez votre connection internet.",
                duplicateEmail: "Cette addresse de courrier électronique existe déjà dans notre système. Si vous avez déjà un compte, connectez-vous avec vos identifiants.",
                duplicateUsername: "Oops! Somebody has already taken this username. Please choose another."
            }
        },
        login: {
            loginTitle: "Log in.",
            loggingIn: "Vous connecter vous permettera de sauvegarder et suivre votre progrès.",
            emailError: "Veuillez écrire votre addresse de courrier électronique.",
            passwordError: "Oups! Mot de passe ou addresse électronique incorrects.",
            loginButtonLabel: "Se connecter",
            joinLink: "Besoin d'un compte? Créez-en un."
        }
    },
    train: {
        chooseLanguage: "Choisissez la langue à pratiquer",
        chooseContrast: "Choisissez le contraste que vous souhaitez pratiquer",
        changeLanguage: "Modifier la langue",
        sorryNoContrasts: "Désolé, nous n'avons pas de fichiers audio disponibles pour cette langue. Nous y travaillons!",
        score: "Points",
        language: {
            eng: "Anglais",
            deu: "Alemand",
            pol: "Polonais"
        },
        progressLabel: {
            begin: "Commencer",
            playAgain: "Ecouter encore",
            next: "Suivant"
        },
        correct: "Correct!",
        wrong: "Oups!",
        donePanel: {
            playAgain: "Recommencer",
            viewStats: "Voir les statistiques",
            yourScore: "*Your score:",
            yourAverage: "*Your average:",
            statsTooltip: "Il faut se connecter pour voir les statistiques."
        }
    },
    norecord: {
        title: "Pour commencer, créez un compte!",
        onlyLoggedIn: "Seulement les utilisateurs connectés peuvent s'enregistrer.",
        login: "Connectez-vous",
        loginReason: "! :)",
        noAccount: "Vous n'avez pas de compte? ",
        signup: "Enregistrez-vous",
        noSuchLanguage: "Nous n'utilisons pas encore votre langue comme langue d'entraînement.",
        noRecordingsNeeded: "Nous utilisons votre langue comme langue d'entraînement, mais nous n'avons pas besoin d'enregistrements en ce moment."
    },
    record: {
        preRecord: {
            heading: "Bienvenu sur la page d'enregistrement",
            intro: "Ici, vous pouvez vous enregistrer en disant des mots dans votre langue maternelle afin que les étudiants de votre langue puissent améliorer leur capacité d'écoute grâce à vos enregistrements.",
            contributions: "Minimal Bears est un projet bénévole dévélopé grâce à l'aide de ses participants.",
            tutorial: `Si vous cliquez "continuer", vous serez guidé au travers des étapes pour vous enregistrer. Cela dure à peu près deux minutes.`,
            buttonLabel: "Continuer"
        },
        startLabel: {
            record: "S'enregistrer",
            done: "Prêt",
            next: "Suivant",
            reRecordAll: "Tout enregistrer de nouveau",
            tooltip1: "Enregistrer tous les mots,",
            tooltip2: "l'un après l'autre."
        },
        stopTooltip: "Cliquez ici pour arrêter l'enregistrement.",
        playbackAll: "Tout écouter",
        playbackAllTooltip: "Ecouter tous les enregistrements.",
        submit: "Valider",
        submitTooltip: "Si vous êtes prêt, envoyer tous les enregistrements à notre base de données.",
        reRecordTooltip: "Enregistrer de nouveau ce mot",
        playbackTooltip: "Ecouter",
        tutorial: {
            buttons: {
                back: "Précédent",
                close: "Fermer",
                last: "Prêt",
                next: "Suivant",
                skip: "Skip"
            },
            step0: {
                title: 'La liste de mots',
                text: "Voilà la liste de mots à enregistrer. L'objectif de cette page est d'enregistrer des français de langue maternelle prononcer des mots, afin que les étudiants de français puisse pratiquer leur capacité d'écoute en utilisant ces enregistrements dans l'application."
            },
            step1: {
                title: "Le bouton d'enregistrement",
                text: "Cliquez ici pour vous enregistrer. Ensuite, cliquez de nouveau pour l'enregistrement suivant."
            },
            step2: {
                title: "Le bouton d'arrêt",
                text: "Cliquez ici pour arrêter l'enregistrement.",
            },
            step3: {
                title: 'Ecoutez le mot',
                text: "Chaque mot que vous avez enregistré peut être écouté individuellement afin de vérifier qu'il est correct."
            },
            step4: {
                title: 'Enregistrer le mot de nouveau',
                text: "Si vous pensez qu'il est nécessaire de le corriger, vous pouvez enregister le mot de nouveau en cliquant ici."
            },
            step5: {
                title: 'Tout écouter',
                text: "Vous pouvez aussi écouter tout que vous avez enregistré jusqu'à maintenant, l'un après l'autre."
            },
            step6: {
                title: 'Valider',
                text: "Quand vous êtes prêt, validez vos enregistrements."
            },
            step7: {
                title: 'Aide',
                text: "Si vous souhaitez revoir le tutoriel, cliquez seulement sur ce bouton."
            }
        }
    },
    edit: {
        playAll: "Ecouter",
        playClip: "Ecouter l'extrait",
        zoomIn: "Zoomer",
        zoomOut: "Dézoomer",
        acceptFull: "Accepter l'enregistrement",
        acceptSegment: "Accepter l'extrait",
        reject: "Rejeter"
    },
    contact: {
        heading: "Contactez-nous",
        text: "You can contact the developers using the following email addresses. Please don't hesitate to tell us about any bugs you find or any features you would like to see included.",
        programming: "Programming: ",
        artwork: "Artwork: "
    }
})