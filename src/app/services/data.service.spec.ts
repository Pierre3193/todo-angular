import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { Todo } from '../interfaces/todo';

let refTodos: Todo[] =  [
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

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('[createDb] should create the DB', () => {
    let DBTodos = service.createDb();
    expect(DBTodos).toEqual({"todos": refTodos});
  });

  it('[genId] should return 4', () => {
    let id = service.genId(refTodos);
    expect(id).toEqual(4);
  });

  it('[genId] should return 0', () => {
    let id = service.genId([]);
    expect(id).toEqual(0);
  });
});
