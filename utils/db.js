import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
//export a function that connects to DB

const db = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`Connected to DB`);
    })
    .catch((err) => {
      console.log(`Error connecting to DB`);
    });
};

export default db;
