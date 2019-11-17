export var ENVIRONMENT_NAME = process.env.VUE_APP_ENVIRONMENT_NAME;
export var API_URL = 'http://api.local.threeswithfriends.com';

if(process.env.VUE_APP_ENVIRONMENT_NAME == "staging") {

	API_URL = 'https://api.staging.threeswithfriends.com';

}else if(process.env.VUE_APP_ENVIRONMENT_NAME == "production") {

	API_URL = 'https://api.threeswithfriends.com';

}