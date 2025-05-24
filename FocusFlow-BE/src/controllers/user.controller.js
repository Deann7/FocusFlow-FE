const baseResponse = require("../utils/baseResponse.utill.js");  
const userRepository = require("../repositories/user.repository.js");
const bcrypt = require('bcrypt');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.userRegister = async (req, res) => {
    const { name, email, password } = req.query; 
   
    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, "Invalid email format", null);
    }

    if (!name || !email || !password) {
        return baseResponse(res, false, 400, "Missing user information", null);
    }
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const userExist = await userRepository.getUserByEmail(email);
        if (userExist) {
            return baseResponse(res, false, 400, "Email already registered", null);
        }
        const user = await userRepository.userRegister({ name, email, password: hashPassword });
        baseResponse(res, true, 201, "User created", user);
    } catch (error) {
        console.error("Registration error:", error);
        baseResponse(res, false, 500, "An error occurred while registering user", null);
    }
};

exports.userLogin = async (req, res) => {
    const { email, password } = req.query; 

    if (!email || !password) {
        return baseResponse(res, false, 400, "Missing email or password", null);
    }
    try {
        const user = await userRepository.userLogin(email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        const hashPasswordMatched = await bcrypt.compare(password, user.password);
        if (!hashPasswordMatched) {
            return baseResponse(res, false, 401, "Invalid password", null);
        }
        baseResponse(res, true, 200, "Login success", user);
    } catch (error) {
        console.error("Login error:", error);
        baseResponse(res, false, 500, "An error occurred while logging in", null);
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userRepository.deleteUser(id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User deleted successfully", user);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while deleting user", null);
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return baseResponse(res, false, 400, "Missing user ID", null);
    }
    try {
        const user = await userRepository.getUserById(id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User retrieved successfully", user);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving user", null);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        baseResponse(res, true, 200, "Users retrieved successfully", users);
    } catch (error) {
        baseResponse(res, false, 500, "An error occurred while retrieving users", null);
    }
}