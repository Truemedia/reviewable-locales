const jsonfile = require('jsonfile')
const merge = require('deepmerge')
const PO = require('pofile');

class LanguageFile
{
  constructor(filesPath, originalTrans = {}, generatedTrans = {}, destPath)
  {
    this.filesPath = filesPath
    this.originalTrans = originalTrans
    this.generatedTrans = generatedTrans
    this.destPath = destPath
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

  // Get merged translations
  get trans() {
    return this.mergeTranslations(this.originalTrans, this.generatedTrans)
  }

  /**
    * Generates a single JSON file containing translations for all locales
    * @return Promise
    */
  get json()
  {
    return jsonfile.writeFile(this.destPath, this.trans)
  }

  /**
    * Generates multiple PO files (one per locale), overwriting any existing ones
    * @return Promise
    */
  get po()
  {
    return Promise.all(
      Object.keys(this.generatedTrans).map(locale => {
        let filePath = this.filesPath.replace('*', locale)
        return PO.load(filePath, (err, po) => {
          Object.entries(this.generatedTrans[locale].messages).map(([msgctxt, msgstr]) => {
            Object.assign(po.items.find(item => {
              let key = (item.msgctxt != null) ? 'msgctxt' : 'msgid'
              return item[key] == msgctxt
            }), {msgctxt, msgstr})
          });
          return po.save(filePath, function (error) {
            // Handle err if needed
          });
        })
      })
    )
  }
}

module.exports = LanguageFile
