odoo.define('sf_layout.FormRenderer', function (require) {
"use strict";

    var core = require('web.core');
    var framework = require('web.framework');
    var session = require('web.session');
    var FormRenderer = require('web.FormRenderer');


    FormRenderer.include({
        _updateView: function ($newContent) {
            this._super($newContent);
            if (!this.$el.find(".o_form_statusbar").length) {
                this.$el.find(".oe_chatter").addClass("_nHeadB");
            }
            if (this.$el.find(".o_statusbar_status").length && !this.$el.find(".oe_chatter").length && $(document).width() > 1140) {
                this.$el.find(".o_statusbar_status").addClass("_noChatter")
            }
        }
    });

});

