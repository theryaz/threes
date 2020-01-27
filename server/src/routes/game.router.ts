// TODO Use real Datastore
import { socketIOController } from '../app';
import { gameList, connectedPlayers } from '../model/socket.io.controller';

import * as express from 'express';
import { sanitizeParams, sanitizeBody, authentication } from '../middleware'

import { logger } from '../shared';
import { asyncWrap } from '../shared/async-wrap';

import { NotFoundError, UnauthorizedError, BadRequestError } from '../errors';
import { Player } from '../model/classes/Player';
import { Game } from '../model/classes/Game';
import { JwtData } from '../model/interfaces';
import { UserModel } from '../model/db';


export class GameRouter{
  public router: express.Router;
  constructor(){
    this.router = express.Router();
    this.middleware();
    this.routes();
  }
  private middleware(){}
  private routes(){
    this.router.route("/list")
      .get(asyncWrap(async (req, res) => {
        res.json({ games: gameList });
      }));
    this.router.route("/create")
      .post(sanitizeBody, authentication,
      asyncWrap(async (req, res) => {
        const clientId = res.locals.clientId;
        if(!clientId) throw new BadRequestError("Socket.io Connection Id is required (x-client-id header)");
        const hostPlayer = connectedPlayers[clientId];
        if(!hostPlayer) throw new BadRequestError(`Socket Id "${clientId}" not found`);
        const game = new Game(socketIOController.io, [ hostPlayer ]);
        gameList.push(game);
        res.json({ gameShortId: game.ShortId });
      }));
    this.router.route("/join/:gameShortId")
      .post(sanitizeBody, authentication,
      asyncWrap(async (req, res) => {
        const clientId = res.locals.clientId;
        if(!clientId) throw new BadRequestError("Socket.io Connection Id is required (x-client-id header)");
        const player = connectedPlayers[clientId];
        const { gameShortId } = req.params;
        const game = gameList.find(g => g.ShortId === gameShortId.toUpperCase());
        if(!game) throw new NotFoundError(`Game not found with Id ${gameShortId}`);
        game.addPlayer(player);
        res.json({ result: "ok" });
      }));
  }
}

export default new GameRouter();
