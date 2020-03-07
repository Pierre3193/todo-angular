import { TestBed } from '@angular/core/testing';

import { TodoService } from './todo.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

describe('TodoService', () => {
  let service: TodoService;
  let mockHTTP: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers : [TodoService]
    });
    service = TestBed.get(TodoService);
    mockHTTP = TestBed.get(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('[getTodos] should return todos', (done) => {
    service.getTodos().subscribe(clientTodos => {
      expect(clientTodos).toBe(todos);
      done();
    });
    const request = mockHTTP.expectOne('api/todos');
    request.flush(todos);
  });

  it('[getTodo] should return todo', (done) => {
    service.getTodo(0).subscribe(clientTodo => {
      expect(clientTodo).toBe(todos[0]);
      done();
    });
    const request = mockHTTP.expectOne('api/todos/0');
    request.flush(todos[0]);
  });

  it('[createTodo] should create a todo', (done) => {
    service.createTodo(todos[0]).subscribe(clientTodo => {
      done();
    });
    const request = mockHTTP.expectOne('api/todos');
    request.flush(null);
  });

  it('[deleteTodo] should delete a todo', (done) => {
    service.deleteTodo(1).subscribe(clientTodo => {
      done();
    });
    const request = mockHTTP.expectOne('api/todos/1');
    request.flush(null);
  });

  it('[updateTodo] should update a todo', (done) => {
    service.updateTodo(todos[2]).subscribe(clientTodo => {
      done();
    });
    const request = mockHTTP.expectOne('api/todos/2');
    request.flush(null);
  });

  it('[compare] should return 1', () => {
    let a = {"completed" : true};
    let b = {"completed" : false};
    let result = service.compare(a,b);
    expect(result).toEqual(1);
  });

  it('[compare] should return -1', () => {
    let a = {"completed" : false};
    let b = {"completed" : true};
    let result = service.compare(a,b);
    expect(result).toEqual(-1);
  });

  it('[compare] should return 4', () => {
    let a = {
      "completed" : true,
      "id" : 1
    };
    let b = {
      "completed" : true,
      "id" : 5
    };
    let result = service.compare(a,b);
    expect(result).toEqual(4);
  });
});
