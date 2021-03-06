import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthHttp} from '../auth.http';
import {Response} from '@angular/http';
import {Level} from '../models/level';
import {environment} from '../../environments/environment';
import { handleError } from './util';

@Injectable()
export class LessonsService {
  private baseUrl: string = environment.apiEndpoint + 'lessons';

  constructor(private http: AuthHttp) {
  }

  // calls the [GET] /api/levels Web API method to retrieve all lessons
  get(): any {
    return this.http.get(this.baseUrl)
      .map((response: Response) => response.json() as Level[])
      .catch(handleError);
  }
}
