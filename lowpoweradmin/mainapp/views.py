from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from mainapp.utility import *
# Create your views here.
def index(request):
    return render(request, 'index.html',context={
        'MAXIMUM_CLIENT': getattr(settings, "MAXIMUM_CLIENT", 1)
        ,'IP':visitor_ip_address(request)
})

def calculate(request):
    print("this calculate data.")
    readFile()


    return JsonResponse({"success": "calculate()", "data": 'OK'}, status=200)