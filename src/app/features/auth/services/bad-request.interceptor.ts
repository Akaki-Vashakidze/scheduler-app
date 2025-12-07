import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SnackbarService } from './snack-bar.service';

@Injectable()
export class BadRequestInterceptor implements HttpInterceptor {
  constructor(private snackbarService:SnackbarService){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) {
            if(event.body.statusCode == 400) {
              let errorT = event.body.errors;
              this.snackbarService.error(errorT)
            }
          }
        },
        error: err => {
          if (err instanceof HttpErrorResponse) {
            if(err.error.statusCode == 400){
              let errorT = err.error.message
              this.snackbarService.error(errorT[0].split('.0.')[1])
            }
          }
        }
      })
    );
  }
}
