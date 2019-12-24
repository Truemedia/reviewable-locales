const {AWSTranslateJSON} = require('aws-translate-json')
const translatorLocales = require('./translator_locales')

/**
  * Extract and translate reviewable subset of translations (language patch) via AWS translate
  */
class AWSTranslate
{
  constructor(awsConfig, sourceLocale)
  {
    this.awsConfig = awsConfig
    this.sourceLocale = sourceLocale
  }

  /**
    * Apply language patch in format compatable with API to generate translation object
    */
  applyPatch({msgids, targetLocales, sourceTrans}) {
    if (msgids.length > 0) {
      let {messages} = sourceTrans
      let subset = msgids.reduce((a, e) => (a[e] = messages[e], a), {});

      let {translateJSON} = new AWSTranslateJSON(
        this.awsConfig,
        this.supportedLocaleAlias(this.sourceLocale),
        targetLocales.map(locale => this.supportedLocaleAlias(locale)));
      return translateJSON({ messages: subset })
    } else {
      throw new Error('No translations to review (all translations provided fulfilled)')
    }
  }

  /**
    * Get equivalent supported locale alias for API
    */
  supportedLocaleAlias(locale) {
    let lang = locale.split('_')[0]
    let apiLocale = null

    if (translatorLocales.includes(locale)) {
      apiLocale = locale
    } else if (translatorLocales.includes(lang)) {
      apiLocale = lang
    }

    return apiLocale
  }
}

module.exports = AWSTranslate
