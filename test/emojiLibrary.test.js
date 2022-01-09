'use strict'

const { test } = require('tap')
const emojiLibrary = require('../src/emojiLibrary')

test('returns true when library contains the emoji name', (t) => {
  t.plan(1)
  const wasFound = emojiLibrary.libContainsEmoji('thumbs up', 'thumbs')
  t.ok(wasFound)
})

test('returns false when the library does not contain the emoji', (t) => {
  t.plan(1)
  const wasFound = emojiLibrary.libContainsEmoji('bax', 'bax')
  t.notOk(wasFound)
})
