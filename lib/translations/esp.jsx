import counterpart from 'counterpart'

counterpart.registerTranslations('esp', {
    example: {
        greeting: 'Hello %(name)s! How are you today?'
    },
    notfound: {
        title: "La página web no existe.",
        text: "¡Qué lástima! Verifica que has ingresado la url correctamente."
    },
    nav: {
        home: "Página Principal",
        about: "Sobre este programa",
        train: "Entrenamiento",
        record: "Grabar",
        guest: "Huésped",
        profile: "Perfil",
        settings: "Ajustes"
    },
    home: {
        welcome: "Bienvenido",
        intro: " es un programa que puede ayudarte a aprender sonidos en otros idiomas.",
        continue: "Continuar como huésped",
        signIn: "Acceder",
        register: "Registrarse"
    },
    about: {
        title: 'Minimal Bears: el programa web basada en la investigación que mejora tu acento.',
        whatIs: 'Que es Minimal Bears?',
        p1: {
            line1: 'Minimal Bears es una aplicación de web que utiliza una tecnica que se llama ',
            HVPT: 'Entrenamiento Fonético de Alta Variabilidad',
            line2: ' (HVPT) para ayudar a la gente a aprender los sonidos de idiomas extranjeros.'
        }
    },
    loading: {
        loading: 'Cargando...'
    },
    train: {
        chooseLanguage: "Elige el lenguage que quieres practicar",
        chooseContrast: "Elige el contraste que quieres practicar",
        changeLanguage: "Cambiar lenguage",
        sorryNoContrasts: "Lo siento, aún no tenemos bastante archivos de sonido para este lenguage. ¡Estamos trabajando en ello!",
        score: "Puntos",
        language: {
            1: "Inglés",
            2: "Alemán",
            3: "Polaco"
        },
        progressLabel: {
            begin: "Empezar",
            playAgain: "Escuchar de nuevo",
            next: "Siguiente",
            goAgain: "Practicar de nuevo"
        },
        correct: "¡Correcto!",
        wrong: "¡Ay ay ay!"
    },
    record: {
        startLabel: {
            record: "Grabar",
            done: "Acabar",
            next: "Siguiente",
            reRecordAll: "Grabar todo de nuevo",
            tooltip1: "Grabar todas las palabras,",
            tooltip2: "uno después el otro."
        },
        stopTooltip: "Haga clic aquí para parar de grabar.",
        playbackAll: "Escuchar todo",
        playbackAllTooltip: "Escuchar a todas las grabaciónes.",
        submit: "Enviar",
        submitTooltip: "Si eres listo, envia todas las grabaciónes al base de datos.",
        reRecordTooltip: "Grabar esta palabra de nuevo",
        playbackTooltip: "Escuchar a esta palabra"
    }
})