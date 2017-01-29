import {Injectable, OnDestroy} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Store} from '@ngrx/store';
import * as fromRoot from './reducers';
import {AuthEntity} from './models/auth-entity';
import {Subscription} from 'rxjs';

@Injectable()
export class AuthHttp implements OnDestroy {
  http: Http;
  authEntity: AuthEntity;
  authEntitySubscription$: Subscription;

  constructor(private store: Store<fromRoot.State>,
              http: Http) {
    this.authEntitySubscription$ =
      this.store.select(fromRoot.getAuthEntity)
        .map(entity => this.authEntity = entity).subscribe();
    this.http = http;
  }

  get(url, opts = {}) {
    this.configureAuth(opts);
    return this.http.get(url, opts);
  }

  post(url, data, opts = {}) {
    if (!!data && !data.includes('refresh_token'))
      this.configureAuth(opts);
    return this.http.post(url, data, opts);
  }

  put(url, data, opts = {}) {
    this.configureAuth(opts);
    return this.http.put(url, data, opts);
  }

  delete(url, opts = {}) {
    this.configureAuth(opts);
    return this.http.delete(url, opts);
  }

  configureAuth(opts: any) {
    if (this.authEntity != null) {
      if (this.authEntity.access_token != null) {
        if (opts.headers == null) opts.headers = new Headers();
        opts.headers.set('Authorization',
          `Bearer ${this.authEntity.access_token}`);
      }
    }
  }

  ngOnDestroy() {
    if (this.authEntitySubscription$)
      this.authEntitySubscription$.unsubscribe();
  }
}
