const db = require("../database/pg.database.js");

exports.getTasksByUserId = async (userId) => {
    try {
        const query = `
            SELECT * FROM pomodoro_tasks
            WHERE user_id = $1
            ORDER BY created_at ASC
        `;
        const result = await db.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error("Error getting pomodoro tasks:", error);
        throw error;
    }
};

exports.getTaskById = async (taskId) => {
    try {
        const query = `
            SELECT * FROM pomodoro_tasks
            WHERE id = $1
        `;
        const result = await db.query(query, [taskId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error getting pomodoro task by id:", error);
        throw error;
    }
};

exports.createTask = async (taskData) => {
    try {
        const { user_id, text, completed, current } = taskData;
        
        const query = `
            INSERT INTO pomodoro_tasks (user_id, text, completed, current)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const result = await db.query(query, [
            user_id,
            text,
            completed || false,
            current || false
        ]);
        
        return result.rows[0];
    } catch (error) {
        console.error("Error creating pomodoro task:", error);
        throw error;
    }
};

exports.updateTask = async (taskId, taskData) => {
    try {
        const { text, completed, current } = taskData;
        
        const query = `
            UPDATE pomodoro_tasks
            SET text = $1,
                completed = $2,
                current = $3,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `;
        
        const result = await db.query(query, [text, completed, current, taskId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating pomodoro task:", error);
        throw error;
    }
};

exports.setCurrentTask = async (userId, taskId) => {
    try {
        // First reset all tasks to not current
        await db.query(
            `UPDATE pomodoro_tasks SET current = false WHERE user_id = $1`,
            [userId]
        );
        
        // Then set the specified task as current
        const query = `
            UPDATE pomodoro_tasks
            SET current = true,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;
        
        const result = await db.query(query, [taskId, userId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error setting current pomodoro task:", error);
        throw error;
    }
};

exports.deleteTask = async (taskId) => {
    try {
        const query = `
            DELETE FROM pomodoro_tasks
            WHERE id = $1
            RETURNING *
        `;
        
        const result = await db.query(query, [taskId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting pomodoro task:", error);
        throw error;
    }
};