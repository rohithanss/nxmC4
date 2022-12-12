const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const tokenAuth = require("./middlewares/tokenAuth");
const connection = require("./config/db");
const port = process.env.port;
const userRouter = require("./routers/user.Router");
const taskRouter = require("./routers/task.Router");

app.use(express.json());
app.use(cors({ origin: "*" }));
// app.enable("trust proxy");

app.get("/", (req, res) => {
  console.log(req.ip);
  res.send("todo API");
});

app.use("/user", userRouter);
app.use(tokenAuth);
app.use("/todos", taskRouter);
app.listen(port, async () => {
  try {
    connection;
    console.log("DB connected");
    console.log(`listening at \nhttp://localhost:${port}`);
  } catch (err) {
    console.log(err);
    console.log("error while connection to DB");
  }
});
