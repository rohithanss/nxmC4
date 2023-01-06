const { Router } = require("express");
// const mongoose = require("mongoose");

const CommentModel = require("../models/CommentModel.js");
const authorise = require("../middlewares/authorise.js");
const tokenAuth = require("../middlewares/tokenAuth.js");
const BlogModel = require("../models/BlogModel.js");
const { default: mongoose } = require("mongoose");

const commentRouter = Router();

commentRouter.post(
  "/:blogId",
  tokenAuth,
  authorise(["user", "writer"]),
  async (req, res) => {
    let { blogId } = req.params;
    let { comment, userId } = req.body;
    if (comment == undefined) {
      return res.send({ msg: "some fields are missing", status: "fail" });
    }
    try {
      let userComment = await CommentModel({ blogId, userId, comment });
      await userComment.save();
      await BlogModel.findByIdAndUpdate(
        { _id: blogId },
        { $inc: { comments: 1 } }
      );
      return res
        .status(201)
        .send({ msg: "Comment posted successfully", status: "success" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ msg: "something went wrong", status: "error" });
    }
  }
);

commentRouter.get("/:blogId", async (req, res) => {
  let blogId = mongoose.Types.ObjectId(req.params.blogId);

  try {
    let comments = await CommentModel.aggregate().match({ blogId });
    return res.send({ comments });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ msg: "Something went wrong", status: "error" });
  }
});

module.exports = commentRouter;
