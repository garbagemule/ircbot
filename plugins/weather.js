var S = require('string');
var request = require('request');
var u = require('../cmdutil');

/**
 * A weather command that utilizes openweathermap.org
 *
 * The command takes a city, and optionally a country or state, and requests
 * weather data from openweathermap.org, and then prints the temperature and
 * description.
 *
 * Usage: !weather <city>
 */
var m = {
  weather: function(text, con, msg) {
    var args = u.args(text);
    if (args.length !== 1) return;
    
    con.info('Getting weather data for ' + args + '...');
    request
      .get('http://api.openweathermap.org/data/2.5/weather?q=' + args.join(','))
      .on('data', function(data) {
        var info = JSON.parse(data.toString('utf8'));

        // City, country
        var place = info.name + ', ' + info.sys.country;

        // Temperature
        var celsius = info.main.temp - 273.15;
        var fahrenheit = (celsius / 5 * 9) + 32;
        var temperature = celsius.toFixed() + '\u00B0C / ' + fahrenheit.toFixed() + '\u00B0F';

        // Description
        var main = info.weather[0].main;
        var desc = info.weather[0].description;
        var description = main + ' (' + desc + ')';

        // Message
        var res = 'Weather for ' + place + ': ' + temperature + ', ' + description + '.';
        u.out(res, con, msg);
      })
      .on('error', function(error) {
        u.out(error, con, msg);
      });
  },
};

m.commands = {
  'weather': m.weather
};

module.exports = m;
