from django.shortcuts import render
from django.conf import settings
import os
import json


def identifier_view(request, identifier):
    """
    Pass files to display to D3js.
    """

    # cmout data
    files_display = [os.path.join(settings.MEDIA_URL, f"{identifier}.csv")]

    # genome data
    genomes_length = os.path.join(settings.MEDIA_URL, f"{identifier}.genomes")

    context = {
        "files_display": json.dumps(files_display),
        "genomes_length": genomes_length,
    }

    return render(request, "viz/main.html", context)
