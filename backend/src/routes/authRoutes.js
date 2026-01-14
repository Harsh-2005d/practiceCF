const express = require("express");
const controller = require("../controllers/authController");
const checkAuth = require("../middleware/requireAuth");
const { file } = require("../prisma-client");
const multer = require('multer');


// Store files in memory (you can switch to disk later if needed)
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/", checkAuth, (req, res) => {
  
  res.render("home", {
    user: req.user,
    files: req.files || [],
  });   
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/upload", checkAuth, upload.single("file"),controller.uploadFile);

router.post("/login", controller.login);
router.get("/sign-up",  (req, res) => {
  res.render("sign-up");
});
router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // use only if using HTTPS
    sameSite: "strict",
  });
  res.redirect("/login");
});

router.post("/signup", controller.signUp); 

module.exports = router;
