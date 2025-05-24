const express = require("express");
const router = express.Router();

const settingsController = require("../controllers/pomodoro.settings.controller.js");
const tasksController = require("../controllers/pomodoro.tasks.controller.js");

// Settings routes
router.get("/settings/user/:user_id", settingsController.getSettingsByUserId);
router.put("/settings/:id", settingsController.updateSettings);

// Tasks routes
router.get("/tasks/user/:user_id", tasksController.getTasksByUserId);
router.post("/tasks", tasksController.createTask);
router.put("/tasks/:id", tasksController.updateTask);
router.put("/tasks/:id/set-current", tasksController.setCurrentTask);
router.delete("/tasks/:id", tasksController.deleteTask);

module.exports = router;