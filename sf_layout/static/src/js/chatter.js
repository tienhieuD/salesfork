odoo.define('sf_layout.chatter', function (require) {
    "use strict";

    let FormRenderer = require('web.FormRenderer');
    let localStorage = require('web.local_storage');
    var Chatter = require('mail.Chatter');
    var config = require('web.config');

    var icon = {
        close: 'fa-backward',
        open: 'fa-forward',
    };

    Chatter.include({
        start: function () {
            var self = this;
            return this._super.apply(this, arguments).then(function () {
                if (localStorage.getItem('x_chatter_state') === 'close') {
                    self.$el.css('display', 'none');
                }
            });
        }
    });

    FormRenderer.include({
        _renderTagHeader: function (node) {
            var self = this;
            var $statusbar = this._super.apply(this, arguments);

            if (config.device.isMobile)
                return $statusbar;

            var chatter_state = localStorage.getItem('x_chatter_state') || 'open';
            var $hide_chatter_btn = $('<button>', {class: 'btn btn-link hide_chatter_btn', html: '<i class="fa ' + "fa-window-restore" + '"></i>'});
            $hide_chatter_btn
                .on('click', this.x_click_hide_chatter_btn.bind(this))
                .appendTo($statusbar);
            return $statusbar;
        },

        x_set_icon: function (cls) {
            $('.hide_chatter_btn')
                .find('i')
                .removeClass('fa-backward fa-forward')
                .addClass(cls);
        },

        x_toggle_chatter: function (state) {
            if (state === 'close') {
                localStorage.setItem('x_chatter_state', 'open');
                $('aside.o_chatter.oe_chatter').show(100);
                this.x_set_icon('fa-forward');
            } else if (state === 'open') {
                localStorage.setItem('x_chatter_state', 'close');
                $('aside.o_chatter.oe_chatter').hide(100);
                this.x_set_icon('fa-backward');
            }
        },

        x_click_hide_chatter_btn: function (e) {
            e.preventDefault();
            var state = localStorage.getItem('x_chatter_state') || 'open';
            this.x_toggle_chatter(state);
        },

    });


    return FormRenderer;
});
