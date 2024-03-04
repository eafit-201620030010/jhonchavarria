import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const clonedRequest = request.clone({
      setHeaders: {
        authorId: environment.id,
      },
    });

    return next.handle(clonedRequest);
  }
}
