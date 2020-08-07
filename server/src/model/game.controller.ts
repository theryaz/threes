import winston from 'winston';
import uuid from 'uuid/v4';
import { Socket } from 'socket.io';

import { Document } from 'mongoose';
import { User, UserModel } from './db';
import { verifyJwt, createLogger, sleep, randomString } from '../shared';
const logger = createLogger('game.controller.ts');

import { socketIOController } from '../app';

import * as UserMutationTypes from '../../../client-ts/src/store/user/user.types';
import * as GameMutationTypes from '../../../client-ts/src/store/game/game.types';
import * as MultiplayerMutationTypes from '../../../client-ts/src/store/multiplayer/multiplayer.types';
import { IPlayerInfo, ICoords, IGameGridState, IGameMove, IGameState } from '../../../client-ts/src/model/interfaces';

export class GameController{
  constructor(private io: SocketIO.Server){
    
  }
}