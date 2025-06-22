import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const request: Request = context.getRequest();
    const response: Response = context.getResponse();
    const status = exception.getStatus();
    const message = exception.message;

    return response.status(status).json({
      message,
      statusCode: status,
      time: new Date().toISOString(),
    });
  }
}
