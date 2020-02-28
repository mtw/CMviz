from django import forms
# from .models import Upload_File


# class NameForm(forms.Form):
#     your_name = forms.CharField(label='Your name:', max_length=100)


# class UploadFileForm(forms.ModelForm):
#     class Meta:
#         model = Upload_File
#         fields = ['upload', ]


class MultipleFileForm(forms.Form):
    cmout = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))
    genomes = forms.FileField()
