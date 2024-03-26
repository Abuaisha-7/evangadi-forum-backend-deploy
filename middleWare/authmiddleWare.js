const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function authMiddleWare(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication Invalid" });
  }

  const token = authHeader.split(" ")[1];
  //   console.log(authHeader);
  //   console.log(token);

  try {
    const { userName, userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userName, userId }; // we can attach our object user on the req & we can get every were authMiddleWare propagate
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication Invalid" });
  }
}

module.exports = authMiddleWare;
