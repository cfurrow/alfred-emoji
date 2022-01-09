'use strict'
const emojiData = require('unicode-emoji-json/data-by-emoji')
const keywordSet = require('emojilib')

const emojiNames = Object.keys(emojiData).map(emoji => emojiData[emoji].name)
const emojiSlugs = Object.keys(emojiData).map(emoji => emojiData[emoji].slug)
const emojiNamesToEmojis = Object.keys(emojiData).reduce(
  (acc, emoji) => {
    acc[emojiData[emoji].name] = emoji
    return acc
  },
  {})

for (const emoji in emojiData) {
  emojiData[emoji].keywords = keywordSet[emoji]
}

module.exports.emojiData = emojiData
module.exports.emojiSlugs = emojiSlugs
module.exports.emojiNames = emojiNames

const findEmojiByName = (name) => {
  const emoji = emojiNamesToEmojis[name]
  return { ...emojiData[emoji], char: emoji }
}

module.exports.findEmojiByName = findEmojiByName
module.exports.libContainsEmoji = (name, term) => {
  const foundEmoji = findEmojiByName(name)
  return foundEmoji &&
   foundEmoji.keywords &&
   foundEmoji.keywords.some((keyword) => keyword.includes(term))
}
