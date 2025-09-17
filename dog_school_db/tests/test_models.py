import unittest
from dog_school.models import Dog, Owner, TrainingSession

class TestDogModel(unittest.TestCase):
    def setUp(self):
        self.dog = Dog(name="Buddy", breed="Golden Retriever", age=3)

    def test_dog_creation(self):
        self.assertEqual(self.dog.name, "Buddy")
        self.assertEqual(self.dog.breed, "Golden Retriever")
        self.assertEqual(self.dog.age, 3)

    def test_dog_age_increment(self):
        self.dog.increment_age()
        self.assertEqual(self.dog.age, 4)

class TestOwnerModel(unittest.TestCase):
    def setUp(self):
        self.owner = Owner(name="Alice", contact_info="alice@example.com")

    def test_owner_creation(self):
        self.assertEqual(self.owner.name, "Alice")
        self.assertEqual(self.owner.contact_info, "alice@example.com")

class TestTrainingSessionModel(unittest.TestCase):
    def setUp(self):
        self.session = TrainingSession(dog=self.dog, date="2023-10-01", duration=60)

    def test_training_session_creation(self):
        self.assertEqual(self.session.dog, self.dog)
        self.assertEqual(self.session.date, "2023-10-01")
        self.assertEqual(self.session.duration, 60)

if __name__ == '__main__':
    unittest.main()