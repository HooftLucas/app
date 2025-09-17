# Dog School Database

This project is a database application for managing a dog school. It includes models for dogs, owners, and training sessions, along with services for handling business logic and database interactions.

## Project Structure

```
dog_school_db
├── dog_school
│   ├── __init__.py
│   ├── models.py
│   ├── database.py
│   ├── services.py
│   └── utils.py
├── tests
│   ├── __init__.py
│   └── test_models.py
├── requirements.txt
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd dog_school_db
   ```

2. **Create a virtual environment:**
   ```
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. **Install the required dependencies:**
   ```
   pip install -r requirements.txt
   ```

## Usage

- To run the application, ensure the virtual environment is activated and execute the necessary scripts or commands as defined in the project.

## Testing

- Unit tests are located in the `tests` directory. To run the tests, use:
  ```
  python -m unittest discover -s tests
  ```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.