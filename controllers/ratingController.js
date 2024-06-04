const jwt = require('jsonwebtoken');
const Rating = require('../models/ratingModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Transaksi = require('../models/transaksiModel');

const createRating = async (req, res) => {
  const id_user = jwt.decode(req.cookies.refresh_token).userId;
  const id_product = req.params.id;
  const { rating, review } = req.body;
  try {
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }

    const cekTransaksi = await Transaksi.findOne({ where: { id_user, id_product, status: 'success' } });
    if (!cekTransaksi) {
      return res.status(400).json({ message: 'Transaksi not found' });
    }

    const rating_products = await Rating.create({ rating, review, id_user, id_product });

    return res.status(201).json({ message: 'Rating created successfully', data: rating_products });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getRatingByProductId = async (req, res) => {
  const id_product = req.params.id;
  try {
    const rating_products = await Rating.findAll({ where: { id_product } });

    return res.status(200).json({ data: rating_products });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateRating = async (req, res) => {
  const id_user = jwt.decode(req.cookies.refresh_token).userId;
  const id_product = req.params.id;
  const { rating, review } = req.body;
  try {
    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }
    const rating_products = await Rating.findOne({ where: { id_user, id_product } });

    if (!rating_products) {
      return res.status(400).json({ message: 'Rating not found' });
    }

    rating_products.rating = rating || rating_products.rating;
    rating_products.review = review || rating_products.review;
    await rating_products.save();
    return res.status(200).json({ message: 'Rating updated successfully', data: rating_products });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createRating,
  getRatingByProductId,
  updateRating,
};
