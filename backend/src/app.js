
const express=require('express');
const app=express();
const passport=require('./middleware/passportConfig')
const path = require("path");

const routes = require('./routes/authRoutes');


const cookieParser = require("cookie-parser");


app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());
app.use("/",routes)

app.listen(3000,()=>{
    console.log("your app is running on 3000")
})