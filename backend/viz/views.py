from django.shortcuts import render

# Create your views here.


def main_visualization(request):
    return render(
        request,
        'viz/main.html',
        {'file_to_display': 'static/data/test_multi2.json'}
        # {'file_to_display': 'static/uploads/upload1.json'}
    )
