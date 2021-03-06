import { Store } from '@ngrx/store';
import {fromJS, List} from 'immutable';
import {AppState, getAllMessages} from './reducers/index';
import { uuid } from './utils/util';
import * as moment from 'moment';
import {Observable} from 'rxjs/Rx';
import {Thread, User, Message} from './models';
import {ThreadActionType, AddThreadAction, 
  AddMessageAction, SelectThreadAction} from './actions/ThreadActions';
import {UserActionType, SetCurrentUserAction} from './actions/UserActions';

const me: User = {
  id: uuid(),
  isClient: true, // <-- notice we're specifying the client as this User
  name: 'Juliet',
  avatarSrc: 'images/avatars/female-avatar-1.png'
};

const ladycap: User = {
  id: uuid(),
  name: 'Lady Capulet',
  avatarSrc: 'images/avatars/female-avatar-2.png'
};

const echo: User = {
  id: uuid(),
  name: 'Echo Bot',
  avatarSrc: 'images/avatars/male-avatar-1.png'
};

const rev: User = {
  id: uuid(),
  name: 'Reverse Bot',
  avatarSrc: 'images/avatars/female-avatar-4.png'
};

let wait: User = {
  id: uuid(),
  name: 'Waiting Bot',
  avatarSrc: 'images/avatars/male-avatar-2.png'
};

let tLadycap: Thread = new Thread({
  id: 'tLadycap',
  name: ladycap.name,
  avatarSrc: ladycap.avatarSrc,
  messages: List<Message>()
});

let tEcho: Thread = new Thread({
  id: 'tEcho',
  name: echo.name,
  avatarSrc: echo.avatarSrc,
  messages: List<Message>()
});

let tRev: Thread = new Thread({
  id: 'tRev',
  name: rev.name,
  avatarSrc: rev.avatarSrc,
  messages: List<Message>()
});

let tWait: Thread = new Thread({
  id: 'tWait',
  name: wait.name,
  avatarSrc: wait.avatarSrc,
  messages: List<Message>()
});

export  function ChatExampleData(store: Store<AppState>) {
  store.dispatch(new SetCurrentUserAction(me));
  // create a new thread and add messages
  store.dispatch(new AddThreadAction(tLadycap));
  store.dispatch(new AddMessageAction(tLadycap, new Message({
    id: uuid(),
    author: me,
    thread: tLadycap,
    sentAt: moment().subtract(45, 'minutes').toDate(),
    text: 'Yet let me weep for such a feeling loss.'
  })));
  store.dispatch(new AddMessageAction(tLadycap, new Message({
    id: uuid(),
    author: ladycap,
    sentAt: moment().subtract(20, 'minutes').toDate(),
    text: 'So shall you feel the loss, but not the friend which you weep for.'
  })));

  // create a few more threads
  store.dispatch(new AddThreadAction(tEcho));
  store.dispatch(new AddMessageAction(tEcho, new Message({
    id: uuid(),
    author: echo,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: 'I\'ll echo whatever you send me'
  })));

  store.dispatch(new AddThreadAction(tRev));
  store.dispatch(new AddMessageAction(tRev, new Message({
    id: uuid(),
    author: rev,
    sentAt: moment().subtract(3, 'minutes').toDate(),
    text: 'I\'ll reverse whatever you send me'
  })));

  store.dispatch(new AddThreadAction(tWait));
  store.dispatch(new AddMessageAction(tWait, new Message({
    id: uuid(),
    author: wait,
    sentAt: moment().subtract(4, 'minutes').toDate(),
    text: `I\'ll wait however many seconds you send to me before responding.` +
      ` Try sending '3'`
  })));

  // select the first thread
  store.dispatch(new SelectThreadAction(tLadycap));
  // Now we set up the "bots". We do this by watching for new messages and
  // depending on which thread the message was sent to, the bot will respond
  // in kind.
  let handledMessages: { [key:string]: boolean } = {};
  store.let(getAllMessages).
      subscribe((messages:List<Message>) => {
        messages.filter(message => message.author.id === me.id)
          .map(message => {
        // This is a bit of a hack and we're stretching the limits of a faux
        // chat app. Every time there is a new message, we only want to keep the
        // new ones. This is a case where some sort of queue would be a better
        // model
        if (handledMessages.hasOwnProperty(message.id)) {
          return;
        }
        handledMessages[message.id] = true;
        switch (message.thread.id) {
          case tEcho.id:
            // echo back the same message to the user
            store.dispatch(new AddMessageAction(tEcho, new Message({
              author: echo,
              text: message.text
            })));
            break;
          case tRev.id:
            // echo back the message reveresed to the user
            store.dispatch(new AddMessageAction(tRev, new Message({
              author: rev,
              text: message.text.split('').reverse().join('')
            })));
            break;
          case tWait.id:
            let waitTime: number = parseInt(message.text, 10);
            let reply: string;
            if (isNaN(waitTime)) {
              waitTime = 0;
              reply = `I didn\'t understand ${message}. Try sending me a number`;
            } else {
              reply = `I waited ${waitTime} seconds to send you this.`;
            }
            setTimeout(() => {
                store.dispatch(new AddMessageAction(tWait, new Message({
                  author: wait,
                  text: reply
                })));
              }, waitTime * 1000);
            break;
          default:
            break;
        }
      });
    });
}