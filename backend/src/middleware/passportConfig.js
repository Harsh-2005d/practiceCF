// const passport=require("passport")
// const prisma = require("../prisma-client");
// require("dotenv").config(); // 🔥 must be at the top

// const JWT = require('passport-jwt').Strategy;

// const JWT_SECRET = process.env.JWT_SECRET 

// const cookieExtractor = (req) => {
//     let token = null;
//     if (req && req.cookies) {
//         token = req.cookies.token;
//     }
//     return token;
// };
// const opt={
//   jwtFromRequest : cookieExtractor,
//   secretOrKey :JWT_SECRET ,

// }

// passport.use(new JWT(opt,async (payload,done)=>{
//    try {
//     const user = await prisma.user.findUnique({
//       where: { id: payload.sub },
//     });

//     if (!user) {
//       return done(null, false);
//     }

//     return done(null, user); // ✅ now req.user will be the actual user
//   } catch (err) {
//     return done(err, false);
//   }
// } 
// ))

// module.exports=passport

