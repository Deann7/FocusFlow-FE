const baseResponse = require("../utils/baseResponse.utill.js");
const flashcardRepository = require("../repositories/flashcard.repository.js");

// Flashcard Set Controllers
exports.createFlashcardSet = async (req, res) => {
    const { user_id, name, description } = req.body;
    
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }
    
    if (!name) {
        return baseResponse(res, false, 400, "Set name is required", null);
    }
    
    try {
        const setData = { user_id, name, description };
        const set = await flashcardRepository.createFlashcardSet(setData);
        baseResponse(res, true, 201, "Flashcard set created successfully", set);
    } catch (error) {
        console.error("Flashcard set creation error:", error);
        baseResponse(res, false, 500, "An error occurred while creating the flashcard set", null);
    }
};

exports.getFlashcardSetsByUserId = async (req, res) => {
    const { user_id } = req.params;
    
    if (!user_id) {
        return baseResponse(res, false, 400, "User ID is required", null);
    }
    
    try {
        const sets = await flashcardRepository.getFlashcardSetsByUserId(user_id);
        baseResponse(res, true, 200, "Flashcard sets retrieved successfully", sets);
    } catch (error) {
        console.error("Get flashcard sets error:", error);
        baseResponse(res, false, 500, "An error occurred while retrieving flashcard sets", null);
    }
};

exports.getFlashcardSetById = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return baseResponse(res, false, 400, "Set ID is required", null);
    }
    
    try {
        const set = await flashcardRepository.getFlashcardSetById(id);
        
        if (!set) {
            return baseResponse(res, false, 404, "Flashcard set not found", null);
        }
        
        baseResponse(res, true, 200, "Flashcard set retrieved successfully", set);
    } catch (error) {
        console.error("Get flashcard set error:", error);
        baseResponse(res, false, 500, "An error occurred while retrieving the flashcard set", null);
    }
};

exports.getFlashcardSetWithCards = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return baseResponse(res, false, 400, "Set ID is required", null);
    }
    
    try {
        const setWithCards = await flashcardRepository.getFlashcardSetWithCards(id);
        
        if (!setWithCards) {
            return baseResponse(res, false, 404, "Flashcard set not found", null);
        }
        
        baseResponse(res, true, 200, "Flashcard set retrieved with cards successfully", setWithCards);
    } catch (error) {
        console.error("Get flashcard set with cards error:", error);
        baseResponse(res, false, 500, "An error occurred while retrieving the flashcard set", null);
    }
};

exports.updateFlashcardSet = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!id) {
        return baseResponse(res, false, 400, "Set ID is required", null);
    }
    
    if (!name) {
        return baseResponse(res, false, 400, "Set name is required", null);
    }
    
    try {
        const existingSet = await flashcardRepository.getFlashcardSetById(id);
        
        if (!existingSet) {
            return baseResponse(res, false, 404, "Flashcard set not found", null);
        }
        
        const updatedSet = await flashcardRepository.updateFlashcardSet(id, { name, description });
        baseResponse(res, true, 200, "Flashcard set updated successfully", updatedSet);
    } catch (error) {
        console.error("Update flashcard set error:", error);
        baseResponse(res, false, 500, "An error occurred while updating the flashcard set", null);
    }
};

exports.deleteFlashcardSet = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return baseResponse(res, false, 400, "Set ID is required", null);
    }
    
    try {
        const existingSet = await flashcardRepository.getFlashcardSetById(id);
        
        if (!existingSet) {
            return baseResponse(res, false, 404, "Flashcard set not found", null);
        }
        
        const deletedSet = await flashcardRepository.deleteFlashcardSet(id);
        baseResponse(res, true, 200, "Flashcard set deleted successfully", deletedSet);
    } catch (error) {
        console.error("Delete flashcard set error:", error);
        baseResponse(res, false, 500, "An error occurred while deleting the flashcard set", null);
    }
};

// Flashcard Controllers
exports.createFlashcard = async (req, res) => {
    const { set_id, front, back } = req.body;
    
    if (!set_id) {
        return baseResponse(res, false, 400, "Set ID is required", null);
    }
    
    if (!front || !back) {
        return baseResponse(res, false, 400, "Front and back content are required", null);
    }
    
    try {
        const cardData = { set_id, front, back };
        const card = await flashcardRepository.createFlashcard(cardData);
        baseResponse(res, true, 201, "Flashcard created successfully", card);
    } catch (error) {
        console.error("Flashcard creation error:", error);
        baseResponse(res, false, 500, "An error occurred while creating the flashcard", null);
    }
};

exports.getFlashcardsBySetId = async (req, res) => {
    const { set_id } = req.params;
    
    if (!set_id) {
        return baseResponse(res, false, 400, "Set ID is required", null);
    }
    
    try {
        const cards = await flashcardRepository.getFlashcardsBySetId(set_id);
        baseResponse(res, true, 200, "Flashcards retrieved successfully", cards);
    } catch (error) {
        console.error("Get flashcards error:", error);
        baseResponse(res, false, 500, "An error occurred while retrieving flashcards", null);
    }
};

exports.updateFlashcard = async (req, res) => {
    const { id } = req.params;
    const { front, back } = req.body;
    
    if (!id) {
        return baseResponse(res, false, 400, "Flashcard ID is required", null);
    }
    
    if (!front || !back) {
        return baseResponse(res, false, 400, "Front and back content are required", null);
    }
    
    try {
        const existingCard = await flashcardRepository.getFlashcardById(id);
        
        if (!existingCard) {
            return baseResponse(res, false, 404, "Flashcard not found", null);
        }
        
        const updatedCard = await flashcardRepository.updateFlashcard(id, { front, back });
        baseResponse(res, true, 200, "Flashcard updated successfully", updatedCard);
    } catch (error) {
        console.error("Update flashcard error:", error);
        baseResponse(res, false, 500, "An error occurred while updating the flashcard", null);
    }
};

exports.deleteFlashcard = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return baseResponse(res, false, 400, "Flashcard ID is required", null);
    }
    
    try {
        const existingCard = await flashcardRepository.getFlashcardById(id);
        
        if (!existingCard) {
            return baseResponse(res, false, 404, "Flashcard not found", null);
        }
        
        const deletedCard = await flashcardRepository.deleteFlashcard(id);
        baseResponse(res, true, 200, "Flashcard deleted successfully", deletedCard);
    } catch (error) {
        console.error("Delete flashcard error:", error);
        baseResponse(res, false, 500, "An error occurred while deleting the flashcard", null);
    }
};