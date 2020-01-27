import uuid from 'uuid/v4';
import { Socket } from 'socket.io';

import { Document } from 'mongoose';
import { User, UserModel } from '../db';
import { verifyJwt, createLogger } from '../../shared';

import * as UserMutationTypes from '../../../../client-ts/src/store/user/user.types';
import * as GameMutationTypes from '../../../../client-ts/src/store/game/game.types';
import { IPlayerInfo, ICoords, IGameGridState, IGameMove, IGameState } from '../../../../client-ts/src/model/interfaces';

const logger = createLogger("Player.ts");
/**
 * Players are anyone currently connected via SocketIO from the site.
 * They can be registered or not.
 */
export class Player{

  public isInGame: boolean = false;

  private uuid: string;
  private email: string | null;
  private username: string | null;
  private role: string | null;
  private _id: string | null;
  
  public user: (Document & User) | null;
  
  get Uuid(){ return this.uuid; }
  get Email(){ return this.email; }
  get Username(){ return this.username; }
  get Role(){ return this.role; }
  get Id(){ return this._id; }
  get User(){
    if(this.user !== null && this._id){
      return UserModel.findOne({ _id: this._id });
    }else{
      return this.user;
    }
  }
  get PlayerInfo(): IPlayerInfo{
    logger.silly(`PlayerInfo: ${this.username}`);
    if(this.user){
      return {
        avatarIcon: this.user.avatarIcon,
        avatarUrl: this.user.avatarUrl,
        color: 'blue',
        username: this.username,
      };
    }else{
      return {
        avatarIcon: 'fa-dog',
        avatarUrl: null,
        color: 'blue',
        username: this.username,
      };
    }
  }
  get socketId(){ return this.socket.client.id }
  get isDisconnected(){ return this.socket.disconnected }
  
  get IsReady() { return this.isReady; }
  private isReady: boolean = true;
  
  constructor(public socket: SocketIO.Socket){
    socket.on('jwt', (jwt) => {
      logger.debug("Loaded Player JWT");
      this.onJwt(jwt).catch(e => {
        logger.error("JWT is invalid");
      });
    });
    socket.on(UserMutationTypes.SET_TEMP_USERNAME, (username) => this.onSetUsername(username));
    socket.on(UserMutationTypes.JOIN_GAME, this.onJoinGame);
  }
  // Called when the player updates their JWT.
  async onJwt(jwt: string){
    const decoded = await verifyJwt(jwt);
    logger.debug("Player connected", decoded.data);
    this.email = decoded.data.email;
    this.username = decoded.data.username;
    this.role = decoded.data.role;
    this._id = decoded.data._id;
    this.user = await UserModel.findOne({ _id: decoded.data._id });
  }
  // Called when the player updates their JWT.
  onSetUsername(username: string){
    this.username = username;
    logger.debug("Player set temp username: " + username);
  }
  onJoinGame(){

  }
  // Prevent Circular structure error
  toJSON(){
    return {
      ...this,
      socket: this.socketId,
      user: this.user ? this.user.getPublicFields() : {},
    }
  }
}