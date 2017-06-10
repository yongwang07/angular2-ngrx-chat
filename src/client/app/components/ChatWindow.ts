import {Inject, Component, ElementRef, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs/Rx';
import {User,Thread, Message} from '../models';
import {SelectThreadAction, AddMessageAction} from '../actions/ThreadActions';
import {AppState, getCurrentThread, getCurrentUser} from '../reducers/index';
import {List} from 'immutable';

@Component({
  selector: 'chat-window',
  template: `
    <div class="chat-window-container">
      <div class="chat-window">
        <div class="panel-container">
          <div class="panel panel-default">
            <div class="panel-heading top-bar">
              <div class="panel-title-container">
                <h3 class="panel-title">
                  <span class="glyphicon glyphicon-comment"></span>
                  Chat - {{currentThread.name}}
                </h3>
              </div>
              <div class="panel-buttons-container"  >
                <!-- you could put minimize or close buttons here -->
              </div>
            </div>

            <div class="panel-body msg-container-base">
              <chat-message
                   *ngFor="let message of currentThread.messages"
                   [message]="message">
              </chat-message>
            </div>

            <div class="panel-footer">
              <div class="input-group">
                <input type="text"
                       class="chat-input"
                       placeholder="Write your message here..."
                       [(ngModel)]="draftMessage.text" />
                <span class="input-group-btn">
                  <button class="btn-chat"
                     >Send</button>
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class ChatWindow implements OnInit {
  currentThread: Thread;
  draftMessage: { text: string };
  currentUser: User;
  
  constructor(private store: Store<AppState>, private el: ElementRef) { 
    this.store.let(getCurrentThread).subscribe(thread => this.currentThread = thread.toJS() );
    this.store.let(getCurrentUser).subscribe(user => this.currentUser = user);
    this.scrollToBottom();
    this.draftMessage = { text: '' };
  }
  ngOnInit() {
    Observable.merge(
        Observable.fromEvent(document.getElementsByClassName('btn-chat'), 'click'),
        Observable.fromEvent(document.getElementsByTagName('input'), 'keydown')
        .filter((evt : KeyboardEvent) => evt.keyCode === 13)).subscribe(() => {
          this.store.dispatch(new AddMessageAction(this.currentThread, new Message({
            text: this.draftMessage.text,
            thread: this.currentThread,
            author: this.currentUser,
            isRead : true
          })));
          this.draftMessage = { text: '' };
          this.scrollToBottom();
        });
  }
  scrollToBottom(): void {
    let scrollPane: any = this.el.nativeElement.querySelector('.msg-container-base');
    if (scrollPane) {
      setTimeout(() => scrollPane.scrollTop = scrollPane.scrollHeight);
    }
  }
}

@Component({
  inputs: ['message'],
  selector: 'chat-message',
  template: `
  <div class="msg-container"
       [ngClass]="{'base-sent': !incoming, 'base-receive': incoming}">
    <div class="avatar" *ngIf="!incoming">
      <img src="{{message.author.avatarSrc}}">
    </div>
    <div class="messages" [ngClass]="{'msg-sent': !incoming, 'msg-receive': incoming}">
      <p>{{message.text}}</p>
      <p class="time">{{message.sender}} • {{message.sentAt | fromNow}}</p>
    </div>
    <div class="avatar" *ngIf="incoming">
      <img src="{{message.author.avatarSrc}}">
    </div>
  </div>
  `
})
export  class ChatMessage implements OnInit {
  message: Message;
  incoming: boolean;
  ngOnInit(): void {
    this.incoming = !this.message.author.isClient;
  }
}