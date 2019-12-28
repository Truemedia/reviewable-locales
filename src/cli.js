#! /usr/bin/env node
require('dotenv').config()
const inquirer = require('inquirer')
const signale = require('signale')
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
  "default": 'src/translations/messages/*.po',
  "describe": "Glob path to translation files (*.po)",
  "type": "string"
})
.option('dest', {
  alias: 'd',
  default: './data/trans.json',
  describe: 'Destination for generate messages file',
  type: 'string'
})
.help('h')
.alias('h', 'help')

// CLI args
let sourceLocale = yargs.argv.locale;
let filesPath = yargs.argv.files;
let destPath = yargs.argv.dest;
// Env file
const awsConfig = {
  accessKeyId: process.env.AWS_TRANSLATE_ID,
  secretAccessKey: process.env.AWS_TRANSLATE_SECRET,
  region: process.env.AWS_TRANSLATE_REGION,
}
let translateApi = new AWSTranslate(awsConfig, sourceLocale)
const log = console.log

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
    }
  ])
  .then(answers => { // Process translations
    let {mode} = answers
    if (mode == 'auto') { // Auto
      let originalTrans = {}

      vuei18nPo(new TranslationConfig(filesPath).json) // Convert PO files to translation object
        .then(trans => {
          originalTrans = trans
          return emptyMsgs(sourceLocale, trans)
        })
        .then(languagePatch => translateApi.applyPatch(languagePatch))
        .then(generatedTrans => {
          let lf = new LanguageFile(filesPath, originalTrans, generatedTrans, destPath)
          return Promise.all([
            lf.json,
            lf.po
          ])
        })
        .then(() => {
          signale.success('Write complete')
        }).catch(error => console.error(error))
    } else { // Manual
      log('manual')
    }
  })
