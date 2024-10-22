import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { AppService } from 'src/app.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, AppService],
})
export class ArticleModule {}
