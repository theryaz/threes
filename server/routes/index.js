const express = require('express');
const router = express.Router();

router.use('/games', require('./game.js'));
router.use('/players', require('./player.js'));

module.exports = router;
