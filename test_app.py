import unittest
from app import app, db
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


if __name__ == '__main__':
    unittest.main()
