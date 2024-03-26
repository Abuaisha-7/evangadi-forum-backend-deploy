// db connection
const dbConnection = require("../db/dbConfig");

const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { user_name, FirstName, LastName, user_email, password } = req.body;

  if (!user_email || !password || !FirstName || !LastName || !user_name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required fields" });
  }

  try {
    // To use it as a foreign key

    let insertregistration =
      "INSERT INTO registration (user_name , user_email ,FirstName,LastName, password ) VALUES (?,?,?,?,?)";
   

    const [user] = await dbConnection.query(
      "SELECT user_name, user_id from registration where user_name = ? or user_email = ?",
      [user_name, user_email]
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already existed" });
    }

    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 characters" });
    }

    // encrypt the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(insertregistration, [
      user_name,
      user_email,
      FirstName,
      LastName,
      hashedPassword,
    ]);

    
    return res.status(StatusCodes.CREATED).json({ msg: "user registered" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later" });
  }
}

async function login(req, res) {
  const { user_email, password } = req.body;

  if (!user_email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT user_name, user_id, password from registration where user_email = ?",
      [user_email]
    );
    // console.log(user)
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credential altemezegebkm" });
    }

    // compare password
    const isMach = await bcrypt.compare(password, user[0].password);
    if (!isMach) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid credential tesastekal bro" });
    }

    const userName = user[0].user_name;
    const userId = user[0].user_id;
    const token = jwt.sign({ userName, userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "user login successfully", token,userName });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later" });
  }
}

async function check(req, res) {
  const { userName, userId } = req.user;
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Valid user", userName, userId });
}

module.exports = { register, login, check };
