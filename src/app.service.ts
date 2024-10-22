import { Injectable } from '@nestjs/common';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import { ArticleFile } from './dto/files.dto';
import * as base64 from 'base-64';

@Injectable()
export class AppService {
  private fullPath: string = join(__dirname, '..', './src/blogs');
  async writeJSON(data: string) {
    try {
      const name = JSON.parse(data).title;
      const fileName =
        `${name.replace(/\s+/g, '-')}_` +
        new Date().toISOString().replace(/:/g, '-').split('T')[1] +
        '.json';

      const filePath = join(this.fullPath, fileName);

      const obj = JSON.parse(data);
      obj.fullFileName = fileName;

      if (!existsSync(this.fullPath)) {
        mkdirSync(this.fullPath, { recursive: true });
      }

      await writeFileSync(filePath, JSON.stringify(obj), 'utf8');
    } catch (error) {
      console.log('Error in writing!');
      console.log(error);
    }
  }

  countFilesInDirectory(): number {
    try {
      if (!existsSync(this.fullPath)) {
        return 0;
      }
      const files = readdirSync(this.fullPath);

      const fileCount = files.filter((file) =>
        statSync(join(this.fullPath, file)).isFile(),
      ).length;

      return fileCount;
    } catch (error) {
      console.log('Error in counting!');
      console.log(error);
      return 0;
    }
  }

  maxId(): number {
    const result: number[] = [];

    try {
      const files = readdirSync(this.fullPath);

      for (const file of files) {
        const filePath = join(this.fullPath, file);
        const fileContent = readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        result.push(jsonData.id);
      }

      const maxId = Math.max(...result);
      return maxId;
    } catch (error) {
      console.log('Error in finding maxId!');
      console.log(error);
      return 0;
    }
  }

  async filesInDictionary() {
    const fileData: ArticleFile[] = [];
    try {
      const files = readdirSync(this.fullPath);

      for (const file of files) {
        const filePath = join(this.fullPath, file);
        const fileContent = readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileContent);

        const dateStr = jsonData.date;
        const date = await this.dateTransform(dateStr);
        // jsonData.fileName = jsonData.title;

        jsonData.date = date;

        fileData.push(jsonData);
      }

      return fileData || [];
    } catch (error) {
      console.log('Error collecting files!');
      console.log(error);
    }
  }

  fetchOneBlog(id: number): ArticleFile | string {
    const files = readdirSync(this.fullPath);

    try {
      for (const file of files) {
        const filePath = join(this.fullPath, file);
        const fileContent = readFileSync(filePath, 'utf8');
        const jsonData: ArticleFile = JSON.parse(fileContent);

        if (jsonData.id === id) {
          return jsonData;
        }
      }
      return 'No article';
    } catch (error) {
      console.log('Error fetching one file (blog)!');
      console.log(error);
      return 'Error while fetching';
    }
  }

  async dateTransformFromFile(file: ArticleFile) {
    try {
      const filePath = join(this.fullPath, file.fullFileName);
      const fileContent = readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);

      const date = await this.dateTransform(jsonData.date);
      jsonData.date = date;

      return jsonData;
    } catch (error) {
      console.log('Error while transforming date');
      console.log(error);
      return 'Error while transforming date';
    }
  }

  async dateTransform(date: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);
    return formattedDate;
  }
}

@Injectable()
export class AuthService {
  decodeData(authHeader: string): [string, string] {
    if (!authHeader.startsWith('Basic')) {
      return ['', ''];
    }

    const base64Credentials = authHeader.split(' ')[1];
    const decodedCredentials = base64.decode(base64Credentials).split(':');

    return [decodedCredentials[0], decodedCredentials[1]];
  }
}
