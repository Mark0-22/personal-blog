import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Response } from 'express';
import { CreateArticleDto } from './dto/create-article.dto';
import { AppService } from 'src/app.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleFile } from 'src/dto/files.dto';

@Controller('admin')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly appService: AppService,
  ) {}

  @Get()
  async findAll(@Res() res: Response) {
    const articleLength = this.appService.countFilesInDirectory();
    const files = await this.appService.filesInDictionary();
    res.status(200).render('./admin/blogs', {
      pageTitle: 'Admin Blogs',
      editing: false,
      articleLength: articleLength,
      files: files,
    });
  }

  @Get('new')
  newArticle(@Res() res: Response) {
    res
      .status(200)
      .render('./admin/new', { pageTitle: 'New Article', editing: false });
  }

  @Post('new')
  async create(@Res() res: Response, @Body() req: CreateArticleDto) {
    await this.articleService.create(req);
    res.status(201).redirect('/');
  }

  @Get('edit/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const file = await this.appService.fetchOneBlog(+id);
    res.status(200).render('./admin/new', {
      pageTitle: 'Edit article',
      editing: true,
      id: id,
      file: file,
    });
  }

  @Post('edit')
  async updateBlog(@Body() body: UpdateArticleDto, @Res() res: Response) {
    const file = await this.appService.fetchOneBlog(+body.id);
    this.articleService.update(file as ArticleFile, body);
    res.status(201).redirect('/');
  }

  @Get('delete/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.articleService.remove(+id);
    res.status(200).redirect('/');
  }
}
