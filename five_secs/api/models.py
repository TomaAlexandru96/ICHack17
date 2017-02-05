from __future__ import unicode_literals

from django.db import models

class User(models.Model):
    user_id = models.CharField(max_length=256, primary_key=True)
    name = models.CharField(max_length=256)
    picture_url = models.URLField()

class Event(models.Model):
    user_id = models.ForeignKey(User)
    title = models.CharField(max_length=80)
    address = models.TextField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    rate = models.PositiveSmallIntegerField(null=True)
    video = models.FileField(null=True)
    description = models.TextField()
    longitude = models.FloatField()
    latitude = models.FloatField()
