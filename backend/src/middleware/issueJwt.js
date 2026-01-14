const jwt = require("jsonwebtoken");
require("dotenv").config(); // 🔥 must be at the top

const JWT_SECRET = process.env.JWT_SECRET 
function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    
  );
}

module.exports = { signAccessToken };