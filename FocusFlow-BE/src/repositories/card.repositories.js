const db = require("../database/pg.database.js");

exports.createCard = async (cardData) => {
    const { title, description, deadline, user_id, status } = cardData;
    
    // Default to 'belum selesai' for new cards
    const validStatus = status && ['sudah selesai', 'belum selesai'].includes(status) 
        ? status 
        : 'belum selesai';
    
    const query = `
        INSERT INTO cards (title, description, deadline, user_id, status)
        VALUES ($1, $2, $3, $4, $5::card_status)
        RETURNING *
    `;
    
    const result = await db.query(query, [title, description, deadline, user_id, validStatus]);
    return result.rows[0];
};

exports.getCardsByUserId = async (userId) => {
    const query = `
        SELECT * FROM cards
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
};

exports.getCardById = async (cardId) => {
    const query = `
        SELECT * FROM cards
        WHERE id = $1
    `;
    
    const result = await db.query(query, [cardId]);
    return result.rows[0];
};

exports.updateCard = async (cardId, cardData) => {
    const { title, description, deadline, status } = cardData;
    
    // Validate status is either 'sudah selesai' or 'belum selesai'
    const validStatus = status && ['sudah selesai', 'belum selesai'].includes(status) 
        ? status 
        : 'belum selesai';
    
    const query = `
        UPDATE cards
        SET title = $1, 
            description = $2, 
            deadline = $3, 
            status = $4::card_status,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
    `;
    
    const result = await db.query(query, [title, description, deadline, validStatus, cardId]);
    return result.rows[0];
};

exports.deleteCard = async (cardId) => {
    const query = `
        DELETE FROM cards
        WHERE id = $1
        RETURNING *
    `;
    
    const result = await db.query(query, [cardId]);
    return result.rows[0];
};