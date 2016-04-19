# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spells', '0003_spell_ritual'),
    ]

    operations = [
        migrations.AddField(
            model_name='spell',
            name='concentration',
            field=models.BooleanField(default=False),
        ),
    ]
