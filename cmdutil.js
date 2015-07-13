var admins = require('./cfg/admins')

var m = {
  /**
   * Returns false, if the user, host, and nick of the message match an admin,
   * true otherwise.
   */
  notadmin: function(msg) {
    return !admins.some(function(admin) {
      return msg.user === admin.user &&
             msg.host === admin.host &&
             msg.nick === admin.nick;
    });
  },

  /**
   * Create an array of the arguments in a message.
   */
  args: function(text) {
    return text.split(' ');
  },

  /**
   * Write to the channel or respond to a private message.
   */
  out: function(text, con, msg) {
    if (msg.channel) {
      con.say(msg.channel, text);
    } else {
      con.pm(msg.nick, text);
    }
  }
};

module.exports = m;
