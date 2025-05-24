const baseResponse = require("../utils/baseResponse.utill.js");
const tasksRepository = require("../repositories/pomodoro.tasks.repository.js");

exports.getTasksByUserId = async (req, res) => {
    const { user_id } = req.params;
    
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }
    
    try {
        const tasks = await tasksRepository.getTasksByUserId(user_id);
        baseResponse(res, true, 200, "Pomodoro tasks retrieved successfully", tasks);
    } catch (error) {
        console.error("Get pomodoro tasks error:", error);
        baseResponse(res, false, 500, "An error occurred while retrieving pomodoro tasks", null);
    }
};

exports.createTask = async (req, res) => {
    const { user_id, text, completed, current } = req.body;
    
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }
    
    if (!text) {
        return baseResponse(res, false, 400, "Task text is required", null);
    }
    
    try {
        const taskData = {
            user_id,
            text,
            completed: completed || false,
            current: current || false
        };
        
        const task = await tasksRepository.createTask(taskData);
        baseResponse(res, true, 201, "Pomodoro task created successfully", task);
    } catch (error) {
        console.error("Create pomodoro task error:", error);
        baseResponse(res, false, 500, "An error occurred while creating pomodoro task", null);
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { text, completed, current } = req.body;
    
    if (!id) {
        return baseResponse(res, false, 400, "Task ID is required", null);
    }
    
    try {
        const existingTask = await tasksRepository.getTaskById(id);
        
        if (!existingTask) {
            return baseResponse(res, false, 404, "Task not found", null);
        }
        
        const taskData = {
            text: text || existingTask.text,
            completed: completed !== undefined ? completed : existingTask.completed,
            current: current !== undefined ? current : existingTask.current
        };
        
        const updatedTask = await tasksRepository.updateTask(id, taskData);
        baseResponse(res, true, 200, "Pomodoro task updated successfully", updatedTask);
    } catch (error) {
        console.error("Update pomodoro task error:", error);
        baseResponse(res, false, 500, "An error occurred while updating pomodoro task", null);
    }
};

exports.setCurrentTask = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;
    
    if (!id) {
        return baseResponse(res, false, 400, "Task ID is required", null);
    }
    
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }
    
    try {
        const updatedTask = await tasksRepository.setCurrentTask(user_id, id);
        
        if (!updatedTask) {
            return baseResponse(res, false, 404, "Task not found", null);
        }
        
        baseResponse(res, true, 200, "Current task set successfully", updatedTask);
    } catch (error) {
        console.error("Set current task error:", error);
        baseResponse(res, false, 500, "An error occurred while setting current task", null);
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return baseResponse(res, false, 400, "Task ID is required", null);
    }
    
    try {
        const deletedTask = await tasksRepository.deleteTask(id);
        
        if (!deletedTask) {
            return baseResponse(res, false, 404, "Task not found", null);
        }
        
        baseResponse(res, true, 200, "Pomodoro task deleted successfully", deletedTask);
    } catch (error) {
        console.error("Delete pomodoro task error:", error);
        baseResponse(res, false, 500, "An error occurred while deleting pomodoro task", null);
    }
};