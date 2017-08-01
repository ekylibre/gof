// Used to automatically set the localized text of a "Label" or "RichText" component

// Modified from extension i18n/LocalizedLabel

const i18n = require('LanguageData');

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

cc.Class({
    extends: cc.Component,

    editor: {
        executeInEditMode: true,
        menu: 'i18n/LocalizedTextExt'
    },

    properties: {
        dataID: {
            get () {
                return this._dataID;
            },
            set (val) {
                if (this._dataID !== val) {
                    this._dataID = val;
                    if (CC_EDITOR) {
                        this._debouncedUpdateLabel();
                    } else {
                        this.updateLabel();
                    }
                }
            }
        },
        _dataID: '',

        forceUppercase:
        {
            get () {
                return this._forceUppercase;
            },
            set (val) {
                if (this._forceUppercase !== val) {
                    this._forceUppercase = val;
                    if (CC_EDITOR) {
                        this._debouncedUpdateLabel();
                    } else {
                        this.updateLabel();
                    }
                }
            }
        },
        _forceUppercase: false,
    },
    
    onLoad () {
        if(CC_EDITOR) {
            this._debouncedUpdateLabel = debounce(this.updateLabel, 200);
        }        
        if (!i18n.inst) {
            i18n.init();
        }
        // cc.log('dataID: ' + this.dataID + ' value: ' + i18n.t(this.dataID));
        this.fetchRender();
    },

    fetchRender () {
        let label = this.getComponent(cc.Label);
        if (!label)
        {
            label = this.getComponent(cc.RichText);
        }
        if (label) {
            this.label = label;
            this.updateLabel();
            return;
        }
    },

    updateLabel () {
        if (!this.label) {
            cc.error('Failed to update localized text!');
            return;
        }
        let localizedString = i18n.t(this.dataID);
        if (localizedString) {
            if (this.forceUppercase)
            {
                localizedString = localizedString.toUpperCase();
            }
            this.label.string = localizedString;
        }
        else
        {
            cc.warn('Missing text id: '+this.dataID);
        }
    }
});