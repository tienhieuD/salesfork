from odoo import models, api, fields


class Message(models.Model):
    _inherit = 'mail.message'

    liked_partner_ids = fields.Many2many(
        'res.partner', 'mail_message_res_partner_liked_rel', string='Liked By')
    liked = fields.Boolean(
        'Liked', compute='_get_liked', search='_search_liked',
        help='Current user has a starred notification linked to this message')

    @api.model
    def _search_liked(self, operator, operand):
        if operator == '=' and operand:
            return [('liked_partner_ids', 'in', [self.env.user.partner_id.id])]
        return [('liked_partner_ids', 'not in', [self.env.user.partner_id.id])]

    @api.depends('liked_partner_ids')
    def _get_liked(self):
        """ Compute if the message is liked by the current user. """
        # TDE FIXME: use SQL
        liked = self.sudo().filtered(lambda msg: self.env.user.partner_id in msg.liked_partner_ids)
        for message in self:
            message.liked = message in liked

    def user_liked(self):
        """ Toggle messages as (un)starred. Technically, the notifications related
            to uid are set to (un)starred.
        """
        # a user should always be able to star a message he can read
        partner_id = self.env.user.partner_id.id
        self.check_access_rule('read')
        self.liked = True
        self.sudo().write({'liked_partner_ids': [(4, partner_id)]})

        notification = {'type': 'liked_message', 'message_ids': [self.id], 'partner_id': partner_id,
                        'liked_partner_name': ", ".join([x.name for x in self.liked_partner_ids]),
                        'liked': self.liked, 'liked_partner_ids': self.liked_partner_ids.ids}
        self.env['bus.bus'].sendone((self._cr.dbname, 'res.partner', partner_id), notification)

    def message_format(self):
        message_values = super(Message, self.with_context(LIKE=True)).message_format()
        for message in message_values:
            message['liked_partner_name'] = ", ".join([x.name for x in self.env['res.partner'].browse(message['liked_partner_ids'])])
        return message_values

    def read(self, fields=None, load='_classic_read'):
        self.check_access_rule('read')
        if self.env.context.get("LIKE", False):
            fields.append("liked_partner_ids")
            fields.append("liked")
        return super(Message, self).read(fields=fields, load=load)
