from django.shortcuts import render

# Create your views here.


def main_visualization(request):
    # print(request.__dict__)
    return render(
        request,
        'viz/main.html',
        {'file_to_display': 'static/data/test_multi2.json'}
        # {'file_to_display': 'static/data/all_DENVG_3UTR.DB2.json'} # all_DENVG_3UTR.DB1.json
        # {'file_to_display': 'static/uploads/upload1.json'}
    )
