MuleBot
=======

MuleBot is an IRC bot written in NodeJS. It supports hot code reloading of its plugins, i.e. any changes made to a plugin can be immediately applied by simply reloading the plugin - without restarting the bot.

Installation
------------

Simply clone the repository and set up the config-files in the `cfg` folder.

The most important config-file is `options.js`, which contains the `host` and `port` of the IRC server to connect to. It also contains the `nick` (and optionally `user` and `name`) that the bot should connect as, and a list of `channels` that the bot should join.

In `admins.js` you can specify the user, host, and nick information of all IRC users that you want the bot to consider as *admins*. Admins have access to certain plugins and features that normal users don't have access to.

Usage
-----

When the bot has been configured, simply run `node main.js`. When the bot has connected, simply send a private message to it from an admin IRC user with the message `!load all` to load all plugins.

Test to see if the bot works by typing `!ping` in the channel.
