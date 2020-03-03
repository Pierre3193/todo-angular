import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

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
        'editingDescription' : false,
        'description' : ''
      },
      {
        'id' : 1,
        'title' : 'Finir la seconde user storie',
        'completed' : true,
        'editingTitle' : false,
        'editingDescription' : false,
        'description' : ''
      },
      {
        'id' : 2,
        'title' : 'Finir la troisème user storie',
        'completed' : true,
        'editingTitle' : false,
        'editingDescription' : false,
        'description' : ''
      },
      {
        'id' : 3,
        'title' : 'Finir la quatrième user storie',
        'completed' : false,
        'editingTitle' : false,
        'editingDescription' : false,
        'description' : ''
      }
    ];
    return  {todos}
  }
}
