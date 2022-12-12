const { Router, response } = require("express");

const TaskModel = require("../models/TaskModel");

const taskRouter = Router();

taskRouter.get("/", async (req, res) => {
  let query = req.query;
  let status = query.status || null;
  let tag = query.tag || null;
  try {
    let tasks;
    if (status == null && tag == null) {
      tasks = await TaskModel.find({ userId: req.body.userId });
    } else if (status != null && tag == null) {
      tasks = await TaskModel.find({ userId: req.body.userId, status });
    } else if (status == null && tag != null) {
      tasks = await TaskModel.find({ userId: req.body.userId, tag });
    } else if (status != null && tag != null) {
      tasks = await TaskModel.find({ userId: req.body.userId, status, tag });
    }

    res.send({ msg: "Tasks fetched successfully", data: tasks });
  } catch (err) {
    res.send({ msg: "Error while fetching the Tasks" });
  }
});

taskRouter.get("/:taskId", async (req, res) => {
  let taskId = req.params.taskId;
  try {
    let tasks = await TaskModel.findOne({
      userId: req.body.userId,
      _id: taskId,
    });

    res.send({ msg: "Tasks fetched successfully", data: tasks });
  } catch (err) {
    res.send({ msg: "Error while fetching the Tasks" });
  }
});

taskRouter.post("/create", async (req, res) => {
  let { taskName, status, tag } = req.body;
  if (taskName == undefined || status == undefined || tag == undefined) {
    res.send({ msg: "some fields are missing" });
    return;
  }
  try {
    let task = new TaskModel({
      taskName,
      status,
      tag,
      userId: req.body.userId,
    });
    await task.save();
    res.send({ msg: "task added successfully" });
  } catch (err) {
    res.send({ msg: "error creating task" });
  }
});

taskRouter.patch("/update/:taskId", async (req, res) => {
  let payload = req.body;
  let taskId = req.params.taskId;
  try {
    let response = await TaskModel.findOneAndUpdate(
      {
        userId: payload.userId,
        _id: taskId,
      },
      payload
    );

    if (response == null) {
      res.send({ msg: "task can not be updated" });
    } else {
      res.send({ msg: "task updated successfully" });
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "error while updating try again" });
  }
});
taskRouter.delete("/delete/:taskId", async (req, res) => {
  let payload = req.body;
  let taskId = req.params.taskId;
  try {
    let response = await TaskModel.findOneAndDelete({
      userId: payload.userId,
      _id: taskId,
    });

    if (response == null) {
      res.send({ msg: "task can not be Deleted" });
    } else {
      res.send({ msg: "task Deleted successfully" });
    }
  } catch (err) {
    res.send({ msg: "error while deleting try again" });
  }
});
module.exports = taskRouter;
