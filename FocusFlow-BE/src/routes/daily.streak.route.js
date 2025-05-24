const express = require("express");
const router = express.Router();
const streakController = require("../controllers/daily.streak.controller.js");

// Mendapatkan streak pengguna
router.get("/user/:user_id", streakController.getStreakByUserId);

// Update streak setelah sesi pomodoro selesai
router.post("/complete", streakController.updateStreakAfterCompletion);

// Tambahkan route baru
router.post("/force-increment", streakController.forceIncrementStreak);

module.exports = router;