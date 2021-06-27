import { reduce } from 'lodash';
import { OutlineItem } from './outline.model';

export const getOutlineArray = (outlineByTitle: Record<string, OutlineItem>) =>
  reduce(outlineByTitle, (acc, item) => [...acc, item], [] as OutlineItem[]);
