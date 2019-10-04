export interface JwtData{
	userId: string,
}

export interface Jwt{
	data: JwtData,
	iat: number,
	exp: number,
}
