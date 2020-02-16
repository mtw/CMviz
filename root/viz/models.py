# -*- coding: utf-8 -*-
from django.db import models


class Document(models.Model):
    upload_to = 'documents/%Y/%m/%d'
    upload_to = ''
    docfile = models.FileField(upload_to=upload_to)
