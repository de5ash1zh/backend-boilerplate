import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";

//import all routes
import userRoutes from "./routes/user.routes.js";
dotenv.config();
const app = express();
app.use(express.json());

// console.log(process.env);
app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // configuring backend that it accepts data in JSON format
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 4000;

app.get("/hitsh", (req, res) => {
  res.send("hii");
});

app.get("/piyush", (req, res) => {
  res.send("piyush"); // this callback -> functionality is being controlled -> called a controller
});
//connect to DB
db();

//user routes
app.use("/api/v1/users/", userRoutes);
///api/v1/users/ -> iss route ke baad kuch bhi aaya to transfer kar diya jayega userRoutes ko
///api/v1/users/ -> agar ye pattern match huye to iske baad aage kuch bhi ho it will be handled by userRoutes

app.listen(PORT, () => {
  console.log(`Your app is listening on port: ${PORT}`);
});
