import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './posts.interface';

@Injectable()
export class PostsService {
  private lastPostId = 0;
  private posts: Post[] = [];

  findAll() {
    return this.posts;
  }

  create(createPostDto: CreatePostDto) {
    const post: Post = {
      id: ++this.lastPostId,
      ...createPostDto,
    };

    this.posts.push(post);

    return post;
  }

  findOne(id: number) {
    const post = this.posts.find((post) => post.id === id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const postIndex = this.findPostIndex(id);

    if (postIndex >= 0) {
      this.posts[postIndex] = {
        id,
        title: updatePostDto.title
          ? updatePostDto.title
          : this.posts[postIndex].title,
        content: updatePostDto.content
          ? updatePostDto.content
          : this.posts[postIndex].content,
      };

      return this.posts[postIndex];
    }

    throw new NotFoundException('Post not found');
  }

  delete(id: number) {
    const postIndex = this.findPostIndex(id);

    if (postIndex >= 0) {
      this.posts.splice(postIndex, 1);
      return this.posts[postIndex];
    }

    throw new NotFoundException('Post not found');
  }

  private findPostIndex(id: number) {
    return this.posts.findIndex((post) => post.id === id);
  }
}
