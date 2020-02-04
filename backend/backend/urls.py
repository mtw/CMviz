from django.urls import path, include
from django.contrib import admin


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('viz.urls')),
    path('upload_file/', include('upload_file.urls')),

]
