from api.models import Event, User
from api.serializers import EventSerializer, UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import requests
from django.db.backends.signals import connection_created
from django.dispatch import receiver
import math
from api.forms import VideoForm
from django.contrib.staticfiles.templatetags.staticfiles import static
from api.CognitiveServicesVideos import send_video, receive_json

@receiver(connection_created)
def extend_sqlite(connection=None, **kwargs):
    if connection.vendor == "sqlite":
        # sqlite doesn't natively support math functions, so add them
        cf = connection.connection.create_function
        cf('acos', 1, math.acos)
        cf('cos', 1, math.cos)
        cf('radians', 1, math.radians)
        cf('sin', 1, math.sin)

def cleanup_events():
    import datetime
    Event.objects.filter(end_time__lte=datetime.datetime.now()).delete()

@api_view(['GET', 'POST'])
@permission_classes((AllowAny, ))
def event_list(request):
    """
    List all events, or create a new event.
    """
    cleanup_events()
    if request.method == 'GET':
        try:
            lat = request.GET.get("latitude")
            lng = request.GET.get("longitude")
            rad = request.GET.get("radius")
            query = """SELECT id, (6367*acos(cos(radians(%2f))
                        *cos(radians(latitude))*cos(radians(longitude)-radians(%2f))
                        +sin(radians(%2f))*sin(radians(latitude))))
                        AS distance FROM api_event WHERE
                        distance < %2f ORDER BY distance LIMIT 0, %d""" % (
                float(lat),
                float(lng),
                float(lat),
                float(rad),
                10 # limit
            )
            events = Event.objects.raw(query)
        except Exception:
            title = request.GET.get("title")
            if title != None and title != "":
                events = Event.objects.filter(title__icontains=title)
            else:
                events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes((AllowAny, ))
def event_detail(request, pk):
    """
    Retrieve, update or delete a event instance.
    """
    cleanup_events()
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EventSerializer(event)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes((AllowAny, ))
def user_list(request):
    """
    List all users, or create a new user.
    """
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        try:
            user_id = request.data["userID"]
            token_id = request.data["accessToken"]
            try:
                user = User.objects.get(pk=user_id)
                serializer = UserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                pass
        except Exception:
            return Response("Invalid", status=status.HTTP_400_BAD_REQUEST)
        r = requests.get("https://graph.facebook.com/v2.8/me?access_token=%s&fields=id,name,picture" % token_id)
        result = r.json()
        try:
            pic_url = result["picture"]["data"]["url"]
        except Exception:
            return Response("You must have a profile picture", status=status.HTTP_400_BAD_REQUEST)
        user = {
            "user_id": user_id,
            "picture_url": pic_url,
            "name": result["name"]
        }
        if r.status_code != 200:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        serializer = UserSerializer(data=user)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes((AllowAny, ))
def user_detail(request, pk):
    """
    Retrieve, update or delete a user instance.
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes((AllowAny, ))
def video_upload(request):
    import os
    form = VideoForm(request.POST, request.FILES)
    if form.is_valid():
        event_id = form.cleaned_data["event_id"]
        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response("Invalid event id", status=status.HTTP_400_BAD_REQUEST)
        video = request.FILES['video']
    else:
        return Response("Invalid Request", status=status.HTTP_400_BAD_REQUEST)
    if not os.path.exists("static"):
        os.mkdir("static")
    filename = str(event_id) + os.path.splitext(video.name)[1]
    with open(os.path.join("static", filename), "wb") as dest:
        for chunk in video.chunks():
            dest.write(chunk)
    event.video = static(filename)
    event.rate = max(5, min(0, int(receive_json(send_video("http://13.74.168.159" + static(filename))) + 0.5)))
    event.save()
    serializer = EventSerializer(event)
    return Response(serializer.data, status=status.HTTP_200_OK)
