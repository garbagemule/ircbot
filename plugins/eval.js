var u = require('../cmdutil');

/**
 * A morbidly dangerous plugin that is reserved for testing purposes only.
 *
 * Everybody knows just how evil eval is, so let's not speak of this to anyone,
 * ever. The purpose of this plugin is simply to test instabilities, and to use
 * as a quick expression evaluator.
 *
 * Usage: !eval <expression>
 */
var m = {
  eval: function(text, con, msg) {
    if (u.notadmin(msg)) return;

    u.out(eval(text), con, msg);
  }
};

m.commands = {
  'eval': m.eval
};

module.exports = m;
