import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectdb } from "./db/connnectdb.js";
import authRoutes from "../backend/routes/auth.route.js"
const app = express();
const PORT = process.env.PORT || 5000
dotenv.config();
app.use(express.json()) ; 
app.use(cookieParser())

app.listen(PORT , ()=>{
    const ap = process.env.MONGO_URI
    console.log(ap)
    console.log("Server is running at the port 3000");
    connectdb();

})
app.use("/api/auth" , authRoutes);

app.get("/" , (req , res)=>{
res.send("HELLO WORLD 123!!")
})
