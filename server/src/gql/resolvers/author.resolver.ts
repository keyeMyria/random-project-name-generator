import { Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { PostsService } from '../services/posts.service';
import { AuthorsService } from '../services/authors.service';
import { Author } from '../interfaces/author.interface';
import { Post } from '../interfaces/post.interface';

@Resolver('Author')
export class AuthorResolver {
  constructor(
    private readonly authorsService: AuthorsService,
    private readonly postsService: PostsService,
  ) {
  }

  @Query('authors')
  async getAuthors(obj, args, context, info) {
    return await this.authorsService.findAllBy();
  }

  @Query('author')
  async getAuthor(obj, args, context, info) {
    const { id } = args;

    return await this.authorsService.findOneBy({ id } as Author);
  }

  @ResolveProperty('posts')
  async getPosts(author, args, context, info) {
    const { id } = author;

    return await this.postsService.findAllBy({ authorId: id } as Post);
  }
}