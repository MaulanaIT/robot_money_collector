const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require('cors');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "robot_money_collector",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/api/select/score", (req, res) => {

    const query = "SELECT * FROM score";

    db.query(query, (err, response) => {
        res.send(response);
    });
});

app.post("/api/insert/score", (req, res) => {
    const UserID = req.body.UserID;
    const MovementHistory = req.body.MovementHistory;
    const TotalMoneyAvailable = req.body.TotalMoneyAvailable;
    const TotalMoneyFound = req.body.TotalMoneyFound;
    const InterestRate = req.body.InterestRate;
    const TotalMoneyEarning = req.body.TotalMoneyEarning;

    const query = "INSERT INTO score (user_id, movement_history, total_money_available, total_money_found, interest_rate, total_money_earning) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(query, [UserID, MovementHistory, TotalMoneyAvailable, TotalMoneyFound, InterestRate, TotalMoneyEarning], (err, response) => {
        console.log(err);
        console.log(response);
    });
});

app.listen(3001, () => {
    console.log("Running on port 3001");
});