const db = require("../database/pg.database.js");

// Flashcard Sets Repository
exports.createFlashcardSet = async (setData) => {
    const { user_id, name, description } = setData;
    
    const query = `
        INSERT INTO flashcard_sets (user_id, name, description)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    
    const result = await db.query(query, [user_id, name, description || ""]);
    return result.rows[0];
};

exports.getFlashcardSetsByUserId = async (userId) => {
    const query = `
        SELECT fs.*, 
               (SELECT COUNT(*) FROM flashcards WHERE set_id = fs.id) as card_count
        FROM flashcard_sets fs
        WHERE fs.user_id = $1
        ORDER BY fs.updated_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
};

exports.getFlashcardSetById = async (setId) => {
    const query = `
        SELECT * FROM flashcard_sets
        WHERE id = $1
    `;
    
    const result = await db.query(query, [setId]);
    return result.rows[0];
};

exports.updateFlashcardSet = async (setId, updateData) => {
    const { name, description } = updateData;
    
    const query = `
        UPDATE flashcard_sets
        SET name = $1, 
            description = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
    `;
    
    const result = await db.query(query, [name, description || "", setId]);
    return result.rows[0];
};

exports.deleteFlashcardSet = async (setId) => {
    const query = `
        DELETE FROM flashcard_sets
        WHERE id = $1
        RETURNING *
    `;
    
    const result = await db.query(query, [setId]);
    return result.rows[0];
};

// Flashcards Repository
exports.createFlashcard = async (cardData) => {
    const { set_id, front, back } = cardData;
    
    const query = `
        INSERT INTO flashcards (set_id, front, back)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    
    const result = await db.query(query, [set_id, front, back]);
    return result.rows[0];
};

exports.getFlashcardsBySetId = async (setId) => {
    const query = `
        SELECT * FROM flashcards
        WHERE set_id = $1
        ORDER BY created_at ASC
    `;
    
    const result = await db.query(query, [setId]);
    return result.rows;
};

exports.getFlashcardById = async (cardId) => {
    const query = `
        SELECT * FROM flashcards
        WHERE id = $1
    `;
    
    const result = await db.query(query, [cardId]);
    return result.rows[0];
};

exports.updateFlashcard = async (cardId, updateData) => {
    const { front, back } = updateData;
    
    const query = `
        UPDATE flashcards
        SET front = $1, 
            back = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
    `;
    
    const result = await db.query(query, [front, back, cardId]);
    return result.rows[0];
};

exports.deleteFlashcard = async (cardId) => {
    const query = `
        DELETE FROM flashcards
        WHERE id = $1
        RETURNING *
    `;
    
    const result = await db.query(query, [cardId]);
    return result.rows[0];
};

// Get flashcard set with all its cards
exports.getFlashcardSetWithCards = async (setId) => {
    try {
        // Validasi format UUID
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        // Log untuk debugging
        console.log(`Fetching flashcard set with ID: ${setId}`);
        
        // Pastikan setId adalah UUID valid jika tidak dalam development mode
        if (!process.env.NODE_ENV !== 'development' && !uuidPattern.test(setId)) {
            console.error(`Invalid UUID format: ${setId}`);
            return null;
        }
        
        // First get the set info
        const setQuery = `
            SELECT * FROM flashcard_sets
            WHERE id = $1
        `;
        
        const setResult = await db.query(setQuery, [setId]);
        
        if (setResult.rows.length === 0) {
            return null;
        }
        
        const set = setResult.rows[0];
        
        // Then get all cards for this set
        const cardsQuery = `
            SELECT * FROM flashcards
            WHERE set_id = $1
            ORDER BY created_at ASC
        `;
        
        const cardsResult = await db.query(cardsQuery, [setId]);
        const cards = cardsResult.rows;
        
        // Return combined data
        return {
            ...set,
            cards
        };
    } catch (error) {
        console.error("Error in getFlashcardSetWithCards:", error);
        throw error;
    }
};