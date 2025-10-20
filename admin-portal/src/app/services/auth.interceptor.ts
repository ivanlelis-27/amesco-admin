import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('ac_token');

        let authReq = req;
        if (token) {
            authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(authReq).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    try {
                        localStorage.removeItem('ac_token');
                        localStorage.removeItem('ac_session');
                    } catch (e) { }
                    // navigate to login (adjust route if your login route differs)
                    this.router.navigate(['/login']);
                }
                return throwError(() => err);
            })
        );
    }
}