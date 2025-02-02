from flask import Flask, request, jsonify
import boto3
import uuid
import tempfile
import os
import cv2
import mediapipe as mp
import numpy as np
import requests
# import speech_recognition as sr

app = Flask(__name__)

# AWS DynamoDB Configuration
dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
users_table = dynamodb.Table("Users")

# MediaPipe Setup for Hand, Pose, and FaceMesh Detection
mp_hands = mp.solutions.hands
mp_pose = mp.solutions.pose
mp_face_mesh = mp.solutions.face_mesh

# Initialize MediaPipe models
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7)
pose = mp_pose.Pose(min_detection_confidence=0.7, min_tracking_confidence=0.7)
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.7, min_tracking_confidence=0.7)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key={GEMINI_API_KEY}"


@app.route('/')
def index():
    return jsonify({"message": "API is running"})

@app.route("/api/chat", methods=["POST"])
def detect_pil():
    if "audio" in request.files:  # Voice message processing
        audio_file = request.files["audio"]

        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
            audio_path = temp_audio.name
            audio_file.save(audio_path)

        # Convert audio to text
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_path) as source:
            audio_data = recognizer.record(source)
            try:
                user_message = recognizer.recognize_google(audio_data)
            except sr.UnknownValueError:
                return jsonify({"reply": "I couldn't understand that. Try speaking clearly."})
        
        os.remove(audio_path)

    else:  # Text message processing
        data = request.json
        user_message = data.get("message", "")

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

    try:
        # Call Google Gemini API
        response = requests.post(
            GEMINI_ENDPOINT,
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": f"You are Bruno the Bear, a friendly and comforting companion for children recovering from surgery. {user_message}"}]}]
            }
        )

        response_json = response.json()

        # Extract response text
        if "candidates" in response_json and response_json["candidates"]:
            reply = response_json["candidates"][0]["content"]["parts"][0]["text"]
        else:
            reply = "Sorry, I couldn't process that request."

        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/detect_pill', methods=['POST'])
def detect_pill():
    if 'video' not in request.files:
        return jsonify({'error': "No video included in request"})
    
    video_file = request.files['video']
    
    # Create a temporary file to store the video
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as tmp_file:
        video_path = tmp_file.name
        video_file.save(video_path)
    
    # Process the video and detect pill-taking action
    detected = process_video(video_path)
    
    # Clean up the temporary file
    os.remove(video_path)
    
    return jsonify({'detected': detected})

# Function to process the video and detect the pill-taking action
def process_video(video_path):
    cap = cv2.VideoCapture(video_path)
    detected = False
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results_hands = hands.process(rgb_frame)
        results_pose = pose.process(rgb_frame)
        results_face_mesh = face_mesh.process(rgb_frame)

        if results_hands.multi_hand_landmarks:
            for landmarks in results_hands.multi_hand_landmarks:
                thumb_tip = landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
                index_tip = landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
                distance = np.linalg.norm([thumb_tip.x - index_tip.x, thumb_tip.y - index_tip.y])
                if distance < 0.05:
                    detected = True
                    break

        if results_face_mesh.multi_face_landmarks:
            for face_landmarks in results_face_mesh.multi_face_landmarks:
                mouth_center = face_landmarks.landmark[13]
                left_wrist = results_pose.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST] if results_pose.pose_landmarks else None
                if left_wrist:
                    distance = np.linalg.norm([left_wrist.x - mouth_center.x, left_wrist.y - mouth_center.y])
                    if distance < 0.2:
                        detected = True
                        break

        if detected:
            break

    cap.release()
    return detected

@app.route("/auth", methods=["POST"])
def authenticate():
    data = request.json
    if not data.get("username"):
        return jsonify({"error": "Username required"}), 400
    
    response = users_table.get_item(Key={"username": data["username"]})
    user = response.get("Item")
    
    if not user:
        user = {
            "username": data["username"],
            "progress": [],
            "level": 1,
            "exp": 0,
            "currency": 0
        }
        users_table.put_item(Item=user)
    
    return jsonify({"message": "User authenticated", "user": user})

@app.route("/user/<username>/progress", methods=["GET"])
def get_progress(username):
    response = users_table.get_item(Key={"username": username})
    user = response.get("Item")
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"progress": user["progress"], "level": user["level"], "exp": user["exp"]})

@app.route("/user/<username>/update", methods=["POST"])
def update_progress(username):
    data = request.json
    response = users_table.get_item(Key={"username": username})
    user = response.get("Item")
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    new_progress = data.get("progress", [])
    users_table.update_item(
        Key={"username": username},
        UpdateExpression="SET progress = list_append(progress, :p)",
        ExpressionAttributeValues={":p": new_progress}
    )
    
    return jsonify({"message": "Progress updated successfully"})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
