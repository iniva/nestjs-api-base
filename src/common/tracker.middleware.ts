import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class TrackerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // access req / res to track according to your needs
    next()
  }
}
