import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import type { User, UserRole } from '@prisma/client';
import { Observable, of, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '../../index';
import { catchError, take } from 'rxjs/operators';
import { ONE, PAGINATION_DEFAULTS } from '@seed/shared/constants';

type PaginatedResponse = { data: User[]; page: number; limit: number; total: number };

@Injectable()
export class UserService {
  readonly baseUrl = `/api/users`;

  constructor(readonly http: HttpClient, readonly store: Store) {}

  get(id: string): Observable<null | User> {
    return this.convert404ToNull(
      this.http.get<null | User>(`${this.baseUrl}/${id}`, { headers: { ...this.getAuthHeader() } }),
    );
  }

  getMe(): Observable<null | User> {
    return this.convert404ToNull(
      this.http.get<null | User>(`${this.baseUrl}/me`, { headers: { ...this.getAuthHeader() } }),
    );
  }

  create(user: {
    firstName: string;
    lastName: string;
    email: string;
    photoURL: undefined | null | string;
  }): Observable<User> {
    return this.http.post<User>(
      this.baseUrl,
      { ...user, userName: Date.now().toString() },
      { headers: { ...this.getAuthHeader() } },
    );
  }

  find(page = ONE, limit = PAGINATION_DEFAULTS.limit, filter?: { role?: UserRole }): Observable<PaginatedResponse> {
    const params: { [key: string]: string | number } = { page, limit, ...filter };
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]); // remove any undefined values from params

    return this.http.get<PaginatedResponse>(this.baseUrl, {
      params,
      headers: { ...this.getAuthHeader() },
    });
  }

  private getAuthHeader(): { authorization?: string } {
    let jwt: undefined | string = undefined;
    this.store
      .select(AuthSelectors.getJWT)
      .pipe(take(ONE))
      .subscribe(j => (jwt = j));
    return {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition,@typescript-eslint/restrict-template-expressions
      ...(jwt ? { authorization: `Bearer ${jwt}` } : {}),
    };
  }

  private convert404ToNull<T>(obs: Observable<T>): Observable<null | T> {
    return obs.pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.NotFound) {
          return of(null);
        }
        return throwError(error);
      }),
    );
  }
}
