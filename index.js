import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
// console.log(process.env);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
  })
);
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("hii");
});

app.listen(PORT, () => {
  console.log(`Your app is listening on port: ${PORT}`);
});
