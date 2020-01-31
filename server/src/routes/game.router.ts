// TODO Use real Datastore
import { socketIOController } from '../app';
import { gameList, connectedPlayers } from '../model/socket.io.controller';

import * as express from 'express';
import { sanitizeBody, authentication, loadClientId } from '../middleware'

import { logger } from '../shared';
import { asyncWrap } from '../shared/async-wrap';

import { NotFoundError, BadRequestError } from '../errors';
import { Game } from '../model/classes/Game';

import * as MultiplayerMutationTypes from '../../../client-ts/src/store/multiplayer/multiplayer.types';



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
      .post(sanitizeBody, loadClientId,
      asyncWrap(async (req, res) => {
        const clientId = res.locals.clientId;
        if(!clientId) throw new BadRequestError("Socket.io Connection Id is required (x-client-id header)");
        const hostPlayer = connectedPlayers[clientId];
        if(!hostPlayer) throw new BadRequestError(`Socket Id "${clientId}" not found`);
        const game = new Game(socketIOController.io, [ hostPlayer ]);
        gameList.push(game);
        socketIOController.io.emit(MultiplayerMutationTypes.GET_USERS);
        res.json({ gameShortId: game.ShortId });
      }));
    this.router.route("/join/:gameShortId")
      .post(sanitizeBody, loadClientId,
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
