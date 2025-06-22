import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostNotFoundException } from './exceptions';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async findAll() {
    return this.postsRepository.find();
  }

  async create(createPostDto: CreatePostDto) {
    const newPost = this.postsRepository.create(createPostDto);
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new PostNotFoundException(id);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postsRepository.update(id, updatePostDto);
    const updatedPost = await this.findOne(id);

    if (!updatedPost) {
      throw new PostNotFoundException(id);
    }

    return updatedPost;
  }

  async delete(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException('Post not found');
    }
  }
}
