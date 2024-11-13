const bcrypt = require('bcryptjs')
const { SALT_ROUNDS_TEN } = require('../constants/saltRoundsForHash')

const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS_TEN)

const comparePassword = async (password, hash) => bcrypt.compare(password, hash)

module.exports = {
  hashPassword,
  comparePassword,
}
