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
			.get(sanitizeBody, authentication,
			asyncWrap(async (req, res) => {
        const players: Player[] = [];
        const connectedIds = Object.keys(connectedPlayers);
        for(const connectedId of connectedIds){
					players.push(connectedPlayers[connectedId]);
				}
				// TEMP Add dummy Data
				players.push(<any>{
					"socket": ~~(Math.random() * 100000),
					"isInGame": false,
					"isReady": true,
					"email": "ryan.lawson437+wolf@gmail.com",
					"username": "Wolf",
					"role": "User",
					"_id": "5e2dd4efed04d0067cf8c791",
					"user": {
						"_id": "5e2dd4efed04d0067cf8c791",
						"uuid": "dcbe0b74-22b4-497a-a70e-55851c44148f",
						"username": "wolf",
						"email": "wolf.lawson437+wolf@gmail.com",
						"role": "User",
						"avatarUrl": null,
						"avatarIcon": "fa-dog",
						"color": "red"
					}
				});
				players.push(<any>{
					"socket": '' + ~~(Math.abs(Math.random() * 1000000000000)),
					"isInGame": false,
					"isReady": true,
					"email": "ryan.lawson437+Kiwi@gmail.com",
					"username": "Kiwi",
					"role": "User",
					"_id": "5e2dd4efed04d0067cf8c791",
					"user": {
						"_id": "5e2dd4efed04d0067cf8c791",
						"uuid": "dcbe0b74-22b4-497a-a70e-55851c44148f",
						"username": "Kiwi",
						"email": "Kiwi.lawson437+Kiwi@gmail.com",
						"role": "User",
						"avatarUrl": null,
						"avatarIcon": "fa-kiwi-bird",
						"color": "red"
					}
				});
				res.json({ players });
			}));
	}
}

export default new PlayerRouter();
