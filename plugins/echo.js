var u = require('../cmdutil');

/**
 * A simple echo command.
 *
 * The bot will echo whatever follows the command, either directly in the
 * channel, or in a private message.
 *
 * Usage: !echo <text>
 */
var m = {
  pm: function(text, con, msg) {
    u.out(text, con, msg);
  }
};

m.commands = {
  'echo': m.pm
};

module.exports = m;
