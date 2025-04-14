const express = require("express");
const app = express();
const connectToMongo = require("./db");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.use("/api/auth", require("./Routes/authentication"));
app.use("/api/investor", require("./Routes/investor"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

//Intializing the application
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

// Connecting to the datbase
connectToMongo();