/**
 * A simple ping command.
 *
 * The bot responds with "Pong, <nick>" in the channel, or simply with "Pong"
 * in a private message.
 *
 * Usage: !ping
 */
var m = {
  ping: function(text, con, msg) {
    if (msg.channel) {
      con.say(msg.channel, 'Pong, ' + msg.nick);
    } else {
      con.pm(msg.nick, 'Pong');
    }
  },

  pong: function(text, con, msg) {
    if (msg.channel) {
      con.say(msg.channel, 'Pi.. Wait a minute..');
    } else {
      con.pm(msg.nick, 'No.');
    }
  }
};

m.commands = {
  'ping': m.ping,
  'pong': m.pong
};

module.exports = m;
