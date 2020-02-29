# written by Matthias Schmal
# generates all valid urls for the "upload_file" app
# since MultipleFileView is a class we have to call the method "as.view()"
# to render it as a view

from django.urls import path
from . import views

# from django.conf import settings
# from django.conf.urls.static import static

app_name = 'upload_file'

urlpatterns = [
    # path('name/', views.get_name, name='get_name'),
    # path('genomes_tab/', views.UploadGenomesTab, name='genomes'),
    path('', views.MultipleFileView.as_view(), name='multi')
] #+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
