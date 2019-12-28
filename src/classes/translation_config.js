const path = require('path')

class TranslationConfig
{
  constructor(globPath, msgDir = 'generated', msgFile = 'allInOne.json')
  {
    this.globPath = globPath
    this.msgDir = msgDir
    this.msgFile = msgFile
  }

  get messagesDir()
  {
    return path.join(process.cwd(), this.msgDir)
  }

  get messagesFile()
  {
    let {messagesDir} = this
    return path.join(messagesDir, this.msgFile)
  }

  get json()
  {
    let {globPath, messagesDir, messagesFile} = this

    return {
      po: [globPath],
      pluralRules: 'spec/data/out/choices.js',
      messagesFile,
      messagesDir
    }
  }
}

module.exports = TranslationConfig
