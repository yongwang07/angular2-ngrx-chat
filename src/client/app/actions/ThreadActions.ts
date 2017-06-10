import { Action } from '@ngrx/store';
import { uuid } from '../utils/util';
import {Message, Thread } from '../models';

export const ThreadActionType = {
    ADD_THREAD : '[Thread] Add',
    ADD_MESSAGE : '[Thread] Add Message',
    SELECT_THREAD : '[Thread] Select'
};

export class AddThreadAction implements Action {
    type = ThreadActionType.ADD_THREAD;
    constructor(public thread: Thread){}
}

export class AddMessageAction implements Action {
    type = ThreadActionType.ADD_MESSAGE;
    public thread: Thread;
    public message: Message;
    constructor(thread: Thread, message: Message){
        this.thread = thread;
        this.message = new Message({
            id: uuid(),
            sentAt: new Date(),
            isRead: message.isRead,
            thread: thread,
            author: message.author,
            text: message.text
        });
    }
}

export class SelectThreadAction implements Action {
    type = ThreadActionType.SELECT_THREAD;
    constructor(public thread: Thread){}
}