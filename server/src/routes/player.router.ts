// TODO Use real Datastore
import { connectedPlayers } from '../model/socket.io.controller';

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
					players.push(connectedPlayers[connectedId]);
				}
				res.json({ players });
			}));
	}
}

export default new PlayerRouter();
