import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, AuthService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [ArticleModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
