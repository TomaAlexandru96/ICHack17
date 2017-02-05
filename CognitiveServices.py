import httplib, urllib, base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': 'dcc9ae09ad904e77864a45cb12d09b1a',
}

params = urllib.urlencode({
})

try:
    conn = httplib.HTTPSConnection('westus.api.cognitive.microsoft.com')
    conn.request("POST", "/emotion/v1.0/recognize?%s" % params, '{"url": "http://www.yodesh.com/wp-content/uploads/2012/02/happy-face.jpg"}', headers)
    response = conn.getresponse()
    data = response.read()
    file_object = open("data.json", "w")
    file_object.write(data)
    print(data)
    conn.close()
except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))
