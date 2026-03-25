import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import vaultRoutes from './routes/vaultRoutes.js';
import legacyRoutes from './routes/legacyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import initDeadManSwitch from './utils/deadManSwitch.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.json({ status: 'Ghost-Guest API running' }));

app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/legacy', legacyRoutes);
app.use('/api/admin', adminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    initDeadManSwitch();
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });