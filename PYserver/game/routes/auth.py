from flask import Blueprint, jsonify, request, redirect, url_for
from werkzeug import exceptions

#* Login
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from tool import get_random_string, get_random_avatar

#* Email
from flask_mail import Mail, Message
mail = Mail()

from ..models.user import User
from ..database.db import db

auth = Blueprint("auth", __name__)

@auth.route("/home")
def home():
    if (current_user.is_authenticated):
        return jsonify(current_user)
    else :
        return "redirect to login page"

@auth.route("/login", methods=['POST'])
def login():
    if(current_user.is_authenticated):
        return f"Hi {current_user.username}, you have logged in already."
    
    userData = request.json
    foundUsername = User.query.filter_by(username=str(userData['username'])).first()
    if (foundUsername and check_password_hash(foundUsername.password, userData['password'])):
        login_user(foundUsername, remember=True)
        
        #? Cheating
        stats = { 
            "avatar_url": current_user.avatar_url,
            "wins": current_user.wins,
            "wins_as_hunter": current_user.wins_as_hunter,
            "games_played": current_user.games_played,
        }
        return jsonify(stats), 200
        #? Cheating 
        
        return "Logged in!", 200
    raise exceptions.BadRequest(f"Failed login! \nIncorrect login details")


@auth.route("/register", methods=['POST'])
def register():
    if(current_user.is_authenticated):
        return f"Hi {current_user.username}, you have logged in already."
    
    userData = request.json
        
    #* Check register detail
    # Empty username
    if not (userData["username"] or len(userData["username"])):
        raise exceptions.BadRequest("username cannot be empty")
    # Empty password
    if not (userData["password"] or len(userData["password"])):
        raise exceptions.BadRequest("password cannot be empty")
    # Empty email
    if not ("@" in userData["email"] or "." in userData["email"]):
        raise exceptions.BadRequest("Invalid Email")
    
    if (User.query.filter_by(username=str(userData["username"])).first()):
        raise exceptions.Conflict('User already exists')
    else:
        new_user = User(
            username = userData["username"], 
            email = userData["email"],
            password = generate_password_hash(userData["password"], method='sha256'),
            OTP = get_random_string(),
            wins = 0, 
            wins_as_hunter = 0, 
            games_played = 0,
            avatar_url = get_random_avatar(),
            )
        db.session.add(new_user)
        db.session.commit()
        
        login_user(new_user, remember=True)
        
        username = userData["username"]
        msg = Message(
            f"Thank you for register an account with us, {username}!", 
            sender='gustafsson_revelio@outlook.com',
            recipients=[userData["email"]])
        msg.html = "<h1>Revelio Welcomes you!</h1>"
        msg.msgId = msg.msgId.split('@')[0] + '@Revelio'
        mail.send(msg)
        
        return jsonify(userData), 201

@auth.route("/forgot_password", methods=['POST'])
def forgotPassword():
    #? {
    #?     "username": "",
    #?     "email": ""
    #? }
    userData = request.json
    if not ('username' in userData and 'email' in userData):
        raise exceptions.BadRequest("You need to have corresponding username and email to reset your password.")
    try:
        # user can use the same email to register muiltiply accounts with different username
        foundUsername = User.query.filter_by(username=str(userData['username'])).first()
        if(foundUsername.email == userData['email']):
            foundUsername.OTP = get_random_string()
            db.session.commit()
            msg = Message(
                f"Here is your OTP, {foundUsername.username}!", 
                sender='gustafsson_revelio@outlook.com',
                recipients=[userData["email"]])
            msg.html = f"<h1>Here is your 8-characters OTP for your Revelio account: {foundUsername.OTP}</h1><h2>Link to reset.</h2>"
            msg.msgId = msg.msgId.split('@')[0] + '@Revelio'
            mail.send(msg)
        return "Please check your Email inbox for resetting the password", 200
    except:
        return "Please check your Email inbox for resetting the password", 200

@auth.route("/reset_password", methods=['PATCH'])
def resetPassword():
    #? {
    #?     "username": "",
    #?     "OTP": "",
    #?     "new_password": "",
    #? }
    userData = request.json
    
    if not ('username' in userData and 'OTP' in userData and 'new_password' in userData):
        raise exceptions.BadRequest("You need to have corresponding username, OTP, new_password to reset your password.")
    
    foundUsername = User.query.filter_by(username=str(userData['username'])).first()
    if(foundUsername and foundUsername.OTP == userData['OTP']):
        foundUsername.password = generate_password_hash(userData["new_password"], method='sha256')
        foundUsername.OTP = get_random_string()
        db.session.commit()
        return "Reset Password Successful!", 200
    raise exceptions.BadRequest(f"Failed to rest! \nIncorrect details")

@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return "Logout"

@auth.route("/profile")
@login_required
def profile():
    stats = { 
        "avatar_url": current_user.avatar_url,
        "wins": current_user.wins,
        "wins_as_hunter": current_user.wins_as_hunter,
        "games_played": current_user.games_played,
    }
    return jsonify(stats)

@auth.route("/stats-update", methods=['PATCH'])
@login_required
def stats_update():
    #? PATCH to http://127.0.0.1:3030/stats-update
    #? {
    #?     "win": true,
    #?     "win_as_hunter": true
    #? }
    
    current_user.games_played += 1
    
    # win = Boolean
    if request.json['win']:
        current_user.wins += 1
    
    # win_as_hunter = Boolean
    if request.json['win_as_hunter']:
        current_user.wins_as_hunter += 1
        
    if request.json['win_as_hunter'] and not request.json['win']:
        raise exceptions.BadRequest(f"you cannot lose but win as hunter at the same time")
    
    db.session.commit()
    
    stats = { 
        "wins": current_user.wins,
        "wins_as_hunter": current_user.wins_as_hunter,
        "games_played": current_user.games_played,
    }
    return jsonify(stats)

@auth.errorhandler(exceptions.Unauthorized)
def handle_401(err):
    return redirect(url_for('auth.home'))

