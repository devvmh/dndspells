# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-07 01:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spells', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spell',
            name='classes',
            field=models.ManyToManyField(blank=True, to='spells.CasterClass'),
        ),
    ]
