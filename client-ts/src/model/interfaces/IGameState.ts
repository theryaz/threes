import { IGameMove, IGameGridState } from '@/model/interfaces';
export interface IGameState{
  paused: boolean,
  gameOver: boolean,
  keyboardEnabled: boolean,
  isRemote: boolean,
  nextNumber: number,
  score: number,
  history: IGameMove[],
  initialState: IGameGridState,
}