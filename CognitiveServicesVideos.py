import httplib, urllib, base64, json, requests


Skey = '32cec343fff74151bdb49237f3aecd7c'


headers = {
    # Request headers
    'Ocp-Apim-Subscription-Key': Skey,
}

params = urllib.urlencode({
    # Request parameters
    'outputStyle': 'aggregate',
})
def send_video():
    try:
        url = 'https://www.doc.ic.ac.uk/~ii515/video.mp4'
        body = {"url" : url}
        r = requests.post("https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognizeinvideo?outputStyle=aggregate", headers=headers, json=body)
        return r.headers["Operation-Location"]
    except Exception as e:
        print(e.message)

def receive_json(ret_url):

        while True:
            r = requests.get(ret_url, headers=headers)
            print (r.json())
            if r.json()["status"] == "Failed" or r.status_code >= 300:
                return -1
            if r.json()["status"] != "Succeeded":
                import time
                time.sleep(30)
                continue
            data = r.json()['processingResult']
            from rankVideo import returnStars
            stars = returnStars(data)
            print stars
            return stars




ret_addr = send_video()
receive_json(ret_addr)
