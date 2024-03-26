const express = require("express");
const router = express.Router();

// questions controller
const {
  askQuestions,
  allQuestions,
  singleQuestions,
} = require("../controller/questionController");
// Ask questions
router.post("/ask-questions", askQuestions);

// All questions
router.get("/all-questions", allQuestions);

// Single questions
router.get("/single-questions/:question_id", singleQuestions);
module.exports = router;
