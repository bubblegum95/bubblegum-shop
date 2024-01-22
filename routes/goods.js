import express from "express";
import mongoose from 'mongoose';
import Goods from "../schemas/goods.js";
import Joi from 'joi';

const router = express.Router();
// 유효성 검사 
const addSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  author: Joi.string().required(),
  password: Joi.string().required(),
  status: Joi.string().valid("FOR_SALE", "SOLD_OUT").required(),
  createdAt: Joi.date().default(new Date()),
});

// 상품 생성 api
router.post("/goods", async (req, res, next) => {
  try {
    const validation = await addSchema.validateAsync(req.body);
    const { name, price, description, author, password, status, createdAt } = validation;

    const highestGoods = await Goods.findOne().sort("-goodsId").exec();
    const highestGoodsId = highestGoods ? highestGoods.goodsId : 0;

    const createdGoods = await Goods.create({
      goodsId: highestGoodsId + 1,
      name: name,
      price: price,
      description: description,
      author: author,
      password: password,
      status: status,
      createdAt: createdAt,
    });

    await createdGoods.save();

    return res.status(201).json({ goods: createdGoods });
  } catch (error) {
    next(error);
  }
});

// 상품 조회 api
router.get('/goods', async (req, res, next) => {
  try {
    const goodsList = await Goods.find()
      .select("name author status createdAt")
      .sort("-createdAt");

    return res.status(200).json({ goods: goodsList });
  } catch (error) {
    return res.status(500).json({ errorMessage: '상품 목록 조회 중 에러가 발생했습니다.' });
  }
});

// 상품 상세 조회 
router.get('/goods/:id', async (req, res, next) => {
  const goodsId = req.params.id;

  try {
    const goods = await Goods.findById(goodsId);
    if (!goods) {
      return res.status(404).json({ message: "상품을 조회할 수 없습니다." });
    }

    return res.status(200).json({ goods: goods });
  } catch (error) {
    next(error);
  }
});

// 상품 정보 수정
router.put('/goods/:id', async (req, res, next) => {
  const goodsId = req.params.id;
  const { name, description, status, password, price } = req.body;

  try {
    const goods = await Goods.findById(goodsId);
    if (!goods) {
      return res.status(404).json({ message: "상품을 조회할 수 없습니다." });
    }

    if (goods.password !== password) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    goods.name = name;
    goods.description = description;
    goods.status = status;
    goods.createdAt = new Date();
    goods.price = price;
    
    await goods.save();

    return res.status(200).json({ goods: goods });
  } catch (error) {
    next(error);
  }
});

// 상품 삭제 
router.delete('/goods/:id', async (req, res, next) => {
  const goodsId = req.params.id;
  const password  = req.body.password;

  try {
    const goods = await Goods.findById(goodsId);
    if (!goods) {
      return res.status(404).json({ message: "상품을 조회할 수 없습니다." });
    }

    if (goods.password !== password) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    await goods.deleteOne({_id: goodsId});

    return res.status(200).json({ message: "상품을 삭제하였습니다." });
  } catch (error) {
    next(error);
  }
});

export default router;
