import { Component, OnInit} from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { TodoStateService } from 'src/app/services/todo-state.service';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as todoAction from '../../services/todo-action.service';
import { Router } from '@angular/router';
import { Todo } from 'src/app/interfaces/todo';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: [TodoService]
})
export class TodoListComponent implements OnInit {
  todo$: Observable<TodoStateService>;
  remaining$: Observable<number>;
  loading$: Observable<boolean>;
  todoSubscription$: Observable<Todo[]>;
  idForTodo$ : Observable<number>;
  todoError: Error = null;

  todoTitle: string = "";
  todoId: number;

  constructor(public todoService: TodoService,
              private store: Store<{todos: TodoStateService}>,
              private router: Router) { 
  }

  ngOnInit(): void {
    this.todo$ = this.store.pipe(select('todos'));
    this.todoSubscription$ = this.todo$
    .pipe(
      map(x => {
        return x.todos.sort(this.todoService.compare);
      })
    );
    this.remaining$ = this.todo$
    .pipe(
      map(x => {
        return x.todos.filter(todo => !todo.completed).length;
      })
    );
    this.loading$ = this.todo$
    .pipe(
      map(x => {
        return x.loading;
      })
    );
    this.idForTodo$ = this.todo$
    .pipe(
      map(x => {
        return x.todos.length;
      })
    );
    this.idForTodo$.subscribe(res => this.todoId=res)
    this.store.dispatch(todoAction.getTodosAction());
  }

  editTodo(todo: Todo){
    this.router.navigate([`/todos/${todo.id}`])
  }

  todoCompleted(todo: Todo): void {
    this.store.dispatch(todoAction.UpdateTodoAction({ payload: todo}));
  }

  AddNewTodo(){
    if (this.todoTitle.trim().length === 0){ 
      return;
    }
    let todo = {
      title: this.todoTitle,
      completed: false,
      editingTitle: false,
      editingDescription: false,
      description: ""
    };
    this.store.dispatch(todoAction.CreateTodoAction({payload:todo}));
    this.todoTitle = "";
  }

  cancelAddNewTodo(){
    this.todoTitle = "";
  }

  AddNewTodoView(){
    let todo = {
      title: this.todoTitle,
      completed: false,
      editingTitle: false,
      editingDescription: false,
      description: ""
    } as Partial<Todo>;
    this.store.dispatch(todoAction.PrepareCreateTodoAction({payload:todo}));
    this.todoTitle = "";
    this.router.navigate([`/todos/createTodo`])
  }
}
