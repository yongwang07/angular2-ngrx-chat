import { Action } from '@ngrx/store';
import { Thread, Message } from '../models';
import { AddThreadAction, ThreadActionType, 
  AddMessageAction, SelectThreadAction } from '../actions/ThreadActions';
import { Map, List, fromJS } from 'immutable';

export interface ThreadsEntities extends Map<string, Thread>{};

export interface ThreadsState extends Map<string, any> {
  ids: List<string>;
  entities: ThreadsEntities;
  currentThreadId?: string;
};

const initialState: ThreadsState = fromJS({
  ids: List<string>(),
  currentThreadId: null,
  entities: Map<string, Thread>()
});

export const ThreadsReducer =
  function(state: ThreadsState = initialState, action: Action) {
  switch (action.type) {
    case ThreadActionType.ADD_THREAD: {
        const thread = (<AddThreadAction>action).thread;
        if (state.get('ids').includes(thread.id)) {
        return state;
      }
      return state.withMutations(map=> {
          map.update('ids', list => list.push(thread.id));
          let newEntity = {
              [thread.id]: thread
          }
          map.update('entities', entity => entity.concat(fromJS({
              [thread.id]: thread
          })));
        });      
    }
    case ThreadActionType.ADD_MESSAGE: {
      const thread: Thread = (<AddMessageAction>action).thread;
      const message: Message = (<AddMessageAction>action).message;
      return state.withMutations(map => {
        map.updateIn(['entities', thread.id, 'messages'], list => 
        list.push(message.set('isRead', message.thread.id === state.currentThreadId)));
      });
    }
    case ThreadActionType.SELECT_THREAD: {
      const thread = (<SelectThreadAction>action).thread;
      return state.withMutations(map => {
        map.set('currentThreadId', thread.id);
        map.updateIn(['entities', thread.id, 'messages'], list => list.map(
          (message:Message) => message.set('isRead', true)));
      });
    }
    default:
        return state;    
  }
};