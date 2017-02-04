from __future__ import unicode_literals

from django.db import models

class User(models.Model):
    token_id = models.CharField(max_length=256)
    name = models.CharField(max_length=256)
    picture_url = models.URLField()

class Event(models.Model):
    token_id = models.ForeignKey(User)
    rate = models.PositiveSmallIntegerField(null=True)
    video = models.FileField(null=True)
    description = models.TextField()
    longitude = models.FloatField()
    latitude = models.FloatField()
