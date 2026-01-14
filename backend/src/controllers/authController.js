
// const { signAccessToken } = require("../middleware/issueJwt");
// const prisma = require("../prisma-client");
// const bcrypt= require('bcrypt');
// const multer = require('multer');
// const supabase = require('../middleware/supabase').default;


// exports.login = async function login(req, res) {
//     try {
//         console.log("User authenticated:");

//     } catch (err) {
//         console.error("Login error:", err);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };

// exports.signUp=async (req, res, next) => {
//     console.log("BODY:", req.body);

//     let { first_name, last_name, email, password, Confirm } = req.body;

//     Confirm=Confirm.trim();
//     password=password.trim();

//     if(password!==Confirm){
//         return res.render("signup",{error: "passwords dont match"});
//         }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await prisma.User.create({data:{
//         firstname: first_name,
//         lastname: last_name,
//         email: email,
//         password: hashedPassword,
//     }
//     });
//     res.redirect("/login");
//   } catch(err) {
//     return next(err);
//   }
// }
// const upload = multer({ storage: multer.memoryStorage() });

// exports.uploadFile = async (req, res) => {
//   try {
//     // ✅ Get userId securely from authenticated request
//     const userId = req.user.id;

//     const file = req.file; // ✅ Multer put uploaded file here

//     if (!file) {
//       return res.status(400).json({ success: false, error: 'No file uploaded' });
//     }

//     const filePath = `${userId}/${file.originalname}`;
//     console.log('supabase object:', supabase);
// console.log('supabase.storage:', supabase.storage);

//     // ✅ Upload to Supabase Storage
//     const { data, error } = await supabase.storage
//       .from('cloud-storage') // 📌 Make sure this bucket exists in Supabase
//       .upload(filePath, file.buffer, {
//         contentType: file.mimetype,
//         upsert: false, // change to true to allow overwriting
//       });

//     if (error) throw error;

    
//     const { data: publicUrlData } = supabase.storage
//       .from('cloud-storage')
//       .getPublicUrl(filePath);

//     const publicUrl = publicUrlData?.publicUrl;

//     // ✅ Save metadata to your PostgreSQL (via Prisma)
//     const savedFile = await prisma.file.create({
//       data: {
//         name: file.originalname,
//         url: publicUrl,
//         size: file.size,
//         mimeType: file.mimetype,
//         userId: userId,
//       },
//     });

//     res.status(200).json({ success: true, file: savedFile });
//   } catch (error) {
//     console.error('File upload error:', error);
//     res.status(500).json({ success: false, error: 'File upload failed' });
//   }
// };