import { Component, OnInit} from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';
import { TodoStateService } from 'src/app/services/todo-state.service';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as todoAction from '../../services/todo-action.service';
import { Router } from '@angular/router';
import { Todo } from 'src/app/interfaces/todo';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todo$: Observable<TodoStateService>;
  remaining$: Observable<number>;
  loading$: Observable<boolean>;
  todoSubscription$: Observable<Todo[]>;
  idForTodo$ : Observable<number>;
  atLeastOneCompleted$: Observable<boolean>
  todosCompleted$ : Observable<Todo[]>

  todosCompleted: Todo[];

  todoTitle: string = "";
  todoId: number;

  constructor(public todoService: TodoService,
              private store: Store<{todos: TodoStateService}>,
              private router: Router,
              public dialog: MatDialog) { 
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
    this.atLeastOneCompleted$ = this.todo$
    .pipe(
      map(x => {
        return x.todos.filter(todo => todo.completed).length > 0;
      })
    );
    this.todosCompleted$ = this.todo$
    .pipe(
      map(x => {
        return x.todos.filter(todo => todo.completed);
      })
    );
    this.store.dispatch(todoAction.getTodosAction());
  }

  editTodo(todo: Todo){
    this.router.navigate([`/todos/${todo.id}`])
  }

  todoCompleted(todo: Todo): void {
    this.store.dispatch(todoAction.UpdateTodoAction({ payload: todo}));
  }

  addNewTodoView(){
    let editingDescription = false;
    let editingTitle = false;
    if (this.todoTitle){
      editingDescription = true;
    }else{
      editingTitle = true;
    }
    let todo = {
      title: this.todoTitle,
      completed: false,
      editingTitle: editingTitle,
      editingDescription: editingDescription,
      description: ""
    } as Partial<Todo>;
    this.store.dispatch(todoAction.PrepareCreateTodoAction({payload:todo}));
    this.todoTitle = "";
    this.router.navigate([`/todos/createTodo`])
  }

  deleteTodo(id:number): void {
    let data = {
      message:"Do you confirm the deletion of this todo ?",
      yesButton: "Delete"
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.store.dispatch(todoAction.DeleteTodo({payload:id}));
      }
    });
  }

  clearCompleted(): void {
    let data = {
      message:"Do you confirm the deletion of all completed todos ?",
      yesButton: "Delete"
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '610px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.todosCompleted$.subscribe(res => this.todosCompleted = res)
        this.todosCompleted.forEach(todo =>{
          this.store.dispatch(todoAction.DeleteTodo({payload:todo.id}));
        })
      }
    });
    
  }
}
