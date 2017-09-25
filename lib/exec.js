var Promise = require('bluebird');
var math = require('mathjs');
var shared = require('./shared.js');

module.exports = function exec(params) {

    var yamaha = shared.instances[params.deviceType.device];

    if (!yamaha) {
        return Promise.reject(new Error(`Yamaha : ${params.deviceType.device} not found`));
    }

    return new Promise(function (resolve, reject) {
        switch (params.deviceType.type) {
            case 'binary':
                if (params.state.value !== 1) {
                    sails.log.debug('Yamaha : powerOn');
                    yamaha.powerOn();
                } else {
                    sails.log.debug('Yamaha : powerOff');
                    yamaha.powerOff();
                }
                yamaha.isOn().then(function (result) {
                    return resolve(result ? 0 : 1);
                });
                break;
            case 'mute':
                yamaha.isOn().then(function () {
                    if (params.state.value !== 1) {
                        sails.log.debug('Yamaha : muteOn');
                        yamaha.muteOn();
                    } else {
                        sails.log.debug('Yamaha : muteOff');
                        yamaha.muteOff();
                    }
                    yamaha.getBasicInfo().then()
                        .done(function(basicInfo) {
                            var result = basicInfo.isMuted();
                            return resolve(result ? 0 : 1);
                        });
                    }).then(function() {
                        return reject();
                    });
                break;
            case 'volume':
                yamaha.isOn().then(function () {
                    var value = math.round(params.state.value / 5) * 5;
                    var valueIndB = value / 10;
                    sails.log.debug(`Yamaha : setVolumeTo ${valueIndB} dB`);
                    yamaha.setVolumeTo(value);

                    yamaha.getBasicInfo().then()
                        .done(function(basicInfo) {
                            var result = basicInfo.getVolume();
                            sails.log.debug(`Yamaha : volume: ${result}`);
                            return resolve(result);
                        });
                    }).then(function() {
                        return reject();
                    });
                break;
        };

        return resolve();
    });
};
