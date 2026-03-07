const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const ExcelJS = require("exceljs");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));


// =============================
// Home Route
// =============================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// =============================
// Save Quiz Result (NO DUPLICATES)
// =============================
app.post("/submit-quiz", (req, res) => {

    const { name, vtuno, html, css, javascript } = req.body;

    // Check if user exists
    db.query("SELECT id FROM users WHERE vtuno = ?", [vtuno], (err, userResult) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ message: "User lookup failed" });
        }

        if (userResult.length > 0) {

            const userId = userResult[0].id;
            checkScore(userId);

        } else {

            db.query(
                "INSERT INTO users (name, vtuno) VALUES (?, ?)",
                [name, vtuno],
                (err, result) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "User insert failed" });
                    }

                    const userId = result.insertId;
                    checkScore(userId);
                }
            );
        }
    });


    // Check if score already exists
    function checkScore(userId) {

        db.query(
            "SELECT id FROM scores WHERE user_id = ?",
            [userId],
            (err, scoreResult) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Score lookup failed" });
                }

                if (scoreResult.length > 0) {
                    return res.json({ message: "Result already saved" });
                }

                insertScore(userId);
            }
        );
    }


    // Insert score
    function insertScore(userId) {

        db.query(
            `INSERT INTO scores (user_id, html_score, css_score, js_score)
             VALUES (?, ?, ?, ?)`,
            [userId, html, css, javascript],
            (err) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Score insert failed" });
                }

                res.json({ success: true });
            }
        );
    }

});


// =============================
// Check Quiz Completion
// =============================
app.get("/check-completion/:vtuno", (req, res) => {

    const vtuno = req.params.vtuno;

    const query = `
    SELECT scores.id
    FROM users
    LEFT JOIN scores ON users.id = scores.user_id
    WHERE users.vtuno = ?
    LIMIT 1
    `;

    db.query(query, [vtuno], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ completed: false });
        }

        res.json({ completed: result.length > 0 });
    });

});


// =============================
// Admin: View Results
// =============================
app.get("/admin/results", (req, res) => {

const query = `
SELECT 
users.name,
users.vtuno,
scores.html_score,
scores.css_score,
scores.js_score,
(IFNULL(scores.html_score,0) + IFNULL(scores.css_score,0) + IFNULL(scores.js_score,0)) AS total,
scores.created_at
FROM users
LEFT JOIN scores ON users.id = scores.user_id
ORDER BY users.id DESC
`;

db.query(query, (err, results) => {

if (err) {
console.log("SQL ERROR:", err);
return res.status(500).json({ message: "Fetch failed" });
}

res.json(results);

});

});

// =============================
// Admin: Download Excel
// =============================
app.get("/admin/download-excel", async (req, res) => {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Quiz Results");

    worksheet.columns = [
        { header: "Name", key: "name", width: 20 },
        { header: "VTU Number", key: "vtuno", width: 20 },
        { header: "HTML Score", key: "html_score", width: 15 },
        { header: "CSS Score", key: "css_score", width: 15 },
        { header: "JavaScript Score", key: "js_score", width: 20 },
        { header: "Total Score", key: "total", width: 15 },
        { header: "Time", key: "created_at", width: 25 }
    ];

    const query = `
    SELECT 
    users.name,
    users.vtuno,
    scores.html_score,
    scores.css_score,
    scores.js_score,
    (IFNULL(scores.html_score,0) + IFNULL(scores.css_score,0) + IFNULL(scores.js_score,0)) AS total,
    scores.created_at
    FROM users
    LEFT JOIN scores ON users.id = scores.user_id
    `;

    db.query(query, async (err, rows) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Excel export failed" });
        }

        rows.forEach(row => worksheet.addRow(row));

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=quiz_results.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();
    });

});


// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

