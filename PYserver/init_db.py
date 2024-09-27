from game import db
from game import create_app
from game.models.user import User
from werkzeug.security import generate_password_hash
from tool import get_random_string, get_random_avatar

users = [
    { 
        'username': "s", 
        'email': "s@s.com",
        'password': "s", 
    },
    { 
        'username': "z", 
        'email': "z@z.com",
        'password': "z", 
    },
    { 
        'username': "c", 
        'email': "c@c.com",
        'password': "c", 
    },
]

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()
    for user in users:
        db.session.add(User(
            username = user['username'],
            email = user['email'], 
            password = generate_password_hash(user["password"], method='sha256'),
            OTP = get_random_string(),
            wins = 0,
            wins_as_hunter = 0,
            games_played = 0,
            avatar_url = get_random_avatar(),
        ))
    db.session.commit()
