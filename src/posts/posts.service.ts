import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async findAll() {
    return await this.postsRepository.find();
  }

  async create(createPostDto: CreatePostDto) {
    const newPost = await this.postsRepository.create(createPostDto);
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      await this.findOne(id);
      return await this.postsRepository.update(id, updatePostDto);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      console.error(e);
      throw new InternalServerErrorException(
        'Something went wrong via updating post',
      );
    }
  }

  async delete(id: number) {
    try {
      await this.findOne(id);
      return await this.postsRepository.delete(id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      console.error(e);
      throw new InternalServerErrorException(
        'Something went wrong via deleting post',
      );
    }
  }
}
