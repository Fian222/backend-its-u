const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const app = express();
const User = require('./models/userModel');
const Product = require('./models/productModel');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(process.env.PORT, () => {
  User.sync({ alter: true });
  Product.sync({ alter: true });
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
