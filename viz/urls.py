from django.urls import path

from . import views


# urlpatterns = [
#     path('example', views.main_visualization, {'file_name': 'upload1'},
#          name='main_viz'),
#     # path('<str:identifier>/', views.main_visualization, name='viz'),
#     path('<str:identifier>/', views.current_datetime, name='viz'),
# ]

app_name = "viz"


urlpatterns = [
    # path('', views.main_visualization, name='main'),
    # path('listy', views.list_view, name='listy'),
    path("", views.main_view, name="main"),
    path("<str:identifier>/", views.view_for_matthias, name="viz"),
    # path('update_session', views.update_session)
]
