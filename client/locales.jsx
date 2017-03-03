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
    'ru-RU': 'rus'
}
    
let getLocale = function() {
    /* Return user locale.
     * This function is actually an entire copied module. I (Staś) went for just copying the source code as it's short, and it let me understand it better.
     */
    var lang
  
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

let locale = getLocale()
console.log(locale)

// Try to get locale. 
// This will run once on startup and not run again.

let threeLetterLocale
Object.keys(localeMapper).forEach(function(key,index) {
    if (locale === key) {
        threeLetterLocale = localeMapper[key]
        console.log("The three letter locale chosen is " + threeLetterLocale + " based on the locale " + key)
        return
    }
    // key: the name of the object key
    // index: the ordinal position of the key within the object 
})

//Set language according to locale.
// If no locale is found, set default locale to 'eng'. The automatic default would be 'en', which would be unrecognised since we're using three-letter codes.
if (threeLetterLocale) {
    counterpart.setLocale(threeLetterLocale)
} else {
    counterpart.setLocale('eng')
}