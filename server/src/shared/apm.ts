import APM from 'elastic-apm-node';
import { loadEnvs } from './load-envs';
const apmEnvs = loadEnvs([
	'APM_SECRET',
	'APM_URL',
], false);

let active = true;
if(process.env.APM_DEACTIVATE !== undefined){
	console.log('[apm.ts] APM_DEACTIVATE Present, disable apm');
	active = false;
}

if(apmEnvs['APM_SECRET'] && apmEnvs['APM_URL']){
	APM.start({
		serviceName: `V2 CPP ${process.env.ENVIRONMENT_NAME}`,
		secretToken: process.env.APM_SECRET,
		serverUrl: process.env.APM_URL,
		active: active,
		ignoreUrls: [
			/\/healthcheck/i
		]
	});
}else{
	console.log('[apm.ts] Skipping APM. Missing Configuration');
}

export const apm = APM;
