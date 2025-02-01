# Flask Medication Reminder

This project is a web application designed to help children who have undergone heart surgery remember to take their medications. The app provides a step-by-step guide through a series of pages, making the process engaging and easy to follow.

## Project Structure

```
flask-medication-reminder
├── static
│   ├── css
│   │   └── styles.css       # CSS styles for the application
│   └── js
│       └── scripts.js       # JavaScript for client-side functionality
├── templates
│   ├── base.html            # Base template with common structure
│   ├── home.html            # Landing page of the application
│   ├── step1.html           # First step in the medication reminder process
│   ├── step2.html           # Second step in the process
│   ├── step3.html           # Third step in the process
│   ├── step4.html           # Fourth step in the process
│   └── step5.html           # Final step in the process
├── app.py                   # Main application file
├── requirements.txt          # List of dependencies
└── README.md                # Documentation for the project
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd flask-medication-reminder
   ```

2. **Create a virtual environment:**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```
   python app.py
   ```

5. **Access the application:**
   Open your web browser and go to `http://127.0.0.1:5000`.

## Usage

- Start at the home page to navigate through the steps.
- Follow the instructions provided on each step to ensure proper medication reminders.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. Your contributions are welcome!