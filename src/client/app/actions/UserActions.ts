import { Action } from '@ngrx/store';
import { uuid } from '../utils/util';
import {Message, Thread, User } from '../models';

export const UserActionType = {
    SET_CURRENT_USER : '[User] Set Current'
}

export class SetCurrentUserAction implements Action {
    type = UserActionType.SET_CURRENT_USER;
    constructor(public user: User){}
}