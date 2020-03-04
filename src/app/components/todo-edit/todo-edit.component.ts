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
  creatingTodo$ : Observable<Todo>;

  numbers = new RegExp(/^[0-9]+$/);
  beforeEditTitleCache: string;
  beforeEditDescriptionCache: string;
  initialTitleCache: string;
  initialDescriptionCache: string;

  createTodoReg = new RegExp(/^createTodo$/);
  
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
    combineLatest(this.route.params, this.todo$).subscribe(([params, state]) => {
      const id = params.id;
      const todo = state.editingTodo;
      if (!state.loading && this.createTodoReg.test(id)){
        this.todo = state.creatingTodo
        if (this.todo === null){
          this.todo = {
            title:"",
            completed: false,
            editingTitle: true,
            editingDescription: false,
            description: ""
          } as Todo
        }
        this.initialTitleCache = "";
        this.initialDescriptionCache = "";
      }else if (!state.loading && !this.numbers.test(id)){
        this.router.navigate(['']);
      }else if (!state.loading && todo){
        this.todo = todo;
        this.initialTitleCache = this.todo.title;
        this.initialDescriptionCache = this.todo.description;
      }else if (!state.loading && !todo) {
        this.router.navigate(['']);
      }else{
      }  
    });
  }

  backTodos(): void{
    this.router.navigate(['/todos']);
  }

  saveTodo(): void{
    if (!this.todo.title){
      this.todo.title = "";
    }
    if (!this.todo.description){
      this.todo.description = "";
    }
    let dataConfirmationDialog = {};
    let widthConfirmationDialog = '0px'
    if (this.todo.title && (this.todo.title !== this.initialTitleCache
      || this.todo.description !== this.initialDescriptionCache)){
        
        if (this.todo.id){
          dataConfirmationDialog = {
            message:"Do you confirm the update of this todo ?",
            yesButton: "Update"
          };
          widthConfirmationDialog = '480px'
        }else{
          dataConfirmationDialog = {
            message: "Do you confirm the creation of this todo ?",
            yesButton: "Create"
          };
          widthConfirmationDialog = '490px'
        }
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: widthConfirmationDialog,
          data: dataConfirmationDialog
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            if ( this.todo.title !== this.beforeEditTitleCache
                || this.todo.description !== this.beforeEditDescriptionCache){
                if (this.todo.id){
                  this.store.dispatch(todoAction.UpdateTodoAction({ payload: this.todo}));
                }else{
                  this.store.dispatch(todoAction.CreateTodoAction({ payload: this.todo}));
                }
              
            }
          }
        });
    }else if (!this.todo.title){
      dataConfirmationDialog = {
        message:"A title is required for save a Todo"
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: dataConfirmationDialog
      });
    }else{
      // do nothing
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
