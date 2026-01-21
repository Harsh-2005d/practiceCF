import express from "express";
import cors from "cors";
import router from "./routes/route";
import "./scheduler/cron";
import cookieParser from "cookie-parser"
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser())
app.use(express.json());


// mount routes
app.use("/api", router);

const PORT =3000 ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
