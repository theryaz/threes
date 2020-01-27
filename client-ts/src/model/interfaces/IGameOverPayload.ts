import { ICellValue } from '.';

export interface IGameOverPayload{
  score: number,
  cells: ICellValue[]
}