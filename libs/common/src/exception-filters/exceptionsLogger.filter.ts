import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch } from '@nestjs/common';

@Catch()
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('Exception thrown', exception);
    super.catch(exception, host);
  }
}
