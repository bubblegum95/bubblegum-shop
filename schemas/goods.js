import mongoose from "mongoose";
const goodsSchema = new mongoose.Schema({
  // 상품 모델을 만들기 위한 스키마 작성
  goodsId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: Number,
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["FOR_SALE", "SOLD_OUT"],
    default: "FOR_SALE",
  },
  createdAt: {
    type: Date, 
    default: Date.now,
  }
});

export default mongoose.model("Goods", goodsSchema);
