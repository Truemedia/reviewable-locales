/**
  * Extract empty messages from translations
  */
function emptyMsgs(sourceLocale = 'en', trans)
{
  return new Promise((resolve, reject) => {
    // Msg ids to review
    let msgids = []

    let sourceTrans = trans[sourceLocale]
    let targetLocales = Object.keys(trans)
    targetLocales.splice(targetLocales.indexOf(sourceLocale), 1)

    Object.entries(trans).map( ([locale, data]) => {
      if (locale != sourceLocale) {
        let {messages} = data

        Object.entries(messages).map( ([msgid, msgstring]) => {
          if (msgstring.trim() == '') { // No translation availble
            msgids.push(msgid)
          }
        })
      }
    })

    resolve({msgids, targetLocales, sourceTrans})
  })
}

module.exports = emptyMsgs
