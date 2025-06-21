import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize, from, tap } from 'rxjs';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    return from(this.handle(req, next));
  }

  async handle(req: HttpRequest<unknown>, next: HttpHandler) {

    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('schedule_token') || '',
      },
    });

    return next
      .handle(tokenizedReq)
      .pipe(
        tap((evt) => {
          if (evt instanceof HttpResponse) {
            const sessionToken = evt.headers.get('schedule_token');
            if (sessionToken) {
              localStorage.setItem('schedule_token', sessionToken);
            }
          }
        })
      )
      .toPromise();
  }
}
