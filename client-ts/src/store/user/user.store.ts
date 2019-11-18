import store from '../store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

import * as UserMutationTypes from './user.types';
import apiService from '../../services/api.service';


interface LoginPayload{
	jwt: string,
	username: string,
	role: string,
	avatarUrl: string | null,
	avatarIcon: string,
}

interface LoginParams{
	email: string,
	password: string,
}

@Module({
	namespaced: true,
	dynamic: true,
	name: 'userStore',
	store: store
})
export default class UserModule extends VuexModule{
  /** Registration */
  joinLoading: boolean = false;
  joinError: string | null = null;
  
  /** Logging In */
  loading: boolean = false;
	jwt: string | null = null;
	role: string | null = null; // Allow Admin Role for debugging purposes
	
	username: string | null = null;
	avatarUrl: string | null = null;
	avatarIcon: string | null = null;

	get isLoggedIn(): boolean{
		return this.jwt !== null;
	}

	@Action({ rawError: true }) async logout(){
		this.context.commit(UserMutationTypes.LOGOUT);
	}
	@Mutation [UserMutationTypes.LOGOUT](){
		this.loading = true;
		this.jwt = null;
		this.username = null;
		this.avatarIcon = null;
		this.avatarUrl = null;
		this.role = null;
		window.localStorage.removeItem("userAuth");
	}
	
  @Action({ rawError: true }) async login({ email, password }: LoginParams){
		this.context.commit(UserMutationTypes.LOGIN);
		try{
			let response = await apiService.post('/v1/user/login', { email, password });
			const payload: LoginPayload = {
				jwt: response.body.jwt,
				username: response.body.username,
				avatarIcon: response.body.avatarIcon,
				avatarUrl: response.body.avatarUrl,
				role: response.body.role,
			};
			this.context.commit(UserMutationTypes.LOGIN_SUCCESS, payload);
		}catch(error){
			this.context.commit(UserMutationTypes.LOGIN_FAILURE);
			throw error;
		}
	}
	@Action({rawError: true}) async loadAuth(){
		console.log("Load Auth");
		const userAuth = window.localStorage.getItem("userAuth");
		if(!userAuth){
			console.log("No user auth exists");
			return;
		}
		const payload = JSON.parse(userAuth);
		this.context.commit(UserMutationTypes.LOGIN_SUCCESS, payload);
  }

	@Mutation [UserMutationTypes.LOGIN](){
		this.loading = true;
	}
	@Mutation [UserMutationTypes.LOGIN_SUCCESS](payload: LoginPayload){
		this.loading = false;
		this.jwt = payload.jwt;
		this.username = payload.username;
		this.avatarIcon = payload.avatarIcon;
		this.avatarUrl = payload.avatarUrl;
		this.role = payload.role;
		window.localStorage.setItem("userAuth", JSON.stringify(payload));
	}
	@Mutation [UserMutationTypes.LOGIN_FAILURE](){
		this.loading = false;
  }
  
  @Action({rawError: true, commit: UserMutationTypes.REGISTER_SUCCESS}) async register({ email, password }: LoginParams){
		this.context.commit(UserMutationTypes.REGISTER);
		try{
			let response = await apiService.post('/v1/register', { email, password });
			return {
				jwt: response.body.jwt,
				role: response.body.role,
			};
		}catch(error){
			this.context.commit(UserMutationTypes.REGISTER_FAILURE);
			throw error;
		}
	}
  
	@Mutation [UserMutationTypes.REGISTER](){
    this.joinLoading = true;
    this.joinError = null;
	}
	@Mutation [UserMutationTypes.REGISTER_SUCCESS]({ jwt, role }: LoginPayload){
		this.joinLoading = false;
	}
	@Mutation [UserMutationTypes.REGISTER_FAILURE](errorMessage: string){
		this.joinLoading = false;
		this.joinError = errorMessage;
	}

	@Action setTempUsername(username: string){
		this.context.commit(UserMutationTypes.SET_TEMP_USERNAME, username);
	}
	@Mutation [UserMutationTypes.SET_TEMP_USERNAME](username: string){
		this.username = username;
	}
}