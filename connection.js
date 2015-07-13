var events = require('events');
var net = require('net');

var parseMessage = require('./parsemessage');

var create = function(options) {
  console.log('Created connection for ' + options.host + ':' + options.port);
  
  // Make sure 'user' and 'name' are defined
  options.user = options.user || options.nick;
  options.name = options.name || options.nick;

  var evtemit = new events.EventEmitter();
  var cmdemit = new events.EventEmitter();

  var socket = undefined;
  var ready = false;

  /*
   * The main data listener.
   *
   * This listener emits a 'connected' event when the rpl_welcome message
   * has been received. It also responds to PING messages, and emits events
   * for channel messages, private messages, and commands.
   */
  var onData = function(data) {
    var msg = parseMessage(data);
    if (options.verbose) console.log('> ' + msg.cmd);

    switch (msg.cmd) {
    case 'rpl_welcome':
      con.info('Received rpl_welcome, flagging ready...');
      ready = true;
      evtemit.emit('connected', con);
      break;

    case 'PING':
      con.info('PING? PONG!');
      con.send('PONG ' + msg.args);
      evtemit.emit('ping', con, msg);
      break;

    case 'PRIVMSG':
      if (msg.channel) {
        con.info('[' + msg.channel + '] ' + msg.nick + ': ' + msg.args);
        evtemit.emit('channelmessage', con, msg);
      } else {
        con.info('[PM] ' + msg.nick + ': ' + msg.args);
        evtemit.emit('privatemessage', con, msg);
      }
      
      if (msg.s.startsWith('!')) {
        if (msg.s.contains(' ')) {
          var event = msg.s.between('', ' ').s;
          var text = msg.s.between(' ').s;
          cmdemit.emit(event, text, con, msg);
        } else {
          cmdemit.emit(msg.args, '', con, msg);
        }
      }      
      break;

    default:
      evtemit.emit('unknown', con, msg);
      break;
    }
  }

  /*
   * The connection object contains functions for establishing the connection
   * and sending raw messages to the server. Convenience functions exist for
   * joining and parting channels, 'speaking' in a channel, and sending private
   * messages.
   *
   * Functions also exist for logging purposes (info, warning, error), and for
   * managing event listeners (on, once, removeListener).
   */
  var con = {
    options: options,

    connect: function() {
      con.info('Connecting...');
      
      socket = net.connect(options, function() {
        con.info('Sending NICK and USER messages...');
        
        con.send('NICK ' + con.options.nick);
        con.send('USER ' + con.options.user + ' 0 * :' + con.options.nick);

        socket.on('data', onData);
      });
    },

    send: function(msg) {
      if (options.verbose) console.log('< ' + msg);
      socket.write(msg + '\r\n');
    },

    join: function(channel) {
      con.info('Joining channel ' + channel);
      con.send('JOIN ' + channel);
    },

    part: function(channel) {
      con.info('Parting channel ' + channel);
      con.send('PART ' + channel);
    },

    say: function(channel, msg) {
      con.info('Saying in ' + channel + ': ' + msg);
      con.send('PRIVMSG ' + channel + ' :' + msg);
    },

    pm: function(name, msg) {
      con.info('Sending private message to ' + name + ': ' + msg);
      con.send('PRIVMSG ' + name + ' :' + msg);
    },

    on: function(event, callback) {
      if (event[0] === '!') {
        cmdemit.on(event, callback);
      } else {
        evtemit.on(event, callback);
      }
    },

    once: function(event, callback) {
      if (event[0] === '!') {
        cmdemit.once(event, callback);
      } else {
        evtemit.once(event, callback);
      }
    },

    removeListener: function(event, callback) {
      if (event[0] === '!') {
        cmdemit.removeListener(event, callback);
      } else {
        evtemit.removeListener(event, callback);
      }
    },

    info: function(msg) {
      console.log('[INFO] ' + msg);
    },

    warning: function(msg) {
      console.log('[WARNING] ' + msg);
    },

    error: function(msg) {
      console.log('[ERROR] ' + msg);
    }
  };

  return con;
};

module.exports = {
  create: create
};
