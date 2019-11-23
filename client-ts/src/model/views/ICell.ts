import Cell from '../../components/Game/Cell.vue';
import { ICoords } from '../interfaces';
export interface ICell extends Cell{
  row: number,
  col: number,
  value: number,
  destroy(): void,
  isAt(coords: ICoords): boolean,
  coords(): ICoords,
  grid: HTMLDivElement,
}