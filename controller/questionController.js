// db connection
const dbConnection = require("../db/dbConfig");

const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

async function askQuestions(req, res) {
  const { question, question_descriptione } = req.body;

  if (!question || !question_descriptione) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required fields" });
  }

  try {
    // To use it as a foreign key

    let insertQuestion =
      "INSERT INTO question (question , question_descriptione , user_id, post_id ) VALUES (?,?,?,?)";
    // user_id extracted from authMiddleWare
    const user_id = req.user.userId;

    const post_id = crypto.randomUUID();
    console.log(post_id);
    console.log(user_id);
    await dbConnection.query(insertQuestion, [
      question,
      question_descriptione,
      user_id,
      post_id,
    ]);

    return res.status(StatusCodes.CREATED).json({ msg: "Question posted" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later" });
  }
}

async function allQuestions(req, res) {

  try {
    const [allQuestions] = await dbConnection.query(
      "SELECT question.*, registration.user_name from question JOIN registration ON question.user_id = registration.user_id ORDER BY question.question_id DESC"
    );
    if (allQuestions.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "No questions yet" });
    }
    return res.status(StatusCodes.OK).json({ allQuestions });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later" });
  }
}

async function singleQuestions(req, res) {
  const  {question_id} = req.params;

  try {
    const [singleQuestions] = await dbConnection.query(
      "SELECT question.*, registration.user_name from question JOIN registration ON question.user_id = registration.user_id WHERE question_id = ?",
      [question_id]
    );
    console.log(singleQuestions);
    if (singleQuestions.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "No questions yet" });
    }

    return res.status(StatusCodes.OK).json({ singleQuestions });

  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later" });
  }
}

module.exports = { askQuestions, allQuestions, singleQuestions };
