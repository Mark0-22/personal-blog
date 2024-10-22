import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/app.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || '';
    const [username, password] = this.authService.decodeData(authHeader);

    if (username === 'admin' && password === 'admin') {
      return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="user_pages"');
    res.status(401).send('Authentication required!');
  }
}
