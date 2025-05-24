const baseResponse = require("../utils/baseResponse.utill.js");
const sessionsRepository = require("../repositories/pomodoro.sessions.repository.js");
const streakRepository = require("../repositories/daily.streak.repository.js");

// Menyelesaikan sesi pomodoro
exports.completeSession = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return baseResponse(res, false, 400, "Session ID is required", null);
    }
    
    try {
        // Menyelesaikan sesi
        const session = await sessionsRepository.completeSession(id);
        
        if (!session) {
            return baseResponse(res, false, 404, "Session not found", null);
        }
        
        // Jika ini sesi pomodoro (bukan istirahat), update streak
        if (session.mode === 'pomodoro') {
            try {
                // Update streak pengguna
                await streakRepository.updateStreakAfterCompletion(session.user_id);
            } catch (streakError) {
                console.error("Error updating streak:", streakError);
                // Tidak mengembalikan error jika update streak gagal
            }
        }
        
        baseResponse(res, true, 200, "Session completed successfully", session);
    } catch (error) {
        console.error("Complete session error:", error);
        baseResponse(res, false, 500, "An error occurred while completing the session", null);
    }
};