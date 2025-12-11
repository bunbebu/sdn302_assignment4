const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// 🚀 Đã sửa: Cấu hình CORS an toàn hơn, chỉ cho phép Frontend đã deploy truy cập
// Đảm bảo bạn đã thêm biến FRONTEND_URL vào Render (Backend)
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000']; 

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép yêu cầu không có 'origin' (như Postman) hoặc 
      // nếu origin nằm trong danh sách cho phép (FRONTEND_URL hoặc localhost)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Quan trọng nếu dùng cookie/session
  })
);


app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Backend is running! ✔");
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes (giữ nguyên, không dùng tiền tố /api/)
app.use("/quizzes", quizRoutes);
app.use("/questions", questionRoutes);
app.use("/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));