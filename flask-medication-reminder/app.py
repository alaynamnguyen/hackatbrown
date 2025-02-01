from flask import Flask, render_template, request, redirect, url_for, session
import time

app = Flask(__name__)
app.secret_key = 'your_secret_key'

@app.route("/")
def welcome():
    return render_template("welcome.html")

@app.route("/loading")
def loading():
    return render_template("loading.html")

@app.route("/select_avatar")
def select_avatar():
    return render_template("select_avatar.html")

@app.route("/set_avatar", methods=["POST"])
def set_avatar():
    session["avatar"] = request.form["avatar"]
    return redirect(url_for("home"))

@app.route("/home")
def home():
    avatar = session.get("avatar", "No Avatar Selected")
    return render_template("home.html", avatar=avatar)

if __name__ == "__main__":
    app.run(debug=True)