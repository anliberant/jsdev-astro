import { POSTS_PER_PAGE } from '../constants';

export const getNumPages = (count: number): number => {
  return Math.ceil(count / POSTS_PER_PAGE) || 1;
};
