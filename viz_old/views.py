from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse
import datetime

def current_datetime(request, identifier):
    now = datetime.datetime.now()
    html = f"<html><body>It is now {now}. {identifier}</body></html>"
    # html = 
    return HttpResponse(html)


def main_visualization(request, identifier):
    return render(
        request,
        'viz/main.html',
        # {'file_to_display': '/static/data/test_multi.json'}
        {'files_display': '/media/documents/' + identifier + '.csv'},
        {'genomes_file': '/media/documents/' + identifier + '.genomes'}
    )
