from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import bcrypt
import secrets

app = Flask(__name__)

import os

uri = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost/local_db')
if uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = uri

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = secrets.token_hex(16)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Hotel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    link = db.Column(db.String(1000), nullable=False) 


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotel.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Successfully logged out!', 'redirect_url': '/login'}), 200

@app.route('/add_hotel')
def add_hotel():
    return render_template('add_hotel.html')

@app.route('/signup', methods=['POST'])
def handle_signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    
    #validation to check existing users hsould not signup again"
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    after_hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_user = User(email=email, password=after_hashed_password.decode('utf-8'))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'You are successfully signed up!'}), 200

@app.route('/dashboard', methods=['GET'])
def dashboard():
    print(session)
    if 'user' in session:
        return render_template('customer_dashboard.html')
    elif 'admin' in session:
        return render_template('admin_dashboard.html')

@app.route('/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    admin_email = 'holiday@gmail.com'
    admin_password = 'Holiday@2021'

    if not email or not password:
        return jsonify({'message': 'Please fill in all fields'}), 400
    if email == admin_email and password == admin_password:
        session['admin'] = admin_email
        return jsonify({
            'message': 'Successfully logged in as admin!',
            'redirect_url': '/dashboard'
        }), 200

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Email or password are not correct'}), 401

    if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        session['user']= email
        return jsonify({
            'message': 'Successfully logged in!',
            'redirect_url': '/dashboard'
        }), 200
    else:
        return jsonify({'message': 'Email or password are not correct'}), 401

@app.route('/api/add_hotel', methods=['POST'])
def handle_add_hotel():
    data = request.json
    name = data.get('name')
    location = data.get('location')
    description = data.get('description')
    link = data.get('link')

    if not name or not location or not description or not link:
        return jsonify({'message': 'All fields are required'}), 400

    new_hotel = Hotel(name=name, location=location, description=description, link=link)
    db.session.add(new_hotel)
    db.session.commit()
    return jsonify({'message': 'Hotel successfully added!'}), 200

@app.route('/view_hotels', methods=['GET'])
def view_hotels():
    return render_template('view_hotel.html')

@app.route('/api/get_hotels', methods=['GET'])
def get_hotels():
    hotels = Hotel.query.all()
    hotels_list = [{'id': hotel.id, 'name': hotel.name, 'location': hotel.location, 'description': hotel.description, 'link': hotel.link} for hotel in hotels]
    return jsonify({'hotels': hotels_list}), 200

@app.route('/edit_hotel/<int:hotel_id>', methods=['GET'])
def edit_hotel(hotel_id):
    hotel = Hotel.query.get_or_404(hotel_id)
    return render_template('edit_hotel.html', hotel=hotel)


@app.route('/api/update_hotel/<int:hotel_id>', methods=['POST'])
def update_hotel(hotel_id):
    data = request.json
    hotel = Hotel.query.get_or_404(hotel_id)

    # Update hotel details
    hotel.name = data.get('name', hotel.name)
    hotel.location = data.get('location', hotel.location)
    hotel.description = data.get('description', hotel.description)
    hotel.link = data.get('link', hotel.link)

    # Commit changes to the database
    db.session.commit()
    return jsonify({'message': 'Hotel successfully updated!'}), 200

@app.route('/api/delete_hotel/<int:hotel_id>', methods=['DELETE'])
def delete_hotel(hotel_id):
    hotel = Hotel.query.get_or_404(hotel_id)
    db.session.delete(hotel)
    db.session.commit()
    return jsonify({'message': 'Hotel successfully deleted!'}), 200

@app.route('/api/book_hotel/<int:hotel_id>', methods=['POST'])
def book_hotel_api(hotel_id):
    if 'user' not in session:
        return redirect(url_for('login'))
    
    user_email = session.get('user')
    data = request.get_json()
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'error': 'User not found.'}), 404
    hotel = Hotel.query.get_or_404(hotel_id)
    new_booking = Booking(
        user_id=user.id,
        hotel_id=hotel.id,
        start_date=start_date,
        end_date=end_date
    )
    db.session.add(new_booking)
    db.session.commit()

    return jsonify({'message': 'Hotel successfully booked!'}), 200

@app.route('/api/get_hotel/<int:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    hotel = Hotel.query.get_or_404(hotel_id)
    hotel_data = {
        'id': hotel.id,
        'name': hotel.name,
        'location': hotel.location,
        'description': hotel.description,
        'link': hotel.link
    }
    return jsonify({'hotel': hotel_data})

@app.route('/book_hotel/<int:hotel_id>')
def book_hotel(hotel_id):
    return render_template('book_hotel.html', hotel_id=hotel_id)

@app.route('/my_bookings', methods=['GET'])
def my_bookings():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    user_email = session.get('user')
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({'error': 'User not found.'}), 404

    bookings = Booking.query.filter_by(user_id=user.id).all()
    bookings_list = []
    for booking in bookings:
        hotel = Hotel.query.get(booking.hotel_id)
        bookings_list.append({
            'hotel_name': hotel.name,
            'location': hotel.location,
            'start_date': booking.start_date.strftime('%Y-%m-%d'),
            'end_date': booking.end_date.strftime('%Y-%m-%d')
        })

    return jsonify(bookings_list)

@app.route('/my_bookings_page')
def my_bookings_page():
    return render_template('my_bookings.html')

@app.route('/search_hotels')
def search_hotels():
    return render_template('search_hotels.html')

@app.route('/api/search_hotels', methods=['GET'])
def search_hotels_api():
    query = request.args.get('query')
    if not query:
        return jsonify({'message': 'Query parameter is required'}), 400

    hotels = Hotel.query.filter(
        (Hotel.name.ilike(f'%{query}%')) |
        (Hotel.location.ilike(f'%{query}%'))
    ).all()

    hotel_list = [{'id': hotel.id, 'name': hotel.name, 'location': hotel.location, 'description': hotel.description, 'link': hotel.link} for hotel in hotels]

    return jsonify({'hotels': hotel_list})

if __name__ == '__main__':
    app.run(debug=True)
