from django.shortcuts import render

# Create your views here.

def main_visualization(request):
    render(request,'viz/index.html',)