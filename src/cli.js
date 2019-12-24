#! /usr/bin/env node
require('dotenv').config()
const inquirer = require('inquirer')
const chalk = require('chalk')
const vuei18nPo = require('vuei18n-po')

// Helpers
const LanguageFile = require('./classes/language_file')
const TranslationConfig = require('./classes/translation_config')
const AWSTranslate = require('./plugins/aws_translate/')
const emptyMsgs = require('./plugins/empty_msgs')

// CLI helper
const yargs = require('yargs')
.usage("$0")
.option('locale', {
  "alias": "l",
  "default": "en",
  "describe": "Source locale used for translations",
  "type": "string"
})
.option('files', {
  "alias": "f",
  "default": 'src/translations/**/*.po',
  "describe": "Glob path to translation files (*.po)",
  "type": "string"
})
.help('h')
.alias('h', 'help')

// CLI args
let sourceLocale = yargs.argv.locale;
let filesPath = yargs.argv.files;
// Env file
const awsConfig = {
  accessKeyId: process.env.AWS_TRANSLATE_ID,
  secretAccessKey: process.env.AWS_TRANSLATE_SECRET,
  region: process.env.AWS_TRANSLATE_REGION,
}
let translateApi = new AWSTranslate(awsConfig, sourceLocale)
const log = console.log

let charsCount = chalk.bgCyan.bold('50 characters')

let pricingLink = chalk.magenta( chalk.underline('https://aws.amazon.com/translate/pricing/') )

inquirer
  .prompt([
    // Mode
    {
      type: 'list',
      message: 'Pick mode for reviewing translations',
      name: 'mode',
      choices: [
        {
          name: 'Manual (Review using PoEdit)',
          value: 'manual'
        },
        {
          name: 'Auto (Generate translations from API)',
          value: 'auto'
        }
      ]
    },
    // Confirm auto
    {
      type: 'input',
      name: 'consentApi',
      message: `AWS translate has costs per total character (See ${pricingLink}). \nCalculated ${charsCount}, if you would like to proceed, type the name of your source locale (${sourceLocale}) and press 'enter'`,
      when: (answers) => {
        return answers.mode == 'auto'
      }
    }
  ])
  .then(answers => { // Process translations
    let {mode} = answers
    if (mode == 'auto') { // Auto
      if (answers.consentApi !== sourceLocale) {
        throw new Error('Locale not confirmed by user, exiting')
      }

      vuei18nPo(new TranslationConfig(filesPath).json) // Convert PO files to translation object
        .then(trans => emptyMsgs(sourceLocale, trans))
        .then(languagePatch => translateApi.applyPatch(languagePatch))
        .then(trans => new LanguageFile(trans).json)
        .then(res => {
          log('Write complete')
        }).catch(error => console.error(error))
    } else { // Manual
      log('manual')
    }
  })
