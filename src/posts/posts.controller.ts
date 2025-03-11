import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CreatePostDto } from './dto/createPost.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    async getAllPosts() {
        return this.postsService.getAllPosts();
    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        return this.postsService.getPostById(+id);
    }

    @Post()
    async createPost(@Body() post: CreatePostDto) {
        return this.postsService.createPost(post);
    }

    @Put(':id')
    async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
        return this.postsService.replacePost(+id, post);
    }

    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        return await this.postsService.deletePost(Number(id));
    }
}
