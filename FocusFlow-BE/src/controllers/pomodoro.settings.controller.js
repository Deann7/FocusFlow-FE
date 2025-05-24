const baseResponse = require("../utils/baseResponse.utill.js");
const settingsRepository = require("../repositories/pomodoro.settings.repository.js");

exports.getSettingsByUserId = async (req, res) => {
    const { user_id } = req.params;
    
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }
    
    try {
        let settings = await settingsRepository.getSettingsByUserId(user_id);
        
        // If user doesn't have settings yet, create default settings
        if (!settings) {
            settings = await settingsRepository.createSettings({ user_id });
        }
        
        baseResponse(res, true, 200, "Pomodoro settings retrieved successfully", settings);
    } catch (error) {
        console.error("Get pomodoro settings error:", error);
        baseResponse(res, false, 500, "An error occurred while retrieving pomodoro settings", null);
    }
};

exports.updateSettings = async (req, res) => {
    const { id } = req.params;
    const { pomodoro_time, short_break_time, long_break_time } = req.body;
    
    if (!id) {
        return baseResponse(res, false, 400, "Settings ID is required", null);
    }
    
    if (!pomodoro_time || !short_break_time || !long_break_time) {
        return baseResponse(res, false, 400, "All time values are required", null);
    }
    
    try {
        const updatedSettings = await settingsRepository.updateSettings(id, {
            pomodoro_time,
            short_break_time,
            long_break_time
        });
        
        if (!updatedSettings) {
            return baseResponse(res, false, 404, "Settings not found", null);
        }
        
        baseResponse(res, true, 200, "Pomodoro settings updated successfully", updatedSettings);
    } catch (error) {
        console.error("Update pomodoro settings error:", error);
        baseResponse(res, false, 500, "An error occurred while updating pomodoro settings", null);
    }
};