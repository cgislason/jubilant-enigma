import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { createHash } from 'crypto';
import { request } from 'http';

// In a real world app, this would probably be a Redis cache with a TTL for eviction
const requestHistory = {};

export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name);

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    // NOTE: Using the id from the request body as the idempotency key.
    // In a real-world codebase it would be better use a `ik` property or `Idempotency-Key` header.
    const idempotency_key = req.body.id;

    // Return the stored response if there's a cached response for the idempotency key
    const existing = requestHistory[idempotency_key];
    if (existing) {
      const resp = context.switchToHttp().getResponse();
      resp.setHeader('Idempotency-Replay', true);
      this.logger.log(`Returning previous response for ${idempotency_key}`);
      return of(existing.response);
    }

    // Store the response after the request has been handled
    const after = (response) => {
      const hash = this.hashRequest(req);
      this.logger.log(`Saving request with key ${idempotency_key}`);
      requestHistory[idempotency_key] = {
        hash,
        response,
      };
    };

    return next.handle().pipe(tap(after));
  }

  hashRequest(req) {
    const payload = JSON.stringify({
      method: req.method,
      url: req.url,
      body: req.body,
    });
    return createHash('sha256').update(payload).digest('hex');
  }
}
