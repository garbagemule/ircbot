var fs = require('fs');
var u = require('./cmdutil');

var m = {
  loaded: {},
  
  load: function(text, con, msg) {
    if (u.notadmin(msg)) return;
    var args = u.args(text);

    // We must have at least one plugin to load
    if (args.length === 0) {
      return;
    }

    // If the first argument is 'all', load everything
    if (args[0] === 'all') {
      return m.loadall(con);
    }

    // Otherwise, load every name in the list
    args.forEach(function(arg) {
      m.loadplugin(arg, con);
    });
  },

  unload: function(text, con, msg) {
    if (u.notadmin(msg)) return;
    var args = u.args(text);
    
    // We must have at least one plugin to unload
    if (args.length === 0) {
      return;
    }

    // If the first argument is 'all', unload everything
    if (args[0] === 'all') {
      return m.unloadall(con);
    }

    // Otherwise, load every name in the list
    args.forEach(function(arg) {
      m.unloadplugin(arg, con);
    });
  },

  reload: function(text, con, msg) {
    if (u.notadmin(msg)) return;
    var args = u.args(text);
    
    // We must have at least one plugin to reload
    if (args.length === 0) {
      return;
    }

    // If the first argument is 'all', reload everything
    if (args[0] === 'all') {
      return m.reloadall(con);
    }

    // Otherwise, reload every name in the list
    args.forEach(function(arg) {
      m.reloadplugin(arg, con);
    });
  },

  loadplugin: function(file, con) {
    // Idempotence
    if (m.loaded[file]) {
      return false;
    }

    // Make sure the file is valid and exists
    if (file[0] === '#' || file[0] === '.' || !fs.existsSync('./plugins/' + file)) {
      return false;
    }

    // Then load it
    var plug = require('./plugins/' + file);

    // Register chat listeners
    if (plug.listeners) {
      Object.keys(plug.listeners).forEach(function(key) {
        con.on(key, plug.listeners[key]);
      });
    }

    // Register commands
    if (plug.commands) {
      Object.keys(plug.commands).forEach(function(key) {
        con.on('!' + key, plug.commands[key]);
      });
    }

    // Store in the loaded plugins map
    m.loaded[file] = plug;
    
    con.info('Plugin ' + file + ' loaded.');
    return true;
  },

  unloadplugin: function(file, con) {
    // Idempotence
    if (!m.loaded[file]) {
      return false;
    }

    // Grab the plugin object
    var plug = m.loaded[file];
    
    // Unregister chat listeners
    if (plug.listeners) {
      Object.keys(plug.listeners).forEach(function(key) {
        con.removeListener(key, plug.listeners[key]);
      });
    }
    
    // Unregister commands
    if (plug.commands) {
      Object.keys(plug.commands).forEach(function(key) {
        con.removeListener('!' + key, plug.commands[key]);
      });
    }

    // Remove from plugin map, and remove from cache
    m.loaded[file] = false;
    delete require.cache[require.resolve('./plugins/' + file)];

    con.info('Plugin ' + file + ' unloaded.');
    return true;
  },

  reloadplugin: function(file, con) {
    return m.unloadplugin(file, con) && m.loadplugin(file, con);
  },
  
  loadall: function(con) {
    //con.info('Loading plugins...');
    fs.readdir('./plugins', function(err, files) {
      files.forEach(function(file) {
        m.loadplugin(file, con);
      });
      //con.info('Done');
    });
  },

  unloadall: function(con) {
    Object.keys(m.loaded).forEach(function(file) {
      m.unloadplugin(file, con);
    });
  },

  reloadall: function(con) {
    m.unloadall(con);
    m.loadall(con);
  }
};

module.exports = m;
