import jwt from 'jsonwebtoken';

import { logger, loadEnvs } from '../shared';
import { JWT_EXPIRY_SECONDS } from '../model/constants';
import { Jwt, JwtData } from '../model/interfaces';

const { JWT_SECRET } = loadEnvs(["JWT_SECRET"]);

export function verifyJwt(token: string): Promise<Jwt>{
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
			logger.debug("Verified JWT decodedToken:", decodedToken);
			if(err || !decodedToken) reject(err);
			else resolve(<Jwt>decodedToken);
		});
	});
}

export function createJwt({data, maxAge}: {data: JwtData, maxAge?: number}): string{
	if(!maxAge) maxAge = JWT_EXPIRY_SECONDS;
	return jwt.sign({data}, JWT_SECRET, {
		expiresIn: maxAge,
		algorithm: 'HS256'
	});
}
