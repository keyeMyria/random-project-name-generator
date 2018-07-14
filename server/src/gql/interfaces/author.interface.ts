import { Post } from './post.interface';

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  posts?: Post[];
}