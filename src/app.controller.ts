import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { ArticleFile } from './dto/files.dto';

@Controller(['/', 'home'])
export class AppController {
  constructor(private appServise: AppService) {}
  @Get()
  async findAll(@Res() res: Response) {
    const articleLength = this.appServise.countFilesInDirectory();
    const files = await this.appServise.filesInDictionary();
    res.status(200).render('./guest/index', {
      pageTitle: 'Home',
      articleLength: articleLength,
      files: files,
    });
  }

  @Get('article/:id')
  async blog(@Param('id') id: string, @Res() res: Response) {
    const blog = await this.appServise.fetchOneBlog(+id);
    const file = await this.appServise.dateTransformFromFile(
      blog as ArticleFile,
    );
    res.status(200).render('./guest/blog', { pageTitle: 'Blog', file: file });
  }
}
