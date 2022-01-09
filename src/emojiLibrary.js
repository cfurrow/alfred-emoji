'use strict'
const orderedEmoji = require('unicode-emoji-json/data-ordered-emoji')
const emojiData = require('unicode-emoji-json')
const keywordSet = require('emojilib')
const emojiNames = orderedEmoji.map(emoji => emojiData[emoji].name)
const emojiSlugs = orderedEmoji.map(emoji => emojiData[emoji].slug)

for (const emoji in emojiData) {
  emojiData[emoji].keywords = keywordSet[emoji]
}

const emojiByName = {}
for (const emoji in emojiData) {
  const emojiName = emojiData[emoji].name
  const emojiSlug = emojiData[emoji].slug

  const emojiObj = emojiData[emoji]
  emojiObj.char = emoji

  // TODO: do I need both name and slug?
  emojiByName[emojiName] = emojiObj
  emojiByName[emojiSlug] = emojiObj
}

module.exports.emojiData = emojiData
module.exports.emojiSlugs = emojiSlugs
module.exports.emojiNames = emojiNames
module.exports.lib = emojiByName
module.exports.libContainsEmoji = (name, term) => {
  return emojiByName[name] &&
   emojiByName[name].keywords &&
   emojiByName[name].keywords.some((keyword) => keyword.includes(term))
}
