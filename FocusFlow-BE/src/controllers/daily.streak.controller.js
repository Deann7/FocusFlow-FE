const baseResponse = require("../utils/baseResponse.utill.js");
const streakRepository = require("../repositories/daily.streak.repository.js");

// Mendapatkan informasi streak pengguna
exports.getStreakByUserId = async (req, res) => {
    const { user_id } = req.params;
    
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }
    
    try {
        let streak = await streakRepository.getStreakByUserId(user_id);
        
        // Jika belum ada streak, buatkan
        if (!streak) {
            streak = await streakRepository.createStreak(user_id);
        }
        
        baseResponse(res, true, 200, "Daily streak retrieved successfully", streak);
    } catch (error) {
        console.error("Get daily streak error:", error);
        baseResponse(res, false, 500, "An error occurred while retrieving daily streak", null);
    }
};

// Update streak setelah menyelesaikan sesi pomodoro
exports.updateStreakAfterCompletion = async (req, res) => {
    const { user_id } = req.body;
    
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }
    
    try {
        const updatedStreak = await streakRepository.updateStreakAfterCompletion(user_id);
        baseResponse(res, true, 200, "Daily streak updated successfully", updatedStreak);
    } catch (error) {
        console.error("Update daily streak error:", error);
        baseResponse(res, false, 500, "An error occurred while updating daily streak", null);
    }
};

// Tambahkan fungsi controller baru
exports.forceIncrementStreak = async (req, res) => {
    const { user_id } = req.body;
    
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }
    
    try {
        // Langsung panggil fungsi increment tanpa pengecekan tanggal
        const updatedStreak = await streakRepository.incrementStreak(user_id);
        baseResponse(res, true, 200, "Daily streak incremented successfully (forced)", updatedStreak);
    } catch (error) {
        console.error("Force increment daily streak error:", error);
        baseResponse(res, false, 500, "An error occurred while incrementing daily streak", null);
    }
};