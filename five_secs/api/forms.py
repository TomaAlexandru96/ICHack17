from django import forms

class VideoForm(forms.Form):
    event_id = forms.IntegerField()
    video = forms.FileField()
