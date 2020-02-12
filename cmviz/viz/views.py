from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.shortcuts import render

from viz.forms import DocumentForm
from viz.models import Document

def monolithic_view(request):
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            newdoc = Document(docfile=request.FILES['docfile'])
            newdoc.save()
    
    documents = Document.objects.all()
    form = DocumentForm()

    print(len(documents))
    # paths = 

    # print(documents[0].__dict__)

    context = {
        'documents': [d.docfile.name for d in documents],
        'file_to_display': ['static/uploads/'+d.docfile.name for d in documents][-1],
        'form': form
    }

    print(context)

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
