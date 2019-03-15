const { EventEmitter } = require('events');
const { Server }       = require('ws');

module.exports = class Laffey extends EventEmitter {}