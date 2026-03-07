const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "fahi",
    database: process.env.DB_NAME || "quiz_app",
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error("❌ DB Connection Error:", err);
    } else {
        console.log("✅ MySQL Connected");
    }
});

module.exports = db;
