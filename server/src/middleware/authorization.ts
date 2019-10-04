import { Request, Response, NextFunction } from 'express';
import { logger } from '../shared';
import { ForbiddenError } from '../errors';

import { Role } from '../model/enums';

/**
* Use After authorization middleware. Only allow specified roles through.
* Always allows Admin Role
*/
export function authorization(allowedRoles: Role[] = []){

	allowedRoles.push(Role.Admin); // Always Allow Admins

	return (req: Request, res: Response, next: NextFunction) => {
		const jwt = res.locals.jwtData;

		if(!jwt){
			throw new ForbiddenError("No Token Provided");
		}

		logger.silly(`${req.path} allow roles: ${allowedRoles}`, jwt);
		if(allowedRoles.indexOf(jwt.role) === -1){
			throw new ForbiddenError("Not authorized to use this route");
		}
		next();
	};
}
