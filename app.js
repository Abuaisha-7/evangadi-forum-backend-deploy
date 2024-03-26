require("dotenv").config()

const express = require("express");
const app = express();
const port = 8086;

const cors = require('cors')
app.use(cors())

// db connection
const dbConnection = require("./db/dbConfig");

// user routes middleware file
const userRoutes = require("./routes/userRoute");

// question routes middleware file
const questionRoute = require("./routes/questionRoute");

// answer routes middleware file
const answerRoute = require("./routes/answerRoute");

// authentication middleware
const authMiddleWare = require("./middleWare/authmiddleWare");

// json  middleware to extract json data
app.use(express.json());

// user routes middleware
app.use("/api/users", userRoutes);

// question routes middleware
app.use("/api/questions", authMiddleWare, questionRoute);

// answer routes middleware ??
app.use("/api/answers", authMiddleWare, answerRoute);

async function start() {
  try {
    const result = await dbConnection.execute("select 'test'");
    app.listen(port);
    console.log("database connection established");
    console.log(`listening on port: ${port}`);

  } catch (error) {
    console.log(error.message);
  }
}

start();
