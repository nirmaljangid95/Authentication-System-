import express from "express"
import morgan from "morgan";
import authroute from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth",authroute)

export default app;