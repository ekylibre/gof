'use strict';

const Plant = require('./models/plant');
const Rotation = require('./models/rotation');
const Tool = require('./models/tool');
const Equipment = require('./models/equipment');

const Constants = require('./constants');

function DbManager() {
}

DbManager.prototype.initiliaze = function (populate) {
    if(populate) {
        populatePlants();
        populateRotations();
        populateTools();
        populateEquipments();
    }
}

function populatePlants() {

    Plant.remove();
    
    write([
        new Plant({ species: 'corn', pricePerHectare: 140, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'corn', pricePerHectare: 140*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'corn', pricePerHectare: 140*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

        new Plant({ species: 'durum_wheat', pricePerHectare: 100, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'durum_wheat', pricePerHectare: 100*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'durum_wheat', pricePerHectare: 100*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),
        
        new Plant({ species: 'soft_wheat', pricePerHectare: 100, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'soft_wheat', pricePerHectare: 100*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'soft_wheat', pricePerHectare: 100*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

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

        new Plant({ species: 'barley', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'barley', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'barley', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),
        
        new Plant({ species: 'oat', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'oat', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'oat', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

        new Plant({ species: 'triticale', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
        new Plant({ species: 'triticale', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
        new Plant({ species: 'triticale', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),


    ]);
}

function populateRotations() { 

    Rotation.remove();

    write([
        new Rotation({plantSpecies: ['carrot', 'corn', 'corn', 'corn', 'corn', 'corn']}),
        new Rotation({plantSpecies: ['colza', 'wheat', 'soy', 'corn', 'corn']}),
        new Rotation({plantSpecies: ['wheat', 'wheat', 'corn', 'corn', 'soy', 'soy']}),
    ]);
}

function populateTools() {

    Tool.remove();

    write([
        new Tool({name:'spreader', price:1000}),
        new Tool({name:'spreader_trailer', price:1000}),
        new Tool({name:'spreader_renting', price:1000}),
        new Tool({name:'harrow', price:1000}),
        new Tool({name:'irrigation_pivot', price:1000}),
        new Tool({name:'sprayer', price:1000}),
        new Tool({name:'sower', price:1000}),
    ]);
}

function populateEquipments() {

    Equipment.remove();
    write([
        new Equipment({name: 'tractor', price: 1000}),
        new Equipment({name: 'hoe', price: 1000}),
        new Equipment({name: 'grinder', price: 1000}),
        new Equipment({name: 'plow', price: 1000}),
        new Equipment({name: 'stubble_cultivator', price: 1000}),
        new Equipment({name: 'grain_tank', price: 1000}),
    ]);
}

function write(elements) {
    elements.forEach(function(e){
        e.save();
    }, this);
}

module.exports = new DbManager();