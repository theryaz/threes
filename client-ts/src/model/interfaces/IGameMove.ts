import { ICellValue } from '../../model/interfaces';
import { Direction } from '../../components/Game/model/constants';

/**
 * Information needed to replicate this move in another game.
 */
export interface IGameMove{
  nextNumber: number, // The number generated after the move
  newCell: ICellValue,
  direction: Direction,
  timestamp: Date,
}