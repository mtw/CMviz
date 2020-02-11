from django.shortcuts import render

# Create your views here.


def main_visualization(request):
    # print(request.__dict__)
    return render(
        request,
        'viz/main.html',
        {'file_to_display': 'static/data/x1.csv'},
        # {'file_to_display': 'static/data/all_DENVG_3UTR.SL2.csv'},
    )
