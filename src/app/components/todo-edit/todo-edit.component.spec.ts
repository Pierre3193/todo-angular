import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoEditComponent } from './todo-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule, Store } from '@ngrx/store';
import { todoReducer } from '../../services/todo-reducer.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TodoStateService } from 'src/app/services/todo-state.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as todoAction from '../../services/todo-action.service';
import { of } from 'rxjs';
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

const editingTodo = {
  'id' : 0,
  'title' : 'Finir la première user storie',
  'completed' : true,
  'editingTitle' : false,
  'editingDescription' : false,
  'description' : ''
}

describe('TodoEditComponent', () => {
  let component: TodoEditComponent;
  let fixture: ComponentFixture<TodoEditComponent>;
  let store: Store<{todos: TodoStateService}>;
  let router: Router;
  let dialog: MatDialog;
  let route : ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoEditComponent ],
      imports : [
        HttpClientTestingModule,
        StoreModule.forRoot(
          { todos: todoReducer}
        ),
        RouterTestingModule.withRoutes([]),
        MatDialogModule
      ],
      providers : [
        Store
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoEditComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    spyOn(store,'dispatch').and.callThrough();
    spyOn(store, 'select').and.callThrough();
    router = TestBed.get(Router);
    spyOn(router,'navigate').and.stub();
    dialog = TestBed.get(MatDialog);
    route = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should not update state', (done) => {
    spyOn(route.snapshot.paramMap,'get').and.returnValue('1');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(todoAction.getTodoAction({payload:1}));
    expect(router.navigate).not.toHaveBeenCalled();
    done();
  });

  it('[ngOnInit] should update state with an existing edit todo', (done) => {
    spyOn(route.snapshot.paramMap,'get').and.returnValue('1');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(todoAction.getTodoAction({payload:1}));
    store.dispatch(todoAction.successgetTodoAction({payload:todos[0]}));
    component.todo$.subscribe(stateTodos => {
      expect(stateTodos.editingTodo).toEqual(todos[0]);
    });
    done();
  });

  it('[ngOnInit] should redirect to home if activedRoute is not a number', (done) => {
    spyOn(route.snapshot.paramMap,'get').and.returnValue('state');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(todoAction.getTodoAction({payload:NaN}));
    store.dispatch(todoAction.errorTodoAction(new Error));
    expect(router.navigate).toHaveBeenCalledWith(['']);
    done();
  });

  it('[ngOnInit] should redirect to home if todo not existing', (done) => {
    spyOn(route.snapshot.paramMap,'get').and.returnValue('11');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(todoAction.getTodoAction({payload:11}));
    store.dispatch(todoAction.errorTodoAction(new Error));
    expect(router.navigate).toHaveBeenCalledWith(['']);
    done();
  })

  it('[ngOnInit] should update state with an existing todo in creation', (done) => {
    spyOn(route.snapshot.paramMap,'get').and.returnValue('createTodo');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(todoAction.getTodoAction({payload:NaN}));
    store.dispatch(todoAction.PrepareCreateTodoAction({payload:todos[0]}));
    store.dispatch(todoAction.successgetTodoAction({payload:todos[0]}));
    component.todo$.subscribe(stateTodos => {
      expect(stateTodos.creatingTodo).toEqual(todos[0]);
      expect(stateTodos.editingTodo).toEqual(todos[0]);
    });
    done();
  });

  it('[ngOnInit] should update state with an not existing todo in creation', (done) => {
    spyOn(route.snapshot.paramMap,'get').and.returnValue('createTodo');
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(todoAction.getTodoAction({payload:NaN}));
    store.dispatch(todoAction.successgetTodoAction({payload:todos[0]}));
    component.todo$.subscribe(stateTodos => {
      expect(stateTodos.editingTodo).toEqual(todos[0]);
    });
    done();
  });

  it('[backTodos] should redirect to todos view', () => {
    component.backTodos();
    expect(router.navigate).toHaveBeenCalledWith([`/todos`]);
  });

  it('[saveTodo] should dispatch update action with updated todo', (done) => {
    let updatedTodo = {
      'id' : 0,
      'title' : 'Finir la première user storie',
      'completed' : true,
      'editingTitle' : false,
      'editingDescription' : true,
      'description' : ''
    };
    component.initialTitleCache = "Finir la première user";
    component.initialDescriptionCache = "";
    component.beforeEditTitleCache = "Finir la première user";
    component.beforeEditDescriptionCache = "";
    spyOn(dialog,'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<ConfirmationDialogComponent>);
    component.saveTodo(updatedTodo);
    expect(store.dispatch).toHaveBeenCalled();
    done();
  });

  it('[saveTodo] should dispatch update action with todo in creation', (done) => {
    let todoInCreation  = {
      'title' : 'Finir la première user',
      'completed' : true,
      'editingTitle' : false,
      'editingDescription' : true,
      'description' : 'description'
    }as Todo;
    component.initialTitleCache = "Finir la première user";
    component.initialDescriptionCache = "";
    component.beforeEditTitleCache = "Finir la première user";
    component.beforeEditDescriptionCache = "";
    spyOn(dialog,'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<ConfirmationDialogComponent>);
    component.saveTodo(todoInCreation);
    expect(store.dispatch).toHaveBeenCalled();
    done();
  });

  it('[saveTodo] should open dialog for required title', (done) => {
    let todoInCreation  = {
      'title' : '',
      'completed' : true,
      'editingTitle' : false,
      'editingDescription' : true,
      'description' : 'description'
    }as Todo;
    component.initialTitleCache = "";
    component.initialDescriptionCache = "";
    component.beforeEditTitleCache = "";
    component.beforeEditDescriptionCache = "";
    spyOn(dialog,'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<ConfirmationDialogComponent>);
    component.saveTodo(todoInCreation);
    done();
  });

  it('[saveTodo] should do nothing during (1)', (done) => {
    let todoInCreation  = {
      'title' : 'Finir la première user',
      'completed' : true,
      'editingTitle' : false,
      'editingDescription' : true,
      'description' : ''
    }as Todo;
    component.initialTitleCache = "Finir la première user";
    component.initialDescriptionCache = "";
    component.beforeEditTitleCache = "Finir la première user";
    component.beforeEditDescriptionCache = "";
    component.saveTodo(todoInCreation);
    done();
  });

  it('[saveTodo] should not dispatch update action with todo in creation', (done) => {
    let todoInCreation  = {
      'title' : 'Finir la première user',
      'completed' : true,
      'editingTitle' : false,
      'editingDescription' : true,
      'description' : 'description'
    }as Todo;
    component.initialTitleCache = "Finir la première user";
    component.initialDescriptionCache = "";
    component.beforeEditTitleCache = "Finir la première user";
    component.beforeEditDescriptionCache = ""
    spyOn(dialog,'open').and.returnValue({
      afterClosed: () => of(false)
    } as MatDialogRef<ConfirmationDialogComponent>);
    component.saveTodo(todoInCreation);
    expect(store.dispatch).toHaveBeenCalled();
    done();
  });

  it('[editTodoTile] should set beforeEditTitleCache', () => {
    component.editTodoTile(editingTodo);
    expect(component.beforeEditTitleCache).toEqual(editingTodo.title);
  });

  it('[doneEditTodoTitle] should set beforeEditTitleCache to false', () => {
    editingTodo.title = 'title';
    component.doneEditTodoTitle(editingTodo);
  });

  it('[doneEditTodoTitle] should restore title to beforeEditTitleCache', () => {
    editingTodo.title = '';
    component.doneEditTodoTitle(editingTodo);
  });

  it('[cancelEditTodoTitle] should restore title to beforeEditTitleCache', () => {
    component.cancelEditTodoTitle(editingTodo);
  });

  it('[editTodoDescription] should set beforeEditTitleCache', () => {
    component.editTodoDescription(editingTodo);
    expect(component.beforeEditDescriptionCache).toEqual(editingTodo.description);
  });

  it('[doneEditTodoDescription] should set editingDescription to false', () => {
    editingTodo.description = 'description';
    component.doneEditTodoDescription(editingTodo);
  });

  it('[doneEditTodoDescription] should restore title to beforeEditDescriptionCache', () => {
    editingTodo.description = '';
    component.doneEditTodoDescription(editingTodo);
  });

  it('[cancelEditTodoDescription] should restore title to beforeEditDescriptionCache', () => {
    component.cancelEditTodoDescription(editingTodo);
  });

});
