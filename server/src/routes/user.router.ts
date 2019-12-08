import * as express from 'express';
import { sanitizeParams, sanitizeBody } from '../middleware'

import { logger } from '../shared';
import { asyncWrap } from '../shared/async-wrap';

import { NotFoundError, UnauthorizedError } from '../errors';

import { User, UserModel } from '../model/db';
import { Role } from '../model/enums';

export class UserRouter{
	public router: express.Router;
	constructor(){
		this.router = express.Router();
		this.middleware();
		this.routes();
	}
	private middleware(){}
	private routes(){
		this.router.route("/register")
			.post(sanitizeBody,
			asyncWrap(async (req, res) => {
				const { username, email, password, avatarIcon } = req.body;
				logger.debug('Registering user', req.body);
				const jwt = await User.registerUser({ username, email, password, role: Role.User, avatarIcon });
				res.json({
					jwt
				});
			}));
		this.router.route("/login")
			.post(sanitizeBody,
			asyncWrap(async (req, res) => {
				const { email, password } = req.body;
				const user = await UserModel.findOne({ email });
				if(user === null || user.checkPassword(password) === false){
					throw new UnauthorizedError();
				}
				const jwt = user.createJwt();
				res.json({
					username: user.username,
					avatarUrl: user.avatarUrl,
					avatarIcon: user.avatarIcon,
					role: user.role,
					color: user.color,
					jwt,
				});
			}));
	}
}

export default new UserRouter();
