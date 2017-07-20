'use strict';

const Plant = require('./models/plant');
const Rotation = require('./models/rotation');

const Constants = require('./constants');

function DbManager() {
}

DbManager.prototype.initiliaze = function (populate) {
    if(populate) {
        populatePlants();
        populateRotations();
    }
}

function populatePlants() {

    Plant.remove();
    
    var plants = [
        new Plant({ species: 'corn', pricePerHectare: 140, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'corn', pricePerHectare: 140*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'corn', pricePerHectare: 140*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

        new Plant({ species: 'wheat', pricePerHectare: 100, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'wheat', pricePerHectare: 100*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'wheat', pricePerHectare: 100*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

        new Plant({ species: 'carrot', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'carrot', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'carrot', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

        new Plant({ species: 'colza', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'colza', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'colza', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

        new Plant({ species: 'sunflower', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'sunflower', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'sunflower', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

        new Plant({ species: 'soy', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'soy', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'soy', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),
    ];

    plants.forEach(function(element) {
        element.save();
    }, this);
}

function populateRotations() { 
    var rotations = [
        new Rotation({plantSpecies: ['carrot', 'corn', 'corn', 'corn', 'corn', 'corn']}),
        new Rotation({plantSpecies: ['colza', 'wheat', 'soy', 'corn', 'corn']}),
        new Rotation({plantSpecies: ['wheat', 'wheat', 'corn', 'corn', 'soy', 'soy']}),
    ];

    rotations.forEach(function(element) {
        element.save();
    }, this);
}

module.exports = new DbManager();