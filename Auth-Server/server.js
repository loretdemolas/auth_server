import express, { json } from "express";
import { CLIENT} from './config/config.js';
import cors from 'cors'
import { dbConnect } from "./config/database.js";
import { router } from "./routes/authRoutes.js";

dbConnect()


const app = express();

const corsOptions = {
    origin: CLIENT,
    optionSuccessStatus: 200
}

app.use(json({ limit: "50mb" }));
app.use(cors(corsOptions))
app.use('/api/user', router)

export default app;