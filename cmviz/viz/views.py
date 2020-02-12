from django.shortcuts import render

# Create your views here.


def main_visualization(request):
    # print(request.__dict__)
    return render(
        request,
        'viz/main.html',
        {'file_to_display': 'static/data/x1.csv'},
        # {'file_to_display': 'static/data/all_DENVG_3UTR.SL2.csv'},
    )

# -*- coding: utf-8 -*-
# from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
# from django.core.urlresolvers import reverse

from viz.models import Document
from viz.forms import DocumentForm

def list(request):
    # Handle file upload


    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            newdoc = Document(docfile = request.FILES['docfile'])
            newdoc.save()

            # Redirect to the document list after POST
            return HttpResponseRedirect('listy')
    else:
        form = DocumentForm() # A empty, unbound form

    # Load documents for the list page
    documents = Document.objects.all()

    # Render list page with the documents and the form
    return render(request, 'viz/list.html', {'documents': documents, 'form': form})
    # return render_to_response(
    #     'viz/list.html',
    #     {'documents': documents, 'form': form},
    #     context_instance=RequestContext(request)
    # )