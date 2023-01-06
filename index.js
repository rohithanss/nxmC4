const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");

const tokenAuth = require("./middlewares/tokenAuth");
const connection = require("./config/db");
const port = process.env.port;
const userRouter = require("./routers/user.Router");
const adminRouter = require("./routers/admin.Router");
const blogRouter = require("./routers/blog.Router");
const commentRouter = require("./routers/comment.Router");
const likeRouter = require("./routers/like.Router");
const authRouter = require("./routers/auth.Router");
const getfreshtokenRouter = require("./routers/getfreshtoken.Router");
const generateOtpRouter = require("./routers/generateOtp.Router.js");

app.use(
  session({
    secret: "keyboard",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
// app.enable("trust proxy");

app.get("/", (req, res) => {
  res.send("todo API");
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.use("/auth", authRouter);

app.use("/getfreshtoken", getfreshtokenRouter);

app.use("/comments", commentRouter);
app.use("/likes", likeRouter);

app.use("/blogs", blogRouter);

app.use("/getotp", generateOtpRouter);

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
