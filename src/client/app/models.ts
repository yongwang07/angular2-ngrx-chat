import {Record, List} from "immutable";

export interface User {
  id: string;
  name: string;
  avatarSrc: string;
  isClient?: boolean;
}

const ThreadRecord  = Record({
  id : undefined,
  name: undefined,
  avatarSrc: undefined,
  messages: undefined
});

export class Thread extends ThreadRecord {
  id : string;
  name: string;
  avatarSrc: string;
  messages: List<Message>;
}

const MessageRecord = Record({
  id: undefined,
  sentAt: undefined,
  isRead: undefined,
  author: undefined,
  text: undefined,
  thread: undefined
});

export class Message extends MessageRecord {
  id: string;
  sentAt: Date;
  isRead?: boolean;
  author: User;
  text: string;
  thread?: Thread;
}