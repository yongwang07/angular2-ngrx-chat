import { Action } from '@ngrx/store';
import { User } from '../models';
import { SetCurrentUserAction, UserActionType } from '../actions/UserActions';

export interface UsersState {
  currentUser: User;
};

const initialState: UsersState = {
  currentUser: null
};

export const UsersReducer =
  function(state: UsersState = initialState, action: Action): UsersState {
      switch (action.type) {
        case UserActionType.SET_CURRENT_USER:
            const user: User = (<SetCurrentUserAction>action).user;
            return {
                currentUser: user
            };
        default:
            return state;
  }
};