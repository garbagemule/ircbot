var S = require('string');
var u = require('../cmdutil');

/**
 * A timer command.
 *
 * The command takes a 'time string' and an optional message as its arguments.
 *
 * The time string is either an integer (denoting seconds), or a combination
 * of pairs of integers and unit letters. A few examples:
 *
 *   '1587'   - 1587 seconds (26 minutes and 27 seconds)
 *   '2m'     - 2 minutes
 *   '3m14s'  - 3 minutes and 14 seconds
 *   '1h2s'   - 1 hour and 2 seconds
 *   '1h2m3s' - 1 hour, 2 minutes, and 3 seconds
 *
 * Usage: !timer <time string> <message>
 */
var m = {
  timer: function(text, con, msg) {
    var args = u.args(text);
    if (args.length === 0) {
      u.out('Usage: !timer <time string> (<message>)');
      u.out('e.g. !timer 2m30s Hello, World!');
      return;
    }

    var seconds = m.stringToSeconds(args[0]);
    var message = (args.length === 1) ? 'Time\'s up!' : S(text).between(' ').s;
    
    setTimeout(m.trigger, seconds * 1000, message, con, msg);
    u.out('Timer scheduled for ' + m.secondsToString(seconds) + ' from now.', con, msg);
  },

  stringToSeconds: function(str) {
    var s = S(str);
    
    // If it's just a number, return the numeric value
    if (s.isNumeric()) {
      return s.toInt();
    }

    // Otherwise, parse the time string
    var total = 0;
    var parts = s.match(/\d+[hms]/gi);

    // Sum function for map-reduce
    var sum = function(a, b) {
      return a + b;
    };

    // Convert to seconds and calculate the sum
    return parts.map(m.partToSeconds).reduce(sum);
  },

  partToSeconds: function(s) {
    /*
     * By replacing all non-digits with the empty string, we're left with
     * just the digits (for 'num'). Conversely (for 'unit'), we replace all
     * the digits with the empty string and get just the unit.
     */
    var secs = parseInt(s.replace(/\D/g, ''));
    var unit = s.replace(/\d/g, '');

    // Units can be days, hours, minutes, or seconds (default)
    if (unit === 'd') secs *= 86400;
    if (unit === 'h') secs *= 3600;
    if (unit === 'm') secs *= 60;

    return secs;
  },

  secondsToString: function(total) {
    var days  = parseInt(total / 86400, 10);
    var hours = parseInt(total / 3600,  10) % 24;
    var mins  = parseInt(total / 60,    10) % 60;
    var secs  = parseInt(total % 60,    10);

    // 1 day, 2 days, etc.
    var format = function(amount, singular) {
      var res = amount + ' ' + singular;
      return (amount > 1) ? res + 's' : res;
    };

    // Only include the parts with non-zero values
    var parts = [];
    if (days)  parts.push(format(days,  'day'));
    if (hours) parts.push(format(hours, 'hour'));
    if (mins)  parts.push(format(mins,  'minute'));
    if (secs)  parts.push(format(secs,  'second'));

    // Join with commas
    return parts.join(', ');
  },

  trigger: function(text, con, msg) {
    if (msg.channel) {
      con.say(msg.channel, '(' + msg.nick + ') ' + text);
    } else {
      con.pm(msg.nick, text);
    }
  }
};

m.commands = {
  timer: m.timer
};

module.exports = m;
