import unittest
from app import app, db, Hotel, User
import time

class TestApp(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['SECRET_KEY'] = 'test_secret'
        cls.client = app.test_client()
        with app.app_context():
            db.create_all()

    @classmethod
    def tearDownClass(cls):
        with app.app_context():
            db.drop_all()

    def setUp(self):
        self.client = TestApp.client
        self.test_email = f"test{int(time.time())}@example.com"
        with app.app_context():
            user = User(email=self.test_email, password="testpassword")
            db.session.add(user)
            db.session.commit()

    def tearDown(self):
        with app.app_context():
            db.session.query(Hotel).delete()
            db.session.query(User).delete()
            db.session.commit()
    def test_add_hotel(self):
        response = self.client.post('/api/add_hotel', json={
            'name': 'Hotel Sunshine',
            'location': 'California',
            'description': 'A sunny place',
            'link': 'http://example.com'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Hotel successfully added!', response.data)


    def test_get_hotels(self):
        with app.app_context():
            hotel = Hotel(name='Hotel Moonlight', location='Florida', description='A cozy place', link='http://example.com')
            db.session.add(hotel)
            db.session.commit()

        response = self.client.get('/api/get_hotels')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Hotel Moonlight', response.data)

    def test_update_hotel(self):
        with app.app_context():
            hotel = Hotel(name='Hotel Update', location='Texas', description='To be updated', link='http://example.com')
            db.session.add(hotel)
            db.session.commit()
            hotel_id = hotel.id

        response = self.client.post(f'/api/update_hotel/{hotel_id}', json={
            'name': 'Hotel Updated',
            'location': 'Texas',
            'description': 'Updated description',
            'link': 'http://updated.com'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Hotel successfully updated!', response.data)

    def test_delete_hotel(self):
        with app.app_context():
            hotel = Hotel(name='Hotel Delete', location='Nevada', description='To be deleted', link='http://example.com')
            db.session.add(hotel)
            db.session.commit()
            hotel_id = hotel.id

        response = self.client.delete(f'/api/delete_hotel/{hotel_id}')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Hotel successfully deleted!', response.data)

    def test_search_hotels(self):
        with app.app_context():
            hotel1 = Hotel(name='Hotel Alpha', location='New York', description='First hotel', link='http://example.com')
            hotel2 = Hotel(name='Hotel Beta', location='California', description='Second hotel', link='http://example.com')
            db.session.add(hotel1)
            db.session.add(hotel2)
            db.session.commit()

        response = self.client.get('/api/search_hotels?query=Alpha')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Hotel Alpha', response.data)
        self.assertNotIn(b'Hotel Beta', response.data)

if __name__ == '__main__':
    unittest.main()
