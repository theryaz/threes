// TODO Use real Datastore
import { connectedPlayers, gameList } from '../model/socket.io.controller';

import * as express from 'express';
import { sanitizeParams, sanitizeBody, authentication } from '../middleware'

import { logger } from '../shared';
import { asyncWrap } from '../shared/async-wrap';

import { NotFoundError, UnauthorizedError } from '../errors';
import { Player } from '../model/classes/Player';


export class PlayerRouter{
	public router: express.Router;
	constructor(){
		this.router = express.Router();
		this.middleware();
		this.routes();
	}
	private middleware(){}
	private routes(){
		this.router.route("/list")
			.get(sanitizeBody,
			asyncWrap(async (req, res) => {
        const players: Player[] = [];
        const connectedIds = Object.keys(connectedPlayers);
        for(const connectedId of connectedIds){
					const player = connectedPlayers[connectedId];
					const game = gameList.find(g => g.hasPlayer(player));
					if(game !== undefined){
						// Don't show players playing games, or ended games with one player left
						if(game.Players.length > 1 || game.GameOver) continue;
						player.gameShortId = game.ShortId;
					}
					players.push(player);
				}
				res.json({ players });
			}));
	}
}

export default new PlayerRouter();
