odoo.define('sf_layout.menu', function (require) {
    'use strict';

    let AppsMenu = require("web.AppsMenu");
    let Menu = require("web.Menu");

    Menu.include({
        _onAppNameClicked: function (ev) {
            this._super.apply(this, arguments);
            this._markCurrentMenuAsActive();
        },

        _on_secondary_menu_click: function (menu_id, action_id) {
            this._super.apply(this, arguments);
            this._markCurrentMenuAsActive(menu_id);
        },

        _markCurrentMenuAsActive: function (menu_id) {
            // Remove all active class
            this.$el.find("a[data-menu],.o_menu_header_lvl_1,.sf_menu_open_dropdown").removeClass('active');
            if (!menu_id) {
                return;
            }
            // Add class active current menu
            let $current_menu = this.$el.find("a[data-menu='" + menu_id + "']");
            $current_menu.addClass('active');
            $current_menu.closest('.sf_dropdown').find('.sf_menu_open_dropdown').addClass('active');
            $current_menu.closest('li').find('.o_menu_header_lvl_1').addClass('active');
        },
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
