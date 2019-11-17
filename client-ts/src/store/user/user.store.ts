import store from '../store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

import * as UserMutationTypes from './user.types';
import apiService from '../../services/api.service';


interface LoginPayload{
	jwt: string,
	role: string,
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


  @Action({rawError: true, commit: UserMutationTypes.LOGIN_SUCCESS}) async login({ email, password }: LoginParams){
		this.context.commit(UserMutationTypes.LOGIN);
		try{
			let response = await apiService.post('/v1/login', { email, password });
			return {
				jwt: response.body.jwt,
				role: response.body.role,
			};
		}catch(error){
			this.context.commit(UserMutationTypes.LOGIN_FAILURE);
			throw error;
		}
	}
	@Action({rawError: true}) async loadAuth(payload: LoginPayload){
		this.context.commit(UserMutationTypes.LOGIN_SUCCESS, payload);
  }

	@Mutation [UserMutationTypes.LOGIN](){
		this.loading = true;
	}
	@Mutation [UserMutationTypes.LOGIN_SUCCESS]({ jwt, role }: LoginPayload){
		this.loading = false;
		this.jwt = jwt;
		this.role = role;
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