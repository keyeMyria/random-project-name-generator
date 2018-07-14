import { Author } from './author.interface';

export interface Post {
  id: number;
  authorId: number;
  title: string;
  votes: number;
  author?: Author;
}