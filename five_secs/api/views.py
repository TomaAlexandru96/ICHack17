from api.models import Event, User
from api.serializers import EventSerializer, UserSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import requests

class EventList(generics.ListCreateAPIView):
    permission_classes = (AllowAny, )
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (AllowAny, )
    queryset = Event.objects.all()
    serializer_class = EventSerializer

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
        user_id = request.data["userID"]
        token_id = request.data["accessToken"]
        r = requests.get("https://graph.facebook.com/v2.8/me?access_token=%s&fields=id,name,picture" % token_id)
        result = r.json()
        try:
            pic_url = result["picture"]["data"]["url"]
        except ValueError:
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
