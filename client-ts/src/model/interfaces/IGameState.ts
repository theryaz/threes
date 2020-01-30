import { IGameMove, IGameGridState } from '../../model/interfaces';
import { GameStatus } from '../../model/enums';
export interface IGameState{
  status: GameStatus,
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