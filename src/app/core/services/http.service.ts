import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {AppResponse, HttpResponseBody} from '../models/api.models';
import {AppError} from '../models/error.model';

@Injectable({providedIn: 'root'})
export class HttpService {

  constructor(private httpClient: HttpClient) {
  }

  get<T>(url: string, options?) {
    const requestOptions = this.addRequestOptions(options);
    return this.httpClient.get<HttpResponseBody<T>>(`${url}`, requestOptions)
      .pipe(
        map(this.handleResponse),
        catchError(this.handleError)
      );
  }

  private addRequestOptions(options) {
    const observe: 'response' = 'response';
    let params: HttpParams = null;
    if (options && options.params) {
      params = new HttpParams();
      Object.keys(options.params).map(key => params = params.set(key, options.params[key]));
    }
    return {
      ...options,
      params,
      observe, // get full response instead of just the body with the observe option
    };
  }

  private handleResponse<T>(response: HttpResponse<HttpResponseBody<T>>): AppResponse<T> {
    return new AppResponse<T>({data: response.body});
  }

  private handleError(error: AppError) {
    // Optional - Handle specific Http-Errors (other then the Error.interceptor)
    return throwError(error);
  }
}


