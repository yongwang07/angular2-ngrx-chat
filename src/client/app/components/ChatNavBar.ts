import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';
import {AppState, getUnreadMessagesCount} from '../reducers/index';

@Component({
  selector: 'chat-nav-bar',
  template: `
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="https://ng-book.com/2">
          <img src="images/logos/ng-book-2-minibook.png"/>
           ng-book 2
        </a>
      </div>
      <p class="navbar-text navbar-right">
        <button class="btn btn-primary" type="button">
          Messages <span class="badge">{{ unreadMessagesCount | async }}</span>
        </button>
      </p>
    </div>
  </nav>
  `
})
export class ChatNavBar  {
  unreadMessagesCount: Observable<number>;
  constructor(private store: Store<AppState>) {
    this.unreadMessagesCount = store.let(getUnreadMessagesCount);
  }
}