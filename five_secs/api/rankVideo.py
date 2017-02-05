import json


def returnStars(data):
    data = json.loads(data)
    content = data['fragments']

    actualHappiness = 1
    if (len(content) == 0):
        print("The video must not be empty")

    for x in range (0, len(content)):
        for y in range(0, len(content[x])):
           for z in range(0, len(content[x]['events'])):

            happiness =  content[x]['events'][z][0]['windowMeanScores']['happiness'] if (content[x]['events'][z][0]['windowMeanScores']['happiness'] <= 1) else 0
            sadness = content[x]['events'][z][0]['windowMeanScores']['sadness']  if (content[x]['events'][z][0]['windowMeanScores']['sadness'] <= 1) else 0
            disgust = content[x]['events'][z][0]['windowMeanScores']['disgust'] if (content[x]['events'][z][0]['windowMeanScores']['disgust'] <= 1) else 0
            fear = content[x]['events'][z][0]['windowMeanScores']['fear'] if (content[x]['events'][z][0]['windowMeanScores']['fear'] <= 1) else 0
            neutral =content[x]['events'][z][0]['windowMeanScores']['neutral'] if (content[x]['events'][z][0]['windowMeanScores']['neutral'] <= 1) else 0
            anger =content[x]['events'][z][0]['windowMeanScores']['anger'] if (content[x]['events'][z][0]['windowMeanScores']['anger'] <= 1) else 0
            actualHappiness = (actualHappiness +
                               happiness + (neutral/2) - (sadness + disgust + fear + anger))/2
    #Let's make it more optimistic
    return ((actualHappiness + 5)/2)*5
