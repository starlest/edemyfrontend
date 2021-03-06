import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Lesson } from '../../models/lesson';
import * as fromRoot from '../../reducers';

@Component({
	selector: 'ed-selected-lesson-page',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
    <ed-online-lesson
      [lesson]="lesson$ | async" [isLoggedIn]="isLoggedIn$ | async">
    </ed-online-lesson>
  `
})
export class SelectedLessonPageComponent {
	lesson$: Observable<Lesson>;
	isLoggedIn$: Observable<boolean>;

	constructor(private store: Store<fromRoot.State>) {
		this.lesson$ = store.select(fromRoot.getSelectedLesson).map(lesson => {
			// Load a placeholder empty lesson first if there are no lessons
			// loaded yet
			if (!lesson) {
				const emptyLesson: Lesson = {
					Id: -1,
					Title: '',
					Levels: [],
					Subject: '',
					Description: '',
					Notes: '',
					Tutor: '',
					Videos: []
				};
				return emptyLesson;
			}
			return lesson;
		});

		this.isLoggedIn$ =
		  store.select(fromRoot.getAuthEntity).map(entity => !!entity);
	}
}
