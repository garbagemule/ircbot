MuleBot
=======

MuleBot is an IRC bot written in NodeJS. It supports hot code reloading of its plugins, i.e. any changes made to a plugin can be immediately applied by simply reloading the plugin - without restarting the bot.

Usage
-----

Simply clone the repository and set up the config-files in the `cfg` folder.

The most important config-file is `options.js`, which contains the host and port of the IRC server to connect to, as well as the nick (and optionally user and name) that the bot should connect as.

In `admins.js` you can specify the user, host, and nick information of all IRC users that you want the bot to consider as *admins*. Admins have access to certain plugins and features that normal users don't have access to.
