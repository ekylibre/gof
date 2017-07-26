'use strict';

const Plant = require('./models/plant');
const Rotation = require('./models/rotation');
const Tool = require('./models/tool');
const Equipment = require('./models/equipment');
const Additive = require('./models/additive')

const Constants = require('../../common/constants');

function DbManager() {
}

DbManager.prototype.initiliaze = function (populate) {
    if(populate) {
        populatePlants();
        populateRotations();
        populateTools();
        populateEquipments();
        populateAdditives();
    }
}

function populatePlants() {

    Plant.remove(null, (error) => {
        if(error){
            return;
        }

        dbWriteArrayOfModels([
            //mais
            new Plant({ species: 'corn', pricePerHectare: 140, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'corn', pricePerHectare: 140*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'corn', pricePerHectare: 140*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //blé dur
            new Plant({ species: 'durum_wheat', pricePerHectare: 100, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'durum_wheat', pricePerHectare: 100*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'durum_wheat', pricePerHectare: 100*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),
            
            //blé tendre
            new Plant({ species: 'soft_wheat', pricePerHectare: 100, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'soft_wheat', pricePerHectare: 100*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'soft_wheat', pricePerHectare: 100*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //carotte
            new Plant({ species: 'carrot', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'carrot', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'carrot', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //colza
            new Plant({ species: 'colza', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'colza', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'colza', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //tournesol
            new Plant({ species: 'sunflower', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'sunflower', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'sunflower', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //soja
            new Plant({ species: 'soy', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'soy', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'soy', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //orge
            new Plant({ species: 'barley', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'barley', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'barley', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),
            
            //avoine
            new Plant({ species: 'oat', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'oat', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'oat', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //triticale
            new Plant({ species: 'triticale', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'triticale', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'triticale', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //seigle
            new Plant({ species: 'rye', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'rye', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'rye', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //sarrasin
            new Plant({ species: 'buckwheat', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'buckwheat', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'buckwheat', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //poi
            new Plant({ species: 'pea', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'pea', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'pea', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //lupin
            new Plant({ species: 'lupin', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'lupin', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'lupin', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //féverole
            new Plant({ species: 'field_bean', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'field_bean', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'field_bean', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //betterave
            new Plant({ species: 'beetroot', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'beetroot', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'beetroot', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),

            //prairies
            new Plant({ species: 'pasture', pricePerHectare: 700, cultureMode: Constants.CultureModeEnum.NORMAL }),
            new Plant({ species: 'pasture', pricePerHectare: 700*2, cultureMode: Constants.CultureModeEnum.BIO }),
            new Plant({ species: 'pasture', pricePerHectare: 700*3, cultureMode: Constants.CultureModeEnum.PERMACULTURE }),
        ]);
    });
    
    
}

function populateRotations() {

    Rotation.remove(null, (error) => {
        if(error) {
            return;
        }

        dbWriteArrayOfModels([
            new Rotation({plantSpecies: ['soft_wheat', 'barley', 'colza', 'sunflower', 'durum_wheat', 'colza', 'soft_wheat', 'barley']}),
            new Rotation({plantSpecies: ['pasture', 'pasture', 'pasture', 'corn', 'soft_wheat', 'colza', 'durum_wheat']}),
            new Rotation({plantSpecies: ['colza', 'soft_wheat', 'corn', 'durum_wheat']}),
            new Rotation({plantSpecies: ['sunflower', 'soft_wheat', 'field_bean', 'colza', 'durum_wheat']}),
            new Rotation({plantSpecies: ['soft_wheat', 'corn', 'corn', 'pea', 'buckwheat']}),
            new Rotation({plantSpecies: ['carrot', 'corn', 'corn', 'corn', 'corn', 'corn']}),
        ]);
    });
}

function populateTools() {

    Tool.remove(null, (error) => {
        if(error) {
            return;
        }
        dbWriteArrayOfModels([
            new Tool({name:'spreader', price:1000}),
            new Tool({name:'spreader_trailer', price:1000}),
            new Tool({name:'spreader_renting', price:1000}),
            new Tool({name:'harrow', price:1000}),
            new Tool({name:'irrigation_pivot', price:1000}),
            new Tool({name:'sprayer', price:1000}),
            new Tool({name:'sower', price:1000}),
        ]);
    });

    
}

function populateEquipments() {

    Equipment.remove(null, (error) => {
        if(error) {
            return;
        }
        dbWriteArrayOfModels([
            new Equipment({name: 'tractor', price: 1000}),
            new Equipment({name: 'hoe', price: 1000}),
            new Equipment({name: 'grinder', price: 1000}),
            new Equipment({name: 'plow', price: 1000}),
            new Equipment({name: 'stubble_cultivator', price: 1000}),
            new Equipment({name: 'grain_tank', price: 1000}),
        ]);  
    });
    
}

function populateAdditives() {

    Additive.remove(null, (error) => {
        if(error) {
            return;
        }
        dbWriteArrayOfModels([
            new Additive({name: 'cattle_compost', price: 50}), //compost de bovin
            new Additive({name: 'hen_compost', price: 50}), //compost de poules
            new Additive({name: 'bulk_urea_46', price: 50}), //Engrais urée 46% vrac
            new Additive({name: 'bulk_ammonitrate_33', price: 50}), //Engrais ammonitrate 33 % vrac
            new Additive({name: 'bulk_ammonitrate_27', price: 50}), //Engrais ammonitrate 27 % vrac
            new Additive({name: 'bulk_fertilizer_15_15_15', price: 50}), //Engrais minéral 15 15 15
            new Additive({name: 'fertiactyl_starter', price: 50}), //Fertiactyl starter
            new Additive({name: 'complete_herbicide', price: 50}), //Herbicide total
            new Additive({name: 'zea_herbicide', price: 50}), //Herbicide maïs
            new Additive({name: 'poaceae_herbicide', price: 50}), //Herbicide céréales/graminées
        ]);
    });
}

function dbWriteArrayOfModels(elements) {
    elements.forEach(function(e){
        e.save();
    }, this);
}

module.exports = new DbManager();