from django.urls import path
from . import views

urlpatterns = [
    path('name/', views.get_name, name='get_name'),
    path('file/', views.uploadfile, name='upload_file'),
    path('rest/', views.FileUploadView, name='rest_view')
]
