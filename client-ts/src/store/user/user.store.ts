import store from '../store';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

import * as UserMutationTypes from './user.types';
import apiService from '../../services/api.service';
import { IPlayerInfo } from '@/model/interfaces';

import { COLORS } from '../../model/constants'


interface LoginPayload{
	jwt: string,
	username: string,
	role: string,
	avatarUrl: string | null,
	avatarIcon: string,
	color: string,
}

interface LoginParams{
	email: string,
	password: string,
}
interface RegisterParams{
	username: string,
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
	
	username: string | null = "Player";
	avatarUrl: string | null = null;
	avatarIcon: string | null = "fa-user";
	color: string | null = COLORS.primary;

	get isLoggedIn(): boolean{
		return this.jwt !== null;
	}

	@Action({ rawError: true }) async logout(){
		this.context.commit(UserMutationTypes.LOGOUT);
	}
	@Mutation [UserMutationTypes.LOGOUT](){
		this.loading = true;
		this.jwt = null;
		this.username = "Player";
		this.avatarIcon = "fa-user";
		this.avatarUrl = null;
		this.role = null;
		this.color = COLORS.primary;
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
				color: response.body.color,
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
			this.setTempUsername(this.username);
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
		this.color = payload.color;
		this.avatarIcon = payload.avatarIcon;
		this.avatarUrl = payload.avatarUrl;
		this.role = payload.role;
		window.localStorage.setItem("userAuth", JSON.stringify(payload));
	}
	@Mutation [UserMutationTypes.LOGIN_FAILURE](){
		this.loading = false;
  }
  
  @Action({rawError: true, commit: UserMutationTypes.REGISTER_SUCCESS}) async register({ username, email, password }: RegisterParams){
		this.context.commit(UserMutationTypes.REGISTER);
		try{
			let response = await apiService.post('/v1/user/register', { username, email, password });
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
		apiService.socket.emit(UserMutationTypes.SET_TEMP_USERNAME, username);
	}
	@Mutation [UserMutationTypes.SET_TEMP_USERNAME](username: string){
		this.username = username;
	}
	@Action setTempAvatar(playerInfo: IPlayerInfo){
		this.context.commit(UserMutationTypes.SET_TEMP_AVATAR, playerInfo);
	}
	@Mutation [UserMutationTypes.SET_TEMP_AVATAR]({ avatarIcon, color }: IPlayerInfo){
		this.avatarIcon = avatarIcon;
		this.color = color;
	}
}