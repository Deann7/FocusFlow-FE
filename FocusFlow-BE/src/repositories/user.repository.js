const db = require("../database/pg.database.js");


exports.userRegister = async (user) => {
    try {
    const res = await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [user.name, user.email, user.password]
    );
    return res.rows[0];
    } catch (error) {
    console.error("Error Executing query", error);
    }
};

exports.userLogin = async (email) => {
    try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0];
    } catch (error) {
    console.error("Error Executing query", error);
    }
};

exports.deleteUser = async (id) => {
    try {
    const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return res.rows[0];
    } catch (error) {
    console.error("Error Executing query", error);
    }
}

exports.getUserById = async (id) => {
    try {
    const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
    }
    catch (error) {
    console.error("Error Executing query", error);
    }
}

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0];
    } catch (error) {
        console.error("Error Executing query", error);
        throw error;
    }
};

exports.getAllUsers = async () => {
    try {
        const res = await db.query("SELECT * FROM users");
        return res.rows;
    } catch (error) {
        console.error("Error Executing query", error);
        throw error;
    }
};


