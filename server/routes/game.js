const express = require('express');
const router = express.Router();
const { Player, Game } = require('../classes');
const { PlayerList, GameList } = require('../storage');
const { NotFoundError } = require('../errors');

router.get('/', (req, res, next) => {
  res.json({result: GameList});
});

router.post('/', (req, res, next) => {
  let game = new Game();
  GameList.push(game);
  res.json({result: game});
});

router.get('/:id', (req, res, next) => {
  let game = GameList.find(x => x.id == req.params.id);
  if(game === undefined) throw new NotFoundError("Game Not Found", {x: 123});
  res.json({result: game});
});

module.exports = router;
