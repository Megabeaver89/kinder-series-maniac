const bcrypt = require('bcryptjs')
const { SALT_ROUNDS_TEN } = require('../constants/saltRoundsForHash')

const hashPassword = async (password) => {
  const saltRounds = SALT_ROUNDS_TEN
  return bcrypt.hash(password, saltRounds)
}

const comparePassword = async (password, hash) => bcrypt.compare(password, hash)

module.exports = {
  hashPassword,
  comparePassword,
}
