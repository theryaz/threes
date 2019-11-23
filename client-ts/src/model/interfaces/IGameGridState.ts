import { ICellValue } from '@/model/interfaces';

export interface IGameGridState{
  nextNumber: number,
  cells: ICellValue[],
}