const db = require("../database/pg.database.js");

// Mendapatkan daily streak pengguna
exports.getStreakByUserId = async (userId) => {
    try {
        const query = `
            SELECT * FROM daily_streaks
            WHERE user_id = $1
        `;
        const result = await db.query(query, [userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error getting daily streak:", error);
        throw error;
    }
};

// Membuat streak baru untuk pengguna
exports.createStreak = async (userId) => {
    try {
        const query = `
            INSERT INTO daily_streaks (user_id, current_streak, longest_streak)
            VALUES ($1, 0, 0)
            RETURNING *
        `;
        const result = await db.query(query, [userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error creating daily streak:", error);
        throw error;
    }
};

// Mengupdate streak setelah pengguna menyelesaikan pomodoro
exports.updateStreakAfterCompletion = async (userId) => {
    try {
        // Dapatkan data streak pengguna saat ini
        const streak = await this.getStreakByUserId(userId);
        
        // Jika user belum punya streak, buatkan baru
        if (!streak) {
            const newStreak = await this.createStreak(userId);
            return await this.incrementStreak(userId);
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastCompletedDate = streak.last_completed_date ? new Date(streak.last_completed_date) : null;
        
        // Jika belum pernah menyelesaikan pomodoro atau terakhir bukan hari ini
        if (!lastCompletedDate || lastCompletedDate.getTime() !== today.getTime()) {
            return await this.incrementStreak(userId);
        }
        
        // Sudah menyelesaikan pomodoro hari ini, tidak perlu update
        return streak;
    } catch (error) {
        console.error("Error updating streak after completion:", error);
        throw error;
    }
};

// Increment streak pengguna
exports.incrementStreak = async (userId) => {
    try {
        const today = new Date();
        const streak = await this.getStreakByUserId(userId);
        
        if (!streak) {
            // Jika belum ada streak, buat baru
            const query = `
                INSERT INTO daily_streaks (user_id, current_streak, longest_streak, last_completed_date)
                VALUES ($1, 1, 1, $2)
                RETURNING *
            `;
            const result = await db.query(query, [userId, today]);
            return result.rows[0];
        }
        
        const lastCompletedDate = streak.last_completed_date ? new Date(streak.last_completed_date) : null;
        let currentStreak = streak.current_streak;
        
        // Cek jika terakhir completed kemarin (harus berurutan)
        if (lastCompletedDate) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            
            const isYesterday = lastCompletedDate.getTime() === yesterday.getTime();
            const isToday = lastCompletedDate.getTime() === today.setHours(0, 0, 0, 0);
            
            if (!isYesterday && !isToday) {
                // Jika tidak kemarin dan tidak hari ini, reset streak
                currentStreak = 0;
            }
        }
        
        // Increment streak
        currentStreak += 1;
        const longestStreak = Math.max(currentStreak, streak.longest_streak);
        
        const query = `
            UPDATE daily_streaks
            SET 
                current_streak = $1,
                longest_streak = $2,
                last_completed_date = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $4
            RETURNING *
        `;
        
        const result = await db.query(query, [currentStreak, longestStreak, today, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error incrementing streak:", error);
        throw error;
    }
};