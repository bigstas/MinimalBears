import counterpart from 'counterpart'

counterpart.registerTranslations('chm', {
    example: {
        greeting: '你好, %(name)s! 你今天怎么样？'
    },
    nav: {
        home: "主页",
        about: "说明",
        train: "炼狱",
        record: "录音",
        guest: "客人",
        profile: "用户资料",
        settings: "设置"
    },
    notfound: {
        title: "没有这个网站。",
        text: "不好意思。请查看网址。"
    },
    home: {
        welcome: "欢迎光临",
        intro: " 是一件让你学习外语的发音的软件。",
        continue: "当客人继续",
        signIn: "签到",
        register: "注册"
    },
    about: {
        title: "Minimal Bears 是一件让你学习外语的发音的软件。",
        whatIs: "Minimal Bears 是什么？",
        HVPT: "HVPT"
    },
    loading: {
        loading: '请稍等一下...'
    },
    auth: {
        email: "Email:",
        username: "Username:",
        password: "密码:",
        confirmPassword: "Confirm password:",
        register: {
            joinTitle: "Join.",
            joining: "Joining allows you to keep track of your progress, contribute recordings, and receive suggestions for what you should practise next.",
            emailError: "Please provide a valid email address.",
            usernameError: "This username is already taken. Please choose another.",
            passwordError: "Your password must be the same in both fields.",
            joinButtonLabel: "Join now",
            loginLink: "Have an account? Log in."
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
        chooseLanguage: "你想练习哪种语言？",
        chooseContrast: "你想练习哪种发音区别？",
        changeLanguage: "改变语言",
        sorryNoContrasts: "可惜我们还没有这种语言的音频文件。我们正在解决这个问题！",
        score: "得分",
        language: {
            1: "英语",
            2: "德语",
            3: "波语"
        },
        contrast: {
            1: "ee/i",
            3: "i/e",
            11: "l/r", 
            2: "s/th"
        },
        progressLabel: {
            begin: "开始",
            playAgain: "再次听",
            next: "下词",
            goAgain: "再次玩"
        },
        correct: "对啊!",
        wrong: "错啦!"
    },
    record: {
        startLabel: {
            record: "录音",
            done: "完了",
            next: "下一个",
            reRecordAll: "所有重新录音",
            tooltip1: "把一切词语录音",
            tooltip2: "按照下面表示的顺序"
        },
        stopTooltip: "停止录音",
        playbackAll: "听",
        playbackAllTooltip: "听所有的录音",
        submit: "发到数据库",
        submitTooltip: "当你已经录完了，把所有录音发到数据库。",
        reRecordTooltip: "重新录音这个词语",
        playbackTooltip: "听这个词语",
        tutorial: {
            buttons: {
                back: "退步",
                close: "关闭",
                last: "懂啦",
                next: "进步",
                skip: "Skip"
            },
            step0: {
                title: '录音按钮',
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