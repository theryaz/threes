const express = require('express');
const router = express.Router();

router.get('/join', (req, res, next) => {
  res.json({result: 'JOIN'});
});

module.exports = router;
