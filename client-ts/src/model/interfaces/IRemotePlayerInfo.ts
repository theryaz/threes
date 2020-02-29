import { RemotePlayerStatus } from '../enums';
import { IPlayerInfo } from './IPlayerInfo';

export interface IRemotePlayerInfo extends IPlayerInfo{
  status: RemotePlayerStatus,
}