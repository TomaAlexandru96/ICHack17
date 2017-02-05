import requests
from rankVideo import returnStars

Skey = '32cec343fff74151bdb49237f3aecd7c'

headers = {
    # Request headers
    'Ocp-Apim-Subscription-Key': Skey,
}

def send_video(url):
    body = {"url" : url}
    r = requests.post("https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognizeinvideo?outputStyle=aggregate", headers=headers, json=body)
    return r.headers["Operation-Location"]

def receive_json(ret_url):
    while True:
        r = requests.get(ret_url, headers=headers)
        if r.json()["status"] == "Failed" or r.status_code >= 300:
            return -1
        if r.json()["status"] != "Succeeded":
            import time
            time.sleep(30)
            continue
        data = r.json()['processingResult']
        stars = returnStars(data)
        return stars
