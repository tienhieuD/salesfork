odoo.define('sf_layout.menu', function (require) {
    'use strict';

    let localStorage = require('web.local_storage');
    let AppsMenu = require("web.AppsMenu");
    let Menu = require("web.Menu");
    let core = require('web.core');

    AppsMenu.include({
        events: _.extend({}, AppsMenu.prototype.events, {
            'click .sf_open_menu': '_onClickOpenMenu',
            'click .sf_close_menu': '_onClickCloseMenu',
            'click .sf_menu_content': '_onClickCloseMenuDelay',
            'click .sf_pending_menu': '_onClickPendingMenu',
        }),

        init: function (parent, menuData) {
            this._super.apply(this, arguments);
            for (var n in this._apps) {
                this._apps[n].web_icon_data = menuData.children[n].web_icon_data;
                this._apps[n].x_menu_category_id = menuData.children[n].x_menu_category_id;
            }
            this.menu_categories = _.chain(menuData.children)
                .map(menu => menu.x_menu_category_id)
                .reject(value => !value)
                .indexBy(menu => menu[0])
                .mapObject(value => value[1])
                .value();
            this.menu_category_ids = _.chain(this.menu_categories).keys().map(id => parseInt(id)).value();
            this.menu_mode = localStorage.getItem('sf_menu_mode') || 'close';
        },

        willStart: function () {
            let self = this;
            return $.when(this._super.apply(this, arguments), this._rpc({
                model: 'x.menu.category',
                method: 'get_sorted_category',
                args: [self.menu_category_ids],
                kwargs: {},
            }).then(function (res) {
                self.sorted_menu_category_ids = res;
            }));
        },

        start: function () {
            this.setMenuMode(this.menu_mode);
            return this._super.apply(this, arguments);
        },
        /**
         * Inherit from web_responsive, make auto close menu when item clicked
         */
        _onAppsMenuItemClicked: function (ev) {
            this._onClickCloseMenuDelay.apply(this, arguments);
            return this._super.apply(this, arguments);
        },

        setMenuMode: function (mode) {
            let $content = $('.o_main_content'),
                $navbar = $('.o_main_navbar'),
                $menu_content = this.$('.sf_menu_content'),
                $el = this.$el;

            $menu_content.removeClass('open minimized');
            $content.removeClass('open minimized');
            $navbar.removeClass('open minimized');
            $el.removeClass('open minimized');

            if (mode === 'normal') {
                $menu_content.addClass('open');
            }

            if (mode === 'pending') {
                $menu_content.addClass('open');
                $el.addClass('minimized');
                $content.addClass('minimized');
                $navbar.addClass('minimized');
            }

            this.menu_mode = mode;
            localStorage.setItem('sf_menu_mode', this.menu_mode);
            core.bus.trigger('Menu_updated');
            core.bus.trigger('DOM_updated');
        },

        _onClickPendingMenu: function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (this.menu_mode === 'pending') {
                this.setMenuMode('close');
            } else {
                this.setMenuMode('pending');
            }
        },

        _onClickOpenMenu: function (event) {
            event.preventDefault();
            this.setMenuMode('normal');
        },
        _onClickCloseMenu: function (event) {
            event.preventDefault();
            this.setMenuMode('close');
        },
        _onClickCloseMenuDelay: function (event) {
            event.preventDefault();
            let self = this;
            if (this.menu_mode === 'pending') {
                return true;
            }
            return setTimeout(this.setMenuMode.bind(this, 'close'), 500);
        },

        getAppsInCategory: function (category_id) {
            let filter_func = app => (app.x_menu_category_id && app.x_menu_category_id[0] === category_id)
                || (app.x_menu_category_id === category_id);
            return _.filter(this._apps, filter_func);
        }
    });

    return AppsMenu;
});
