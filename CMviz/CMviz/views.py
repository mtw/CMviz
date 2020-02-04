from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from . import views


def home(request):
    return render(request, 'CMviz/home.html')
