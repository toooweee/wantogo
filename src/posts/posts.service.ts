import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from './posts.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private lastPostId = 0;
  private posts: Post[] = [];

  findAll() {
    return this.posts;
  }

  create(createPostDto: CreatePostDto) {
    if (!createPostDto) {
      throw new BadRequestException();
    }

    const newPost: Post = {
      id: ++this.lastPostId,
      ...createPostDto,
    };

    this.posts.push(newPost);

    return newPost;
  }

  findOne(id: number) {
    const post = this.posts.find((post) => post.id === id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const postIndex = this.posts.findIndex((post) => post.id === id);

    if (postIndex < 0) {
      throw new NotFoundException('Post not found');
    }

    this.posts[postIndex] = {
      id: this.posts[postIndex].id,
      title: updatePostDto.title || this.posts[postIndex].title,
      content: updatePostDto.content || this.posts[postIndex].content,
    };

    return this.posts[postIndex];
  }

  delete(id: number) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex > -1) {
      this.posts.splice(postIndex, 1);
    } else {
      throw new NotFoundException('Post not found');
    }
  }
}
