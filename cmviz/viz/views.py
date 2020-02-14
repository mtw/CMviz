from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.shortcuts import render

from viz.forms import DocumentForm
from viz.models import Document

from viz.transformers.funcs import cmout_to_csv

import os
import json

default_can_display = [
    'static/dummy2.csv',
    'static/dummy.csv',
]


def main_view(request):

    # print(request.session.serializer.__dict__)

    # print('can', request.session.get('can_display'))
    # print('will', request.session.get('will_display'))

    print(dict(request.session.items()))

    baseurl = 'cmviz/viz/static/uploads'

    if not 'can_display' in request.session:
        request.session['can_display'] = default_can_display

    if not 'will_display' in request.session:
        request.session['will_display'] = []

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

            uploaded = f'static/uploads/csvs/{filename}.csv'

            if not uploaded in request.session['will_display']:
                request.session['will_display'].append(uploaded)

            if not uploaded in request.session['can_display']:
                request.session['can_display'].append(uploaded)

    if request.session['will_display'] == []:
        request.session['will_display'] = [request.session['can_display'][0]]

    context = {
        # 'documents': Document.objects.all(),
        'files_exist': json.dumps(request.session['can_display']),
        'files_display': json.dumps(request.session['will_display']),
        'form': DocumentForm(),
    }

    print(dict(request.session.items()))

    context['itemos'] = json.dumps(list(request.session.items()))

    request.session.modified = True

    # print('can2', request.session['can_display'])
    # print('will2', request.session['will_display'])

    return render(request, 'viz/main.html', context)


def dummy_view(request):

    print(request.session.items())
    request.session.flush()

    return render(request, 'viz/dummy.html', {})

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
