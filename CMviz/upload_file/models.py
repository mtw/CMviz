from django.db import models
from InfernalUtils import CmsearchOut
# Create your models here.


class Upload_File(models.Model):
    upload = models.FileField(upload_to='documents/')


def parse_uploaded_file(request, path_to_file):

    return
