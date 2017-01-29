import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {AuthService} from '../services/auth';
import {Observable, Subscription} from 'rxjs';
import {Action, Store} from '@ngrx/store';
import * as auth from '../actions/auth';
import * as fromRoot from '../reducers';
import {go, back} from '@ngrx/router-store';
import {of} from 'rxjs/observable/of';

@Injectable()
export class AuthEffects {
  refreshSubscription$: Subscription;

  constructor(private store: Store<fromRoot.State>,
              private actions$: Actions,
              private authService: AuthService) {
  }

  @Effect()
  loadAuthFromLocalStorage$: Observable<Action> = this.actions$
    .ofType(auth.ActionTypes.LOAD_FROM_LOCAL_STORAGE)
    .startWith(new auth.LoadFromLocalStorageAction())
    .map(() => {
      // localStorage.clear();
      const authToken = this.authService.getAuthInLocalStorage();
      if (authToken) return new auth.LoadSuccessAction(authToken);
      else return new auth.LoadNullAction();
    });

  @Effect()
  loadAuthFromServer$: Observable<Action> = this.actions$
    .ofType(auth.ActionTypes.LOAD_FROM_SERVER)
    .map((action: auth.LoadFromServerAction) => action.payload)
    .switchMap(payload => {
      return this.authService.login(payload.username, payload.password,
        payload.rememberUser)
        .map(result => {
          this.store.dispatch(back());
          return new auth.LoadSuccessAction(result);
        })
        .catch(err => {
          const error = err.json();
          console.log(error);
          return of(new auth.LoadFailAction(error));
        });
    });

  @Effect()
  removeAuth$: Observable<Action> = this.actions$
    .ofType(auth.ActionTypes.REMOVE)
    .switchMap(() => {
      return this.authService.logout()
        .map(() => {
          this.store.dispatch(go(['/']));
          this.refreshSubscription$.unsubscribe();
          return new auth.RemoveSuccessAction();
        })
        .catch(err => {
          const error = err.json();
          console.log(error);
          return of(new auth.RemoveFailAction());
        });
    });

  @Effect()
  loadSuccess$: Observable<Action> = this.actions$
    .ofType(auth.ActionTypes.LOAD_SUCCESS)
    .map(() => new auth.ScheduleRefreshAction());

  @Effect()
  scheduleRefresh$: Observable<Action> = this.actions$
    .ofType(auth.ActionTypes.SCHEDULE_REFRESH)
    .map(() => {
      const source = this.store.select(fromRoot.getAuthEntity).take(1)
        .flatMap(entity => {
          // the interval is how long in between token refreshes
          // here we are taking half of the time it takes to expired
          // you may want to change how this time interval is calculated
          const interval = entity.expires_in / 2 * 1000;
          return Observable.interval(interval);
        });
      this.refreshSubscription$ =
        source.subscribe(() => this.store.dispatch(new auth.RefreshAction()));
      return new auth.ScheduleRefreshSuccessAction();
    });

  @Effect()
  refreshToken$: Observable<Action> = this.actions$
    .ofType(auth.ActionTypes.REFRESH)
    .switchMap(() => {
      return this.authService.refreshTokens()
        .map(result => {
          console.log('refresh success');
          // update local storage's
          if (localStorage.getItem('auth'))
            this.authService.setAuthInLocalStorage(result);
          return new auth.RefreshSuccessAction(result);
        })
        .catch(err => {
          console.log(err.json());
          return of(new auth.RefreshFailAction());
        });
    });

  @Effect()
  refreshFailToken$: Observable<Action> = this.actions$
    .ofType(auth.ActionTypes.REFRESH_FAIL)
    .map(() => new auth.RemoveAction());
}
