import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, lastLogin: new Date() });
    res.status(201).json({ token: signToken(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();
    res.json({ token: signToken(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyAlive = async (req, res) => {
  try {
    const payload = jwt.verify(req.params.token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(payload.id, { lastLogin: new Date(), verificationEmailsSent: 0 });
    res.json({ message: 'Verified! Your account is marked as active.' });
  } catch {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
