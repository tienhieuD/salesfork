odoo.define('sf_layout.menu', function (require) {
    'use strict';

    let AppsMenu = require("web.AppsMenu");
    let Menu = require("web.Menu");

    Menu.include({
        /**
         * @override: Mặc định add class active cho menu sau khi tải lại trang.
         */
        change_menu_section: function (primary_menu_id) {
            this._super(primary_menu_id);
            this._appsMenu.$el.find("[data-menu-id='"+primary_menu_id+"']").addClass("active");
        }
    });

    AppsMenu.include({
        events: _.extend({}, AppsMenu.prototype.events, {
            'click ._aMenu': 'toggleMenu',
            'click .sf_menu_content': '_onClickCloseMenuDelay',
            'click .sf_menu_overlay': '_onClickOverLay',
        }),

        init: function (parent, menuData) {
            this._super.apply(this, arguments);
            this.menuShow = false;
            for (var n in this._apps) {
                this._apps[n].web_icon_data = menuData.children[n].web_icon_data;
            }
        },
        _onClickOverLay: function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.toggleMenu();
        },
        toggleMenu: function () {
            let menu = this.$el.find(".sf_menu_content");
            this.menuShow = !this.menuShow;
            this.menuShow ? menu.addClass("open") : menu.removeClass("open");
        },

        _onClickCloseMenuDelay: function () {
            this.toggleMenu();
        },

    });

    return AppsMenu;
});
