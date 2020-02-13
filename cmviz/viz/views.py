from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.shortcuts import render

from viz.forms import DocumentForm
from viz.models import Document

from viz.transformers.funcs import cmout_to_csv

import os
import json


def monolithic_view(request):

    baseurl = 'cmviz/viz/static/uploads'

    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            filename = request.FILES['docfile']
            newdoc = Document(docfile=filename)
            newdoc.save()
            cmout_to_csv(
                f'{baseurl}/{filename}', f'{baseurl}/csvs/{filename}.csv')
            # print(newdoc.__dict__)

            file_to_display = f'static/uploads/csvs/{filename}.csv'

    documents = Document.objects.all()
    form = DocumentForm()

    # print(len(documents))
    # paths =

    # print(documents[0].__dict__)

    # print([d.docfile.name for d in documents])

    documents = os.listdir(f'{baseurl}/csvs')

    # print(documents)

    try:
        file_to_display
    except NameError:
        file_to_display = json.dumps(['static/dummy2.csv','static/dummy.csv'])
        # file_to_display = f'static/uploads/csvs/{documents[-1]}'

    print(file_to_display)

    context = {
        # 'documents': [d.docfile.name for d in documents],
        'documents': documents,
        # 'file_to_display': ['static/uploads/'+d.docfile.name for d in documents][-1],
        'file_to_display': file_to_display,
        'form': form
    }
    # print()
    # print(context)

    return render(request, 'viz/main.html', context)


def main_visualization(request):
    return render(
        request,
        'viz/main.html',
        {'file_to_display': 'static/data/x1.csv'},
        # {'file_to_display': 'static/data/all_DENVG_3UTR.SL2.csv'},
    )


def list_view(request):

    if request.method == 'POST':

        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            newdoc = Document(docfile=request.FILES['docfile'])
            newdoc.save()
            return HttpResponseRedirect('listy')
    else:
        form = DocumentForm()

    documents = Document.objects.all()

    return render(request, 'viz/list.html', {'documents': documents, 'form': form})
