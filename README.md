# pinhead
![pinhead](http://www.clivebarker.info/pinheader.jpg)

listen to changes on raspberry pi pins

## pinhead(config)
`config` supports these properties:
  * pin (pin number to listen to)
  * interval (poll rate)
  * delay (time to wait between broadcasting changes)

## example usage
    var pinhead = require('pinhead');
    var pin22 = pinhead({
      pin: 22
    });

    pin22.on('change', function (val) {
      console.log('the pin value changed to', val);
    });
