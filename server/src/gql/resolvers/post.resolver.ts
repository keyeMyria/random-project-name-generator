import { Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { PostsService } from '../services/posts.service';
import { AuthorsService } from '../services/authors.service';
import { Post } from '../interfaces/post.interface';
import { Author } from '../interfaces/author.interface';

@Resolver('Post')
export class PostResolver {
  constructor(
    private readonly authorsService: AuthorsService,
    private readonly postsService: PostsService,
  ) {
  }

  @Query('posts')
  async getPosts(obj, args, context, info) {
    return await this.postsService.findAllBy();
  }

  @Query('post')
  async getPost(obj, args, context, info) {
    const { id } = args;

    return await this.postsService.findOneBy({ id } as Post);
  }

  @ResolveProperty('author')
  async getAuthor(post, args, context, info) {
    const { authorId } = post;

    return await this.authorsService.findOneBy({ id: authorId } as Author);
  }
}