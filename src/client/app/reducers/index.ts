import {combineReducers, ActionReducer} from '@ngrx/store';
import { compose } from '@ngrx/core';
import {Message, Thread } from '../models';
import {List} from 'immutable';
import {Observable} from "rxjs/Rx";
import '@ngrx/core/add/operator/select';
import { UsersState, UsersReducer } from './UsersReducer';

export * from './UsersReducer';
export * from './ThreadsReducer';

import { ThreadsState, ThreadsReducer, ThreadsEntities } from './ThreadsReducer';
export interface AppState {
  users: UsersState;
  threads: ThreadsState;
}
export const reducers: ActionReducer<AppState> = combineReducers({
  users: UsersReducer,
  threads: ThreadsReducer
});

export const getThreadsState = (state: Observable<AppState>): Observable<ThreadsState> => {
  return state.select(s => s.threads)};

export const getThreadsEntities = compose(
  ( state: Observable<ThreadsState> ) => state.select(s => s.get('entities')), getThreadsState);

export const getAllThreads = compose(
  ( entities: Observable<ThreadsEntities> ) => entities.select(en => en.valueSeq().toArray()), getThreadsEntities);
  
export const getUnreadMessagesCount = compose(
  ( threads: Observable<List<Thread>> ) => threads.select(t => t.reduce(
      (unreadCount: number, thread: Thread) => {
        thread.messages.forEach((message: Message) => {
          if (!message.isRead) {
            ++unreadCount;
          }
        });
        return unreadCount;
      }, 0)), getAllThreads);

export const getCurrentThread = function(state: Observable<AppState>) {
  return Observable.combineLatest(getThreadsEntities(state), getThreadsState(state), 
  (entities: ThreadsEntities , s: ThreadsState) => entities.get(s.get('currentThreadId')));
};

export const getAllMessages = compose(
  ( threads: Observable<List<Thread>> ) => threads.select( 
    t => t.reduce((allMessages:List<Message>, thread) => allMessages.concat(thread.messages), List<Message>())
                .sort((m1: Message, m2: Message) => m1.sentAt.getTime() - m2.sentAt.getTime())
    ), getAllThreads);

export const getUsersState = (state: Observable<AppState>): Observable<UsersState> => state.select( s => s.users);

export const getCurrentUser = compose(
  ( state: Observable<UsersState> ) => state.select( s => s.currentUser), getUsersState );