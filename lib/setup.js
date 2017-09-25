var Yamaha = require('yamaha-nodejs');

const ignoredZonesParam = 'YAMAHA_IGNORED_ZONES';
const ignoredFeaturesParam = 'YAMAHA_IGNORED_FEATURES';
const ignoredInputsParam = 'YAMAHA_IGNORED_INPUTS';

module.exports = function setup() {
    var yamahaAPI = new Yamaha();

    yamahaAPI.discover().then(function (addr) {
        sails.log.info(`Yamaha : Yamaha Network Receiver found at: ${addr}`);

        var yamaha = new Yamaha(addr);

        yamaha.getSystemConfig().then(function (config) {
            var modelName = config.YAMAHA_AV.System[0].Config[0].Model_Name[0];

            // device creation
            var newDevice = {
                device: {
                    name: `Yamaha (${modelName})`,
                    protocol: 'wifi',
                    service: 'yamaha',
                    identifier: addr,
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
            }

            gladys.device.create(newDevice)
                .then(() => {
                    sails.log.info(`Yamaha : New Yamaha Network Receiver added with success`);
                })
                .catch((err) => {
                    sails.log.warn(`Yamaha : Error while adding Yamaha device in Gladys. ${err}`);
                });

            //TODO: use zones, features and inputs to set advanced device
            /*gladys.param.getValues([ignoredZonesParam, ignoredFeaturesParam, ignoredInputsParam])
                .spread((ignoredZones, ignoredFeatures, ignoredInputs) => {
                    // get zones and features
                    var features = config.YAMAHA_AV.System[0].Config[0].Feature_Existence[0];
                    for (var feature in features) {
                        if (features.hasOwnProperty(feature) && features[feature][0] === '1') {
                            if (feature.indexOf('Zone') > -1) {
                                if (ignoredZones.indexOf(feature) === -1) {
                                    sails.log.debug(`Yamaha : zone: ${feature}`);
                                }
                            } else {
                                if (ignoredFeatures.indexOf(feature) === -1) {
                                    sails.log.debug(`Yamaha : feature: ${feature}`);
                                }
                            }
                        }
                    }
                    // get inputs
                    var inputsTypes = [];
                    var inputs = config.YAMAHA_AV.System[0].Config[0].Name[0].Input[0];
                    for (var input in inputs) {
                        if (inputs.hasOwnProperty(input)) {
                            if (ignoredInputs.indexOf(input) === -1) {
                                sails.log.debug(`Yamaha : input: ${input} (${inputs[input][0]})`);
                            }
                        }
                    }
                });*/
        });
    });

    return Promise.resolve();
}
