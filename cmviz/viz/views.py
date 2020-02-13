from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.shortcuts import render

from viz.forms import DocumentForm
from viz.models import Document

from viz.transformers.funcs import cmout_to_csv

import os
import json


def main_view(request):

    baseurl = 'cmviz/viz/static/uploads'

    # if upload was made
    if request.method == 'POST':

        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            filename = request.FILES['docfile']
            newdoc = Document(docfile=filename)
            newdoc.save()

            ipath = f'{baseurl}/{filename}'
            opath = f'{baseurl}/csvs/{filename}.csv'
            cmout_to_csv(ipath, opath)

            files_display = [f'static/uploads/csvs/{filename}.csv']

    try:
        files_display
    except:
        files_display = ['static/dummy2.csv', 'static/dummy.csv']

    files_exist = os.listdir(f'{baseurl}/csvs')

    context = {
        # 'documents': Document.objects.all(),
        'files_exist': json.dumps(files_exist),
        'files_display': json.dumps(files_display),
        'form': DocumentForm(),
    }

    return render(request, 'viz/main.html', context)


# def main_visualization(request):
#     return render(
#         request,
#         'viz/main.html',
#         {'file_to_display': 'static/data/x1.csv'},
#         # {'file_to_display': 'static/data/all_DENVG_3UTR.SL2.csv'},
#     )


# def list_view(request):

#     if request.method == 'POST':

#         form = DocumentForm(request.POST, request.FILES)
#         if form.is_valid():
#             newdoc = Document(docfile=request.FILES['docfile'])
#             newdoc.save()
#             return HttpResponseRedirect('listy')
#     else:
#         form = DocumentForm()

#     documents = Document.objects.all()

#     return render(request, 'viz/list.html', {'documents': documents, 'form': form})
