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

    print(request.POST)

    baseurl = 'CMviz/viz/static/uploads'

    if not 'can_display' in request.session:
        request.session['can_display'] = default_can_display

    if not 'will_display' in request.session:
        request.session['will_display'] = []

    # if upload was made
    if request.method == 'POST':

        if request.POST['form-type'] == 'upload':
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

        if request.POST['form-type'] == 'selection':
            add_file = request.POST['filename']

            if add_file in request.session['will_display']:
                request.session['will_display'].remove(add_file)
            else:
                request.session['will_display'].append(add_file)

    if request.session['will_display'] == []:
        request.session['will_display'] = [request.session['can_display'][0]]

    context = {
        # 'documents': Document.objects.all(),
        'files_exist': json.dumps(request.session['can_display']),
        'files_display': json.dumps(request.session['will_display']),
        'form': DocumentForm(),
    }

    # print(dict(request.session.items()))

    context['itemos'] = json.dumps(list(request.session.items()))

    request.session.modified = True

    return render(request, 'viz/main.html', context)


def dummy_view(request):

    print(request.session.items())
    request.session.flush()
    request.session.modified = True

    return render(request, 'viz/dummy.html', {})
