import express from "express";
import router from "./routes/products.router.js";
import connect from "./schemas/index.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();

const app = express()

connect();
app.use(bodyParser.json());

app.use("/api", router);
app.listen(3000, ()=>{
  console.log('서버가 새로 띄워졌네요!');
});
