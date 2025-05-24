const express = require("express");
const router = express.Router();
const cardController = require("../controllers/card.controller.js");


router.post("/", cardController.createCard);
router.get("/user/:user_id", cardController.getCardsByUserId);
router.get("/:id", cardController.getCardById);
router.put("/:id", cardController.updateCard);
router.delete("/:id", cardController.deleteCard);

module.exports = router;