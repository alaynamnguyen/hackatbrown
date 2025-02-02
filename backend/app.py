from flask import Flask, request, jsonify, send_from_directory, session
from flask_session import Session
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import boto3
import os
import cv2
import mediapipe as mp
import numpy as np
import tempfile

app = Flask(__name__)

app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = "your_secret_key"
Session(app)

# AWS S3 Configuration
# s3 = boto3.client("s3", aws_access_key_id="your_aws_access_key", aws_secret_access_key="your_aws_secret_key")
# S3_BUCKET = "your_s3_bucket_name"

# AWS DynamoDB Configuration
# dynamodb = boto3.resource("dynamodb", region_name="your_region")
# users_table = dynamodb.Table("Users")

# MediaPipe Setup for Hand, Pose, and FaceMesh Detection
mp_hands = mp.solutions.hands
mp_pose = mp.solutions.pose
mp_face_mesh = mp.solutions.face_mesh

# Initialize MediaPipe models
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7)
pose = mp_pose.Pose(min_detection_confidence=0.7, min_tracking_confidence=0.7)
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.7, min_tracking_confidence=0.7)

# Serve the index.html file when the root URL is accessed
@app.route('/')
def index():
    return jsonify({"message": "api"})

# Define the route to process the uploaded video
@app.route('/detect_pill', methods=['POST'])
def detect_pill():
    if not request.files['video']:
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

    # Return the result as JSON
    return jsonify({'detected': detected})

# Function to process the video and detect the pill-taking action
def process_video(video_path):
    cap = cv2.VideoCapture(video_path)
    detected = False
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Convert the frame to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process with MediaPipe for hand and pose detection
        results_hands = hands.process(rgb_frame)
        results_pose = pose.process(rgb_frame)
        results_face_mesh = face_mesh.process(rgb_frame)

        # Check for pill-holding gesture with hands
        if results_hands.multi_hand_landmarks:
            for landmarks in results_hands.multi_hand_landmarks:
                thumb_tip = landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
                index_tip = landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
                distance = np.linalg.norm([thumb_tip.x - index_tip.x, thumb_tip.y - index_tip.y])
                if distance < 0.05:  # Threshold for holding something
                    detected = True
                    break

        # Check for hand near mouth gesture (using Face Mesh landmarks)
        if results_face_mesh.multi_face_landmarks:
            for face_landmarks in results_face_mesh.multi_face_landmarks:
                # Get the mouth center point from Face Mesh landmarks
                mouth_center = face_landmarks.landmark[13]  # Mouth center index in Face Mesh
                left_wrist = results_pose.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST] if results_pose.pose_landmarks else None
                
                if left_wrist:
                    # Check if the left wrist is near the mouth center
                    distance = np.linalg.norm([left_wrist.x - mouth_center.x, left_wrist.y - mouth_center.y])
                    if distance < 0.2:  # Threshold for "near the mouth"
                        detected = True
                        break

        # If pill-taking action is detected, break early
        if detected:
            break

    cap.release()
    return detected

# User Registration/Login (Simplified - Only Username Needed)
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if not data.get("username"):
        return jsonify({"error": "Username required"}), 400
    
    user_id = str(uuid.uuid4())
    user = {
        "user_id": user_id,
        "username": data["username"],
        "progress": [],
        "level": 1,
        "exp": 0,
        "currency": 0
    }
    
    users_table.put_item(Item=user)
    return jsonify({"message": "User registered successfully", "user_id": user_id}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    response = users_table.get_item(Key={"username": data["username"]})
    user = response.get("Item")
    if not user:
        return jsonify({"error": "User not found"}), 401
    
    return jsonify({"message": "Login successful", "user_id": user["user_id"]})

# Get User Progress
@app.route("/user/<user_id>/progress", methods=["GET"])
def get_progress(user_id):
    response = users_table.get_item(Key={"user_id": user_id})
    user = response.get("Item")
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"progress": user["progress"], "level": user["level"], "exp": user["exp"]})

# Update User Progress
@app.route("/user/<user_id>/update", methods=["POST"])
def update_progress(user_id):
    data = request.json
    response = users_table.get_item(Key={"user_id": user_id})
    user = response.get("Item")
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    new_progress = data.get("progress", [])
    users_table.update_item(
        Key={"user_id": user_id},
        UpdateExpression="SET progress = list_append(progress, :p)",
        ExpressionAttributeValues={":p": new_progress}
    )
    
    return jsonify({"message": "Progress updated successfully"})

# Upload Wound Image
@app.route("/user/<user_id>/upload_wound", methods=["POST"])
def upload_wound(user_id):
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    file_name = f"{user_id}_{uuid.uuid4()}.jpg"
    s3.upload_fileobj(file, S3_BUCKET, file_name)
    file_url = f"https://{S3_BUCKET}.s3.amazonaws.com/{file_name}"
    
    users_table.update_item(
        Key={"user_id": user_id},
        UpdateExpression="SET wound_images = list_append(if_not_exists(wound_images, :empty_list), :w)",
        ExpressionAttributeValues={":w": [file_url], ":empty_list": []}
    )
    return jsonify({"message": "File uploaded successfully", "file_url": file_url})

if __name__ == "__main__":
    app.run(debug=True)

