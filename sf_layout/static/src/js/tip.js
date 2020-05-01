odoo.define('sf_layout.Tip', function (require) {
    "use strict";
    var Tip = require('web_tour.Tip');

    Tip.include({
        start: function () {
            let self = this;
            return this._super.apply(this, arguments).then(function () {
                return self.destroy();
            });
        },
    });

    return Tip;

});
