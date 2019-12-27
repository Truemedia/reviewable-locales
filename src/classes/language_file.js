const jsonfile = require('jsonfile')
const merge = require('deepmerge')
const PO = require('pofile');

class LanguageFile
{
  constructor(originalTrans = {}, generatedTrans = {})
  {
    this.trans = this.mergeTranslations(originalTrans, generatedTrans)
  }

  // Merge generated translations with original translations
  mergeTranslations(originalTrans, generatedTrans)
  {
    if (Object.keys(generatedTrans).length > 0) { // Merge
      return merge(originalTrans, generatedTrans)
    } else { // Nothing to merge
      return originalTrans
    }
  }

  /**
    * Generates a single JSON file containing translations for all locales
    * @return Promise
    */
  get json()
  {
    return jsonfile.writeFile('./dist/trans.json', this.trans)
  }

  /**
    * Generates multiple PO files (one per locale), overwriting any existing ones
    * @return Promise
    */
  get po()
  {
    return Promise.all(
      Object.keys(this.trans).map(locale => {
        return PO.load(`./translations/samples/${locale}.po`, (err, po) => {
          console.log(`a ${locale} file`, po)
        })
      })
    )
  }
}

module.exports = LanguageFile
