import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, StoreModule } from '@ngrx/store';
import { todoReducer } from '../../services/todo-reducer.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TodoStateService } from 'src/app/services/todo-state.service';
import * as todoAction from '../../services/todo-action.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { Todo } from 'src/app/interfaces/todo';

const todos= [
  {
    'id' : 0,
    'title' : 'Finir la première user storie',
    'completed' : true,
    'editingTitle' : false,
    'editingDescription' : true,
    'description' : ''
  },
  {
    'id' : 1,
    'title' : 'Finir la seconde user storie',
    'completed' : true,
    'editingTitle' : false,
    'editingDescription' : true,
    'description' : ''
  },
  {
    'id' : 2,
    'title' : 'Finir la troisème user storie',
    'completed' : true,
    'editingTitle' : false,
    'editingDescription' : true,
    'description' : ''
  },
  {
    'id' : 3,
    'title' : 'Finir la quatrième user storie',
    'completed' : true,
    'editingTitle' : false,
    'editingDescription' : true,
    'description' : ''
  }
]

const createdTodo = {
  title: "",
  completed: false,
  editingTitle: true,
  editingDescription: false,
  description: ""
} as Partial<Todo>;

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let store: Store<{todos: TodoStateService}>;
  let router: Router;
  let dialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoListComponent ],
      imports : [
        HttpClientTestingModule,
        StoreModule.forRoot(
          { todos: todoReducer}
        ),
        RouterTestingModule,
        MatDialogModule
      ],
      providers : [
        Store
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    spyOn(store,'dispatch').and.callThrough();
    spyOn(store, 'select').and.callThrough();
    router = TestBed.get(Router);
    spyOn(router,'navigate').and.stub();
    dialog = TestBed.get(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should update state', (done) => {
    store.dispatch(todoAction.successgetTodosAction({payload:todos}));
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(todoAction.getTodosAction());
    component.todo$.subscribe(stateTodos => {
      expect(stateTodos.todos).toEqual(todos);
      done();
    });
  });

  it('[editTodo] should redirect to edit view', () => {
    component.editTodo(todos[0]);
    expect(router.navigate).toHaveBeenCalledWith([`/todos/${todos[0].id}`]);
  });

  it('[todoCompleted] should dispatch update action', () => {
    component.todoCompleted(todos[0]);
    expect(store.dispatch).toHaveBeenCalledWith(todoAction.UpdateTodoAction({ payload: todos[0]}));
  });

  it('[createNewTodo] should redirect to createTodo view', (done) => {
    component.createNewTodo();
    expect(store.dispatch).toHaveBeenCalledWith(todoAction.PrepareCreateTodoAction({payload:createdTodo}));
    expect(router.navigate).toHaveBeenCalledWith([`/todos/createTodo`]);
    done();
  });

  it('should dispatch delete action', (done) => {
    spyOn(dialog,'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<ConfirmationDialogComponent>);
    component.deleteTodo(todos[0].id);
    expect(store.dispatch).toHaveBeenCalledWith(todoAction.DeleteTodo({ payload: todos[0].id}));
    done();
  });

  it('should not dispatch delete action', (done) => {
    spyOn(dialog,'open').and.returnValue({
      afterClosed: () => of(false)
    } as MatDialogRef<ConfirmationDialogComponent>);
    component.deleteTodo(todos[0].id);
    expect(store.dispatch).not.toHaveBeenCalledWith(todoAction.DeleteTodo({ payload: todos[0].id}));
    done();
  });

  it('should dispatch delete action for all todos', (done) => {
    store.dispatch(todoAction.successgetTodosAction({payload:todos}));
    spyOn(dialog,'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<ConfirmationDialogComponent>);
    component.clearCompleted();
    component.todosCompleted$.subscribe(stateTodos => {
      stateTodos.forEach(stateTodo =>{
        expect(store.dispatch).toHaveBeenCalledWith(todoAction.DeleteTodo({ payload: stateTodo.id}));
      });
      done();
    })
  });

  it('should not dispatch delete action for all todos', (done) => {
    store.dispatch(todoAction.successgetTodosAction({payload:todos}));
    spyOn(dialog,'open').and.returnValue({
      afterClosed: () => of(false)
    } as MatDialogRef<ConfirmationDialogComponent>);
    component.clearCompleted();
    component.todosCompleted$.subscribe(stateTodos => {
      stateTodos.forEach(stateTodo =>{
        expect(store.dispatch).not.toHaveBeenCalledWith(todoAction.DeleteTodo({ payload: stateTodo.id}));
      });
      done();
    })
  });

});
