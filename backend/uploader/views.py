from django.http import HttpResponseRedirect
from django.shortcuts import render
from .forms import UploadFileForm

# Imaginary function to handle an uploaded file.
# from somewhere import handle_uploaded_file

def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            handle_uploaded_file(request.FILES['file'])
            return HttpResponseRedirect('/')
    else:
        form = UploadFileForm()
    return render(request, 'uploader/upload.html', {'form': form})


def handle_uploaded_file(f):
    print(f.__dict__)
    with open(f._name, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
