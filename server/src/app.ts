import express from 'express';
import http from 'http';
import body_parser from 'body-parser';
import cors from 'cors';
import socket from 'socket.io';

import graphqlHTTP from 'express-graphql';
import { graphqlSchema } from './schema';

import { createLogger } from './shared';
const logger = createLogger('app.ts');

let version: string;
try{
	version = require('../package.json').version;
}catch(e){
	console.error("Failed to load Version from package.json", e);
}

import { logRoute } from './middleware';
import { errorHandler } from './errors';

export class App{

	public app: express.Application;
	public httpServer;
	public io: SocketIO.Server;
	constructor(){
		this.app = express();
		this.httpServer = http.createServer(this.app);
		this.io = socket(this.httpServer);
		this.socketHandlers();
		this.middleware();
		this.routes();
		this.postMiddleware();
	}

	private middleware(): void{
		logger.debug("App loading middleware");
		this.app.use(body_parser.json());
		this.app.use(cors());
		this.app.use(logRoute);
	}

	private routes(): void{
		logger.debug("App loading routes");
		this.app.get('/healthcheck', (_, res: express.Response) => res.status(200).end());
		this.app.get('/v1', (_, res: express.Response) => {
			res.json({
				result:"Threes With Friends API",
				version: version
			});
		});
		this.app.use('/graphql',
				graphqlHTTP({
					schema: graphqlSchema,
					graphiql: true,
				})
		);
	}
	private postMiddleware(): void{
		this.app.use(errorHandler);
	}

	private socketHandlers(): void{
		logger.info("Setup Socket.io handlers");
		this.io.on('connection', (socket) => {
			logger.info("A User Connected! " + socket.client.id);
		});
	}
}

export default new App().httpServer;
