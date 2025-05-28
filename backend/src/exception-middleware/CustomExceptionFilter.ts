import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(CustomExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // Get status code
        let status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // If HttpException, get response, or set default error message
        let message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        // Logging
        this.logger.error(
            `HTTP Status: ${status} URL: ${request.url} Error Message: ${JSON.stringify(message)}`,
        );

        // Response Error
        response.status(status).json({
            message: message['message'],
            error: message['error'],
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
