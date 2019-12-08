import { Role } from "../enums";

export interface JwtData{
	uuid: string,
	username: string,
	email: string,
	role: Role
	_id: string,
}

export interface Jwt{
	data: JwtData,
	iat: number,
	exp: number,
}
