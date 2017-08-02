const UIPopupBase = require('UIPopupBase');
const CGame = require('Game');
const UISpeciesSelItem = require('UISpeciesSelItem');

/**
 * UI controller for UISpeciesSelPopup popup
 * @class
 * @name UISpeciesSelPopup
 */
var UISpeciesSelPopup = cc.Class({
    extends: UIPopupBase,
    editor:
    {
        menu: 'gof/UISpeciesSelPopup'
    },    

    properties:
    {
        /**
         * @property {cc.Prefab} itemPrefab: the prefab used to created the items in the list
         */
        itemPrefab: {
            default: null,
            type: cc.Prefab       
        },

        /**
         * @property {cc.ScrollView} scrollView: the scrollview containing the species items
         */
        scrollView:
        {
            default: null,
            type: cc.ScrollView
        },

        // /**
        //  * @property {String: species, String: culture} lastSelection: to set if editing an existing item
        //  */
        // lastSelection:
        // {
        //     default: null,
        //     type: Object,
        //     visible: false,            
        // },

    },

    statics:
    {
        /**
         * @property {UISpeciesSelPopup} instance: UISpeciesSelPopup unique instance
         * @static
         */
        instance: null,
    }, 

    // use this for initialization
    onLoad: function () {
        if (UISpeciesSelPopup.instance != null)
        {
            cc.error('An instance of UISpeciesSelPopup already exists');
        }
        UISpeciesSelPopup.instance = this;

        this.initPopup();
    },

    onShow: function()
    {
        var game = new CGame();

        var content = this.scrollView.content;
        content.removeAllChildren(true);
        
        for (var i=0; i<game.plants.length; i++)
        {
            var prefab = cc.instantiate(this.itemPrefab);
            prefab.setParent(content);

            var s = prefab.getComponent('UISpeciesSelItem');
            s.plant = game.plants[i];
        }
    },

    onHide: function()
    {

    },

    onBtClose: function()
    {
        this.hide();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
