import { prop, getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

import { User } from './user.model';
import { logger, sha512, randomString, createJwt } from '../shared';
import { JWT_EXPIRY_SECONDS } from './constants';
import { Role } from './enums';

export class Game{
  
  @prop({default: () => randomString(8)}) private urlId: string;
  @prop({ ref: 'User' }) private players: User[];

};

export const GameModel = getModelForClass(Game); // GameModel is a regular Mongoose Model with correct types

GameModel.on('index', function() {
  logger.info("Game Indexes Created");
});
