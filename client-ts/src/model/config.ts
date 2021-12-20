export const ENVIRONMENT_NAME = process.env.VUE_APP_ENVIRONMENT_NAME;
// export let API_URL = 'http://api.local.threeswithfriends.com';
// export let API_URL = 'http://192.168.132.196:4280';
export let API_URL = 'http://localhost:4280';

if(process.env.VUE_APP_ENVIRONMENT_NAME == "staging") {

	API_URL = 'https://api.staging.threeswithfriends.com';

}else if(process.env.VUE_APP_ENVIRONMENT_NAME == "production") {

	API_URL = 'https://threeswithfriends.herokuapp.com';
	// API_URL = 'https://api.threeswithfriends.com';

}