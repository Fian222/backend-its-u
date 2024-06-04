const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const oauth2Client = require('../middleware/authGoogle');
const { google } = require('googleapis');

const register = async (req, res) => {
  const { email, password, name, alamat, nomor_telp } = req.body;
  if (!email || !password || !name || !alamat || !nomor_telp) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const cekEmail = await User.findOne({ where: { email } });
    if (cekEmail) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      alamat,
      nomor_telp,
    });

    res.status(201).json({
      message: 'User created successfully',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        alamat: user.alamat,
        nomor_telp: user.nomor_telp,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const refresh_token = jwt.sign({ userId: user.id, email: user.email, name: user.name, role: user.role }, process.env.REFRESH_TOKEN, {
      expiresIn: '1d',
    });

    await User.update({ refresh_token }, { where: { email: email } });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ refresh_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const logout = async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) {
    return res.status(204);
  }
  try {
    const user = await User.findOne({ where: { refresh_token: refresh_token } });
    if (!user) {
      return res.status(204);
    }
    const userId = user[0].id;
    await User.update({ refresh_token: null }, { where: { id: userId } });
    res.clearCookie('refresh_token');
    return res.status(200).json({ message: 'Logout successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginGoogle = async (req, res) => {
  const scope = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scope,
    include_granted_scopes: true,
  });
  res.redirect(url);
};

const callbackGoogle = async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();
  if (!data) {
    return res.json({ data: data });
  }
  const user = await User.findOne({ where: { email: data.email } });
  if (!user) {
    const newUser = await User.create({
      email: data.email,
      name: data.name,
    });
    const refresh_token = jwt.sign({ userId: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }, process.env.REFRESH_TOKEN, {
      expiresIn: '1d',
    });

    await User.update({ refresh_token }, { where: { email: data.email } });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ refresh_token });
  } else {
    const refresh_token = jwt.sign({ userId: user.id, email: user.email, name: user.name, role: user.role }, process.env.REFRESH_TOKEN, {
      expiresIn: '1d',
    });
    await User.update({ refresh_token }, { where: { email: user.email } });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ refresh_token });
  }
};

module.exports = { register, login, logout, loginGoogle, callbackGoogle };
