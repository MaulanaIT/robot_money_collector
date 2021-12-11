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

app.post("/api/insert/score", (req, res) => {
    const score = req.body.score;

    const query = "INSERT INTO score () VALUES (?, ?)";

    db.query(query, [score], (err, response) => {
        console.log("Success");
    });
});

app.listen(3001, () => {
    console.log("Running on port 3001");
});