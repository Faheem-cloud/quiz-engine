const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST || "nozomi.proxy.rlwy.net",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "EmlgtAUTGhhXfbEGCQEPeNUrNIufkpFX",
    database: process.env.DB_NAME || "railway",
    port: process.env.DB_PORT || 12311
});

db.connect((err) => {
    if (err) {
        console.error("❌ DB Connection Error:", err);
    } else {
        console.log("✅ MySQL Connected");
    }
});

module.exports = db;
