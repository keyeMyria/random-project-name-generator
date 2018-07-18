import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AttachUserToRequestMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {
  }

  resolve(...args: any[]): MiddlewareFunction {
    return (req: Request, res: Response, next) => {
      if (req.headers.authorization) {
        const jwt = req.headers.authorization.slice(7);

        req.user = this.jwtService.decode(jwt, {}) as JwtPayload;
      }

      next();
    };
  }
}
