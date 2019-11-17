import Cell from '../../components/Game/Cell.vue';
import { Grid } from '../../components/Game/model/Grid';
export interface ICell extends Cell{
  row: number,
  col: number,
  value: number,
  grid: Grid,
  destroy(): void,
}