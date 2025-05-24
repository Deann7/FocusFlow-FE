const baseResponse = require("../utils/baseResponse.utill.js");
const cardRepository = require("../repositories/card.repositories.js");

exports.createCard = async (req, res) => {
    const { title, description, deadline, user_id, status } = req.body;
    
    if (!title){
        return baseResponse(res, false, 400, "Title is required", null);
    }
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }
    
    if (status && !['sudah selesai', 'belum selesai'].includes(status)) {
        return baseResponse(res, false, 400, "Invalid status value. Must be 'sudah selesai' or 'belum selesai'", null);
    }

    try {
        const cardData = { 
            title, 
            description: description || "", 
            deadline: deadline || new Date(), 
            user_id,
            status: status || 'belum selesai'
        };
        
        const card = await cardRepository.createCard(cardData);
        baseResponse(res, true, 201, "Card created successfully", card);
    } catch (error) {
        console.error("Card creation error:", error);
        baseResponse(res, false, 500, "An error occurred while creating the card", null);
    }
};

exports.getCardsByUserId = async (req, res) => {
    const { user_id } = req.params;
    
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }

    try {
        const cards = await cardRepository.getCardsByUserId(user_id);
        baseResponse(res, true, 200, "Cards retrieved successfully", cards);
    } catch (error) {
        console.error("Get cards error:", error);
        baseResponse(res, false, 500, "An error occurred while retrieving cards", null);
    }
};

exports.getCardById = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return baseResponse(res, false, 400, "Card ID is required", null);
    }

    try {
        const card = await cardRepository.getCardById(id);
        
        if (!card) {
            return baseResponse(res, false, 404, "Card not found", null);
        }
        
        baseResponse(res, true, 200, "Card retrieved successfully", card);
    } catch (error) {
        console.error("Get card error:", error);
        baseResponse(res, false, 500, "An error occurred while retrieving the card", null);
    }
};

exports.updateCard = async (req, res) => {
    const { id } = req.params;
    const { title, description, deadline, status } = req.body;
    
    if (!id) {
        return baseResponse(res, false, 400, "Card ID is required", null);
    }

    if (!title) {
        return baseResponse(res, false, 400, "Title is required", null);
    }
      if (status && !['sudah selesai', 'belum selesai'].includes(status)) {
        return baseResponse(res, false, 400, "Invalid status value. Must be 'sudah selesai' or 'belum selesai'", null);
    }

    try {
        const existingCard = await cardRepository.getCardById(id);
        
        if (!existingCard) {
            return baseResponse(res, false, 404, "Card not found", null);
        }
        
        const updatedCard = await cardRepository.updateCard(id, {
            title, 
            description: description || existingCard.description,
            deadline: deadline || existingCard.deadline,
            status: status || existingCard.status
        });
        
        baseResponse(res, true, 200, "Card updated successfully", updatedCard);
    } catch (error) {
        console.error("Update card error:", error);
        baseResponse(res, false, 500, "An error occurred while updating the card", null);
    }
};

exports.deleteCard = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return baseResponse(res, false, 400, "Card ID is required", null);
    }

    try {
        const card = await cardRepository.deleteCard(id);
        
        if (!card) {
            return baseResponse(res, false, 404, "Card not found", null);
        }
        
        baseResponse(res, true, 200, "Card deleted successfully", card);
    } catch (error) {
        console.error("Delete card error:", error);
        baseResponse(res, false, 500, "An error occurred while deleting the card", null);
    }
};