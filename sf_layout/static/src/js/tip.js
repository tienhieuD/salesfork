odoo.define('sf_layout.Tip', function (require) {
    "use strict";
    let Tip = require('web_tour.Tip');

    Tip.include({
        start: function () {
            return this._super.apply(this, arguments).then(this.destroy.bind(this));
        },
    });

    return Tip;
});
