import counterpart from 'counterpart'

// taken from http://stackoverflow.com/questions/3191664/list-of-all-locales-and-their-short-codes
const localeMapper = {
    'en'    : 'eng', // may not be necessary...?
    'en-029': 'eng',
    'en-AU': 'eng',
    'en-BZ': 'eng',
    'en-CA': 'eng',
    'en-GB': 'eng',
    'en-IE': 'eng',
    'en-IN': 'eng',
    'en-JM': 'eng',
    'en-MY': 'eng',
    'en-NZ': 'eng',
    'en-PH': 'eng',
    'en-SG': 'eng',
    'en-TT': 'eng',
    'en-US': 'eng',
    'en-ZA': 'eng',
    'en-ZW': 'eng',
    'es-AR': 'esp',
    'es-BO': 'esp',
    'es-CL': 'esp',
    'es-CO': 'esp',
    'es-CR': 'esp',
    'es-DO': 'esp',
    'es-EC': 'esp',
    'es-ES': 'esp',
    'es-GT': 'esp',
    'es-HN': 'esp',
    'es-MX': 'esp',
    'es-NI': 'esp',
    'es-PA': 'esp',
    'es-PE': 'esp',
    'es-PR': 'esp',
    'es-PY': 'esp',
    'es-SV': 'esp',
    'es-US': 'esp',
    'es-UY': 'esp',
    'es-VE': 'esp',
    'pl-PL': 'pol',
    'zh-CN': 'chm',
    'zh-TW': 'chm', // to be made traditional characters in future
    'fa-IR': 'far',
    'ka-GE': 'geo',
    'de'   : 'deu', // may not be necessary...?
    'de-AT': 'deu',
    'de-CH': 'deu',
    'de-DE': 'deu',
    'de-LI': 'deu',
    'de-LU': 'deu',
    'hu-HU': 'hun',
    'lt-LT': 'lit',
    'ru-RU': 'rus'
}
    
let getLocale = function() {
    /* Return user locale.
     * This function is actually an entire copied module. I (Staś) went for just copying the source code as it's short, and it let me understand it better.
     */
    // default to null
    var lang = null
  
    if (navigator.languages) {
        // chrome does not currently set navigator.language correctly https://code.google.com/p/chromium/issues/detail?id=101138
        // but it does set the first element of navigator.languages correctly
        lang = navigator.languages[0]
    } else if (navigator.userLanguage) {
        // IE only
        lang = navigator.userLanguage
    } else {
        // as of this writing the latest version of firefox + safari set this correctly
        lang = navigator.language
    }
    return lang
} 

// Set language according to locale.
// If no locale is found, set default locale to 'eng'.
let locale = getLocale()
const threeLetterLocale = locale != null ? localeMapper[locale] : 'eng';
console.log("The three letter locale chosen is " + threeLetterLocale + " based on the locale " + locale)
counterpart.setLocale(threeLetterLocale)

const rtlLanguages = new Set(['far', 'ara'])

function getDirection(locale) {
    const result = rtlLanguages.has(locale) ? 'rtl' : 'ltr';
    return result
}

counterpart.onLocaleChange( (newLocale, oldLocale) => {
    // check text direction
    const oldDirection = getDirection(oldLocale)
    const newDirection = getDirection(newLocale)
    if (oldDirection !== newDirection) {
        // get the "content" div, which is written in index.html (the container for the whole app) 
        // and change its text direction style
        document.getElementById("content").style["direction"] = newDirection
    }
})