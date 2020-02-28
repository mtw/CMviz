# written by Matthias Schmal
# renders landing page

from django.shortcuts import render


def home(request):
    return render(request, 'CMviz/home.html')
