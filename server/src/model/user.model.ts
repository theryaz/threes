import uuid from 'uuid/v4';
import { prop, getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { logger, sha512, randomString, createJwt } from '../shared';
import { JWT_EXPIRY_SECONDS } from './constants';
import { Role } from './enums';
import { ObjectId } from 'bson';

interface RegisterUserParams{
  username: string,
  email: string,
  password: string,
  role: Role,
  avatarUrl?: string,
  avatarIcon?: string
}

export class User{
  public _id: ObjectId;
  @prop({ default: uuid }) public uuid: string;
  @prop() public username: string;
  @prop({ index: true, unique: true}) public email: string;
  @prop({ default: Role.User }) public role: Role;

  @prop({ default: null }) public avatarUrl: string | null;
  @prop({ default: 'fa-user' }) public avatarIcon: string;
  @prop({ default: 'red' }) public color: string;

  @prop() private password: string;
  @prop({ default: () => randomString(16) }) private salt: string;
  
  public createJwt(maxAgeOverride?: number){
    return createJwt({
      data:{
        uuid: this.uuid,
        username: this.username,
        email: this.email,
        role: this.role,
        _id: this._id.toHexString(),
      },
      maxAge: maxAgeOverride || JWT_EXPIRY_SECONDS,
    });
  }
  public checkPassword(password: string): boolean{
    return this.password === sha512(password, this.salt);
  }
  public setPassword(password: string){
    this.password = sha512(password, this.salt);
  }
  
  static async registerUser({ username, email, password, role, avatarUrl, avatarIcon }: RegisterUserParams){
    const salt = randomString(16);
    const user = await UserModel.create({ username, email, role, avatarUrl, avatarIcon } as User);
    user.setPassword(password);
    await user.save();
    return createJwt({
      data:{
        uuid: user.uuid,
        username,
        email,
        role: role,
        _id: user._id,
      },
      maxAge: JWT_EXPIRY_SECONDS
    });
  } 
};

export const UserModel = getModelForClass(User); // UserModel is a regular Mongoose Model with correct types

UserModel.on('index', function() {
  logger.info("User Indexes Created");
});
