import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {HttpModule} from '@angular/http';
import {AppRouting} from './app.routing';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
// import { DBModule } from '@ngrx/db';
import {RouterStoreModule} from '@ngrx/router-store';
import {AppComponent} from './app.component';
import {ComponentsModule} from './components';
import {reducer} from './reducers';
import 'hammerjs';
import {LessonsService} from './services/lessons';
import {EffectsModule} from '@ngrx/effects';
import {LessonsEffects} from './effects/lessons';
import {SubjectsService} from './services/subjects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRouting,
    BrowserModule,
    ComponentsModule,
    FormsModule,
    FlexLayoutModule.forRoot(),
    MaterialModule.forRoot(),
    HttpModule,

    /**
     * StoreModule.provideStore is imported once in the root module, accepting
     * a reducer function or object map of reducer functions. If passed an
     * object of reducers, combineReducers will be run creating your
     * application meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.provideStore(reducer),
    /**
     * @ngrx/router-store keeps router state up-to-date in the store and uses
     * the store as the single source of truth for the router's state.
     */
    RouterStoreModule.connectRouter(),
    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    StoreDevtoolsModule.instrumentOnlyWithExtension(),

    /**
     * EffectsModule.run() sets up the effects class to be initialized
     * immediately when the application starts.
     *
     * See: https://github.com/ngrx/effects/blob/master/docs/api.md#run
     */
    EffectsModule.run(LessonsEffects)
  ],
  providers: [LessonsService, SubjectsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
