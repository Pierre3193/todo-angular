import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { InMemoryWebApiModule} from 'angular-in-memory-web-api';
import { DataService } from './services/data.service'
import { TodoService } from './services/todo.service'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TodoEditComponent } from './components/todo-edit/todo-edit.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects'
import { todoReducer } from './services/todo-reducer.service';
import { TodoEffectsService } from './services/todo-effects.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AutofocusFixModule } from 'ngx-autofocus-fix';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    PageNotFoundComponent,
    TodoEditComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(
      DataService, {dataEncapsulation: false}),
    StoreModule.forRoot(
      { todos: todoReducer}
    ),
    EffectsModule.forRoot(
      [TodoEffectsService]
    ),
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    AutofocusFixModule.forRoot()
  ],
  entryComponents: [ConfirmationDialogComponent],
  providers: [DataService,TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
