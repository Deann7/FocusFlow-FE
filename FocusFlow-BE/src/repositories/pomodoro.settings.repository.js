const db = require("../database/pg.database.js");

exports.getSettingsByUserId = async (userId) => {
    try {
        const query = `
            SELECT * FROM pomodoro_settings
            WHERE user_id = $1
            LIMIT 1
        `;
        const result = await db.query(query, [userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error getting pomodoro settings:", error);
        throw error;
    }
};

exports.createSettings = async (settingsData) => {
    try {
        const { user_id, pomodoro_time, short_break_time, long_break_time } = settingsData;
        
        const query = `
            INSERT INTO pomodoro_settings (user_id, pomodoro_time, short_break_time, long_break_time)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const result = await db.query(query, [
            user_id, 
            pomodoro_time || 25,
            short_break_time || 5,
            long_break_time || 15
        ]);
        
        return result.rows[0];
    } catch (error) {
        console.error("Error creating pomodoro settings:", error);
        throw error;
    }
};

exports.updateSettings = async (settingsId, settingsData) => {
    try {
        const { pomodoro_time, short_break_time, long_break_time } = settingsData;
        
        const query = `
            UPDATE pomodoro_settings
            SET pomodoro_time = $1, 
                short_break_time = $2, 
                long_break_time = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `;
        
        const result = await db.query(query, [
            pomodoro_time,
            short_break_time,
            long_break_time,
            settingsId
        ]);
        
        return result.rows[0];
    } catch (error) {
        console.error("Error updating pomodoro settings:", error);
        throw error;
    }
};