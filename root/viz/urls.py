from django.urls import path

from . import views

urlpatterns = [
    # path('', views.main_visualization, name='main'),
    # path('listy', views.list_view, name='listy'),
    path('', views.main_view, name='main'),
    path('dummy', views.dummy_view),
    # path('update_session', views.update_session)
]
