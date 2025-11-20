const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const validUrl = require('valid-url');

router.post('/', async (req, res) => {
  try {
    const { target, code } = req.body;

    try {
      new URL(target);
    } catch {
      return res.status(400).json({ error: "Invalid target URL" });
    }

    if (code) {
      const allowed = /^[A-Za-z0-9]{6,8}$/;
      if (!allowed.test(code)) {
        return res.status(400).json({
          error: "Code must match [A-Za-z0-9]{6,8}"
        });
      }
      const exists = await Link.findOne({ code });
      if (exists) {
        return res.status(409).json({ error: "Code already exists" });
      }
    }

    const generateCode = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let c = "";
      for (let i = 0; i < 6; i++) {
        c += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return c;
    };

    let finalCode = code || generateCode();
    while (await Link.findOne({ code: finalCode })) {
      finalCode = generateCode();
    }
    
    const link = new Link({
      target,
      code: finalCode,
      clicks: 0,
    });

    await link.save();

    res.status(201).json({
      code: link.code,
      target: link.target,
      clicks: link.clicks,
      createdAt: link.createdAt,
    });

  } catch (err) {
    console.error("POST /api/links error:", err);
    res.status(500).json({ error: "server error" });
  }
});

router.get('/', async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).json({ error: 'Not found' });
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const result = await Link.findOneAndDelete({ code });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;