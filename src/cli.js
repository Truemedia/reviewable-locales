#! /usr/bin/env node
const inquirer = require('inquirer')
const chalk = require('chalk')
const log = console.log

let charsCount = chalk.bgCyan.bold('50 characters')
let sourceLocale = 'en'

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
      name: 'confirmAuto',
      message: `AWS translate has costs per total character (See ${pricingLink}). \nCalculated ${charsCount}, if you would like to proceed, type the name of your source locale (${sourceLocale}) and press 'enter'`,
      when: (answers) => {
        return answers.mode == 'auto'
      }
    }
  ])
  .then(answers => { // Process translations
    log('config', answers)
  })
