import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { TodoService } from './todo.service';
import * as todoAction from '../services/todo-action.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Todo } from '../interfaces/todo';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class TodoEffectsService {

  constructor(private action$: Actions,
              private TodoService: TodoService){

  }

  getTodos$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(todoAction.getTodosAction),
      mergeMap(action =>
        this.TodoService.getTodos().pipe(
          map((todos: Todo[]) =>
            {
              return todoAction.successgetTodosAction({payload: todos});
            }),
            catchError((error: Error) => {
              return of(todoAction.errorTodoAction(error))
            })
        ))
      )
    );

  updatetodo$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(todoAction.UpdateTodoAction),
      mergeMap(action =>
        this.TodoService.updateTodo(action.payload).pipe(
          map(() =>
            {
              return todoAction.getTodosAction();
            }),
            catchError((error: Error) => {
              return of(todoAction.errorTodoAction(error))
            })
        ))
      )
    );

    getTodo$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(todoAction.getTodoAction),
      mergeMap(action =>
        this.TodoService.getTodo(action.payload).pipe(
          map((editingTodo: Todo) =>
            {
              return todoAction.successgetTodoAction({payload: editingTodo});
            }),
            catchError((error: Error) => {
              return of(todoAction.errorTodoAction(error))
            })
        ))
      )
    );
  
  createtodo$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(todoAction.CreateTodoAction),
      mergeMap(action =>
        this.TodoService.createTodo(action.payload as Todo).pipe(
          map(() =>
            {
              return todoAction.getTodosAction();
            }),
            catchError((error: Error) => {
              return of(todoAction.errorTodoAction(error))
            })
        ))
      )
    );
}
