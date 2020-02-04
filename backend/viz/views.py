from django.shortcuts import render

# Create your views here.

def main_visualization(request):
    return render(request,'viz/index.html',)