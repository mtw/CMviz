# Generated by Django 2.2.7 on 2020-01-21 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('upload_file', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='upload_file',
            name='upload',
            field=models.FileField(upload_to='documents/'),
        ),
    ]