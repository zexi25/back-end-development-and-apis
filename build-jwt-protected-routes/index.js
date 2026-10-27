import express, { application } from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";


const PORT = process.env.PORT;
const app = express();

app.use(helmet());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Auth API is running" });
});

app.use((err, req, res, next)=>{
  if (res.headersSent) {
    return next(err);
  }
  
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(Number(statusCode)).json({
    error: message,
  });
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
