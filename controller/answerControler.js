// db connection
const dbConnection = require("../db/dbConfig");

const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

async function giveAnswer(req, res) {
  const  {question_id} = req.params;
  const { userId } = req.user;
  const { answer } = req.body;

  if (!answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide your answer" });
  }

  try {
   
   
    const [singleQuestions] = await dbConnection.query(
      "SELECT question.*, registration.user_name from question JOIN registration ON question.user_id = registration.user_id WHERE question_id = ?",
      [question_id]
    );

    // console.log(singleQuestions);
    const post_id = singleQuestions[0].post_id;

    const answerQuery =
      "INSERT INTO answer (answer,user_id,post_id) VALUES (?,?,?)";

    await dbConnection.query(answerQuery, [answer, userId, post_id]);

    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong while posting the answer" });
  }
}

async function allAnswers(req, res) {
  // const {post_id} = req.body;
  
  const {post_id} = req.params;

  try {

    // const [answers] = await dbConnection.query(
    //   "SELECT answer.*, registration.user_name from answer JOIN registration ON answer.user_id = registration.user_id ORDER BY answer.answer_id DESC"
    
    //   // "SELECT answer.*, registration.user_name from answer JOIN registration ON answer.user_id = registration.user_id WHERE question_id = ? ORDER BY answer.answer_id DESC",[question_id]
    // );

    const [answers] = await dbConnection.query(

      "SELECT answer.*, registration.user_name from answer JOIN registration ON answer.user_id = registration.user_id WHERE post_id = ? ORDER BY answer.answer_id DESC",[post_id]

      // `SELECT *  FROM answer WHERE answer.post_id = ?`,[post_id]
    );

    console.log(answers)

    return res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, please try again later" });
  }
}

module.exports = { giveAnswer, allAnswers };
