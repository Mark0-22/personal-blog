import { unlink } from 'fs';
import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { AppService } from 'src/app.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { ArticleFile } from 'src/dto/files.dto';

@Injectable()
export class ArticleService {
  constructor(private appService: AppService) {}
  private id: number = 1;
  private fullPath: string = join(__dirname, '..', '..', './src/blogs');

  async create(createArticleDto: CreateArticleDto) {
    const filesCounter = this.appService.countFilesInDirectory();
    let obj;

    if (filesCounter < 1) {
      obj = {
        ...createArticleDto,
        id: this.id,
      };
    } else {
      this.id = await this.appService.maxId();
      obj = {
        ...createArticleDto,
        id: (this.id += 1),
      };
    }
    await this.appService.writeJSON(JSON.stringify(obj));
  }

  async update(article: ArticleFile, body: UpdateArticleDto): Promise<any> {
    const files = readdirSync(this.fullPath);
    for (const file of files) {
      const filePath = join(this.fullPath, file);
      const fileContent = readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);

      if (jsonData.id === article.id) {
        jsonData.title = body.title || jsonData.title;
        jsonData.date = body.date || jsonData.date;
        jsonData.content = body.content || jsonData.content;
        unlink(filePath, (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });

        await this.appService.writeJSON(JSON.stringify(jsonData));
      }
    }
  }

  remove(id: number) {
    const files = readdirSync(this.fullPath);

    for (const file of files) {
      const filePath = join(this.fullPath, file);
      const fileContent = readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);

      if (jsonData.id === id) {
        unlink(filePath, (err) => {
          if (err) {
            console.log(err);
            return;
          } else {
            console.log('Successfully deleted article!');
          }
        });
      }
    }
  }
}
