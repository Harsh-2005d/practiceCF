import express from "express";
import cors from "cors";
import router from "./routes/route";
import solveRoutes from "./routes/solve.route";
import "./scheduler/cron";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", solveRoutes);

// mount routes
app.use("/api", router);

const PORT =3000 ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
