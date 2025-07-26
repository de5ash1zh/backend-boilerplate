import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";

dotenv.config();
const app = express();
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

app.get("/", (req, res) => {
  res.send("hii");
});
//connect to DB
db();
app.listen(PORT, () => {
  console.log(`Your app is listening on port: ${PORT}`);
});
