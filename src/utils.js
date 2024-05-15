const NUM_SKIN_TONES = 5
module.exports.NUM_SKIN_TONES = NUM_SKIN_TONES

module.exports.getRandomSkinTone = () => {
  return Math.round(Math.random() * (NUM_SKIN_TONES - 1))
}
