const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const analyticsRoutes = require('./routes/analytics');
const { connectMongo } = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/analytics', analyticsRoutes);

const PORT = 3001;
connectMongo().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
