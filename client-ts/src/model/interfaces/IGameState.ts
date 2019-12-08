import { IGameMove, IGameGridState } from '@/model/interfaces';
export interface IGameState{
  autoStart: boolean,
  paused: boolean,
  gameOver: boolean,
  keyboardEnabled: boolean,
  isRemote: boolean,
  nextNumber: number,
  score: number,
  history: IGameMove[],
  initialGridState: IGameGridState,
}