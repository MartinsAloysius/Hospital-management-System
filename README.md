# Hospital Management System - Prescription Module

A digital prescription system that allows doctors to prescribe medications and save all prescription details in a database using PHP.

## Features

- **Create Prescriptions**: Doctors can create digital prescriptions with multiple medications
- **Patient Management**: Link prescriptions to patients
- **Doctor Management**: Assign prescriptions to doctors
- **Medication Tracking**: Store detailed medication information including dosage, frequency, duration, and instructions
- **View Prescriptions**: View and filter prescriptions by doctor or patient
- **Database Storage**: All prescription data is securely stored in MySQL database

## Requirements

- PHP 7.4 or higher (with SQLite extension - usually included by default)
- Web browser
- No MySQL server required! Uses SQLite (file-based database)

## Installation

### 1. Database Setup

**No setup required!** The system uses SQLite, which is a file-based database. The database will be automatically created when you first run the application.

The database file will be created at: `database/hospital_management.db`

### 2. Database Configuration

**No configuration needed!** The system automatically:
- Creates the database file if it doesn't exist
- Creates all necessary tables
- Inserts sample data (doctors and patients)

Everything is handled automatically in `config/database.php`.

### 3. Web Server Setup

#### Using XAMPP/WAMP/MAMP:

1. Copy the project folder to your web server directory:
   - XAMPP: `C:\xampp\htdocs\` (Windows) or `/Applications/XAMPP/htdocs/` (Mac)
   - WAMP: `C:\wamp64\www\`
   - MAMP: `/Applications/MAMP/htdocs/`

2. Start Apache and MySQL services

3. Access the application:
   ```
   http://localhost/hositalmanagementsystem group8/
   ```

#### Using PHP Built-in Server:

1. Navigate to the project directory:
   ```bash
   cd "hositalmanagementsystem group8"
   ```

2. Start the PHP server:
   ```bash
   php -S localhost:8000
   ```

3. Access the application:
   ```
   http://localhost:8000
   ```

## Project Structure

```
hositalmanagementsystem group8/
├── api/
│   ├── create_prescription.php    # API endpoint for creating prescriptions
│   └── get_prescriptions.php      # API endpoint for retrieving prescriptions
├── assets/
│   ├── css/
│   │   └── style.css              # Main stylesheet
│   └── js/
│       └── script.js              # JavaScript functionality
├── config/
│   └── database.php               # Database configuration
├── database/
│   └── schema.sql                 # Database schema
├── includes/
│   └── functions.php              # Helper functions
├── index.php                      # Main application page
└── README.md                      # This file
```

## Database Schema

The system uses SQLite and automatically creates the following tables:

- **doctors**: Stores doctor information
- **patients**: Stores patient information
- **prescriptions**: Main prescription records
- **prescription_medications**: Individual medications in each prescription

The database file is located at `database/hospital_management.db` and is created automatically on first run.

## Usage

### Creating a Prescription

1. Navigate to the "Create Prescription" tab
2. Select a doctor from the dropdown
3. Select a patient
4. Enter the prescription date (defaults to today)
5. Optionally add diagnosis and notes
6. Click "Add Medication" to add medications
7. Fill in medication details:
   - Medication Name (required)
   - Dosage (required)
   - Frequency (required)
   - Duration (required)
   - Quantity (optional)
   - Instructions (optional)
8. Click "Save Prescription" to save

### Viewing Prescriptions

1. Navigate to the "View Prescriptions" tab
2. Use the filters to view prescriptions by:
   - Doctor
   - Patient
3. All prescriptions are displayed with their details

## Sample Data

The database schema includes sample data for testing:
- 3 sample doctors
- 3 sample patients

You can use these for testing or remove them and add your own data.

## Security Notes

- The application uses prepared statements to prevent SQL injection
- Input validation is implemented on both client and server side
- Consider implementing user authentication for production use
- Ensure proper file permissions on the server

## Troubleshooting

### Database Connection Error

- Ensure the `database/` directory exists and is writable
- Check file permissions on the database directory
- SQLite should work out of the box - no server setup needed!

### Prescription Not Saving

- Check browser console for JavaScript errors
- Verify API endpoints are accessible
- Check PHP error logs
- Ensure database tables are created correctly

### Page Not Loading

- Verify web server is running
- Check file paths are correct
- Ensure PHP is properly installed and configured

## Future Enhancements

Potential improvements for the system:
- User authentication and authorization
- Prescription printing/PDF generation
- Email notifications
- Medication inventory management
- Prescription history tracking
- Advanced search and filtering
- Patient prescription history view

## License

This project is created for educational purposes as part of Group 8's Hospital Management System assignment.

## Support

For issues or questions, please refer to the project documentation or contact the development team.

