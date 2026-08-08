const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "User not found",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT);
  req.user = {
    id: decoded.id,
    name: decoded.name,
    email: decoded.email,
    role: decoded.role,
  };

  next();
};

module.exports = isAuth;
