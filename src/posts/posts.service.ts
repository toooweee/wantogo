import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PostEntity from './post.entity';
import Post from './post.entity';

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private readonly postRepository: Repository<PostEntity>) {}

    async getAllPosts() {
        return this.postRepository.find();
    }

    async getPostById(id: number) {
        const post = await this.postRepository.findOne({
            where: { id },
        });

        if (!post) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }

        return post;
    }

    async replacePost(id: number, post: UpdatePostDto) {
        const postInDb = await this.postRepository.findOne({
            where: { id },
        });

        if (!postInDb) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }

        return this.postRepository.update(id, post);
    }

    async createPost(post: CreatePostDto) {
        const newPost = this.postRepository.create(post);

        return this.postRepository.save(newPost);
    }

    async deletePost(id: number) {
        const deletedPost = await this.postRepository.findOne({
            where: { id },
        });

        if (!deletedPost) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }

        await this.postRepository.delete(id);

        return deletedPost;
    }
}
