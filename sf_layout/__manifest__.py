{
    'name': "Salesfork Layout",
    'author': 'tienhieuD, Odoo Community Association (OCA)',
    'version': '13.0.1.0.0',
    'maintainer': 'tienhieuD',
    'website': "http://odoo.com",
    'license': 'LGPL-3',
    'category': 'Theme/Backend',
    'sequence': 1000,
    'summary': """Salesfork Layout""",
    'depends': ['base', 'web', 'mail', 'web_tour'],
    'data': [
        'security/ir.model.access.csv',
        'views/assets.xml',
        'views/ir_ui_menu.xml',
        'views/res_config_settings.xml',
    ],
    'demo': [
    ],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    "images": ['static/description/banner.png', 'static/description/icon.png'],
    'application': True,
}
