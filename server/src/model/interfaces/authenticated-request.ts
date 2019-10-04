import { Response } from 'express';
import { JwtData } from '.';

/**
* Express Response passed through Authentication middleware
*/
export interface IAuthenticatedResponse extends Response{
	locals:{
		jwtData: JwtData
	},
	body: any,
	query: any,
	params: any,
}
