from rest_framework import serializers
from api.models import User, Event

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'name', 'picture_url')

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'user_id', 'rate', 'video', 'description', 'longitude', 'latitude')
        read_only_fields = ('rate',  'video')
