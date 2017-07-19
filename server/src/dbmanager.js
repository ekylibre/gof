'use strict';

const Plant = require('./models/plant');
const Constants = require('./constants');

function DbManager() {
}

DbManager.prototype.initiliaze = function (populate) {
    if(populate) {
        populatePlants();
    }
}

function populatePlants() {

    Plant.remove();
    
    var plants = [
        new Plant({ species: 'corn', pricePerHectare: 140, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'corn', pricePerHectare: 140*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'corn', pricePerHectare: 140*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

        new Plant({ species: 'wheat', pricePerHectare: 107, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'wheat', pricePerHectare: 107*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'wheat', pricePerHectare: 107*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

    ];

    plants.forEach(function(element) {
        element.save();
    }, this);


}


module.exports = new DbManager();