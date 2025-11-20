require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Link = require('./models/Link');
const linksRouter = require('./routes/links');

const app = express();
app.use(express.json());
app.use(cors());


app.get('/api/health', (req, res) => {
   res.json({ ok: true, version: "1.0", uptime: process.uptime() });
});

app.use('/api/links', linksRouter);

app.get('/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).send('Not found');

    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    res.redirect(302, link.target);
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
});

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('mongo connected');
    app.listen(PORT, () => console.log('server listening', PORT));
  })
  .catch(err => {
    console.error('db connect error', err);
  });