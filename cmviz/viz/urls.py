from django.urls import path

from . import views

urlpatterns = [
    path('', views.main_visualization, name='main'),
    path('listy', views.list, name='list')
]
