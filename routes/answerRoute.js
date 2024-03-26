const express = require("express");
const router = express.Router();

// answer controller
const {giveAnswer,allAnswers} = require("../controller/answerControler")

// Give Answer
router.post("/give-answer/:question_id",giveAnswer)

// All Answer
router.get("/all-answers/:post_id",allAnswers)

module.exports = router;
