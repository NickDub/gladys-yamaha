var Yamaha = require('yamaha-nodejs');

module.exports = function() {
    var yamaha = new Yamaha();
    var nextReceiverNumber = 1;

    yamaha.discover().then(function(device) {
        sails.log.info('Yamaha : Yamaha Receiver found at: ' + device);

        var newDevice = {
            device: {
                name: `Yamaha ${nextReceiverNumber}` || 'Yamaha',
                protocol: 'wifi',
                service: 'yamaha',
                identifier: device,
            },
            types: [
                {
                    name: 'Power',
                    identifier: 'power',
                    tag: 'Home Cinema',
                    type: 'binary',
                    sensor: false,
                    min: 0,
                    max: 1
                },
                {
                    name: 'Mute',
                    identifier: 'mute',
                    tag: 'Mute',
                    type: 'mute',
                    sensor: false,
                    min: 0,
                    max: 1
                },
                {
                    name: 'Volume',
                    identifier: 'volume',
                    tag: 'Volume',
                    type: 'volume',
                    unit: 'dB (x10)',
                    sensor: false,
                    min: -800,
                    max: 165
                }
            ]
        };
        nextReceiverNumber++;

        gladys.device.create(newDevice)
            .then(() => {
                sails.log.info(`Yamaha : New Yamaha Receiver added with success`);
            })
            .catch((err) => {
                sails.log.warn(`Yamaha : Error while adding Yamaha device in Gladys. ${err}`);
            });
    });

    return Promise.resolve();
}
