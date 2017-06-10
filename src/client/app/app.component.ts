import {Component} from '@angular/core';
import {Config} from './shared/config/env.config';
import {AppState} from './reducers';
import {ChatExampleData} from './ChatExampleData';
import {Store} from '@ngrx/store';

@Component({
  moduleId: module.id,
  selector: 'chat-app',
  template: `
    <div>
    <chat-nav-bar></chat-nav-bar>
    <div class="container">
      <chat-threads></chat-threads>
      <chat-window></chat-window>
    </div>
  </div>
  `
})
export class AppComponent {
  constructor(private store: Store<AppState>) {
      console.log('Environment config', Config);
      ChatExampleData(store);
  }
}