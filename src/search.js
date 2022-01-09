'use strict'

const { emojiSlugs, emojiNames, libContainsEmoji } = require('./emojiLibrary')
const emojiLibrary = require('./emojiLibrary').lib
const modifiers = require('unicode-emoji-json/data-emoji-components')
const indexedModifiers = Object.values(modifiers)

let skinTone
let modifier

let verb = 'Copy'
let preposition = 'to clipboard'

const resetWordsForPasteByDefault = () => {
  verb = 'Paste'
  preposition = 'as snippet'
}

const setSkinToneModifier = (tone) => {
  skinTone = tone
  modifier = skinTone ? indexedModifiers[skinTone] : null
}

const addModifier = (emoji, modifier) => {
  const skinToneSupport = emoji.skin_tone_support
  if (!modifier || !skinToneSupport) return emoji.char

  /*
  * There are some emojis categorized as a sequence of emojis
  * Emoji ZWJ Sequence is a combination of multiple emojis which display as a single emoji
  * on supported platforms. These sequences are joined with a Zero Width Joiner character.
  *
  * https://emojipedia.org/emoji-zwj-sequence/
  */

  const zwj = new RegExp('‍', 'g') // eslint-disable-line prefer-regex-literals
  return emoji.char.match(zwj) ? emoji.char.replace(zwj, modifier + '‍') : emoji.char + modifier
}

const getIconName = (emoji, name) => {
  const skinToneSupport = emoji.skin_tone_support
  if (skinToneSupport && skinTone && skinTone >= 0 && skinTone < 5) {
    return `${name}_${skinTone}`
  }
  return name
}

const alfredItem = (emoji, name) => {
  const modifiedEmoji = addModifier(emoji, modifier)
  const icon = getIconName(emoji, name)
  return {
    uid: name,
    title: name,
    subtitle: `${verb} "${modifiedEmoji}" (${name}) ${preposition}`,
    arg: modifiedEmoji,
    autocomplete: name,
    icon: { path: `./icons/${icon}.png` },
    mods: {
      alt: {
        subtitle: `${verb} ":${emoji.slug}:" (${emoji}) ${preposition}`,
        arg: `:${emoji.slug}:`,
        icon: { path: `./icons/${name}.png` }
      },
      shift: {
        subtitle: `${verb} "${emoji}" (${name}) ${preposition}`,
        arg: emoji.char,
        icon: { path: `./icons/${name}.png` }
      }
    }
  }
}

const alfredItems = (names) => {
  const items = []
  names.forEach((name) => {
    const emoji = emojiLibrary[name]
    if (!emoji) return
    items.push(alfredItem(emoji, name))
  })
  return { items }
}

const all = () => alfredItems(emojiSlugs)

const libHasEmoji = (name, term) => {
  return libContainsEmoji(name, term)
}

const matches = (terms) => {
  return emojiNames.filter((name) => {
    return terms.every((term) => {
      return name.includes(term) || libHasEmoji(name, term)
    })
  })
}

// :thumbs up: => ['thumbs', 'up']
const parse = query => query.replace(/[:]/g, '').split(/\s+/)

module.exports = function search (query, skinTone, pasteByDefault = false) {
  if (pasteByDefault) resetWordsForPasteByDefault()

  setSkinToneModifier(skinTone)

  if (!query) return all()

  const terms = parse(query)

  return alfredItems(matches(terms))
}
