# -*- coding: utf-8 -*-
{
    'name': 'Attendance',
    'version': '1.0',
    'category': 'Human Resources',
    'sequence': 1,      
    'summary': 'Manage an attendance for employee',
    'author': 'max',
    'depends': ['hr_attendance'],
    'data': [
        'views/assets.xml'
    ],
    'qweb': [
        'static/src/xml/attendance.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': True,
}

