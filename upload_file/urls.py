# written by Matthias Schmal
# generates all valid urls for the "upload_file" app

from django.urls import path
from . import views

app_name = "upload_file"

urlpatterns = [
    path(
        "", views.MultipleFileView.as_view(), name="multi"
    )  # since MultipleFileView is a class we have to call the method "as.view()" to render it as a view
]
