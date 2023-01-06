const jwt = require("jsonwebtoken");
require("dotenv").config();

function tokenAuth(req, res, next) {
  let token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  try {
    let decoded = jwt.verify(token, process.env.secret_key);
    // res.send(decoded);

    req.body.userId = decoded.userId;
    req.body.userRole = decoded.userRole;
    next();
  } catch (err) {
    // console.log(err);
    res.send({ msg: "invalid token", status: err.message });
  }
}

module.exports = tokenAuth;
