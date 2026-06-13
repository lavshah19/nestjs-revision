import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";





@Injectable()
export class LoggerMiddleware implements NestMiddleware {

    private readonly logger = new Logger('HTTP');

   use(req: Request, res: Response, next: NextFunction) {

const {method} = req;
this.logger.log(`${method} ${req.url}`);
req['start'] = Date.now();
res.on('finish', () => {
    const duration = Date.now() - req['start'];
    const {statusCode} = res;
    if(statusCode >= 500){
        this.logger.error(`${method} ${req.url} ${statusCode} ${duration}ms`)
    }else if(statusCode >= 400){
        this.logger.warn(`${method} ${req.url} ${statusCode} ${duration}ms`)
    }else{
        this.logger.log(`${method} ${req.url} ${statusCode} ${duration}ms`)
    }
    
})
    next();
  }
}