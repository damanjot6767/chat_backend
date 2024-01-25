require('dotenv').config()
import connectDB from "./db/index";
import { app } from "./app";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is runing at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection error", err);
  });