import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import paymentRoutes from "./routes/paymentRoutes.js"

const app = express();
dotenv.config();
connectDb();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // 👈 Allow frontend origin
  credentials: true // optional if you're using cookies
}));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Api working")
})

// API route
app.use("/api/payment", paymentRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
})