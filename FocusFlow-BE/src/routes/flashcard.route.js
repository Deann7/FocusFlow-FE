const express = require("express");
const router = express.Router();
const flashcardController = require("../controllers/flashcard.controller.js");

// Flashcard Set Routes
router.post("/set", flashcardController.createFlashcardSet);
router.get("/set/user/:user_id", flashcardController.getFlashcardSetsByUserId);
router.get("/set/:id", flashcardController.getFlashcardSetById);
router.get("/set/:id/cards", flashcardController.getFlashcardSetWithCards);
router.put("/set/:id", flashcardController.updateFlashcardSet);
router.delete("/set/:id", flashcardController.deleteFlashcardSet);

// Flashcard Routes
router.post("/card", flashcardController.createFlashcard);
router.get("/cards/set/:set_id", flashcardController.getFlashcardsBySetId);
router.put("/card/:id", flashcardController.updateFlashcard);
router.delete("/card/:id", flashcardController.deleteFlashcard);

module.exports = router;