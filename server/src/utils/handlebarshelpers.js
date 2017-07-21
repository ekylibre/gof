
module.exports = {
    i18n_helper : function(key, options) {
        return options.data.root.__(key, options.data.root);
    },
}
