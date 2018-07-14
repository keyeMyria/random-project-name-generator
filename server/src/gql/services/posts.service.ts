import { Post } from '../interfaces/post.interface';
import { filter, find, identity, pickBy } from 'lodash';


export class PostsService {
    private readonly posts: Post[] = [
        {id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2},
        {id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3},
        {id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1},
        {id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7}
    ];

    findAllBy(args: Post = {} as Post): Post[] {
        return filter(this.posts, pickBy(args, identity))
    }

    findOneBy(args: Post): Post {
        return find(this.posts, pickBy(args, identity));
    }
}