import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Todo } from '../interfaces/todo';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService{

  constructor() { }

  createDb(){
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
    ];
    return  {todos}
  }

  genId(todos: Todo[]): number {
    return todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 0;
  }
}
