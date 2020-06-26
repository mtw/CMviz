from django import forms


class MultipleFileForm(forms.Form):
    """Define the overall layout of the user interface."""

    cmout = forms.FileField(widget=forms.ClearableFileInput(attrs={"multiple": True}))
    genomes = forms.FileField()
