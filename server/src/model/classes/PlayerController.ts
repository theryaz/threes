import uuid from 'uuid/v4';
import { Socket } from 'socket.io';

import { Avatars } from '../constants';
import { User, UserModel } from '../db';
import { verifyJwt, createLogger } from '../../shared';

import * as UserMutationTypes from '../../../../client-ts/src/store/user/user.types';
import * as GameMutationTypes from '../../../../client-ts/src/store/game/game.types';
import { IPlayerInfo, ICoords, IGameGridState, IGameMove, IGameState } from '../../../../client-ts/src/model/interfaces';

const logger = createLogger("PlayerControllerController.ts");

export class PlayerController{

  
}