odoo.define('sf_layout.widget.Thread', function (require) {
"use strict";

    var DocumentViewer = require('mail.DocumentViewer');
    var mailUtils = require('mail.utils');

    var core = require('web.core');
    var time = require('web.time');
    var Widget = require('web.Widget');
    var ThreadWidget = require('mail.widget.Thread');
    var ThreadField = require('mail.ThreadField');
    var Message = require('mail.model.Message');
    var Notification = require('mail.Manager.Notification');

    Notification.include({
        _handlePartnerChannelNotification: function (channelData) {
            if (channelData.type == 'liked_message') {
                this._handlePartnerLikeNotification(channelData);
                return true;
            }
            this._super(channelData);
        },
        _handlePartnerLikeNotification: function (data) {
            var self = this;
            _.each(data.message_ids, function (messageID) {
                var message = _.find(self._messages, function (msg) {
                    return msg.getID() === messageID;
                });
                if (message) {
                    message.liked_partner_ids = data.liked_partner_ids;
                    message.liked_partner_name = data.liked_partner_name ? data.liked_partner_name.split(",") : [];
                    if (data.partner_id == self.getSession().partner_id) {
                        message.liked = data.liked;
                    }
                    self._mailBus.trigger('update_message', message);
                }
            });
        },
    });

    Message.include({
        init: function (parent, data, emojis) {
            this._super(parent, data, emojis);
            this.liked = data.liked || false;
            this.liked_partner_ids = data.liked_partner_ids || [];
            this.liked_partner_name = data.liked_partner_name ? data.liked_partner_name.split(",") : [];
        },
        likeMessage: function () {
            return this._rpc({
                    model: 'mail.message',
                    method: 'user_liked',
                    args: [[this._id]],
                });
        },
    });

    ThreadField.include({
        start: function () {
            let self = this, res = this._super();
            this._threadWidget.on('action_liked_message', this, function (messageID) {
                var message = self.call('mail_service', 'getMessage', messageID);
                message.likeMessage();
            });
            return res;
        },
    })

    ThreadWidget.include({
        init: function (parent, options) {
            this._super.apply(this, arguments);
            this.events['click .o_react:not([liked="true"]) > .fa-thumbs-up'] = '_onClickMessageLike';
        },
        /**
         * @private
         * @param {MouseEvent} ev
         */
        _onClickMessageLike: function (ev) {
            var messageID = $(ev.currentTarget).data('message-id');
            this.trigger('action_liked_message', messageID);
        },
        renderElement: function () {
            this._super();
        }
    });


});
