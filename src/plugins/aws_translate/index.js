const inquirer = require('inquirer')
const chalk = require('chalk')
const Table = require('cli-table3');
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

      // Locales table
      let localesTable = new Table({
        head: ['Target locales']
      })
      localesTable.push(...targetLocales.map(locale => [locale]));
      console.log(localesTable.toString());

      // Words table
      let wordsTable = new Table({
        head: ['Words']
      })
      wordsTable.push(...Object.values(subset).map(locale => [locale]));
      console.log(wordsTable.toString());

      // Stats table
      let totalWords = Object.entries(subset).length
      let totalChars = 0
      Object.values(subset).map(word => totalChars += word.length)

      let statsTable = new Table();
      statsTable.push(
        {'Locales': targetLocales.length},
        {'Words': totalWords},
        {'Characters': totalChars}
      )
      console.log(statsTable.toString());

      let charsTranslationCount = (totalChars * targetLocales.length)
      let charsCount = chalk.bgCyan.bold(`${charsTranslationCount} characters`)
      let pricingLink = chalk.magenta( chalk.underline('https://aws.amazon.com/translate/pricing/') )
      // Confirm auto
      return inquirer.prompt([
        {
          type: 'input',
          name: 'consentApi',
          message: `AWS translate has costs per total character (See ${pricingLink}). \nCalculated ${charsCount}, if you would like to proceed, type the name of your source locale (${this.sourceLocale}) and press 'enter'`
        }
      ]).then( (answers) => {
        if (answers.consentApi !== this.sourceLocale) {
          throw new Error('Locale not confirmed by user, exiting')
        }
        let {translateJSON} = new AWSTranslateJSON(
          this.awsConfig,
          this.supportedLocaleAlias(this.sourceLocale),
          targetLocales.map(locale => this.supportedLocaleAlias(locale))
        )
        return translateJSON({ messages: subset })
      })

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
