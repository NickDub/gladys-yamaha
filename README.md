![gladys version](https://badgen.net/badge/Gladys/%3E=%203.9/purple)
![license](https://badgen.net/github/license/NicolasD-62/gladys-yamaha)
[![dependencies Status](https://badgen.net/david/dep/NicolasD-62/gladys-yamaha)](https://david-dm.org/NicolasD-62/gladys-yamaha)

# gladys-yamaha
Gladys module to control your Yamaha receiver.
It is based on [yamaha-nodejs](https://github.com/PSeitz/yamaha-nodejs) module from PSeitz. 

## Prerequisites

* Gladys version >= 3.9 
* Yamaha receiver with wifi capabilities 

## Installation

1. Install the module through Gladys modules pannel and reboot Gladys when it's done. 
2. Go to the modules pannel and click 'Config'. This process takes around 8 secondes to complete. 
3. Your receiver(s) should now be listed in the devices pannel. If they are not, feel free to repeat step 2. 
4. Check your console for the list of available inputs and then configure the "YAMAHA\_DEFAULT\_INPUT" parameter with your value (HDMI1 by default). 

## Usage

After installation is done, you can control power, mute and volume for each receiver in the devices pannel. 
