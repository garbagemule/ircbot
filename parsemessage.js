var S = require('string');
var codes = require('./codes');

/**
 * The prefix of a message sits between the : and the first space.
 */
var getPrefix = function(s) {
  if (s.startsWith(':')) {
    return s.between(':', ' ');
  }
  return null;
};

/**
 * Returns the nick, user, and host in the message (format: nick!user@host).
 */
var getNickUserHost = function(s) {
  var nick = s.between( '', '!');
  var user = s.between('!', '@');
  var host = s.between('@');

  if (nick && user && host) {
    return {
      nick: nick,
      user: user,
      host: host
    };
  }
  return null;
};

/**
 * Create an object representing the given IRC message.
 */
var parseMessage = function(msg) {
  // The return value
  var message = {};

  // Create a string.js object to use for string operations
  var s = S(msg);

  // Check for prefix
  var prefix = getPrefix(s);
  if (prefix) {
    message.prefix = prefix.s;

    // Then check for nick!user@host or server.host.name
    var match = getNickUserHost(prefix);
    if (match) {
      message.nick = match.nick.s;
      message.user = match.user.s;
      message.host = match.host.s;
    } else {
      message.server = message.prefix;
    }

    // Because the prefix has been processed, trim it off
    s = s.between(' ');
  }

  // Grab the command (potentially just a number, i.e. no spaces)
  var command = s.between('', ' ');
  if (command.s == '') {
    command = s;
  }

  // Fetch the command name, if possible
  message.cmd = codes.replies[command.s] ||
                codes.errors[command.s]  ||
                command.s;

  /*
   * Time to parse parameters.
   *
   * We start by trimming off the command itself, and then continue to trim
   * off the space following it and the colon following that. The space and
   * the colon are both optional, but chomping is safe (no-op if no match).
   */
  s = s.chompLeft(command).chompLeft(' ').chompLeft(':').trimRight();
  message.s = s;
  message.args = s.s;

  /*
   * Special cases are handled explicitly here for convenience.
   *
   * PRIVMSG
   *   This is either a channel message or a private message. We parse the
   *   channel (or undefined), and the raw text.
   */
  switch (message.cmd) {
  case 'PRIVMSG':
    message.channel = s.startsWith('#') ? s.between('', ' ').s : undefined;
    message.s = s.between(':');
    message.args = message.s.s;
    break;
  }

  // Finally, return the message object
  return message;
};

module.exports = parseMessage;
