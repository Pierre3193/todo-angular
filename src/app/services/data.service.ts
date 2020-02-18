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
        'id' : 2,
        'title' : 'Finir la première user storie',
        'completed' : true,
        'editing' : false
      },
      {
        'id' : 3,
        'title' : 'Finir la seconde user storie',
        'completed' : true,
        'editing' : false
      },
      {
        'id' : 0,
        'title' : 'Finir la troisème user storie',
        'completed' : false,
        'editing' : false
      },
      {
        'id' : 1,
        'title' : 'Finir la quatrième user storie',
        'completed' : false,
        'editing' : false
      }
    ];
    return  {todos}
  }
}
