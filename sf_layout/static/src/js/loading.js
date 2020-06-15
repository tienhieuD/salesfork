odoo.define('sf_layout.Loading', function (require) {
"use strict";

    var core = require('web.core');
    var framework = require('web.framework');
    var session = require('web.session');
    var Loading = require('web.Loading');


    Loading.include({
        on_rpc_event : function(increment) {
            var self = this;
            if (!this.count && increment === 1) {
                // Block UI after 3s
                this.long_running_timer = setTimeout(function () {
                    self.blocked_ui = true;
                    framework.blockUI();
                    if (session.debug) {
                        self.$el.text(_.str.sprintf( _t("Loading (%d)"), self.count));
                    } else {
                        self.$el.text(_t("Loading"));
                    }
                    self.$el.show();
                    self.getParent().$el.addClass('oe_wait');
                }, 3000);
            }

            this.count += increment;
            if (this.count <= 0) {
                this.count = 0;
                clearTimeout(this.long_running_timer);
                // Don't unblock if blocked by somebody else
                if (self.blocked_ui) {
                    this.blocked_ui = false;
                    framework.unblockUI();
                }
                this.$el.fadeOut();
                this.getParent().$el.removeClass('oe_wait');
            }
        }
    });

});

