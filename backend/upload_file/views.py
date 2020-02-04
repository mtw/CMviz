from django.shortcuts import render, redirect
from .forms import NameForm, UploadFileForm
from .models import parse_uploaded_file
from rest_framework.parsers import FileUploadParser
from rest_framework import views
from rest_framework.response import Response


def get_name(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = NameForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return redirect('/upload_file/file/')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = NameForm()

    return render(request, 'upload_file/name.html', {'form': form})


def uploadfile(request):
    if request.method == 'POST':
        form  = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            #parse_uploaded_file(request.FILES['file'])
            return redirect('/upload_file/name/')
    else:
        form = UploadFileForm()
    return render(request, 'upload_file/name.html', {'form': form})


class FileUploadView(views.APIView):
    parser_classes = [FileUploadParser]

    def put(self, request, filename, format=None):
        file_obj = request.data['file']
        # ...
        # do some stuff with uploaded file
        # ...
        return Response(status=204)
