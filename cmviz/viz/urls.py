from django.urls import path

from . import views

urlpatterns = [
    # path('', views.main_visualization, name='main'),
    path('listy', views.list_view, name='listy'),
    path('', views.monolithic_view,name='main')
]
