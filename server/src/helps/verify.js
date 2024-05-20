const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  console.log(req.cookies)
  if (!token) return res.status(401).json("You are not authenticated.");

  jwt.verify(token, process.env.SECRET_JWT, (error, user) => {
    if (error) return res.status(403).json("Your token is invalid.");
    req.channel = user;
    next();
  });
};

module.exports = verifyToken;
