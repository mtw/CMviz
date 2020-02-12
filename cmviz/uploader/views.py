from django.http import HttpResponseRedirect
from django.shortcuts import render
from .forms import UploadFileForm


# UPLOAD_LOCATION = 'uploader/uploads'
UPLOAD_LOCATION = 'viz/static/uploads'


def upload_file(request):

    def handle_file(f):
        path = f'{UPLOAD_LOCATION}/{f._name}'
        with open(path, 'wb+') as destination:
            for chunk in f.chunks():
                destination.write(chunk)

    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)

        if form.is_valid():
            handle_file(request.FILES['file'])
            return render(request, 'viz/main.html')
    else:
        form = UploadFileForm()

    return render(request, 'uploader/upload.html', {'form': form})
