const jsonfile = require('jsonfile')

class LanguageFile
{
  constructor(trans)
  {
    this.trans = trans
  }

  // @return Promise
  get json()
  {
    return jsonfile.writeFile('./dist/trans.json', this.trans)
  }
}

module.exports = LanguageFile
