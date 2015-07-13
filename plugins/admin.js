var S = require('string');
var u = require('../cmdutil');

var m = {
  say: function(text, con, msg) {
    if (u.notadmin(msg)) return;
    var args = u.args(text);
    
    var channel = args[0];
    var message = args.slice(1).join(' ');

    if (channel[0] === '#' && message !== '') {
      con.say(channel, message);
    }
  },

  pm: function(text, con, msg) {
    if (u.notadmin(msg)) return;
    var args = u.args(text);
    
    var nick = args[0];
    var message = args.slice(1).join(' ');

    if (message !== '') {
      con.pm(nick, message);
    }
  }
};

m.commands = {
  'say': m.say,
  'pm': m.pm
};

module.exports = m;
