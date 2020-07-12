from django.urls import path
from . import views

# app name for shorthand reference for Django
app_name = 'viz'

# URL path connection to Django views
urlpatterns = [
    path("<str:identifier>", views.identifier_view, name="viz"),
]
