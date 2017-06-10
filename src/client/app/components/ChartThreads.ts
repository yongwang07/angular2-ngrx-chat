import {Component, ChangeDetectionStrategy, EventEmitter} from '@angular/core';
import {SelectThreadAction} from '../actions/ThreadActions';
import {Observable} from 'rxjs/Rx';
import {Thread} from '../models';
import {Store} from '@ngrx/store';
import {AppState, getAllThreads, getCurrentThread} from '../reducers/index';

@Component({
  selector: 'chat-threads',
  template: `
  <div class="row">
    <div class="conversation-wrap">
      <chat-thread
           *ngFor="let thread of threads | async"
           [thread]="thread"
           [selected]="thread.id === currentThreadId | async"
           (onThreadSelected)="handleThreadClicked($event)">
      </chat-thread>
    </div>
  </div>
  `
})
export class ChatThreads {
  threads: Observable<Thread[]>;
  currentThreadId: Observable<string>;
  constructor(private store: Store<AppState>) {
    this.threads = this.store.let(getAllThreads);
    this.currentThreadId = this.store.let(getCurrentThread).select(thread => thread.id);
  }
  handleThreadClicked(thread: Thread) {
    this.store.dispatch(new SelectThreadAction(thread));
  }
}


@Component({
  inputs: ['thread', 'selected'],
  selector: 'chat-thread',
  changeDetection: ChangeDetectionStrategy.OnPush,
  outputs: ['onThreadSelected'],
  template: `
  <div class="media conversation">
    <div class="pull-left">
      <img class="media-object avatar"
           src="{{thread.avatarSrc}}">
    </div>
    <div class="media-body">
      <h5 class="media-heading contact-name">{{thread.name}}
        <span *ngIf="selected">&bull;</span>
      </h5>
      <small class="message-preview">
        {{thread.messages.last().text}}
      </small>
    </div>
    <a (click)="clicked($event)" class="div-link">Select</a>
  </div>
  `
})
export class ChatThread {
  thread: Thread;
  selected: boolean;
  onThreadSelected: EventEmitter<Thread>;

  constructor() {
    this.onThreadSelected = new EventEmitter<Thread>();
  }
  
  clicked(event: any): void {
    this.onThreadSelected.emit(this.thread);
    event.preventDefault();
  }
}