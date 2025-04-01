
const user = require('./user');
const match = require('./matches')
const teams = require('./teams');
const player = require('./player');
const contest= require('./contests')
const pool= require('./pools')
const duo= require('./duo')


module.exports = [
    user,
    match,
    teams,
    player,
    contest,
    pool,
    duo
]
