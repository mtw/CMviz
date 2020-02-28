from django.shortcuts import render
from django.conf import settings
import os
import json


def identifier_view(request, identifier):

    folder = os.path.join(settings.MEDIA_URL)

    files_display = [os.path.join(folder, f"{identifier}.csv")]
    genomes_length = os.path.join(folder, f"{identifier}.genomes")

    context = {
        "files_display": json.dumps(files_display),
        "genomes_length": genomes_length,
    }

    return render(request, "viz/main.html", context)
