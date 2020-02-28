from django.urls import path
from . import views

app_name = 'viz'

urlpatterns = [
    path("<str:identifier>", views.identifier_view, name="viz"),
]
