# Deployment Guide - Hospital Management System

## ❌ Why GitHub Pages Won't Work

GitHub Pages only hosts **static websites** (HTML, CSS, JavaScript). It cannot:
- Run PHP code
- Access databases (SQLite)
- Process server-side requests
- Execute API endpoints

Your application requires PHP and SQLite, so it needs a **PHP hosting service**.

---

## ✅ Free PHP Hosting Options

### Option 1: 000webhost (Recommended - Easiest)
**Website:** https://www.000webhost.com

**Steps:**
1. Sign up for free account
2. Create a new website
3. Upload all your files via File Manager or FTP
4. Your site will be live at: `yourname.000webhostapp.com`

**Features:**
- ✅ Free PHP hosting
- ✅ MySQL database (you can convert SQLite to MySQL if needed)
- ✅ No credit card required
- ✅ Easy file upload

---

### Option 2: InfinityFree
**Website:** https://www.infinityfree.net

**Steps:**
1. Create free account
2. Add new website
3. Upload files via File Manager
4. Your site will be live at: `yourname.infinityfreeapp.com`

**Features:**
- ✅ Free PHP hosting
- ✅ MySQL database available
- ✅ No ads on your site
- ✅ Unlimited bandwidth

---

### Option 3: Freehostia
**Website:** https://www.freehostia.com

**Steps:**
1. Sign up for free account
2. Create hosting account
3. Upload files via File Manager
4. Your site will be live

**Features:**
- ✅ Free PHP hosting
- ✅ MySQL database
- ✅ 250MB storage

---

## 🔄 Converting SQLite to MySQL (If Needed)

Some free hosts only support MySQL. Here's how to convert:

### Step 1: Export SQLite Data
```sql
-- Your schema.sql already has the structure
-- Just need to ensure it's MySQL compatible
```

### Step 2: Update `config/database.php`

Replace the SQLite code with MySQL:

```php
<?php
// MySQL Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'your_database_username');
define('DB_PASS', 'your_database_password');
define('DB_NAME', 'your_database_name');

class Database {
    private $conn;
    
    public function __construct() {
        $this->connect();
    }
    
    private function connect() {
        try {
            $this->conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8",
                DB_USER,
                DB_PASS
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            die("Database connection error: " . $e->getMessage());
        }
    }
    
    // ... rest of the methods stay the same
}
```

### Step 3: Update `database/schema.sql`

Change SQLite syntax to MySQL:

```sql
-- Change INTEGER PRIMARY KEY AUTOINCREMENT to INT AUTO_INCREMENT PRIMARY KEY
-- Change DATETIME DEFAULT CURRENT_TIMESTAMP to TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- Remove IF NOT EXISTS from CREATE INDEX (or keep it, MySQL supports it)
```

---

## 📤 Uploading Files to Host

### Method 1: File Manager (Easiest)
1. Log into your hosting control panel
2. Go to File Manager
3. Navigate to `public_html` or `www` folder
4. Upload all your project files

### Method 2: FTP (Faster for large files)
1. Get FTP credentials from hosting panel
2. Use FTP client like FileZilla
3. Connect and upload files

**Files to Upload:**
- ✅ All PHP files (index.php, api/*, config/*, includes/*)
- ✅ All assets (assets/css/*, assets/js/*)
- ✅ database/schema.sql (for reference)
- ✅ README.md
- ✅ .htaccess
- ❌ Don't upload: database/hospital_management.db (will be created on server)

---

## 🔧 Post-Deployment Checklist

1. **Set File Permissions:**
   - `database/` folder: 755 (writable by PHP)
   - PHP files: 644

2. **Test Database Connection:**
   - Visit your site
   - Check if database is created automatically
   - If errors, check file permissions

3. **Update Database Path (if needed):**
   - Some hosts require absolute paths
   - Check hosting documentation

4. **Test the Application:**
   - Create a prescription
   - View prescriptions
   - Check for any errors

---

## 🎓 For University Submission

**If you need to demonstrate the live site:**

1. Deploy to free hosting (000webhost recommended)
2. Share the live URL with your lecturer
3. Include the URL in your project documentation
4. Keep the GitHub repository as source code backup

**Documentation should include:**
- GitHub repository link
- Live demo URL (if deployed)
- Setup instructions
- Database structure

---

## 💡 Alternative: Keep It Local

If you don't need a live website:
- ✅ Keep it on GitHub (for code sharing)
- ✅ Run locally with `php -S localhost:8000`
- ✅ Show it to lecturer during presentation
- ✅ Submit GitHub link as proof of work

---

## 🚀 Quick Deploy to 000webhost

1. Go to https://www.000webhost.com
2. Click "Get Started Free"
3. Create account
4. Add new website
5. Upload files via File Manager
6. Done! Your site is live

**Note:** You may need to convert SQLite to MySQL for 000webhost. Contact me if you need help with the conversion!

---

## 📝 Need Help?

If you encounter issues:
1. Check hosting error logs
2. Verify file permissions
3. Test database connection
4. Check PHP version (needs 7.4+)

