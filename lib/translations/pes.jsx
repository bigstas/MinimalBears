import counterpart from 'counterpart'

counterpart.registerTranslations('far', {
    nav: {
        home: "صفحه نخست",
        about: "در باره این برنامه",
        train: "مشق",
        record: "ضبط",
        guest: "مهمان",
        profile: "پروفایل",
        settings: "تنظیمات"
    },
    notfound: {
        title: "صفحه وب کشف نشد",
        text: "Sad bear face. Check you input the URL correctly."
    },
    home: {
        welcome: "خوش آمدید",
        intro: ".یک برنامه است که مردان را کمک می کند که صداها زبان خارجی را یاد بگیرند ",
        continue: "امتحان کن",
        signIn: "ورود",
        register: "ثبت نام"
    },
    about: {
        bearCaption: "Brown Bear has done thorough research",
        whatIs: {
            heading: "Minimal Bears چیست؟",
            p1: "ممکن است متوجه شده باشید که زبان‌آموزان بزرگسال یک زبان که با یک لهجه خارجی صحبت می کنند، حتی پیش از سال‌ها تحصیل و تمرین با مشکلات زیادی موجه هستند. این مسئله گاهی اوقات می تواند یک مانع در ارتباط قلمداد شد و اغلب باعث می شود که توانایی گفتاری آنخا کمتر از آنچه که هست، به نظر برسد.",
            p2: "Minimal Bears یگ اپلیکشن تحت وب است که به شما کمک می کند تلفظ یک زبان خارجی را بیاموزید. این برنامه <strong>ساده</strong>، <strong>سریع</strong> و <strong>صحت علمی</strong>  آن قبلا به اثبات رسیده است.",
            p3_start: "این برنامه یک  <strong>منبع در دسترس</strong> و <strong>رایگان</strong> می باشد و شما می توانید ",
            p3_link: "هم اکنون",
            p3_end: " از آن استفاده کنید."
        },
        howWorks: {
            heading: "این برنامه چطور کار می کند؟",
            p1: `شما این برنامه را به شکل یک بازی ساده با جفت کلماتی که تنها در یک آوا با هم متفاوت هستند می آموزید. برای مثل "sheep" و "ship" یا "will" و "well". به چنین جفت کلماتی minimal pair \فته وی شود. شما یکی از کلماتی گفته شده را می شنوید و سپس تصمیم می گیرید که کدام یک بوده است. و در ادامه بازخورده سریعی از پاسخ صحیح دریافت خواهید کرد.`,
            p2: `دانشمندان این تکنیک را آموزش پیشرفته تغییر پذیری آوایی یا High Variability Phonetic Training (HVPT) نامیده‌اند. این آموزش <a target="_blank" href="%(url1)s">برای مدت ها</a> به عنوان یک شیوه موثر برای بهبود توانایی افراد در تشخیص صداهای مشابه در یک زبان خارجی، <a target="_blank" href="%(url2)s">فارغ از سطح مهارت</a> و <a target="_blank" href="%(url3)s">بهبود لهجه</a> آنها به عنوان نتیجه حاصل شده، شناخته شده است. علی رغم تحقیقات صورت گرفته این روش <a target="_blank" href="%(url4)s">کاملا شناخته شده نیست</a> و ما برنامه Minimal Bears را به منظور پر کردن این خلاء طراحی کرده‌ایم.`,
            p3: "هرقدر شما با این برنامه تمرین کنید، صداها را بتدریج آسانتر تشخیص خواهید داد."
        },
        whyUse: {
            heading: "چرا من می خواهم از این برنامه استفاده کنم؟",
            p1: "این ویدو نمایش ظنزآمیزی از انواع و اقسام مشکلاتی که ما با آنها سر وکار داریم فرامم می کند. (این ویدو وسیله Jokhie Judy تهیه شده بود.)"
        },
        results: {
            heading: "من چه انتظاری می توانم داشته باشم؟",
            p1: `پیش از آموزش، فراگیرانگ گاهنا به سختی شانس کافی را برای تشخیص صدای یک زبان خارجی در اختیاز دارند. حتی اگر آنها چندین سال در جامعه زبان مورد نظر زندگی کرده باشند. پیشرفت‌های قابل توجهی در آموزش ۹۰ دقیقه‌ای این برنامه تایید شده است.`,
            p_1: `Prior to training, learners often perform <a target="_blank" href="http://www.minimalbears.com/articles/rl_japanese_slightly_better_than_chance.pdf">barely better than chance</a> at distinguishing similar sounds in a foreign language, even if they've lived in target language community for several years.{/*TODO link*/} Significant improvements have been verified <a target="_blank" href="http://www.minimalbears.com/articles/th_francophones.pdf">within 90 minutes of training</a>.`,
            p2: `The effect has been verified for speakers and learners of many different languages, including <a target="_blank" href="%(Korean)s">Korean-</a>, <a target="_blank" href="%(Japanese)s">Japanese-</a>, <a target="_blank" href="%(Cantonese)s">Cantonese-</a>, <a target="_blank" href="%(Mandarin)s">Mandarin-</a>, <a target="_blank" href="%(French)s">French-</a>, <a target="_blank" href="%(Arabic)s">Arabic-</a>, <a target="_blank" href="%(German)s">German-</a>, <a target="_blank" href="%(Portuguese)s">Portuguese-</a>, <a target="_blank" href="%(Finnish)s">Finnish-</a>, <a target="_blank" href="%(Greek)s">Greek-</a>, and <a target="_blank" href="%(Catalan)s">Catalan-speaking learners of English</a>; <a target="_blank" href="%(ChineseKorean)s">Chinese learners of Korean</a>; and <a target="_blank" href="%(EnglishArabic)s">English-speaking learners of Arabic</a>, <a target="_blank" href="%(EnglishKorean)s">Korean</a>, and <a target="_blank" href="%(EnglishMandarin)s">Mandarin</a>.`,
            p3: `محققان متوجه شده افرادی که با این روش آموزش دیده‌اند، پیشرفت‌های بادوام‌تری کسب می کنند که در زمان بسیار کمی اتفاق می افتند. یک تیم تحقیقاتی متوجه شد که حتی زبان‌آموزانی که <a target="_blank" href="%(sixMonths)s">۶ ماه بعد</a> وبدون اینکه آموزشی در این خلال ببینند وقتی که از آنان آزمونی به عمل آمد به طور قابل ملاحظه‌ای بهتر عمل کردند. `,
            p4: `همچنانکه از یک زبان‌اموزشان نقل قول شده است، علاوه بر بهبود در درک و تلفط صحیح صداها، <a target="_blank" href="%(confidence)s">اعتماد</a> به نفس او نیز افزاسش یافت است.`,
            p_4: `(above) reference to the quote?`,
            p5: `"من نسبت به قبل از آموزش‌ام حالا اعتماد به نفس بیشتری دارم. و با اعتماد یه نفس بیشتری به گوینده گوش می دهم. به طور کلی اعتماد بنفس بیشتری نسبت به زبان دارم."`,
            p6: `بنابراین، صرفنظر از زبان مادریتان، <a target="_blank" href="%(proficiency)s">سطح مهارت</a> و زبانی که در حال یاد گرفتی آن هستید، HVPT می تواند به بهبود مهارت‌های زبانی شما کمک کند. `
        },
        whyWorks: {
            heading: "چرا این کار به خوبی انجام می شود؟",
            p1: "سه ویژگی کلیدی وجود دارد که HVPT را تبدیل به یک روش موژر می کند: <strong>عدم وجود زمینه</strong>، <strong>گویندگان گختلف</strong> و <strong>بازخورد فوری</strong>. همه آنها در Minimal Bears وجود دارند.",
            context: {
                heading: "عدم وجود زمینه",
                p1: `برای بیشتر جفت‌های حداقل می توانیم از زمینه به عنوان یک راهبما استفاده کنیم. به عنوان مثال، فرض کنید یک یاد گیرنده تلاش می کند تا "mouse" را از "mouth" تشخیص دهد. اگر کاربران بشنوند که کسی می گوید: »شما کلمات را درست از دهان (mouth) من شنیدید» غیر محتمل است که آنها بخواهند به دنبال موش (mouse) بگردند.`,
                p_1: `For most minimal pairs, we can use the context as a guide. For example, suppose a learner struggles to distinguish "mouse" and "mouth". If they heard someone say "You took the words right out of my mouth", they're unlikely to start looking for a mouse!`,
                p2: `ازآنجایی که تماس آسان در گفتگو با شخصی که به زبان مادری صحبت می کند تضمین کننده بهبود در یاد گیری یک زبان نیست. با Minimal Bears، شما نمی توانید روی زمینه تکیه کنید، بلکه به شما اجازه می دهیم که بر روی مهارت‌های شنیداری خود تمرکز کنید.`
            },
            varied: {
                heading: "گویندگان مختلف",
                p1: `اگر شما فقت تلفظ یک نفر را می شنوید، ممکن است همگان گوش دادن یه یک شخص جدید با مشکلاتی مواجه شوید. بنابراین به نظر منطقی می رسد که گوش دادن به افراد بیشتری بهتر از گوش دادن به یک نفر باشد. `,
                p_1: `If you only hear one person's pronunciation, you might struggle when listening to someone new. It would seem reasonable that listening to many people should be better than listening to just one. This common sense idea is also <a target="_blank" href="%(supported)s">supported by research</a>. With Minimal Bears, you can practise with recordings crowd-sourced from around the world.`
            },
            feedback: {
                heading: "بازخورد فوری",
                p1: "اهمیت بازخورد سریع و غیرمبهم برای یاد گیری یکی از یافته‌های مقبول و حمایت شده در علوم رفتاری است. با این حال، در یک محیط اجتماعی، اشتباهات کوچک در تلفظ یا تشخیص  صداهای خارجی به ندرت در لحظه اصلاح می شود. Minimal Bears به شما اجازه می دهد تا بلافاصله هر خطایی را درک کنید، که نتیجه آن یک پیشرفت سریع در یارگیری است."
            } 
        },
        whichLangs: {
            heading: "کدام زبان را می توانم تمرین کنم؟",
            p1_start: "به لطف مشارکت‌های گسترده، طیف وسیعی از زبان‌ها در Minimal Bears به طور مستمر در حال رشد است. برای دیدن اینکه چه زبان‌های در حال حاضر در دسترس هستند، یه ",
            p1_link: "صفحه تمرین",
            p1_end: " بروید.",
            p2: "رابط سایت نیز در تعداد بیشماری از زبان‌ها در دسترس هستند، به طوری که بهشتر مردم می تواند از آن استفاده کنند.",
        },
        getStarted: {
            heading: "عالی! چگونه می توانم شروع کنم؟",
            p1_start: "به ",
            p1_link: "صغحه تمرین",
            p1_end: " بروید. زبان را مترداف‌های خود را برای آموزش انتخاب و تمرین کنید."
        },
        contribute: {
            heading: "آیا راهی وجود دارد که من هم بتوانم در این برنامه مشارکت کنم؟",
            p1_start: "صداهایی قبلا برای Minimal Bears به مانند وبسایت ویکی‌پدیا جمع آوری شده است. به منظور گسترش طیف وسیعی از محتوا (متن‌های متفاوتی از زبان‌های مختلف که توسط افراد مختلف صحبت می شود)، ما به کلمات ثبت شده توسط داوطلبان تکیه می کنیم. اگر می جواهید مشارکت کنید، به ",
            p1_link: "ضبط ثبتی",
            p1_end: " بروید و صحبت کنید!"
        }
    },
    loading: {
        loading: '...لتفا صبر کنید'
    },
    train: {
        chooseLanguage: "لتفا زبان را امتحان کن",
        chooseContrast: "Choose which contrast you want to train",
        changeLanguage: "زبان را تغییر کن",
        sorryNoContrasts: "Sorry, we don't have enough audio ready for this language. We're working on it!",
        score: "نمره",
        language: {
            eng: "اینگلیسی",
            deu: "آلمانی",
            pol: "لخستانی"
        },
        contrast: {
            1: "ee/i",
            3: "i/e",
            11: "l/r", 
            2: "s/th"
        },
        progressLabel: {
            begin: "شروع کن",
            playAgain: "دوباره کوش کن",
            next: "بعد",
            goAgain: "دوباره تمرین کن"
        },
        correct: "!درست است",
        wrong: "!اشتباه"
    },
    record: {
        startLabel: {
            record: "Record",
            done: "Done",
            next: "بعد",
            reRecordAll: "Re-record All",
            tooltip1: "Record all the words,",
            tooltip2: "one after the other."
        },
        stopTooltip: "Click here to stop recording.",
        playbackAll: "Playback All",
        playbackAllTooltip: "Play all the audio.",
        submit: "Sumbit",
        submitTooltip: "If you are ready, send all the audio to the database.",
        reRecordTooltip: "Re-record this word",
        playbackTooltip: "Play back"
    }
})