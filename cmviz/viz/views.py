from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.shortcuts import render

from viz.forms import DocumentForm
from viz.models import Document


def main_visualization(request):
    return render(
        request,
        'viz/main.html',
        {'file_to_display': 'static/data/x1.csv'},
        # {'file_to_display': 'static/data/all_DENVG_3UTR.SL2.csv'},
    )


def list(request):

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
