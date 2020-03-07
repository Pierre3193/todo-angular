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
 
    const id = this.route.snapshot.paramMap.get('id')
    this.store.dispatch(todoAction.getTodoAction({payload:Number(id)})); 
    combineLatest(this.todo$).subscribe(([state]) => {
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

  saveTodo(todo:Todo): void{
    let dataConfirmationDialog = {};
    let widthConfirmationDialog = '0px'
    if (todo.title && (todo.title !== this.initialTitleCache
      || todo.description !== this.initialDescriptionCache) && 
      (todo.title !== this.beforeEditTitleCache
      || todo.description !== this.beforeEditDescriptionCache)){
        
        if (todo.id !== undefined){
          dataConfirmationDialog = {
            message:"Do you confirm the update ?",
            yesButton: "Update"
          };
          widthConfirmationDialog = '350px'
        }else{
          dataConfirmationDialog = {
            message: "Do you confirm the creation ?",
            yesButton: "Create"
          };
          widthConfirmationDialog = '365px'
        }
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: widthConfirmationDialog,
          data: dataConfirmationDialog
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            if (!todo.description){
              todo.editingTitle = false;
              todo.editingDescription = true;
            }else {
              todo.editingTitle = false;
              todo.editingDescription = false;
            }
            
            if (todo.id !== undefined){
              this.store.dispatch(todoAction.UpdateTodoAction({ payload: todo}));
            }else{
              this.store.dispatch(todoAction.CreateTodoAction({ payload: todo}));
              this.router.navigate([''])
            }
          }
        });
    }else if (!todo.title){
      dataConfirmationDialog = {
        message:"A title is required"
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '230px',
        data: dataConfirmationDialog
      });
    }else{
      // do nothing
    }
  }

  editTodoTile(todo:Todo){
    this.beforeEditTitleCache = todo.title;
    todo.editingTitle = true;
    todo.editingDescription = false;
  }

  doneEditTodoTitle(todo:Todo){
    if (todo.title.trim().length === 0){
      todo.title = this.beforeEditTitleCache;
    }
    todo.editingTitle = false;
    todo.editingDescription = true;
  }

  cancelEditTodoTitle(todo:Todo){
    todo.title = this.beforeEditTitleCache;
  }

  editTodoDescription(todo:Todo){
    this.beforeEditDescriptionCache = todo.description;
    todo.editingDescription = true;
    todo.editingTitle = false;
  }

  doneEditTodoDescription(todo:Todo){
    if (todo.description.trim().length === 0){
      todo.description = this.beforeEditDescriptionCache;
    }
    todo.editingDescription = false;
  }

  cancelEditTodoDescription(todo:Todo){
    todo.description = this.beforeEditDescriptionCache;
  }
}
