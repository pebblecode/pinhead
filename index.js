var gpio = require('rpi-gpio');
var util = require('util');
var events = require('events');

function changed(previous, next, lastChanged, delay) {
  return (previous !== next) &&
         (Date.now() - lastChanged >= delay);
}

/**
 * Listen for a pin
 * @param {Object} config
 *                  - pin: pin to listen to
 *                  - interval: poll interval (ms)
 *                  - delay: how much time should pass before registering
 *                           another change (s)
 */
function Pinhead(config) {
  this.pin = config.pin;
  this.interval = config.interval || 10;
  this.delay = (config.delay * 1000) || 5000;

  events.EventEmitter.call(this);
  gpio.setup(this.pin, gpio.DIR_IN, this.read.bind(this));
}

util.inherits(Pinhead, events.EventEmitter);

Pinhead.prototype.read = function() {
  var _this = this;
  var previous = -1;
  var changeTime = Date.now();

  setInterval(function () {
    gpio.read(_this.pin, function (err, val) {
      _this.emit('data', val);

      if (err) _this.emit('error', err);

      if (changed(previous, val, changeTime, _this.delay)) {
        changeTime = Date.now();
        _this.emit('change', val);
      }

      previous = val;
    });
  }, this.interval);
};

module.exports = function(config) {
  return new Pinhead(config);
};
