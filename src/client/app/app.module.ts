import { NgModule, } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import {ChatNavBar} from './components/ChatNavBar';
import {ChatThread, ChatThreads} from './components/ChartThreads';
import {ChatMessage, ChatWindow} from './components/ChatWindow';
import {FromNowPipe} from './utils/util';
import {StoreModule} from "@ngrx/store";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {reducers} from './reducers/index'

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule,    
  StoreModule.provideStore(reducers),
  StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
  })],
  declarations: [AppComponent, ChatNavBar, ChatThread,
                 ChatThreads, ChatMessage, ChatWindow, FromNowPipe],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }