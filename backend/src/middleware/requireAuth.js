const passport = require("passport");

function checkAuth(req, res, next) {
  console.log("➡️ Cookies:", req.cookies);

  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      
      return res.redirect("/login");
    }

    req.user = user;
    
    return next();
  })(req, res, next);
}


module.exports = checkAuth;
