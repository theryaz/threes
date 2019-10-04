import { KeyValueMap } from '../model/interfaces';

export function loadEnvs(envs: string[], throw_error: boolean = true): KeyValueMap{
	let environment:KeyValueMap = {};
	let missing_envs: string[] = [];
	for(let env of envs){
		if(process.env[env] !== undefined){
			environment[env] = <string>process.env[env];
		}else{
			missing_envs.push(env);
		}
	}
	if(missing_envs.length > 0){
		let message = "Failed to load environment variables: " + missing_envs.join(",");
		if(throw_error) throw new Error(message);
		else console.error("WARNING: " + message);
	}
	return environment;
}
