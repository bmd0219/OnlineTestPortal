# import os
import cv2
# import numpy as np
import face_recognition

imgMaddy = face_recognition.load_image_file('faceTest/Maddy.jpg')
imgMaddy = cv2.cvtColor(imgMaddy, cv2.COLOR_BGR2RGB)
imgTest = face_recognition.load_image_file('faceTest/Suri.jpeg')
imgTest = cv2.cvtColor(imgTest, cv2.COLOR_BGR2RGB)

faceLoc = face_recognition.face_locations(imgMaddy)[0]
encodeElon = face_recognition.face_encodings(imgMaddy)[0]
cv2.rectangle(imgMaddy, (faceLoc[3], faceLoc[0]), (faceLoc[1], faceLoc[2]), (255, 0, 255), 2)
#
# faceTestLoc = face_recognition.face_locations(imgTest)[0]
# encodeTest = face_recognition.face_encodings(imgTest)[0]
# cv2.rectangle(imgTest, (faceTestLoc[3], faceTestLoc[0]), (faceTestLoc[1], faceTestLoc[2]), (255, 0, 255), 2)
#
# results = face_recognition.compare_faces([encodeElon], encodeTest)
# faceDis = face_recognition.face_distance([encodeElon], encodeTest)
# print(results)
# cv2.putText(imgTest, f'{results} {round(faceDis[0], 2)}', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
#
# cv2.imshow('Maddy', imgMaddy)
# cv2.imshow('Maddy Test', imgTest)
# cv2.waitKey(0)

cap = cv2.VideoCapture(0)

while True:
    success, img = cap.read()
    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    face = face_recognition.face_locations(imgS)
    encode = face_recognition.face_encodings(imgS)

    for face1, encode1 in zip(face, encode):
        result = face_recognition.compare_faces([encodeElon], encode1)
        print(result)

    cv2.imshow("Webcam", img)
    cv2.waitKey(1)
