from django import forms

# This class defines the overall layout of the user interface
class MultipleFileForm(forms.Form):
    cmout = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))
    genomes = forms.FileField()
