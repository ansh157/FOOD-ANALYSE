const express = require('express');
const cors = require('cors');
const path = require('path');
const analyzeRouter = require('./routes/analyze');
const authRouter = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/analyze', analyzeRouter);

app.get('/', (req, res) => {
  res.json({ status: 'Food Analyzer API is running' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
