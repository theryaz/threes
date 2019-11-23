import { ICellValue } from '@/model/interfaces';

export interface IGameState{
  paused: boolean,
  gameOver: boolean,
  keyboardEnabled: boolean,
  remoteGameId: string | null,
  nextNumber: number,
  score: number,
  lastCellState: ICellValue[] | null,
}