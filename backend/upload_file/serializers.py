from rest_framework import serializers
from upload_file.models import Upload_File


class UploadSerializer(serializers.Serializer):
    class Meta:
        model = Upload_File
        fields = ['upload', ]
