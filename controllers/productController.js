const Product = require('../models/productModel');
const cloudinary = require('../middleware/cloudinary');
const jwt = require('jsonwebtoken');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createProduct = async (req, res) => {
  const { nama_produk, jumlah, harga, deskripsi } = req.body;
  if (!nama_produk || !harga || !deskripsi || !jumlah) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const image = req.file;

  if (!image) {
    return res.status(400).json({ message: 'Image is required' });
  }

  try {
    const userId = jwt.decode(req.cookies.refresh_token).userId;
    const validImages = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImages.includes(image.mimetype)) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    const transaction = await Product.sequelize.transaction();
    try {
      cloudinary.uploader
        .upload_stream({ transformation: { quality: 'auto', fetch_format: 'auto' } }, async (err, result) => {
          if (err) throw err;
          const product = await Product.create({ nama_produk, harga, jumlah, deskripsi, gambar: result.url, public_id: result.public_id, id_user: userId }, { transaction });
          await transaction.commit();
          res.status(201).json(product);
        })
        .end(image.buffer);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  const { nama_produk, jumlah, harga, deskripsi } = req.body;
  const image = req.file;
  try {
    if (image) {
      const validImages = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImages.includes(image.mimetype)) {
        return res.status(400).json({ message: 'Invalid image format' });
      }
      const transaction = await Product.sequelize.transaction();
      try {
        const productImage = await Product.findOne({ where: { id: req.params.id } });
        await cloudinary.uploader.destroy(productImage.public_id, (err, result) => {
          if (err) throw err;
        });
        cloudinary.uploader
          .upload_stream({ transformation: { quality: 'auto', fetch_format: 'auto' } }, async (err, result) => {
            if (err) throw err;
            const product = await Product.findOne({ where: { id: req.params.id } });
            product.nama_produk = nama_produk || product.nama_produk;
            product.harga = harga || product.harga;
            product.jumlah = jumlah || product.jumlah;
            product.deskripsi = deskripsi || product.deskripsi;
            product.gambar = result.url;
            product.public_id = result.public_id;
            await product.save();
            await transaction.commit();
            res.json(product);
          })
          .end(image.buffer);
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } else {
      const product = await Product.findOne({ where: { id: req.params.id } });
      product.nama_produk = nama_produk || product.nama_produk;
      product.harga = harga || product.harga;
      product.jumlah = jumlah || product.jumlah;
      product.deskripsi = deskripsi || product.deskripsi;
      await product.save();
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
    await cloudinary.uploader.destroy(product.public_id, (err, result) => {
      if (err) throw err;
    });
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct };
