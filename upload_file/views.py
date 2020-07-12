# written by Matthias Schmal
# the user interface
# all views are defined here and what to do with different requests

from django.shortcuts import render, redirect
from .forms import MultipleFileForm
from .models import save_cmout, generate_random_string, save_lengths
from django.urls import reverse_lazy
from django.views.generic.edit import FormView


class MultipleFileView(FormView):
    identifier = None
    form_class = MultipleFileForm
    template_name = 'upload_file/landing.html'

    def post(self, request, *args, **kwargs):
        self.identifier = generate_random_string()
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        cmout = request.FILES.getlist('cmout')
        genomes = request.FILES.getlist('genomes')
        if form.is_valid():
            save_cmout(cmout, self.identifier)
            save_lengths(genomes, self.identifier)
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    # Newly defines to which url the redirection goes after successfully sending
    # the form via POST-request. This POST-request also sends the identifier
    def get_success_url(self):
        return reverse_lazy('viz:viz', kwargs={'identifier': self.identifier})
