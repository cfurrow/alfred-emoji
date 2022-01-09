'use strict'

// Based on https://stackoverflow.com/a/43808972/7979

const fs = require('fs')
const fontkit = require('fontkit')
const font = fontkit.openSync('/System/Library/Fonts/Apple Color Emoji.ttc').fonts[0]

const modifiers = require('unicode-emoji-json/data-emoji-components')
const indexedModifiers = Object.values(modifiers)
const emojiData = require('../src/emojiLibrary.js').emojiData

const saveIcon = (emoji, name) => {
  const glyph = emoji.glyphs[0].getImageForSize(64)
  fs.writeFileSync(`${process.env.PWD}/${name}.png`, glyph.data)
}

const addModifier = (emojiData, modifier) => {
  if (!modifier || !emojiData.skin_tone_support) return emojiData.char
  const zwj = new RegExp('‍', 'g') // eslint-disable-line prefer-regex-literals
  return emojiData.char.match(zwj) ? emojiData.char.replace(zwj, modifier + '‍') : emojiData.char + modifier
}

for (const emoji in emojiData) {
  try {
    const data = emojiData[emoji]
    const name = data.name
    const fontEmoji = font.layout(emoji)
    saveIcon(fontEmoji, name)

    if (data.skin_tone_support) {
      indexedModifiers.forEach((modifier, index) => {
        const modEmoji = font.layout(addModifier(data, modifier))
        saveIcon(modEmoji, `${name}_${index}`)
      })
    }
  } catch (e) {
    const name = emojiData[emoji] ? emojiData[emoji].name : 'unknown emoji'
    console.error('Could not generate icon for "%s": %s', name, e.message)
  }
}
