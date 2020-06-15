{
    'name': "Salesfork Layout",
    'author': 'tienhieuD, Odoo Community Association (OCA)',
    'version': '12.0.1.0.0',
    'maintainer': 'tienhieuD',
    'website': "http://odoo.com",
    'license': 'LGPL-3',
    'category': 'Uncategorized',
    'sequence': 1000,
    'summary': """Salesfork Layout""",
    'depends': ['base', 'web', 'mail', 'web_tour'],
    'data': [
        'views/assets.xml',
    ],
    'demo': [
    ],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    'application': True,
}
