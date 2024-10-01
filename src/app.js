const express = require('express');

const app = express();

app.use("/hello", (req, res) => {
    res.send("Hello from the board");
});

app.use("/test", (req, res) => {
    res.send("testing page welcomes you");
});

app.listen(3000);