var async = require('async');
var fs = require('fs');

// IRC connection and plugin manager modules
var connection = require('./connection');
var pluginman = require('./pluginman');

/*
 * The config-file should at the very least contain an 'host' and 'port'
 * of the IRC server to connect to, as well as the 'nick' that the bot
 * should connect as.
 */
var options = require('./cfg/options');

// Create the IRC connection
var con = connection.create(options);

/*
 * By using a domain, we can listen for uncaught errors thrown from plugins
 * and log the error without crashing. While 'log and forget' is completely
 * terrible, it at least allows the bot to stay online in case of failure.
 *
 * TODO: Disable the plugin throwing errors, if possible..?
 */
var d = require('domain').create();
d.on('error', function(error) {
  con.error(error);
});

// We have to run our 'error-prone' code in a domain task
d.run(function() {
  con.connect();
  con.on('connected', function() {
    options.channels.forEach(function(channel) {
      con.join(channel);
    });

    // Register plugin manager explicitly
    con.on('!load', pluginman.load);
    con.on('!unload', pluginman.unload);
    con.on('!reload', pluginman.reload);

    // Load all plugins automatically
    pluginman.loadall(con);
  });
});

