const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  taskName: String,
  status: String,
  tag: String,
  userId: String,
});

const TaskModel = mongoose.model("task", taskSchema);

module.exports = TaskModel;
