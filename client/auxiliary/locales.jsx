import counterpart from 'counterpart'

// taken from http://stackoverflow.com/questions/3191664/list-of-all-locales-and-their-short-codes
const localeMapper = {
    'en'  : 'eng', 
    'eng' : 'eng',
    'es'  : 'esp',
    'esp' : 'esp',
    'pl'  : 'pol',
    'pol' : 'pol',
    'zh'  : 'cmn',
    'cmn' : 'cmn',
    'zho' : 'cmn',
    'fa'  : 'pes',
    'fas' : 'pes',
    'pes' : 'pes',
    'ka'  : 'kat',
    'kat' : 'kat',
    'de'  : 'deu',
    'deu' : 'deu',
    'fr'  : 'fra',
    'fra' : 'fra',
    'hu'  : 'hun',
    'hun' : 'hun',
    'lt'  : 'lit',
    'lit' : 'lit',
    'ru'  : 'rus',
    'rus' : 'rus'
}

let getLocale = function() {
    /* Return user locale.
     * This function is actually an entire copied module. I (Staś) went for just copying the source code as it's short, and it let me understand it better.
     */
    // default to null
    let lang = null
  
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
    // type checking
    if (typeof(lang) !== "string") {
	return "eng"
    }
    // remove country code, where applicable
    if (lang.includes('-')) {
	lang = lang.split('-')[0]
    }
    // lookup
    let locale = localeMapper[lang]
    return locale ? locale : 'eng'
}

counterpart.setLocale(getLocale())

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
