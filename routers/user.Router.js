const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserModel = require("../models/UserModel");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  if (name == undefined || email == undefined || password == undefined) {
    res.send({ msg: "some fields are missing" });
    return;
  }
  let userExist = await UserModel.find({ email });
  if (userExist.length > 0) {
    res.send({ msg: "user already exists" });
  } else {
    try {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          console.log(err);
          res.send({ msg: "error while signing up try again" });
        } else {
          let user = new UserModel({ name, email, password: hash, ip: req.ip });
          await user.save();
          res.send({ msg: "sign up successful" });
        }
      });
    } catch (err) {
      console.log(err);
      res.send({ msg: "error registering" });
    }
  }
});

userRouter.post("/login", async (req, res) => {
  let { email, password } = req.body;
  if (email == undefined || password == undefined) {
    res.send({ msg: "some fields are missing" });
    return;
  }
  let userExist = await UserModel.find({ email });
  if (userExist.length == 0) {
    res.send({ msg: "wrong Credentials" });
  } else {
    let user = userExist[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.send({ msg: "Error while logging in" });
      } else {
        if (result) {
          let token = jwt.sign({ userId: user._id }, process.env.secret_key);
          res.send({ msg: "login Success", token });
        } else {
          res.send({ msg: "wrong Credentials" });
        }
      }
    });
  }
});

module.exports = userRouter;
