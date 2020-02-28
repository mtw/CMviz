from django.urls import path
from . import views

app_name = 'viz'

urlpatterns = [
    path('example', views.main_visualization, {'file_name': 'upload1'},
         name='main_viz'),
    # path('<str:identifier>/', views.main_visualization, name='viz'),
    path('<str:identifier>/', views.current_datetime, name='viz'),
]
