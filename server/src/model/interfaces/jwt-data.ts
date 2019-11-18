import { Role } from "../enums";

export interface JwtData{
	username: string,
	email: string,
	role: Role
}

export interface Jwt{
	data: JwtData,
	iat: number,
	exp: number,
}
