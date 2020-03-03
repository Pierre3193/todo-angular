import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoStateService } from 'src/app/services/todo-state.service';
import { Store,select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import * as todoAction from '../../services/todo-action.service';
import { TodoService } from 'src/app/services/todo.service';
import { Router } from '@angular/router';
import { Todo } from 'src/app/interfaces/todo';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'todo-edit',
  templateUrl: './todo-edit.component.html',
  styleUrls: ['./todo-edit.component.scss']
})
export class TodoEditComponent implements OnInit{
  todo: Todo;
  todo$: Observable<TodoStateService>;
  todoSubscription$: Observable<Todo[]>;
  loading$: Observable<boolean>;

  numbers = new RegExp(/^[0-9]+$/);
  beforeEditTitleCache: string;
  beforeEditDescriptionCache: string;
  initialTitleCache: string;
  initialDescriptionCache: string;


  constructor(public todoService: TodoService,
              private store: Store<{todos: TodoStateService}>,
              private route : ActivatedRoute,
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
    this.loading$ = this.todo$
    .pipe(
      map(x => {
        return x.loading;
      })
    );
    
    
    const id = this.route.snapshot.paramMap.get('id')
    this.store.dispatch(todoAction.getTodoAction({payload:Number(id)})); 
    if (!this.numbers.test(id)){
      this.router.navigate(['']);
    }
    combineLatest(this.route.params, this.todo$).subscribe(([params, state]) => {
        const id = params.id;
        const todos = state.todos;
        const todo = state.editingTodo;
        if (!state.loading && Number(id) < (todos.length)){
          this.todo = todo;
          this.initialTitleCache = this.todo.title;
          this.initialDescriptionCache = this.todo.description;
        }else if (!state.loading && Number(id) >= (todos.length)) {
          this.router.navigate(['']);
        }else{
        }  
      }
    );
  }

  backTodos(): void{
    
    if (!this.todo.title){
      this.todo.title = "";
    }
    if (!this.todo.description){
      this.todo.description = "";
    }

    if ( this.todo.title !== this.initialTitleCache
      || this.todo.description !== this.initialDescriptionCache){
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '500px',
          data: "Do you confirm the update of this todo ?"
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            if ( this.todo.title !== this.beforeEditTitleCache
                || this.todo.description !== this.beforeEditDescriptionCache){
              this.store.dispatch(todoAction.UpdateTodoAction({ payload: this.todo}));
            }
          }
          this.router.navigate(['/todos']);
        });
    }else{
      this.router.navigate(['/todos']);
    }
  }

  editTodoTile(){
    this.beforeEditTitleCache = this.todo.title;
    this.todo.editingTitle = true;
    this.todo.editingDescription = false;
  }

  doneEditTodoTitle(){
    if (this.todo.title.trim().length === 0){
      this.todo.title = this.beforeEditTitleCache;
    }
    this.todo.editingTitle = false;
  }

  cancelEditTodoTitle(){
    this.todo.title = this.beforeEditTitleCache;
    this.todo.editingTitle = false;
  }

  editTodoDescription(){
    this.beforeEditDescriptionCache = this.todo.description;
    this.todo.editingDescription = true;
    this.todo.editingTitle = false;
  }

  doneEditTodoDescription(){
    if (this.todo.description.trim().length === 0){
      this.todo.description = this.beforeEditDescriptionCache;
    }
    this.todo.editingDescription = false;
  }

  cancelEditTodoDescription(){
    this.todo.description = this.beforeEditDescriptionCache;
    this.todo.editingDescription = false;
  }
}
