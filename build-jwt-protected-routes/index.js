import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";


const PORT = process.env.PORT;
const app = express();

app.use(helmet());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Auth API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
